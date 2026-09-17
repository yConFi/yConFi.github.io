import { describe, expect, it } from 'vitest';
import {
  agruparPorTecnica,
  comprobarSecciones,
  SECCIONES,
  slugTecnica,
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
});
