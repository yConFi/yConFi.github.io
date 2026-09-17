// Demuestra que `astro build` FALLA si un <Cmd> usa algo que no está en el
// diccionario, y que compila con un comando válido (para descartar que falle
// por otro motivo). Lanza compilaciones reales, por eso tarda unos segundos.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const ASTRO = resolve('node_modules/astro/bin/astro.mjs');
const salidas: string[] = [];

function compilar(fixture: string) {
  const outDir = mkdtempSync(join(tmpdir(), `astro-${fixture}-`));
  salidas.push(outDir);
  const r = spawnSync(process.execPath, [ASTRO, 'build', '--root', `tests/fixtures/${fixture}`, '--outDir', outDir], {
    encoding: 'utf8',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
  });
  return { codigo: r.status, salida: `${r.stdout}\n${r.stderr}` };
}

afterAll(() => {
  for (const dir of salidas) rmSync(dir, { recursive: true, force: true });
});

describe('compilación con <Cmd>', () => {
  it('compila si todos los comandos están en el diccionario', () => {
    const { codigo, salida } = compilar('cmd-valido');
    expect(salida).not.toContain('[Cmd]');
    expect(codigo).toBe(0);
  }, 120_000);

  it('falla si una opción no está en el diccionario, indicando token, comando y archivo', () => {
    const { codigo, salida } = compilar('cmd-invalido');
    expect(codigo).not.toBe(0);
    expect(salida).toContain('[Cmd] Opción "--opcion-inventada" no está en el diccionario de nmap.');
    expect(salida).toContain('Comando:  nmap -sC --opcion-inventada 10.10.10.10');
    expect(salida).toContain('Token:    --opcion-inventada');
    expect(salida).toMatch(/Archivo:\s+.*src\/pages\/index\.mdx:5/);
  }, 120_000);
});
