import { describe, expect, it } from 'vitest';
import { esSeccionActiva, NAVEGACION } from '../src/data/site';

/** Textos de las secciones marcadas como activas en una ruta. */
const activas = (ruta: string) => NAVEGACION.filter((e) => esSeccionActiva(e, ruta)).map((e) => e.texto);

describe('navegación', () => {
  it.each([
    ['/', ['Inicio']],
    ['/walkthroughs/', ['Walkthroughs']],
    ['/walkthroughs/lame/', ['Walkthroughs']],
    ['/tecnicas/', ['Walkthroughs']],
    ['/tecnicas/sqli/', ['Walkthroughs']],
    ['/proyectos/fichas-tecnicas/', ['Proyectos']],
    ['/diccionario/', ['Diccionario']],
    ['/no-existe/', []],
  ])('%s → %j', (ruta, esperadas) => {
    expect(activas(ruta)).toEqual(esperadas);
  });
});
