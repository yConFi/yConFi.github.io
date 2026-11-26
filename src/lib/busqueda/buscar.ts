// Búsqueda sobre el índice estático. Se usa igual en el navegador y en los tests.
//
// Reglas (ver design-exploration/CLAUDE_CODE_HANDOFF.md):
// 1. TODAS las palabras de la consulta tienen que aparecer en el registro (en el
//    título, un alias, una relación o sus tokens). Si falta una, no sale.
// 2. Puntuación:
//      frase completa en el título o en un alias ....... 5
//      opción exacta (registro de una opción) .......... 5
//      el título empieza por la consulta ............... 4
//      por palabra que es una técnica/herramienta
//        relacionada (WinRM, nmap…) .................... 3
//      por palabra en el resumen o los tokens .......... 1
// 3. Empates: primero el tipo más útil para consultar (opción, operador,
//    herramienta, técnica, walkthrough, proyecto) y después el título.
// 4. Como mucho 20 resultados.

import { coincidePalabra, esOpcion, normalizar, palabrasConsulta, palabrasTexto } from './normalizar';
import { ORDEN_TIPOS, intencionDe, type Intencion, type RegistroBusqueda, type TipoRegistro } from './tipos';

export const PESOS = {
  frase: 5,
  opcionExacta: 5,
  prefijoTitulo: 4,
  relacion: 3,
  token: 1,
} as const;

export const MAXIMO_RESULTADOS = 20;

export interface Resultado {
  registro: RegistroBusqueda;
  puntos: number;
}

/** Lo que se calcula una vez por registro y se reutiliza en cada búsqueda. */
interface Preparado {
  titulo: string;
  alias: string[];
  /** Palabras de las técnicas y herramientas relacionadas (y del propio registro si es una de ellas). */
  relacionadas: string[];
  /** Todo lo demás: palabras del título, alias, resumen y tokens. */
  tokens: string[];
  /** Solo en opciones: sus nombres (`-p`, `--min-rate`). */
  opciones: string[];
}

const cache = new WeakMap<RegistroBusqueda, Preparado>();

/** Último tramo de un id: `technique:escaneo-de-puertos` → `escaneo-de-puertos`. */
const ultimo = (id: string) => id.slice(id.lastIndexOf(':') + 1);

function preparar(r: RegistroBusqueda): Preparado {
  const enCache = cache.get(r);
  if (enCache) return enCache;

  const propias = r.kind === 'technique' || r.kind === 'tool' ? [r.id] : [];
  const relacionadas = [...propias, ...r.relations.filter((x) => x.kind === 'technique' || x.kind === 'tool').map((x) => x.id)]
    .flatMap((id) => {
      const slug = ultimo(id);
      // "escaneo-de-puertos" vale como palabras sueltas; "evil-winrm" también entero.
      return [slug, ...slug.split('-')];
    })
    .filter(Boolean);

  const opciones = r.kind === 'option' ? r.tokens.filter(esOpcion) : [];

  const preparado: Preparado = {
    titulo: normalizar(r.title),
    alias: r.aliases.map(normalizar),
    relacionadas: [...new Set(relacionadas)],
    tokens: [
      ...new Set([
        ...palabrasTexto(r.title, 1),
        ...r.aliases.flatMap((a) => palabrasTexto(a, 1)),
        ...palabrasTexto(r.summary),
        ...r.tokens,
      ]),
    ],
    opciones,
  };
  cache.set(r, preparado);
  return preparado;
}

/** Puntos de un registro para una consulta, o `null` si alguna palabra no aparece. */
export function puntuar(r: RegistroBusqueda, consulta: string): number | null {
  const palabras = palabrasConsulta(consulta);
  if (palabras.length === 0) return null;
  const frase = normalizar(consulta);
  const p = preparar(r);

  let puntos = 0;
  for (const palabra of palabras) {
    // Las opciones se comparan tal cual; el resto, normalizado.
    const comparar = (token: string) => coincidePalabra(palabra, esOpcion(palabra) ? token : token.toLowerCase());
    if (p.relacionadas.some(comparar)) puntos += PESOS.relacion;
    else if (p.tokens.some(comparar)) puntos += PESOS.token;
    else return null;
  }

  if (p.titulo.includes(frase) || p.alias.some((a) => a.includes(frase))) puntos += PESOS.frase;
  if (p.titulo.startsWith(frase)) puntos += PESOS.prefijoTitulo;
  if (p.opciones.length > 0 && palabras.some((w) => esOpcion(w) && p.opciones.includes(w))) {
    puntos += PESOS.opcionExacta;
  }
  return puntos;
}

export interface OpcionesBusqueda {
  /** Solo registros de este tipo. */
  tipo?: TipoRegistro;
  max?: number;
}

export function buscar(registros: readonly RegistroBusqueda[], consulta: string, opciones: OpcionesBusqueda = {}): Resultado[] {
  const { tipo, max = MAXIMO_RESULTADOS } = opciones;
  const resultados: Resultado[] = [];
  for (const registro of registros) {
    if (tipo && registro.kind !== tipo) continue;
    const puntos = puntuar(registro, consulta);
    if (puntos !== null) resultados.push({ registro, puntos });
  }
  return resultados
    .sort(
      (a, b) =>
        b.puntos - a.puntos ||
        ORDEN_TIPOS.indexOf(a.registro.kind) - ORDEN_TIPOS.indexOf(b.registro.kind) ||
        a.registro.title.localeCompare(b.registro.title, a.registro.lang),
    )
    .slice(0, max);
}

export interface GrupoResultados {
  intencion: Intencion;
  resultados: Resultado[];
}

/**
 * Agrupa por intención (Aprender, Aplicar, Consultar) sin alterar el ranking:
 * los grupos salen en el orden en que aparece su primer resultado, y dentro de
 * cada grupo se conserva el orden por puntos.
 */
export function agruparPorIntencion(resultados: readonly Resultado[]): GrupoResultados[] {
  const grupos = new Map<Intencion, Resultado[]>();
  for (const r of resultados) {
    const intencion = intencionDe(r.registro.kind);
    const lista = grupos.get(intencion) ?? [];
    lista.push(r);
    grupos.set(intencion, lista);
  }
  return [...grupos].map(([intencion, lista]) => ({ intencion, resultados: lista }));
}
