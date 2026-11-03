// Idiomas de la web.
//
// El castellano es el idioma por defecto y vive en la raíz (/walkthroughs/);
// el inglés lleva prefijo (/en/walkthroughs/). Así ninguna URL ya publicada
// cambia. La configuración de enrutado está en astro.config.mjs.

export const IDIOMAS = ['es', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = 'es';

/** Nombre de cada idioma en su propio idioma, para el selector. */
export const NOMBRE_IDIOMA: Record<Idioma, string> = { es: 'Español', en: 'English' };

/**
 * Valor de `lang` y de `hreflang`: solo el idioma, sin región, porque la web no
 * se dirige a un país concreto.
 */
export const LANG: Record<Idioma, string> = { es: 'es', en: 'en' };

/**
 * Valor de `og:locale`. Open Graph exige el formato idioma_TERRITORIO, así que
 * aquí sí hay que elegir una región aunque el contenido no sea de un país.
 * https://ogp.me/#optional
 */
export const OG_LOCALE: Record<Idioma, string> = { es: 'es_ES', en: 'en_US' };

export function esIdioma(valor: unknown): valor is Idioma {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}

/** El otro idioma (con dos idiomas no hay ambigüedad). */
export function idiomaAlterno(idioma: Idioma): Idioma {
  return idioma === 'es' ? 'en' : 'es';
}

/**
 * Idioma al que pertenece una ruta: todo lo que empieza por /en/ es inglés y el
 * resto castellano. Se usa en los componentes que solo conocen `Astro.url`.
 */
export function idiomaDeRuta(ruta: string): Idioma {
  return ruta === '/en' || ruta.startsWith('/en/') ? 'en' : IDIOMA_POR_DEFECTO;
}
