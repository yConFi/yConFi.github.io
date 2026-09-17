// Acceso a la colección de walkthroughs respetando los borradores.

import { getCollection } from 'astro:content';
import type { Walkthrough } from './walkthroughs';

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
