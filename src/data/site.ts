// Datos globales del sitio. Solo datos confirmados por Ricardo;
// lo que falta queda marcado con TODO.

export const SITE = {
  titulo: 'yConFi',
  descripcion:
    'Portfolio de ciberseguridad y walkthroughs paso a paso de máquinas y retos retirados, con cada parte de cada comando explicada.',
  idioma: 'es',
  autor: 'Ricardo Hidalgo Bejarano',
} as const;

export const ENLACES = {
  github: 'https://github.com/yConFi',
  linkedin: 'https://www.linkedin.com/in/ricardo-hidalgo-bejarano-810155344',
} as const;

export interface EnlaceNavegacion {
  href: string;
  texto: string;
  /** Otras rutas que pertenecen a esta sección (se marca como activa también en ellas). */
  incluye?: readonly string[];
}

export const NAVEGACION: readonly EnlaceNavegacion[] = [
  { href: '/', texto: 'Inicio' },
  // Las técnicas son otra forma de recorrer los walkthroughs, no una sección aparte.
  { href: '/walkthroughs/', texto: 'Walkthroughs', incluye: ['/tecnicas/'] },
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/diccionario/', texto: 'Diccionario' },
];

/** true si `ruta` pertenece a la sección. "Inicio" solo está activo en "/"; el resto también en sus subpáginas. */
export function esSeccionActiva(enlace: EnlaceNavegacion, ruta: string): boolean {
  if (enlace.href === '/') return ruta === '/';
  return [enlace.href, ...(enlace.incluye ?? [])].some((base) => ruta.startsWith(base));
}
