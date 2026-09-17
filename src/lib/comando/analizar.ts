// Analiza un comando y devuelve sus segmentos explicados a partir del diccionario.
// Si algo no está en el diccionario, lanza ErrorComando: nunca se publica un
// comando sin explicar.

import { HERRAMIENTAS, OPERADORES } from '../../data/comandos';
import { expandirCombinadas } from './combinadas';
import { ErrorComando, type MotivoError } from './errores';
import type { Herramienta, Opcion, Segmento, Subcomando } from './tipos';
import { tokenizar, type Token } from './tokenizar';

const POR_NOMBRE = new Map(HERRAMIENTAS.map((h) => [h.nombre, h]));
const POR_SIMBOLO = new Map(OPERADORES.map((o) => [o.simbolo, o]));

const EXPLICACION_FIN_OPCIONES =
  'Marca el final de las opciones: lo que sigue se trata como argumentos aunque empiece por "-".';
const EXPLICACION_LLAVES_FIND = 'find lo sustituye por la ruta de cada fichero encontrado.';

export interface OpcionesAnalisis {
  /** Explicaciones concretas para argumentos y valores, por su texto. */
  notas?: Record<string, string>;
  /** Falla si una clave de `notas` no coincide con nada. Por defecto, true. */
  comprobarNotas?: boolean;
}

interface Contexto {
  herramienta: Herramienta;
  subcomando?: Subcomando;
  esperaSubcomando: boolean;
  opcionesCerradas: boolean;
  posicionales: number;
}

export function analizarComando(comando: string, opciones: OpcionesAnalisis = {}): Segmento[] {
  const notas = opciones.notas ?? {};
  const notasUsadas = new Set<string>();
  const tokens = tokenizar(comando);

  const error = (motivo: MotivoError, detalle: string, token: string) =>
    new ErrorComando(motivo, detalle, token, comando);

  /** Busca una nota por el texto mostrado o por el valor sin comillas. */
  const nota = (token: Token): string | undefined => {
    for (const clave of [token.texto, token.valor]) {
      if (clave in notas) {
        notasUsadas.add(clave);
        return notas[clave];
      }
    }
    return undefined;
  };

  const segmentos = analizarTokens(tokens, { error, nota });

  if (opciones.comprobarNotas !== false) {
    const sinUsar = Object.keys(notas).find((clave) => !notasUsadas.has(clave));
    if (sinUsar !== undefined) {
      throw error('nota-sin-usar', `La nota "${sinUsar}" no corresponde a ningún argumento o valor.`, sinUsar);
    }
  }
  return segmentos;
}

interface Ayudas {
  error: (motivo: MotivoError, detalle: string, token: string) => ErrorComando;
  nota: (token: Token) => string | undefined;
}

function analizarTokens(tokens: Token[], ayudas: Ayudas, notasExtra: Record<string, string> = {}): Segmento[] {
  const { error } = ayudas;
  const nota = (t: Token) => ayudas.nota(t) ?? notasExtra[t.valor];
  const segmentos: Segmento[] = [];
  let ctx: Contexto | null = null;
  let i = 0;

  const siguiente = () => tokens[i + 1];

  /** Añade el segmento de valor de una opción tomando el token siguiente. */
  const consumirValor = (flag: string, opcion: Opcion, h: Herramienta) => {
    const t = siguiente();
    if (!t || t.tipo !== 'palabra') {
      throw error('falta-valor', `La opción "${flag}" de ${h.nombre} necesita un valor.`, flag);
    }
    segmentos.push(segmentoValor(t.texto, flag, opcion, nota(t), false));
    i++;
  };

  while (i < tokens.length) {
    const token = tokens[i]!;

    // ---------- Operadores ----------
    if (token.tipo === 'operador') {
      const op = POR_SIMBOLO.get(token.valor);
      if (!op) {
        throw error('operador-desconocido', `Operador "${token.valor}" no está en el diccionario.`, token.valor);
      }
      const seg: Segmento = {
        texto: token.texto,
        clase: 'operador',
        etiqueta: `operador · ${op.nombre}`,
        explicacion: op.descripcion,
        docs: op.docs,
        pegadoAlAnterior: false,
      };

      if (op.tipo === 'separador') {
        const t = siguiente();
        if (!ctx || !t || t.tipo !== 'palabra') {
          throw error('falta-comando', `Falta un comando alrededor de "${op.simbolo}".`, op.simbolo);
        }
        if (ctx.esperaSubcomando) {
          throw error('falta-subcomando', `${ctx.herramienta.nombre} necesita un subcomando.`, ctx.herramienta.nombre);
        }
        segmentos.push(seg);
        ctx = null;
      } else if (op.tipo === 'redireccion') {
        const t = siguiente();
        if (!t || t.tipo !== 'palabra') {
          throw error('falta-destino', `Falta el fichero de destino de "${op.simbolo}".`, op.simbolo);
        }
        segmentos.push(seg, {
          texto: t.texto,
          clase: 'argumento',
          etiqueta: `destino de ${op.simbolo}`,
          explicacion: nota(t) ?? 'Fichero en el que se escribe la salida redirigida.',
          pegadoAlAnterior: false,
        });
        i++;
      } else {
        segmentos.push(seg);
      }
      i++;
      continue;
    }

    // ---------- Inicio de un comando: la herramienta ----------
    if (!ctx) {
      const h = POR_NOMBRE.get(token.valor);
      if (!h) {
        throw error('herramienta-desconocida', `Herramienta "${token.valor}" no está en el diccionario.`, token.valor);
      }
      segmentos.push({
        texto: token.texto,
        clase: 'herramienta',
        etiqueta: 'herramienta',
        explicacion: h.descripcion,
        ...(h.variantes ? { aviso: h.variantes } : {}),
        docs: h.docs,
        pegadoAlAnterior: false,
      });
      ctx = {
        herramienta: h,
        esperaSubcomando: Boolean(h.subcomandos?.length),
        opcionesCerradas: false,
        posicionales: 0,
      };
      i++;
      continue;
    }

    const h = ctx.herramienta;
    const v = token.valor;

    // ---------- Opciones ----------
    if (!ctx.opcionesCerradas && v.startsWith('-') && v !== '-') {
      if (ctx.esperaSubcomando && h.opciones.length === 0) {
        throw error('falta-subcomando', `${h.nombre} necesita un subcomando antes de "${v}".`, v);
      }
      if (v === '--') {
        segmentos.push({
          texto: token.texto,
          clase: 'opcion',
          etiqueta: `opción · ${h.nombre}`,
          explicacion: EXPLICACION_FIN_OPCIONES,
          pegadoAlAnterior: false,
        });
        ctx.opcionesCerradas = true;
        i++;
        continue;
      }

      const buscar = (flag: string) => buscarOpcion(ctx!, flag);
      const [flag, opcion] = resolverOpcion(ctx, token);

      if (opcion && flag === v) {
        // Coincidencia exacta.
        segmentos.push(segmentoOpcion(token.texto, flag, opcion, h, false));
        if (opcion.ejecutaComandoHasta) {
          i = analizarExec(tokens, i, opcion.ejecutaComandoHasta, segmentos, ayudas, token.texto);
          continue;
        }
        if (opcion.valor && !opcion.valor.soloConIgual) consumirValor(flag, opcion, h);
      } else if (opcion) {
        // Valor pegado: "--min-rate=5000", "-T4", "-p-", "-t=50" (Go).
        const conIgual = v.charAt(flag.length) === '=';
        if (!opcion.valor) {
          throw error('valor-no-admitido', `La opción "${flag}" de ${h.nombre} no lleva valor.`, v);
        }
        const corte = flag.length + (conIgual ? 1 : 0);
        const valorTexto = token.texto.slice(corte);
        segmentos.push(segmentoOpcion(token.texto.slice(0, corte), flag, opcion, h, false));
        segmentos.push(segmentoValor(valorTexto, flag, opcion, ayudas.nota({ ...token, texto: valorTexto, valor: v.slice(corte) }), true));
      } else if (h.estilo === 'posix' && h.combinables && !v.startsWith('--') && v.length > 2) {
        const r = expandirCombinadas(v.slice(1), buscar);
        if (!r.ok) {
          throw error('opcion-desconocida', `Opción "${r.flagDesconocida}" (en "${v}") no está en el diccionario de ${h.nombre}.`, r.flagDesconocida);
        }
        const textoGrupo = r.valorPegado === undefined ? token.texto : token.texto.slice(0, token.texto.length - r.valorPegado.length);
        segmentos.push({
          texto: textoGrupo,
          clase: 'opcion',
          etiqueta: `opciones combinadas · ${h.nombre}`,
          explicacion: `Equivale a ${r.partes.map((p) => p.flag).join(' ')}.`,
          partes: r.partes.map((p) => ({ texto: p.flag, explicacion: p.opcion.descripcion })),
          docs: h.docs,
          pegadoAlAnterior: false,
        });
        const ultima = r.partes.at(-1)!;
        if (r.valorPegado !== undefined) {
          segmentos.push(segmentoValor(r.valorPegado, ultima.flag, ultima.opcion, ayudas.nota({ ...token, texto: r.valorPegado, valor: r.valorPegado }), true));
        } else if (ultima.opcion.valor && !ultima.opcion.valor.soloConIgual) {
          consumirValor(ultima.flag, ultima.opcion, h);
        }
      } else {
        throw error('opcion-desconocida', `Opción "${v}" no está en el diccionario de ${h.nombre}.`, v);
      }

      if (opcion?.terminaOpciones) ctx.opcionesCerradas = true;
      i++;
      continue;
    }

    // ---------- Subcomando ----------
    if (ctx.esperaSubcomando) {
      const sub = h.subcomandos!.find((s) => s.nombre === v);
      if (!sub) {
        throw error('subcomando-desconocido', `Subcomando "${v}" no está en el diccionario de ${h.nombre}.`, v);
      }
      segmentos.push({
        texto: token.texto,
        clase: 'subcomando',
        etiqueta: `subcomando · ${h.nombre}`,
        explicacion: sub.descripcion,
        docs: h.docs,
        pegadoAlAnterior: false,
      });
      ctx.subcomando = sub;
      ctx.esperaSubcomando = false;
      i++;
      continue;
    }

    // ---------- Comando anidado (sudo <comando>) ----------
    if (h.ejecutaComando) {
      ctx = null; // el mismo token se procesa como herramienta nueva
      continue;
    }

    // ---------- Argumento posicional ----------
    const explicacionNota = nota(token);
    if (h.argumentos === null && explicacionNota === undefined) {
      throw error('argumento-no-admitido', `${h.nombre} no admite el argumento "${v}".`, v);
    }
    segmentos.push({
      texto: token.texto,
      clase: 'argumento',
      etiqueta: `argumento · ${h.nombre}`,
      explicacion: explicacionNota ?? h.argumentos!,
      pegadoAlAnterior: false,
    });
    ctx.posicionales++;
    if (h.opcionesHastaArgumento && ctx.posicionales >= h.opcionesHastaArgumento) {
      ctx.opcionesCerradas = true;
    }
    i++;
  }

  if (ctx?.esperaSubcomando) {
    throw ayudas.error('falta-subcomando', `${ctx.herramienta.nombre} necesita un subcomando.`, ctx.herramienta.nombre);
  }
  return segmentos;
}

/** Opciones visibles en el contexto: primero las del subcomando, luego las generales. */
function buscarOpcion(ctx: Contexto, flag: string): Opcion | undefined {
  const listas = [ctx.subcomando?.opciones ?? [], ctx.herramienta.opciones];
  for (const lista of listas) {
    const encontrada = lista.find((o) => o.nombres.includes(flag));
    if (encontrada) return encontrada;
  }
  return undefined;
}

/**
 * Devuelve [flag, opción] si el token es una opción conocida, exacta o con valor
 * pegado. Si no, [token, undefined] (quizá sean opciones combinadas).
 */
function resolverOpcion(ctx: Contexto, token: Token): [string, Opcion | undefined] {
  const v = token.valor;
  const h = ctx.herramienta;

  if (h.estilo === 'go') {
    // En Go, "-x" y "--x" son lo mismo y el valor solo puede ir con "=".
    const nombre = v.includes('=') ? v.slice(0, v.indexOf('=')) : v;
    const alternativa = nombre.startsWith('--') ? nombre.slice(1) : `-${nombre}`;
    const opcion = buscarOpcion(ctx, nombre) ?? buscarOpcion(ctx, alternativa);
    return [nombre, opcion];
  }

  const exacta = buscarOpcion(ctx, v);
  if (exacta) return [v, exacta];

  if (h.estilo === 'exacto') return [v, undefined];

  if (v.startsWith('--')) {
    const nombre = v.includes('=') ? v.slice(0, v.indexOf('=')) : v;
    return [nombre, buscarOpcion(ctx, nombre)];
  }

  // Opción corta con valor pegado (-p80, -T4, -p-): la más larga que encaje.
  if (h.valorPegado !== false) {
    const candidatas = [...(ctx.subcomando?.opciones ?? []), ...h.opciones]
      .filter((o) => o.valor && !o.valor.soloConIgual)
      .flatMap((o) => o.nombres.filter((n) => !n.startsWith('--') && v.startsWith(n) && v.length > n.length).map((n) => [n, o] as const))
      .sort((a, b) => b[0].length - a[0].length);
    if (candidatas[0]) return [candidatas[0][0], candidatas[0][1]];
  }
  return [v, undefined];
}

/** find -exec comando ... \; → analiza el comando anidado hasta el terminador. */
function analizarExec(
  tokens: Token[],
  inicio: number,
  terminadores: string[],
  segmentos: Segmento[],
  ayudas: Ayudas,
  textoOpcion: string,
): number {
  const fin = tokens.findIndex((t, j) => j > inicio && t.tipo === 'palabra' && terminadores.includes(t.valor));
  if (fin === -1) {
    throw ayudas.error('exec-sin-terminar', `"${textoOpcion}" no termina en ${terminadores.join(' o ')}.`, textoOpcion);
  }
  const interior = tokens.slice(inicio + 1, fin);
  if (interior.length === 0) {
    throw ayudas.error('falta-comando', `"${textoOpcion}" necesita un comando.`, textoOpcion);
  }
  segmentos.push(...analizarTokens(interior, ayudas, { '{}': EXPLICACION_LLAVES_FIND }));
  const terminador = tokens[fin]!;
  segmentos.push({
    texto: terminador.texto,
    clase: 'argumento',
    etiqueta: `fin de ${textoOpcion}`,
    explicacion:
      terminador.valor === ';'
        ? 'Termina el comando de -exec y lo ejecuta una vez por fichero. Se escapa (\\;) para que el shell no lo interprete como separador.'
        : 'Termina el comando de -exec y lo ejecuta agrupando muchos ficheros en cada ejecución.',
    pegadoAlAnterior: false,
  });
  return fin + 1;
}

function segmentoOpcion(texto: string, _flag: string, opcion: Opcion, h: Herramienta, pegado: boolean): Segmento {
  return {
    texto,
    clase: 'opcion',
    etiqueta: `opción · ${h.nombre}`,
    explicacion: opcion.descripcion,
    docs: h.docs,
    pegadoAlAnterior: pegado,
  };
}

function segmentoValor(texto: string, flag: string, opcion: Opcion, nota: string | undefined, pegado: boolean): Segmento {
  return {
    texto,
    clase: 'valor',
    etiqueta: `valor de ${flag} · ${opcion.valor?.nombre ?? ''}`.trim(),
    explicacion: nota ?? opcion.valor?.descripcion ?? '',
    pegadoAlAnterior: pegado,
  };
}
