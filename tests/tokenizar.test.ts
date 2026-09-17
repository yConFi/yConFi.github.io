import { describe, expect, it } from 'vitest';
import { ErrorComando } from '../src/lib/comando/errores';
import { tokenizar } from '../src/lib/comando/tokenizar';

const valores = (c: string) => tokenizar(c).map((t) => t.valor);

describe('tokenizar', () => {
  it('separa por espacios', () => {
    expect(valores('nmap -sC -sV 10.10.10.10')).toEqual(['nmap', '-sC', '-sV', '10.10.10.10']);
  });

  it('respeta comillas simples y dobles, y conserva el texto original', () => {
    const tokens = tokenizar(`curl -H 'Host: a b' -d "x=1 y"`);
    expect(tokens.map((t) => t.valor)).toEqual(['curl', '-H', 'Host: a b', '-d', 'x=1 y']);
    expect(tokens[2]!.texto).toBe(`'Host: a b'`);
  });

  it('no trata como operador lo que va entre comillas', () => {
    expect(valores(`python3 -c 'import pty;pty.spawn("/bin/bash")'`)).toEqual([
      'python3',
      '-c',
      'import pty;pty.spawn("/bin/bash")',
    ]);
  });

  it('separa operadores aunque vayan pegados', () => {
    expect(tokenizar('cat a|grep b;id').map((t) => `${t.tipo}:${t.valor}`)).toEqual([
      'palabra:cat',
      'palabra:a',
      'operador:|',
      'palabra:grep',
      'palabra:b',
      'operador:;',
      'palabra:id',
    ]);
  });

  it('reconoce >> antes que > y 2>/dev/null como un solo operador', () => {
    expect(valores('id >> out.txt 2>/dev/null')).toEqual(['id', '>>', 'out.txt', '2>/dev/null']);
  });

  it('un escape convierte ; en palabra (find -exec ... \\;)', () => {
    const t = tokenizar('find . -exec cat {} \\;').at(-1)!;
    expect(t).toEqual({ tipo: 'palabra', texto: '\\;', valor: ';' });
  });

  it('falla con comillas sin cerrar', () => {
    expect(() => tokenizar(`grep 'abc file`)).toThrow(ErrorComando);
  });
});
