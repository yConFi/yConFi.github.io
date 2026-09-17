// Especificación de expandirCombinadas (la implementa Ricardo).
import { describe, expect, it } from 'vitest';
import { expandirCombinadas } from '../src/lib/comando/combinadas';
import type { Opcion } from '../src/lib/comando/tipos';

// Mini diccionario de prueba: -l, -a, -v, -n e -i sin valor; -p y -A con valor.
const opciones: Record<string, Opcion> = {
  '-l': { nombres: ['-l'], descripcion: 'l' },
  '-a': { nombres: ['-a'], descripcion: 'a' },
  '-v': { nombres: ['-v'], descripcion: 'v' },
  '-n': { nombres: ['-n'], descripcion: 'n' },
  '-i': { nombres: ['-i'], descripcion: 'i' },
  '-p': { nombres: ['-p'], descripcion: 'p', valor: { nombre: 'puerto', descripcion: 'puerto' } },
  '-A': { nombres: ['-A'], descripcion: 'A', valor: { nombre: 'N', descripcion: 'N' } },
};
const buscar = (flag: string) => opciones[flag];
const flags = (grupo: string) => {
  const r = expandirCombinadas(grupo, buscar);
  return r.ok ? r.partes.map((p) => p.flag) : r;
};

describe('expandirCombinadas', () => {
  it('-la = -l -a', () => {
    expect(flags('la')).toEqual(['-l', '-a']);
  });

  it('-lvnp: la última lleva valor y no queda nada detrás → sin valorPegado', () => {
    const r = expandirCombinadas('lvnp', buscar);
    expect(r).toMatchObject({ ok: true });
    if (r.ok) {
      expect(r.partes.map((p) => p.flag)).toEqual(['-l', '-v', '-n', '-p']);
      expect(r.valorPegado).toBeUndefined();
    }
  });

  it('-iA3: lo que sigue a una opción con valor es su valor', () => {
    const r = expandirCombinadas('iA3', buscar);
    expect(r).toMatchObject({ ok: true, valorPegado: '3' });
    if (r.ok) expect(r.partes.map((p) => p.flag)).toEqual(['-i', '-A']);
  });

  it('-lvnp4444: el valor pegado puede ser largo', () => {
    expect(expandirCombinadas('lvnp4444', buscar)).toMatchObject({ ok: true, valorPegado: '4444' });
  });

  it('-pla: tras una opción con valor NO se siguen leyendo opciones ("la" es el valor)', () => {
    const r = expandirCombinadas('pla', buscar);
    expect(r).toMatchObject({ ok: true, valorPegado: 'la' });
    if (r.ok) expect(r.partes.map((p) => p.flag)).toEqual(['-p']);
  });

  it('una letra desconocida devuelve cuál es', () => {
    expect(expandirCombinadas('lZ', buscar)).toEqual({ ok: false, flagDesconocida: '-Z' });
  });
});
