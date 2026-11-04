// El diccionario tiene que estar entero en los dos idiomas.
//
// Si se añade una herramienta o una opción y se deja solo en castellano, la web
// no se rompe (se enseña el castellano y la página en inglés avisa de cuántas
// entradas van), pero este test lo dice en cuanto pasa, que es cuando se puede
// arreglar sin tener que buscarlo después entre 649 textos.

import { describe, expect, it } from 'vitest';
import { HERRAMIENTAS, OPERADORES } from '../src/data/comandos';
import { cobertura, enIdioma, estaTraducido, textosDelDiccionario } from '../src/lib/comando/texto';
import type { Texto } from '../src/lib/comando/tipos';

const TEXTOS = textosDelDiccionario([...HERRAMIENTAS], [...OPERADORES]);

/** Los textos sin traducir, con su contenido, para que el fallo diga cuáles son. */
const sinTraducir = TEXTOS.filter((t): t is string => !estaTraducido(t));

describe('diccionario en los dos idiomas', () => {
  it('no queda ningún texto solo en castellano', () => {
    expect(sinTraducir).toEqual([]);
  });

  it('ningún texto está vacío en ninguno de los dos idiomas', () => {
    for (const texto of TEXTOS) {
      for (const idioma of ['es', 'en'] as const) {
        expect(enIdioma(texto, idioma).trim(), JSON.stringify(texto)).not.toBe('');
      }
    }
  });

  it('el castellano y el inglés son distintos, salvo en nombres propios y siglas', () => {
    // Que coincidan no es un error (FTP es FTP), pero si coincidieran MUCHOS
    // sería señal de que se copió el castellano en vez de traducirlo.
    const objetos = TEXTOS.filter((t): t is Exclude<Texto, string> => estaTraducido(t));
    const iguales = objetos.filter((t) => t.es === t.en);
    expect(iguales.length / objetos.length).toBeLessThan(0.1);
  });

  it('la cobertura que enseña la página se calcula bien', () => {
    const c = cobertura([...HERRAMIENTAS], [...OPERADORES]);
    expect(c.total).toBe(TEXTOS.length);
    expect(c.traducidos).toBe(TEXTOS.length - sinTraducir.length);
    expect(c.completa).toBe(sinTraducir.length === 0);
  });
});
