// Expansión de opciones cortas combinadas, estilo getopt: `-lvnp` = `-l -v -n -p`.

import type { Opcion } from './tipos';

export interface ParteCombinada {
  /** La opción individual con su guion, p. ej. "-l". */
  flag: string;
  opcion: Opcion;
}

export type ResultadoCombinadas =
  | {
      ok: true;
      partes: ParteCombinada[];
      /**
       * Si la ÚLTIMA parte lleva valor y quedaban caracteres detrás, esos
       * caracteres son su valor: `-p80` → valorPegado "80".
       * Si la última parte lleva valor y no queda nada, se deja undefined y el
       * analizador usará el token siguiente (`-lvnp 4444`).
       */
      valorPegado?: string;
    }
  | { ok: false; flagDesconocida: string };

/**
 * Expande un grupo de opciones cortas combinadas.
 *
 * @param grupo  Letras SIN el guion inicial, p. ej. "lvnp" para `-lvnp`.
 * @param buscar Devuelve la Opcion del diccionario para una flag como "-l",
 *               o undefined si la herramienta no la tiene.
 *
 * Ejemplos esperados (ver tests/combinadas.test.ts):
 *   "la"    → partes [-l, -a]
 *   "lvnp"  → partes [-l, -v, -n, -p], sin valorPegado (-p toma el token siguiente)
 *   "iA3"   → partes [-i, -A], valorPegado "3"
 *   "lZ"    → { ok: false, flagDesconocida: "-Z" }
 */
export function expandirCombinadas(
  grupo: string,
  buscar: (flag: string) => Opcion | undefined,
): ResultadoCombinadas {
  // TODO(Ricardo): implementar (5-10 líneas).
  void grupo;
  void buscar;
  throw new Error('TODO: implementar expandirCombinadas en src/lib/comando/combinadas.ts');
}
