// Utilidades puras de walkthroughs: técnicas, secciones y fechas.
// Sin imports de ejecución de astro:content, para poder probarlas con Vitest.
// El acceso a la colección está en ./coleccion.ts.

import type { CollectionEntry } from 'astro:content';

export type Walkthrough = CollectionEntry<'walkthroughs'>;

/** "Escalada de privilegios" → "escalada-de-privilegios" (sin tildes ni símbolos). */
export function slugTecnica(tecnica: string): string {
  return tecnica
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // quita tildes y diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface Tecnica {
  slug: string;
  nombre: string;
  walkthroughs: Walkthrough[];
}

/**
 * Agrupa por técnica. Falla si la misma técnica está escrita de dos formas
 * distintas ("SQLi" y "sqli"), para que el índice no se duplique.
 */
export function agruparPorTecnica(lista: Walkthrough[]): Tecnica[] {
  const mapa = new Map<string, Tecnica>();
  for (const w of lista) {
    for (const nombre of w.data.tecnicas) {
      const slug = slugTecnica(nombre);
      const existente = mapa.get(slug);
      if (existente && existente.nombre !== nombre) {
        throw new Error(
          `[técnicas] "${nombre}" (en ${w.id}) y "${existente.nombre}" (en ${existente.walkthroughs[0]!.id}) son la misma técnica escrita distinto. Usa la misma forma en todos los walkthroughs.`,
        );
      }
      if (existente) {
        if (!existente.walkthroughs.includes(w)) existente.walkthroughs.push(w);
      } else {
        mapa.set(slug, { slug, nombre, walkthroughs: [w] });
      }
    }
  }
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

/** Secciones obligatorias (títulos de nivel 2), en este orden. */
export const SECCIONES = [
  'Reconocimiento',
  'Enumeración',
  'Acceso inicial',
  'Escalada de privilegios',
  'Lecciones aprendidas',
] as const;

/** Lanza un error si los `##` del walkthrough no son exactamente las secciones fijas en orden. */
export function comprobarSecciones(id: string, headings: { depth: number; text: string }[]): void {
  const encontradas = headings.filter((h) => h.depth === 2).map((h) => h.text.trim());
  const correcto =
    encontradas.length === SECCIONES.length && encontradas.every((texto, i) => texto === SECCIONES[i]);
  if (!correcto) {
    throw new Error(
      [
        `[walkthrough] Las secciones de "${id}" no siguen la estructura fija.`,
        `  Esperadas (## en este orden): ${SECCIONES.join(' → ')}`,
        `  Encontradas:                  ${encontradas.join(' → ') || '(ninguna)'}`,
        '  Usa ### para subapartados dentro de cada sección.',
      ].join('\n'),
    );
  }
}

const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'UTC' });
export const formatearFecha = (fecha: Date) => formatoFecha.format(fecha);
