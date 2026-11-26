import { describe, expect, it } from 'vitest';
import { esSeccionActiva, navegacion, textos, type Idioma } from '../src/i18n';

/** Textos de las secciones marcadas como activas en una ruta. */
const activas = (idioma: Idioma, ruta: string) =>
  navegacion(idioma, textos(idioma).nav)
    .filter((e) => esSeccionActiva(e, ruta))
    .map((e) => e.texto);

describe('navegación en castellano', () => {
  it.each([
    ['/', ['Inicio']],
    ['/walkthroughs/', ['Walkthroughs']],
    ['/walkthroughs/lame/', ['Walkthroughs']],
    ['/tecnicas/', ['Walkthroughs']],
    ['/tecnicas/sqli/', ['Walkthroughs']],
    ['/proyectos/fichas-tecnicas/', ['Proyectos']],
    ['/biblioteca/', ['Biblioteca']],
    // Logros no está en el menú principal: se enlaza desde el pie.
    ['/logros/', []],
    ['/diccionario/', ['Diccionario']],
    ['/no-existe/', []],
    // Las páginas en inglés no marcan ninguna sección del menú en castellano.
    ['/en/', []],
    ['/en/walkthroughs/', []],
  ])('%s → %j', (ruta, esperadas) => {
    expect(activas('es', ruta)).toEqual(esperadas);
  });
});

describe('navegación en inglés', () => {
  it.each([
    ['/en/', ['Home']],
    ['/en/walkthroughs/', ['Walkthroughs']],
    ['/en/walkthroughs/lame/', ['Walkthroughs']],
    ['/en/techniques/', ['Walkthroughs']],
    ['/en/techniques/port-scanning/', ['Walkthroughs']],
    ['/en/projects/fichas-tecnicas/', ['Projects']],
    ['/en/library/', ['Library']],
    ['/en/achievements/', []],
    ['/en/dictionary/', ['Dictionary']],
    ['/en/no-existe/', []],
    // El inicio en inglés es prefijo de todo /en/, así que solo vale su ruta exacta.
    ['/', []],
    ['/walkthroughs/', []],
  ])('%s → %j', (ruta, esperadas) => {
    expect(activas('en', ruta)).toEqual(esperadas);
  });
});
