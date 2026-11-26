// Forma del índice de búsqueda (ver design-exploration/CLAUDE_CODE_HANDOFF.md).

import type { Idioma } from '../../i18n/idiomas';

export const TIPOS = ['walkthrough', 'technique', 'tool', 'option', 'dictionary', 'project'] as const;
export type TipoRegistro = (typeof TIPOS)[number];

/**
 * Desempate: a igualdad de puntos, primero lo más útil para una consulta
 * (una opción concreta antes que un walkthrough entero).
 */
export const ORDEN_TIPOS: readonly TipoRegistro[] = ['option', 'dictionary', 'tool', 'technique', 'walkthrough', 'project'];

/**
 * Las tres intenciones del Laboratorio. Solo agrupan lo que se ve: el orden de
 * los resultados lo decide la puntuación, nunca la intención.
 */
export const INTENCIONES = {
  aprender: ['walkthrough', 'technique'],
  aplicar: ['project'],
  consultar: ['tool', 'option', 'dictionary'],
} as const satisfies Record<string, readonly TipoRegistro[]>;

export type Intencion = keyof typeof INTENCIONES;

export function intencionDe(tipo: TipoRegistro): Intencion {
  return (Object.keys(INTENCIONES) as Intencion[]).find((i) =>
    (INTENCIONES[i] as readonly TipoRegistro[]).includes(tipo),
  )!;
}

export interface Relacion {
  /** Id estable del destino: `technique:winrm`, `tool:nmap`… */
  id: string;
  kind: TipoRegistro | 'source';
}

export interface RegistroBusqueda {
  /** Id estable: `${kind}:${slug}`; opciones `option:${herramienta}:${opción}`. */
  id: string;
  lang: Idioma;
  kind: TipoRegistro;
  /** Título visible, en su forma original (con tildes y mayúsculas). */
  title: string;
  slug: string;
  /** Ruta de la página (con ancla si apunta a una ficha del diccionario). */
  url: string;
  summary: string;
  /** Palabras normalizadas para buscar (las opciones conservan mayúsculas). */
  tokens: string[];
  /** Otras formas de nombrarlo ("FTP anónimo", "anonymous FTP"). */
  aliases: string[];
  relations: Relacion[];
  /** Fecha AAAA-MM-DD, solo si el contenido la tiene. */
  updated?: string;
}
