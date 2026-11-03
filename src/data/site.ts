// Datos globales del sitio. Solo datos confirmados por Ricardo;
// lo que falta queda marcado con TODO.

export const SITE = {
  titulo: 'yConFi',
  autor: 'Ricardo Hidalgo Bejarano',
} as const;
// La descripción del sitio y el idioma de cada página ya no están aquí: dependen
// del idioma, así que viven en src/i18n/ (textos/<idioma>.ts y idiomas.ts).

export const ENLACES = {
  github: 'https://github.com/yConFi',
  linkedin: 'https://www.linkedin.com/in/ricardo-hidalgo-bejarano-810155344',
} as const;

/**
 * Contador de "me ha servido" de la portada. El endpoint es el Worker de
 * Cloudflare de `worker/` (ver su README para desplegarlo).
 *
 * Mientras `endpoint` esté vacío el botón NO se muestra. Es a propósito: más
 * vale que no haya botón a que haya un número que no sea real.
 */
export const CONTADOR_UTIL = {
  endpoint: 'https://contador-util.yconfi.workers.dev',
} as const;

export interface PerfilPlataforma {
  nombre: string;
  url: string;
  /** Opcional: rango o nivel, actualizado a mano. Si se pone, indica también la fecha en que lo miraste. */
  rango?: { nombre: string; actualizado: string };
}

/** Perfiles en plataformas de práctica, para la página de logros. */
export const PERFILES: readonly PerfilPlataforma[] = [
  // TODO: añadir `rango` cuando Ricardo lo indique, p. ej. { nombre: '…', actualizado: 'AAAA-MM-DD' }.
  { nombre: 'HackTheBox', url: 'https://profile.hackthebox.com/profile/019ddedf-fe2d-70cf-93a9-c866d6fdb45c' },
];
