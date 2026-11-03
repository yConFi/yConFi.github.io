// Tabla de rutas por idioma.
//
// Es la única fuente de verdad de las URLs de las secciones, y hace dos cosas:
// construir los enlaces de cada idioma y decirle al selector de idioma a qué
// página equivalente tiene que llevar. Los segmentos se traducen (/en/projects/
// y no /en/proyectos/): si no, media URL quedaría en castellano.
//
// Las rutas en castellano NO llevan prefijo, así que son exactamente las que ya
// estaban publicadas. Si añades una sección, añádela aquí y en los textos de
// navegación de src/i18n/textos/.

import { IDIOMAS, type Idioma } from './idiomas';

export const RUTAS = {
  inicio: { es: '/', en: '/en/' },
  walkthroughs: { es: '/walkthroughs/', en: '/en/walkthroughs/' },
  tecnicas: { es: '/tecnicas/', en: '/en/techniques/' },
  proyectos: { es: '/proyectos/', en: '/en/projects/' },
  logros: { es: '/logros/', en: '/en/achievements/' },
  diccionario: { es: '/diccionario/', en: '/en/dictionary/' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type Seccion = keyof typeof RUTAS;

export const SECCIONES = Object.keys(RUTAS) as Seccion[];

/** Ruta de una sección en un idioma: ruta('tecnicas', 'en') → "/en/techniques/". */
export function ruta(seccion: Seccion, idioma: Idioma): string {
  return RUTAS[seccion][idioma];
}

/** Ruta de una página hija: rutaHija('walkthroughs', 'en', 'meow') → "/en/walkthroughs/meow/". */
export function rutaHija(seccion: Seccion, idioma: Idioma, hijo: string): string {
  return `${RUTAS[seccion][idioma]}${hijo}/`;
}

/**
 * La misma ruta en el otro idioma, para el selector y para `hreflang`.
 *
 * Solo resuelve las secciones de la tabla. Las páginas con parámetro
 * (un walkthrough, una técnica, un proyecto) conocen su propio equivalente y lo
 * pasan a mano a BaseLayout, porque el slug también cambia de idioma.
 */
export function rutaEquivalente(rutaActual: string, destino: Idioma): string | undefined {
  const normalizada = rutaActual.endsWith('/') ? rutaActual : `${rutaActual}/`;
  const seccion = SECCIONES.find((s) => IDIOMAS.some((i) => RUTAS[s][i] === normalizada));
  return seccion ? RUTAS[seccion][destino] : undefined;
}

export interface EnlaceNavegacion {
  href: string;
  texto: string;
  /** Rutas que también marcan esta sección como activa (las técnicas son parte de walkthroughs). */
  incluye?: readonly string[];
  /** true = solo está activa en su ruta exacta (el inicio, que es prefijo de todo lo demás). */
  exacto?: boolean;
}

/** Secciones de la navegación en el orden del menú, con los textos del idioma. */
export function navegacion(idioma: Idioma, textos: Record<Seccion, string>): readonly EnlaceNavegacion[] {
  return [
    { href: ruta('inicio', idioma), texto: textos.inicio, exacto: true },
    // Las técnicas son otra forma de recorrer los walkthroughs, no una sección aparte.
    { href: ruta('walkthroughs', idioma), texto: textos.walkthroughs, incluye: [ruta('tecnicas', idioma)] },
    { href: ruta('proyectos', idioma), texto: textos.proyectos },
    { href: ruta('logros', idioma), texto: textos.logros },
    { href: ruta('diccionario', idioma), texto: textos.diccionario },
  ];
}

/** true si `rutaActual` pertenece a la sección del enlace. */
export function esSeccionActiva(enlace: EnlaceNavegacion, rutaActual: string): boolean {
  const normalizada = rutaActual.endsWith('/') ? rutaActual : `${rutaActual}/`;
  if (enlace.exacto) return normalizada === enlace.href;
  return [enlace.href, ...(enlace.incluye ?? [])].some((base) => normalizada.startsWith(base));
}
