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

export const NAVEGACION = [
  { href: '/', texto: 'Inicio' },
  { href: '/walkthroughs/', texto: 'Walkthroughs' },
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/diccionario/', texto: 'Diccionario' },
] as const;
