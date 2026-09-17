// Datos globales del sitio. Solo datos confirmados por Ricardo;
// lo que falta queda marcado con TODO.

export const SITE = {
  // TODO: confirmar el nombre/título que quieres para la web.
  titulo: 'Ricardo Hidalgo',
  // TODO: descripción por defecto para buscadores (1-2 frases).
  descripcion: 'Portfolio y walkthroughs de ciberseguridad.',
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
