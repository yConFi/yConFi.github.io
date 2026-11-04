// Cuentas del diccionario. Se usan en /diccionario/ y en los contadores de la portada,
// para que ambos digan siempre lo mismo.

import { HERRAMIENTAS, OPERADORES } from '../data/comandos';
import { cobertura } from './comando/texto';

/** Herramientas del diccionario (nmap, ftp, telnet…). */
export const TOTAL_HERRAMIENTAS = HERRAMIENTAS.length;

/** Operadores de shell explicados (|, >, &&…). */
export const TOTAL_OPERADORES = OPERADORES.length;

/**
 * Cuántos textos del diccionario están ya en los dos idiomas. Se calcula desde
 * el propio diccionario, así que el aviso de la página siempre dice la verdad y
 * desaparece solo cuando no queda nada por traducir.
 */
export const COBERTURA = cobertura([...HERRAMIENTAS], [...OPERADORES]);

/** Opciones explicadas, contando también las de los subcomandos (`gobuster dir`…). */
export const TOTAL_OPCIONES = HERRAMIENTAS.reduce(
  (n, h) => n + h.opciones.length + (h.subcomandos ?? []).reduce((m, s) => m + s.opciones.length, 0),
  0,
);
