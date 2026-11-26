// Cadena de conocimiento y relacionados: derivados del contenido, nunca a mano.
import { describe, expect, it } from 'vitest';
import { cadenaDeWalkthrough, relacionados } from '../src/lib/relaciones';

const responder = {
  id: 'responder',
  titulo: 'Responder',
  resumen: 'Resumen.',
  tecnicas: ['Escaneo de puertos', 'LFI', 'WinRM'],
  body: '<Cmd c="ping 10.0.0.1" />\n<Cmd c="nmap -p- --min-rate 1000 -sV 10.0.0.1" notas={{}} />',
};

describe('cadenaDeWalkthrough', () => {
  it('va del walkthrough a la fuente oficial, en cinco pasos y en orden', () => {
    const cadena = cadenaDeWalkthrough(responder, 'es')!;
    expect(cadena.map((n) => n.tipo)).toEqual(['walkthrough', 'technique', 'command', 'dictionary', 'source']);
    // El primer comando con opciones explicadas (ping no tiene ninguna aquí).
    expect(cadena[2]!.titulo).toBe('nmap -p- --min-rate 1000 -sV 10.0.0.1');
    // -p- es la opción -p con el valor "-".
    expect(cadena[3]!.titulo).toBe('nmap -p');
    // La técnica que corresponde a nmap, si el walkthrough la tiene.
    expect(cadena[1]!.titulo).toBe('Escaneo de puertos');
    expect(cadena[4]!.href).toMatch(/^https:\/\/nmap\.org\//);
    expect(cadena[4]!.externo).toBe(true);
  });

  it('en inglés enlaza a las rutas inglesas', () => {
    const cadena = cadenaDeWalkthrough(responder, 'en')!;
    expect(cadena[0]!.href).toBe('/en/walkthroughs/responder/');
    expect(cadena[1]!.href).toBe('/en/techniques/port-scanning/');
    expect(cadena[3]!.href).toBe('/en/dictionary/#nmap');
  });

  it('sin comandos con opciones del diccionario no hay cadena', () => {
    expect(cadenaDeWalkthrough({ ...responder, body: 'Sin comandos.' }, 'es')).toBeNull();
  });
});

describe('relacionados', () => {
  const w = (id: string, tecnicas: string[], dia = 1) => ({ id, tecnicas, fecha: new Date(2026, 0, dia) });
  const todos = [
    w('a', ['Escaneo de puertos', 'FTP', 'Acceso anónimo']),
    w('b', ['Escaneo de puertos', 'FTP', 'Acceso anónimo', 'SSH'], 2),
    w('c', ['Escaneo de puertos', 'FTP'], 3),
    w('d', ['Escaneo de puertos', 'SMB'], 4),
    w('e', ['Escaneo de puertos', 'Redis'], 5),
    w('f', ['Escaneo de puertos', 'RDP'], 6),
  ];

  it('ordena por técnicas compartidas y dice cuáles', () => {
    const r = relacionados(todos[0]!, todos);
    expect(r.map((x) => x.item.id)).toEqual(['b', 'c']);
    expect(r[0]!.comparte).toEqual(['FTP', 'Acceso anónimo']);
  });

  it('no relaciona por técnicas que están en casi todas las máquinas', () => {
    expect(relacionados(todos[3]!, todos)).toEqual([]);
  });
});
