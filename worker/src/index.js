/**
 * Contador de "me ha servido" de la portada de yconfi.github.io.
 *
 * Es un Worker de Cloudflare con un Durable Object. Se eligió Durable Object y
 * no Workers KV porque la documentación de KV dice literalmente que no sirve
 * para esto: "KV is not ideal for applications where you need support for
 * atomic operations" y "concurrent writes to the same key can end up
 * overwriting one another". Un Durable Object, en cambio, tiene almacenamiento
 * "private, transactional, and strongly consistent" y atiende las peticiones de
 * una en una, así que sumar 1 no puede perder votos.
 * https://developers.cloudflare.com/kv/concepts/how-kv-works/
 * https://developers.cloudflare.com/durable-objects/
 *
 * QUÉ GUARDA: un número entero, y nada más. Ni IPs, ni hashes, ni cookies, ni
 * identificadores de ningún tipo. Que una persona no vote dos veces se resuelve
 * en su propio navegador con localStorage, no aquí. Es decir: el contador es
 * aproximado a propósito, y esa es la decisión, no un descuido.
 *
 * Rutas:
 *   GET  /  -> { "total": 128 }
 *   POST /  -> { "total": 129, "limitado": false }   (suma uno)
 */
import { DurableObject } from 'cloudflare:workers';

/**
 * Tope de votos por minuto para TODA la web. No identifica a nadie: solo evita
 * que un bucle de peticiones se coma la cuota diaria del plan gratuito.
 * Es deliberadamente generoso: para que estorbe a una persona real tendrían que
 * votar 20 en el mismo minuto, que sería una gran noticia.
 */
const MAX_POR_MINUTO = 20;

/** Desde dónde se acepta sumar. El resto recibe 403. */
const ORIGENES = ['https://yconfi.github.io', 'http://localhost:4321', 'http://127.0.0.1:4321'];

export class ContadorUtil extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);

    this.sql = ctx.storage.sql;

    // Tabla de una sola columna útil. Las tres filas se crean aquí para que
    // después toda lectura pueda usar .one() sin comprobar si existen.
    this.sql.exec(`CREATE TABLE IF NOT EXISTS contador (
      clave TEXT PRIMARY KEY,
      valor INTEGER NOT NULL
    )`);
    for (const clave of ['total', 'ventana', 'en_ventana']) {
      this.sql.exec('INSERT INTO contador (clave, valor) VALUES (?, 0) ON CONFLICT(clave) DO NOTHING', clave);
    }
  }

  /** Lee una de las tres filas. */
  #valor(clave) {
    return Number(this.sql.exec('SELECT valor FROM contador WHERE clave = ?', clave).one().valor);
  }

  /** Total actual, sin tocar nada. */
  leer() {
    return this.#valor('total');
  }

  /**
   * Suma un voto. No hace falta transacción explícita: el Durable Object
   * procesa una petición cada vez, así que entre el SELECT y el UPDATE no se
   * cuela nadie.
   */
  sumar() {
    const ventana = Math.floor(Date.now() / 60_000);
    const usados = this.#valor('ventana') === ventana ? this.#valor('en_ventana') : 0;

    if (usados >= MAX_POR_MINUTO) {
      return { total: this.#valor('total'), limitado: true };
    }

    this.sql.exec("UPDATE contador SET valor = valor + 1 WHERE clave = 'total'");
    this.sql.exec("UPDATE contador SET valor = ? WHERE clave = 'ventana'", ventana);
    this.sql.exec("UPDATE contador SET valor = ? WHERE clave = 'en_ventana'", usados + 1);

    return { total: this.#valor('total'), limitado: false };
  }
}

/** Cabeceras CORS. Solo se devuelven si el origen está en la lista. */
function cabeceras(origen) {
  const base = { 'Content-Type': 'application/json; charset=utf-8' };
  if (!ORIGENES.includes(origen)) return base;
  return { ...base, 'Access-Control-Allow-Origin': origen, Vary: 'Origin' };
}

function json(cuerpo, estado, origen, extra = {}) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...cabeceras(origen), ...extra },
  });
}

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') ?? '';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...cabeceras(origen),
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Una sola instancia para toda la web: un contador global, un objeto.
    const contador = env.CONTADOR.getByName('global');

    if (request.method === 'GET') {
      // Se cachea un minuto en el borde para no despertar al objeto en cada
      // visita. El voto propio no depende de esto: al votar, la respuesta del
      // POST trae el total ya actualizado.
      return json({ total: await contador.leer() }, 200, origen, {
        'Cache-Control': 'public, max-age=60',
      });
    }

    if (request.method === 'POST') {
      if (!ORIGENES.includes(origen)) {
        return json({ error: 'origen no permitido' }, 403, origen);
      }
      const resultado = await contador.sumar();
      return json(resultado, resultado.limitado ? 429 : 200, origen);
    }

    return json({ error: 'método no permitido' }, 405, origen, { Allow: 'GET, POST, OPTIONS' });
  },
};
