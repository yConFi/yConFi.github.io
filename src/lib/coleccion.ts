// Acceso a las colecciones respetando los borradores.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Walkthrough } from './walkthroughs';

export type Proyecto = CollectionEntry<'proyectos'>;

/**
 * Los borradores solo existen con `npm run dev`. En `npm run build` se excluyen del
 * todo: sin página, índice, técnicas ni sitemap. Ver la integración en astro.config.mjs.
 */
export const MOSTRAR_BORRADORES = __MOSTRAR_BORRADORES__;

/** Walkthroughs visibles, del más reciente al más antiguo. */
export async function obtenerWalkthroughs(): Promise<Walkthrough[]> {
  const todos = await getCollection('walkthroughs', ({ data }) => MOSTRAR_BORRADORES || !data.borrador);
  return todos.sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

/** Proyectos visibles: primero los que tienen fecha (más recientes antes), luego por título. */
export async function obtenerProyectos(): Promise<Proyecto[]> {
  const todos = await getCollection('proyectos', ({ data }) => MOSTRAR_BORRADORES || !data.borrador);
  return todos.sort(
    (a, b) =>
      (b.data.fecha?.getTime() ?? -Infinity) - (a.data.fecha?.getTime() ?? -Infinity) ||
      a.data.titulo.localeCompare(b.data.titulo, 'es'),
  );
}
