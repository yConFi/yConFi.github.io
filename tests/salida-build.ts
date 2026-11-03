// Directorio de salida para los tests que lanzan compilaciones de verdad.
//
// Tiene que estar DENTRO del repositorio, y no en el temporal del sistema.
// Astro genera los assets optimizados en `<raíz>/.astro/.prerender/` y después
// los mueve al `--outDir` con `rename`, que falla con EXDEV ("cross-device link
// not permitted") si el origen y el destino están en discos distintos. En los
// runners de GitHub, /tmp puede estar en otro disco que el workspace, así que
// `npm test` fallaba de vez en cuando con el código perfectamente bien (y, como
// los tests van antes de publicar, se llevaba por delante el despliegue).
//
// En Windows no se reproduce, porque el temporal del sistema y el repositorio
// suelen estar los dos en C:. Por eso solo se veía en CI.

import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** node_modules ya está en .gitignore, así que no ensucia el repositorio. */
const BASE = resolve('node_modules/.tmp-build');

/** Crea un directorio de salida vacío y devuelve su ruta. */
export function salidaTemporal(prefijo: string): string {
  mkdirSync(BASE, { recursive: true });
  return mkdtempSync(join(BASE, `${prefijo}-`));
}

/** Borra un directorio de salida. Vale aunque ya no exista. */
export function borrarSalida(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}
