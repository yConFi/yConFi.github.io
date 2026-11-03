// Valores cerrados del contenido: plataformas, dificultades, sistemas, series y
// estados de proyecto.
//
// Están aquí y no en src/content.config.ts porque ese archivo importa
// `astro:content`, que solo existe dentro de Astro: desde aquí los pueden usar
// también los tests (tests/i18n.test.ts comprueba que todos tienen traducción).
//
// Para añadir un valor, amplía la lista y añade su traducción en src/i18n/etiquetas.ts.

export const PLATAFORMAS = ['HackTheBox', 'TryHackMe'] as const;
export const DIFICULTADES = ['Muy fácil', 'Fácil', 'Media', 'Difícil', 'Insana'] as const;
export const SISTEMAS = ['Linux', 'Windows', 'FreeBSD', 'OpenBSD', 'Android', 'Otro'] as const;
/** Series o rutas guiadas dentro de una plataforma (p. ej. Starting Point de HackTheBox). */
export const SERIES = ['Starting Point'] as const;
export const ESTADOS_PROYECTO = ['En producción', 'En desarrollo', 'Terminado', 'Archivado'] as const;
