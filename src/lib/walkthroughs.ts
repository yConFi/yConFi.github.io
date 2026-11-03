// Utilidades puras de walkthroughs: técnicas, secciones y fechas.
// Sin imports de ejecución de astro:content, para poder probarlas con Vitest.
// El acceso a la colección está en ./coleccion.ts.

import type { CollectionEntry } from 'astro:content';
import { etiquetaTecnica, IDIOMA_POR_DEFECTO, type Idioma } from '../i18n';

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
  /**
   * Nombre en castellano, tal cual está en el frontmatter. Es la clave canónica:
   * la que se compara, la que va en los `data-*` y la que se traduce.
   */
  canonico: string;
  /** Nombre visible en el idioma pedido. */
  nombre: string;
  /** Slug del nombre visible, así que cambia con el idioma (port-scanning / escaneo-de-puertos). */
  slug: string;
  walkthroughs: Walkthrough[];
}

/**
 * Agrupa por técnica en el idioma pedido. Falla si la misma técnica está escrita
 * de dos formas distintas ("SQLi" y "sqli"), para que el índice no se duplique.
 *
 * El agrupado y la comprobación son siempre sobre el nombre canónico (castellano);
 * el idioma solo cambia lo que se ve y el orden alfabético.
 */
export function agruparPorTecnica(lista: Walkthrough[], idioma: Idioma = IDIOMA_POR_DEFECTO): Tecnica[] {
  const mapa = new Map<string, Tecnica>();
  for (const w of lista) {
    for (const canonico of w.data.tecnicas) {
      const clave = slugTecnica(canonico);
      const existente = mapa.get(clave);
      if (existente && existente.canonico !== canonico) {
        throw new Error(
          `[técnicas] "${canonico}" (en ${w.id}) y "${existente.canonico}" (en ${existente.walkthroughs[0]!.id}) son la misma técnica escrita distinto. Usa la misma forma en todos los walkthroughs.`,
        );
      }
      if (existente) {
        if (!existente.walkthroughs.includes(w)) existente.walkthroughs.push(w);
      } else {
        const nombre = etiquetaTecnica(canonico, idioma);
        mapa.set(clave, { canonico, nombre, slug: slugTecnica(nombre), walkthroughs: [w] });
      }
    }
  }
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, idioma));
}

/** Una técnica suelta en el idioma pedido, para las etiquetas de las tarjetas. */
export function tecnicaEnIdioma(canonico: string, idioma: Idioma): { nombre: string; slug: string } {
  const nombre = etiquetaTecnica(canonico, idioma);
  return { nombre, slug: slugTecnica(nombre) };
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

/** Nombre visible de la serie y su nivel: "Starting Point · Tier 0". */
export function nombreSerie(serie: { nombre: string; tier: number }): string {
  return `${serie.nombre} · Tier ${serie.tier}`;
}

/**
 * Valores por los que se puede filtrar la serie de un walkthrough: la serie entera
 * y la serie con su nivel. Sin serie, ninguno.
 */
export function filtrosSerie(serie?: { nombre: string; tier: number }): string[] {
  return serie ? [serie.nombre, nombreSerie(serie)] : [];
}

/**
 * Formato de fecha por idioma:
 * - castellano: dd/mm/aa (02/11/26), como lo tenía la web.
 * - inglés: dd mmm aaaa (02 Nov 2026). dd/mm/aa no vale: media angloesfera lo
 *   leería como mm/dd/aa y el 02/11 pasaría a ser el 11 de febrero.
 */
const FORMATOS: Record<Idioma, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }),
};

export const formatearFecha = (fecha: Date, idioma: Idioma = IDIOMA_POR_DEFECTO) => FORMATOS[idioma].format(fecha);
