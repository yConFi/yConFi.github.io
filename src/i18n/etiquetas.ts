// Etiquetas por idioma de los valores cerrados del contenido.
//
// La clave es SIEMPRE el valor en castellano, que es el que se escribe en el
// frontmatter y en el diccionario. Así no hay que tocar ningún .mdx ni ningún
// `data-*`: lo canónico sigue en castellano y aquí solo se traduce lo que se ve.
//
// Si falta una traducción se lanza un error en lugar de caer al castellano:
// vale más que falle `astro build` que publicar media página en el otro idioma.

import type { Idioma } from './idiomas';
import { IDIOMA_POR_DEFECTO } from './idiomas';

/** Traducciones de un valor canónico: solo hace falta la del idioma no por defecto. */
type Traduccion = Record<string, string>;

function traducir(tabla: Traduccion, valor: string, idioma: Idioma, que: string): string {
  if (idioma === IDIOMA_POR_DEFECTO) return valor;
  const traducido = tabla[valor];
  if (!traducido) {
    throw new Error(
      `[i18n] Falta la traducción al ${idioma} de ${que} "${valor}". Añádela en src/i18n/etiquetas.ts.`,
    );
  }
  return traducido;
}

// Los nombres de HackTheBox en inglés son los que usa la propia plataforma.
const DIFICULTADES_EN: Traduccion = {
  'Muy fácil': 'Very Easy',
  'Fácil': 'Easy',
  'Media': 'Medium',
  'Difícil': 'Hard',
  'Insana': 'Insane',
};

const SISTEMAS_EN: Traduccion = {
  Linux: 'Linux',
  Windows: 'Windows',
  FreeBSD: 'FreeBSD',
  OpenBSD: 'OpenBSD',
  Android: 'Android',
  Otro: 'Other',
};

const ESTADOS_EN: Traduccion = {
  'En producción': 'In production',
  'En desarrollo': 'In development',
  'Terminado': 'Completed',
  'Archivado': 'Archived',
};

const CATEGORIAS_EN: Traduccion = {
  'Escaneo de red': 'Network scanning',
  'Enumeración web': 'Web enumeration',
  HTTP: 'HTTP',
  Conexiones: 'Connections',
  Contraseñas: 'Passwords',
  Privilegios: 'Privileges',
  'Ficheros y búsqueda': 'Files and search',
  'Información del sistema': 'System information',
  'Intérpretes': 'Interpreters',
};

/**
 * Técnicas. Las siglas de protocolos y productos (FTP, SMB, RDP…) no se traducen,
 * pero se listan igual para que la tabla sea la lista completa y falte lo que falte.
 */
const TECNICAS_EN: Traduccion = {
  'Acceso anónimo': 'Anonymous access',
  'Acceso sin contraseña': 'Passwordless access',
  'Captura de hashes NTLM': 'NTLM hash capture',
  'Credenciales por defecto': 'Default credentials',
  'Crackeo de hashes': 'Password cracking',
  'Escaneo de puertos': 'Port scanning',
  'Fuerza bruta de directorios': 'Directory brute forcing',
  'Inyección de comandos': 'Command injection',
  'Inyección SQL': 'SQL injection',
  LFI: 'Local File Inclusion (LFI)',
  RFI: 'Remote File Inclusion (RFI)',
  FTP: 'FTP',
  MariaDB: 'MariaDB',
  MongoDB: 'MongoDB',
  MySQL: 'MySQL',
  RDP: 'RDP',
  Redis: 'Redis',
  Rsync: 'Rsync',
  SMB: 'SMB',
  SSH: 'SSH',
  Telnet: 'Telnet',
  WinRM: 'WinRM',
  // Solo la usa src/content/walkthroughs/plantilla.mdx, que es borrador.
  'Ejemplo de técnica': 'Example technique',
};

export const etiquetaDificultad = (v: string, i: Idioma) => traducir(DIFICULTADES_EN, v, i, 'la dificultad');
export const etiquetaSistema = (v: string, i: Idioma) => traducir(SISTEMAS_EN, v, i, 'el sistema');
export const etiquetaEstado = (v: string, i: Idioma) => traducir(ESTADOS_EN, v, i, 'el estado');
export const etiquetaCategoria = (v: string, i: Idioma) => traducir(CATEGORIAS_EN, v, i, 'la categoría');
export const etiquetaTecnica = (v: string, i: Idioma) => traducir(TECNICAS_EN, v, i, 'la técnica');

/** Las plataformas y las series son nombres propios: iguales en los dos idiomas. */
export const etiquetaPlataforma = (v: string) => v;
export const etiquetaSerie = (v: string) => v;

/** Tablas expuestas para el test que comprueba que no falta ninguna traducción. */
export const TABLAS_EN = {
  dificultades: DIFICULTADES_EN,
  sistemas: SISTEMAS_EN,
  estados: ESTADOS_EN,
  categorias: CATEGORIAS_EN,
  tecnicas: TECNICAS_EN,
} as const;
