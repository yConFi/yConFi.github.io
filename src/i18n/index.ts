// Punto de entrada del i18n: lo que importan las páginas y los componentes.
//
//   import { textos, rellenar, ruta } from '../i18n';
//   const t = textos(idioma);

import { en } from './textos/en';
import { es, type Textos } from './textos/es';
import type { Idioma } from './idiomas';

const TEXTOS: Record<Idioma, Textos> = { es, en };

/** Todos los textos de un idioma. */
export function textos(idioma: Idioma): Textos {
  return TEXTOS[idioma];
}

/**
 * Rellena los huecos {asi} de una plantilla.
 *
 * Falla si queda algún hueco sin valor o si se pasa un valor que no existe en la
 * plantilla: así un descuido al traducir rompe la compilación en lugar de dejar
 * un "{n}" suelto en la página publicada.
 */
export function rellenar(plantilla: string, valores: Record<string, string | number>): string {
  const usados = new Set<string>();
  const texto = plantilla.replace(/\{(\w+)\}/g, (_, clave: string) => {
    if (!(clave in valores)) {
      throw new Error(`[i18n] Falta el valor "${clave}" para la plantilla: ${plantilla}`);
    }
    usados.add(clave);
    return String(valores[clave]);
  });
  const sobran = Object.keys(valores).filter((c) => !usados.has(c));
  if (sobran.length > 0) {
    throw new Error(`[i18n] La plantilla no usa ${sobran.join(', ')}: ${plantilla}`);
  }
  return texto;
}

export {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  LANG,
  NOMBRE_IDIOMA,
  OG_LOCALE,
  esIdioma,
  idiomaAlterno,
  idiomaDeRuta,
  type Idioma,
} from './idiomas';

export {
  RUTAS,
  SECCIONES,
  esSeccionActiva,
  navegacion,
  ruta,
  rutaEquivalente,
  rutaHija,
  type EnlaceNavegacion,
  type Seccion,
} from './rutas';

export {
  TABLAS_EN,
  etiquetaCategoria,
  etiquetaDificultad,
  etiquetaEstado,
  etiquetaPlataforma,
  etiquetaSerie,
  etiquetaSistema,
  etiquetaTecnica,
} from './etiquetas';

export type { Textos } from './textos/es';
