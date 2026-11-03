import { describe, expect, it } from 'vitest';
import {
  agruparPorTecnica,
  comprobarSecciones,
  filtrosSerie,
  formatearFecha,
  nombreSerie,
  SECCIONES,
  slugTecnica,
  tecnicaEnIdioma,
  type Walkthrough,
} from '../src/lib/walkthroughs';

const h2 = (text: string) => ({ depth: 2, text });

/** Walkthrough mínimo para probar la agrupación (solo se usan id y tecnicas). */
const wt = (id: string, tecnicas: string[]) => ({ id, data: { tecnicas } }) as unknown as Walkthrough;

describe('slugTecnica', () => {
  it('quita tildes, mayúsculas y símbolos', () => {
    expect(slugTecnica('Escalada de privilegios')).toBe('escalada-de-privilegios');
    expect(slugTecnica('Enumeración SMB')).toBe('enumeracion-smb');
    expect(slugTecnica('  SUID / GTFOBins ')).toBe('suid-gtfobins');
  });
});

describe('comprobarSecciones', () => {
  it('acepta las cinco secciones en orden, con ### entre medias', () => {
    const headings = SECCIONES.flatMap((s) => [h2(s), { depth: 3, text: 'Subapartado' }]);
    expect(() => comprobarSecciones('ok', headings)).not.toThrow();
  });

  it('falla si falta una sección', () => {
    expect(() => comprobarSecciones('x', SECCIONES.slice(0, 4).map(h2))).toThrow(/no siguen la estructura fija/);
  });

  it('falla si el orden es distinto', () => {
    const desordenadas = [SECCIONES[1], SECCIONES[0], ...SECCIONES.slice(2)].map(h2);
    expect(() => comprobarSecciones('x', desordenadas)).toThrow(/Encontradas: +Enumeración → Reconocimiento/);
  });

  it('falla si hay un ## extra', () => {
    expect(() => comprobarSecciones('x', [...SECCIONES.map(h2), h2('Extra')])).toThrow();
  });
});

describe('agruparPorTecnica', () => {
  it('agrupa, ordena alfabéticamente y no repite walkthroughs', () => {
    const a = wt('a', ['SQLi', 'Enumeración web']);
    const b = wt('b', ['SQLi']);
    const grupos = agruparPorTecnica([a, b]);
    expect(grupos.map((g) => [g.nombre, g.walkthroughs.map((w) => w.id)])).toEqual([
      ['Enumeración web', ['a']],
      ['SQLi', ['a', 'b']],
    ]);
  });

  it('falla si la misma técnica está escrita de dos formas', () => {
    expect(() => agruparPorTecnica([wt('a', ['SQLi']), wt('b', ['sqli'])])).toThrow(/misma técnica escrita distinto/);
  });

  it('en inglés traduce el nombre, el slug y el orden, pero agrupa por lo canónico', () => {
    const a = wt('a', ['Inyección SQL', 'Escaneo de puertos']);
    const b = wt('b', ['Escaneo de puertos']);
    const grupos = agruparPorTecnica([a, b], 'en');
    expect(grupos.map((g) => [g.canonico, g.nombre, g.slug, g.walkthroughs.map((w) => w.id)])).toEqual([
      ['Escaneo de puertos', 'Port scanning', 'port-scanning', ['a', 'b']],
      ['Inyección SQL', 'SQL injection', 'sql-injection', ['a']],
    ]);
  });

  it('falla al compilar si una técnica no está traducida', () => {
    expect(() => agruparPorTecnica([wt('a', ['Técnica sin traducir'])], 'en')).toThrow(
      /Falta la traducción al en de la técnica/,
    );
  });
});

describe('tecnicaEnIdioma', () => {
  it('da el nombre y el slug del idioma pedido', () => {
    expect(tecnicaEnIdioma('Escaneo de puertos', 'es')).toEqual({
      nombre: 'Escaneo de puertos',
      slug: 'escaneo-de-puertos',
    });
    expect(tecnicaEnIdioma('Escaneo de puertos', 'en')).toEqual({ nombre: 'Port scanning', slug: 'port-scanning' });
  });
});

describe('formatearFecha', () => {
  const fecha = new Date('2026-11-02T00:00:00Z');

  it('en castellano usa dd/mm/aa', () => {
    expect(formatearFecha(fecha)).toBe('02/11/26');
    expect(formatearFecha(fecha, 'es')).toBe('02/11/26');
  });

  it('en inglés usa el mes abreviado, para que no se lea como mm/dd', () => {
    expect(formatearFecha(fecha, 'en')).toBe('02 Nov 2026');
  });
});

describe('series', () => {
  it('muestra la serie con su tier', () => {
    expect(nombreSerie({ nombre: 'Starting Point', tier: 0 })).toBe('Starting Point · Tier 0');
  });

  it('permite filtrar por la serie entera y por la serie con su tier', () => {
    expect(filtrosSerie({ nombre: 'Starting Point', tier: 2 })).toEqual(['Starting Point', 'Starting Point · Tier 2']);
    expect(filtrosSerie(undefined)).toEqual([]);
  });
});
