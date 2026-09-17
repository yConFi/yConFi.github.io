import { describe, expect, it } from 'vitest';
import { coincide, normalizar } from '../src/lib/buscar';

describe('buscar', () => {
  it('normaliza tildes y mayúsculas', () => {
    expect(normalizar('  Enumeración WEB ')).toBe('enumeracion web');
  });

  it('todas las palabras deben aparecer, en cualquier orden', () => {
    expect(coincide('nmap -p Escanea solo los puertos indicados', 'puertos nmap')).toBe(true);
    expect(coincide('nmap -p Escanea solo los puertos indicados', 'puertos udp')).toBe(false);
  });

  it('ignora tildes en la consulta y en el texto', () => {
    expect(coincide('Detección de versión', 'deteccion VERSION')).toBe(true);
  });

  it('una consulta vacía coincide con todo', () => {
    expect(coincide('lo que sea', '   ')).toBe(true);
  });
});
