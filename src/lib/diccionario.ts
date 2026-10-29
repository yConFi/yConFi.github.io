// Cuentas del diccionario. Se usan en /diccionario/ y en los contadores de la portada,
// para que ambos digan siempre lo mismo.

import { HERRAMIENTAS, OPERADORES } from '../data/comandos';

/** Herramientas del diccionario (nmap, ftp, telnet…). */
export const TOTAL_HERRAMIENTAS = HERRAMIENTAS.length;

/** Operadores de shell explicados (|, >, &&…). */
export const TOTAL_OPERADORES = OPERADORES.length;

/** Opciones explicadas, contando también las de los subcomandos (`gobuster dir`…). */
export const TOTAL_OPCIONES = HERRAMIENTAS.reduce(
  (n, h) => n + h.opciones.length + (h.subcomandos ?? []).reduce((m, s) => m + s.opciones.length, 0),
  0,
);
