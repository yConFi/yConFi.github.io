// Resolver y contar los textos del diccionario (ver el tipo `Texto` en tipos.ts).
//
// El diccionario se escribió entero en castellano y se va traduciendo entrada
// por entrada. Mientras una entrada no esté traducida se enseña en castellano:
// vale más eso que una traducción sin comprobar en la documentación oficial.
// Para que eso no sea una trampa al visitante, la página dice cuántas entradas
// van traducidas, y la cuenta sale de aquí, no de un número escrito a mano.

import { IDIOMA_POR_DEFECTO, type Idioma } from '../../i18n/idiomas';
import type { Herramienta, Operador, Texto } from './tipos';

/** El texto en el idioma pedido. Si no está traducido, el castellano. */
export function enIdioma(texto: Texto, idioma: Idioma): string {
  return typeof texto === 'string' ? texto : texto[idioma];
}

/** Igual, pero admite que no haya texto. */
export function enIdiomaOpcional(texto: Texto | null | undefined, idioma: Idioma): string | undefined {
  return texto == null ? undefined : enIdioma(texto, idioma);
}

/** true si la entrada ya está en los dos idiomas. */
export const estaTraducido = (texto: Texto): boolean => typeof texto !== 'string';

/** Todos los textos traducibles de una herramienta, en orden de aparición. */
function textosDeHerramienta(h: Herramienta): Texto[] {
  const deOpcion = (o: { descripcion: Texto; valor?: { nombre: Texto; descripcion: Texto } }): Texto[] => [
    o.descripcion,
    ...(o.valor ? [o.valor.nombre, o.valor.descripcion] : []),
  ];
  return [
    h.descripcion,
    ...(h.variantes ? [h.variantes] : []),
    ...(h.argumentos ? [h.argumentos] : []),
    ...h.opciones.flatMap(deOpcion),
    ...(h.subcomandos ?? []).flatMap((s) => [s.descripcion, ...s.opciones.flatMap(deOpcion)]),
  ];
}

/** Todos los textos traducibles del diccionario. */
export function textosDelDiccionario(herramientas: Herramienta[], operadores: Operador[]): Texto[] {
  return [...herramientas.flatMap(textosDeHerramienta), ...operadores.flatMap((o) => [o.nombre, o.descripcion])];
}

export interface Cobertura {
  total: number;
  traducidos: number;
  /** true cuando no queda nada por traducir: entonces el aviso desaparece solo. */
  completa: boolean;
}

export function cobertura(herramientas: Herramienta[], operadores: Operador[]): Cobertura {
  const textos = textosDelDiccionario(herramientas, operadores);
  const traducidos = textos.filter(estaTraducido).length;
  return { total: textos.length, traducidos, completa: traducidos === textos.length };
}

/** El idioma por defecto se reexporta para que las páginas no tengan que importarlo aparte. */
export { IDIOMA_POR_DEFECTO };
