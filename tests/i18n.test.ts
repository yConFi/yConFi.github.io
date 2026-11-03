// Red de seguridad del i18n. Lo que se comprueba aquí es justo lo que no se ve
// al mirar una página: que a un idioma no le falte una clave, que las plantillas
// usen los mismos huecos y que ningún valor del contenido se quede sin traducir.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIFICULTADES, ESTADOS_PROYECTO, SISTEMAS } from '../src/data/valores';
import { HERRAMIENTAS } from '../src/data/comandos';
import { IDIOMAS, rellenar, rutaEquivalente, TABLAS_EN, textos } from '../src/i18n';
import { en } from '../src/i18n/textos/en';
import { es } from '../src/i18n/textos/es';

type Nodo = Record<string, unknown>;

/** Todas las rutas de claves de un objeto anidado: ['nav.inicio', 'general.ojo', …]. */
function claves(objeto: Nodo, prefijo = ''): string[] {
  return Object.entries(objeto).flatMap(([clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    return typeof valor === 'object' && valor !== null ? claves(valor as Nodo, ruta) : [ruta];
  });
}

/** El valor que hay en esa ruta de claves. */
function valorEn(objeto: Nodo, ruta: string): unknown {
  return ruta.split('.').reduce<unknown>((actual, clave) => (actual as Nodo)?.[clave], objeto);
}

/** Los huecos {asi} de una plantilla, ordenados. */
const huecos = (texto: string) => [...texto.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();

describe('textos', () => {
  const clavesEs = claves(es).sort();
  const clavesEn = claves(en).sort();

  it('los dos idiomas tienen exactamente las mismas claves', () => {
    expect(clavesEn).toEqual(clavesEs);
  });

  it('ningún texto está vacío', () => {
    for (const idioma of IDIOMAS) {
      const t = textos(idioma) as unknown as Nodo;
      for (const clave of clavesEs) {
        expect(valorEn(t, clave), `${idioma}: ${clave}`).toEqual(expect.any(String));
        expect(String(valorEn(t, clave)).trim(), `${idioma}: ${clave}`).not.toBe('');
      }
    }
  });

  it('las plantillas usan los mismos huecos en los dos idiomas', () => {
    for (const clave of clavesEs) {
      const original = String(valorEn(es as unknown as Nodo, clave));
      const traducido = String(valorEn(en as unknown as Nodo, clave));
      expect(huecos(traducido), `${clave}`).toEqual(huecos(original));
    }
  });

  it('solo llevan huecos las claves que lo dicen en su nombre', () => {
    for (const clave of clavesEs) {
      const tiene = huecos(String(valorEn(es as unknown as Nodo, clave))).length > 0;
      expect(tiene, `${clave}`).toBe(clave.endsWith('Plantilla'));
    }
  });
});

describe('rellenar', () => {
  it('sustituye los huecos', () => {
    expect(rellenar('{n} máquinas', { n: 3 })).toBe('3 máquinas');
    expect(rellenar('{visibles} de {total}', { visibles: 2, total: 9 })).toBe('2 de 9');
  });

  it('falla si falta un valor, en lugar de dejar el hueco en la página', () => {
    expect(() => rellenar('{n} máquinas', {})).toThrow(/Falta el valor "n"/);
  });

  it('falla si se pasa un valor que la plantilla no usa', () => {
    expect(() => rellenar('{n} máquinas', { n: 1, total: 4 })).toThrow(/no usa total/);
  });
});

describe('rutaEquivalente', () => {
  it('encuentra la misma sección en el otro idioma', () => {
    expect(rutaEquivalente('/tecnicas/', 'en')).toBe('/en/techniques/');
    expect(rutaEquivalente('/en/dictionary/', 'es')).toBe('/diccionario/');
    expect(rutaEquivalente('/', 'en')).toBe('/en/');
    expect(rutaEquivalente('/en/', 'es')).toBe('/');
  });

  it('da igual la barra final', () => {
    expect(rutaEquivalente('/logros', 'en')).toBe('/en/achievements/');
  });

  it('no inventa nada para las páginas con parámetro ni para lo que no existe', () => {
    // Esas las resuelve cada página, porque el slug también cambia de idioma.
    expect(rutaEquivalente('/walkthroughs/meow/', 'en')).toBeUndefined();
    expect(rutaEquivalente('/no-existe/', 'en')).toBeUndefined();
  });
});

describe('etiquetas', () => {
  it.each([
    ['dificultades', DIFICULTADES, TABLAS_EN.dificultades],
    ['sistemas', SISTEMAS, TABLAS_EN.sistemas],
    ['estados', ESTADOS_PROYECTO, TABLAS_EN.estados],
  ])('todos los valores de %s tienen traducción', (_que, valores, tabla) => {
    expect(Object.keys(tabla).sort()).toEqual([...valores].sort());
  });

  it('todas las categorías del diccionario tienen traducción', () => {
    const usadas = [...new Set(HERRAMIENTAS.map((h) => h.categoria))];
    for (const categoria of usadas) {
      expect(TABLAS_EN.categorias[categoria], categoria).toEqual(expect.any(String));
    }
  });

  it('todas las técnicas que usa algún walkthrough tienen traducción', () => {
    const dir = 'src/content/walkthroughs';
    const usadas = new Set<string>();
    for (const archivo of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
      // Lista `tecnicas:` del frontmatter: las líneas "  - Lo que sea" que van detrás.
      const bloque = /^tecnicas:\n((?:\s+-\s+.+\n)+)/m.exec(readFileSync(join(dir, archivo), 'utf8'));
      for (const linea of bloque?.[1]?.trimEnd().split('\n') ?? []) {
        usadas.add(linea.replace(/^\s*-\s*/, '').replace(/^['"]|['"]$/g, '').trim());
      }
    }

    expect(usadas.size).toBeGreaterThan(0);
    for (const tecnica of usadas) {
      expect(TABLAS_EN.tecnicas[tecnica], `falta la traducción de "${tecnica}"`).toEqual(expect.any(String));
    }
  });
});
