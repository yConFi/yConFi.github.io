import { describe, expect, it } from 'vitest';
import { analizarComando } from '../src/lib/comando/analizar';
import { ErrorComando, type MotivoError } from '../src/lib/comando/errores';

/** Resumen compacto "clase:texto" ("+" = pegado al anterior) para comparar fácilmente. */
const resumen = (c: string, notas?: Record<string, string>) =>
  analizarComando(c, { notas }).map((s) => `${s.clase}:${s.pegadoAlAnterior ? '+' : ''}${s.texto}`);

const motivo = (fn: () => unknown): MotivoError | undefined => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ErrorComando) return e.motivo;
    throw e;
  }
  return undefined;
};

describe('analizarComando: casos válidos', () => {
  it('nmap del ejemplo, con --opcion valor, -p- pegado y nota', () => {
    expect(
      resumen('nmap -sC -sV -p- --min-rate 5000 -oN nmap.txt 10.10.10.10', {
        '10.10.10.10': 'IP de la máquina objetivo',
      }),
    ).toEqual([
      'herramienta:nmap',
      'opcion:-sC',
      'opcion:-sV',
      'opcion:-p',
      'valor:+-',
      'opcion:--min-rate',
      'valor:5000',
      'opcion:-oN',
      'valor:nmap.txt',
      'argumento:10.10.10.10',
    ]);
    const ip = analizarComando('nmap 10.10.10.10', { notas: { '10.10.10.10': 'IP objetivo' } }).at(-1)!;
    expect(ip.explicacion).toBe('IP objetivo');
  });

  it('--opcion=valor se divide en opción y valor', () => {
    expect(resumen('nmap --min-rate=5000 10.10.10.10')).toEqual([
      'herramienta:nmap',
      'opcion:--min-rate=',
      'valor:+5000',
      'argumento:10.10.10.10',
    ]);
  });

  it('-T4 (valor pegado a opción corta)', () => {
    expect(resumen('nmap -T4 10.10.10.10')).toContain('valor:+4');
  });

  it('gobuster con subcomando y estilo Go (-t=50 y --url)', () => {
    expect(resumen('gobuster dir --url http://x -w lista.txt -t=50')).toEqual([
      'herramienta:gobuster',
      'subcomando:dir',
      'opcion:--url',
      'valor:http://x',
      'opcion:-w',
      'valor:lista.txt',
      'opcion:-t=',
      'valor:+50',
    ]);
  });

  it('sudo delante de otro comando', () => {
    expect(resumen('sudo -u root find / -perm -4000')).toEqual([
      'herramienta:sudo',
      'opcion:-u',
      'valor:root',
      'herramienta:find',
      'argumento:/',
      'opcion:-perm',
      'valor:-4000',
    ]);
  });

  it('tubería: lo que va después de | es un comando nuevo; 2>/dev/null y > fichero', () => {
    expect(resumen('find / -type f 2>/dev/null | grep conf > out.txt')).toEqual([
      'herramienta:find',
      'argumento:/',
      'opcion:-type',
      'valor:f',
      'operador:2>/dev/null',
      'operador:|',
      'herramienta:grep',
      'argumento:conf',
      'operador:>',
      'argumento:out.txt',
    ]);
  });

  it('find -exec analiza el comando interior hasta \\;', () => {
    const segs = analizarComando('find . -name "*.txt" -exec cat {} \\;');
    expect(segs.map((s) => `${s.clase}:${s.texto}`)).toEqual([
      'herramienta:find',
      'argumento:.',
      'opcion:-name',
      'valor:"*.txt"',
      'opcion:-exec',
      'herramienta:cat',
      'argumento:{}',
      'argumento:\\;',
    ]);
    expect(segs[6]!.explicacion).toContain('ruta de cada fichero');
  });

  it('python3 -c: lo que va detrás ya no son opciones del intérprete', () => {
    expect(resumen(`python3 -c 'print(1)' -x`, { '-x': 'argumento para el código' })).toEqual([
      'herramienta:python3',
      'opcion:-c',
      "valor:'print(1)'",
      'argumento:-x',
    ]);
  });

  it('opciones combinadas: ls -la y nc -lvnp 4444', () => {
    expect(resumen('ls -la')).toEqual(['herramienta:ls', 'opcion:-la']);
    const nc = analizarComando('nc -lvnp 4444');
    expect(nc.map((s) => `${s.clase}:${s.texto}`)).toEqual(['herramienta:nc', 'opcion:-lvnp', 'valor:4444']);
    expect(nc[1]!.partes?.map((p) => p.texto)).toEqual(['-l', '-v', '-n', '-p']);
    expect(nc[0]!.aviso).toMatch(/variante/);
  });

  it('opciones combinadas con valor pegado: grep -iA3', () => {
    expect(resumen('grep -iA3 pass fichero')).toEqual([
      'herramienta:grep',
      'opcion:-iA',
      'valor:+3',
      'argumento:pass',
      'argumento:fichero',
    ]);
  });
});

describe('analizarComando: errores', () => {
  it.each<[string, MotivoError]>([
    ['nmapp 10.10.10.10', 'herramienta-desconocida'],
    ['nmap -Z 10.10.10.10', 'opcion-desconocida'],
    ['nmap -sCV 10.10.10.10', 'opcion-desconocida'],
    ['gobuster -u http://x', 'falta-subcomando'],
    ['gobuster', 'falta-subcomando'],
    ['gobuster fuzzz -u http://x', 'subcomando-desconocido'],
    ['gobuster dir -t50', 'opcion-desconocida'],
    ['ffuf -u http://x/FUZZ -qk', 'opcion-desconocida'],
    ['nmap -p', 'falta-valor'],
    ['nmap -oN | grep x', 'falta-valor'],
    ['nmap --open=1 x', 'valor-no-admitido'],
    ['whoami root', 'argumento-no-admitido'],
    ['id & whoami', 'operador-desconocido'],
    ['id |', 'falta-comando'],
    ['| id', 'falta-comando'],
    ['id >', 'falta-destino'],
    ['find . -exec cat {}', 'exec-sin-terminar'],
    ['sudo bash', 'herramienta-desconocida'],
    ["grep 'abc", 'comilla-sin-cerrar'],
  ])('%s → %s', (comando, esperado) => {
    expect(motivo(() => analizarComando(comando))).toBe(esperado);
  });

  it('una nota que no coincide con nada es un error', () => {
    expect(motivo(() => analizarComando('nmap 10.10.10.10', { notas: { '10.10.10.11': 'x' } }))).toBe('nota-sin-usar');
  });

  it('el error dice el token y el comando', () => {
    try {
      analizarComando('nmap -Z 10.10.10.10');
      expect.unreachable();
    } catch (e) {
      expect(e).toMatchObject({ token: '-Z', comando: 'nmap -Z 10.10.10.10' });
    }
  });
});
