// Compila la web real y comprueba que la plantilla (borrador: true) no se publica
// en ningún sitio: ni su página, ni su texto en ningún archivo generado.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const outDir = mkdtempSync(join(tmpdir(), 'astro-web-'));
afterAll(() => rmSync(outDir, { recursive: true, force: true }));

function ficheros(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? ficheros(ruta) : [ruta];
  });
}

describe('borradores', () => {
  it('no se generan al compilar, aunque NODE_ENV no sea production', () => {
    const r = spawnSync(process.execPath, [resolve('node_modules/astro/bin/astro.mjs'), 'build', '--outDir', outDir], {
      encoding: 'utf8',
      // NODE_ENV=development a propósito: la exclusión no debe depender del entorno.
      env: { ...process.env, NODE_ENV: 'development', ASTRO_TELEMETRY_DISABLED: '1', NO_COLOR: '1' },
    });
    expect(r.status, r.stderr).toBe(0);

    // La plantilla existe como contenido…
    expect(existsSync('src/content/walkthroughs/plantilla.mdx')).toBe(true);
    // …pero no hay página…
    expect(existsSync(join(outDir, 'walkthroughs/plantilla'))).toBe(false);
    // …ni su texto en ningún archivo publicado (índices, técnicas, JS, CSS…).
    // Textos que solo existen en la plantilla ("plantilla" a secas aparece, p. ej., en nmap -T).
    const marcas = ['no es una máquina real', 'Ejemplo de técnica', 'ejemplo-de-tecnica', 'walkthroughs/plantilla'];
    const conPlantilla = ficheros(outDir).filter((f) => {
      const contenido = readFileSync(f, 'utf8');
      return marcas.some((m) => contenido.includes(m));
    });
    expect(conPlantilla).toEqual([]);
  }, 120_000);
});
