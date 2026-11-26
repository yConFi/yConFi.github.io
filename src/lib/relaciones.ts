// Cadena de conocimiento: walkthrough → técnica → comando → diccionario → fuente.
//
// Todo se deriva del contenido real: la técnica sale del frontmatter, el comando
// de un <Cmd> del propio walkthrough, la opción y la fuente del diccionario. No
// hay relaciones escritas a mano. Cada eslabón dice POR QUÉ está ahí (la
// relación), no solo "relacionado".
//
// Función pura: los tests la llaman con el contenido leído del disco.

import { HERRAMIENTAS } from '../data/comandos';
import { etiquetaTecnica, ruta, rutaHija, type Idioma } from '../i18n';
import { comandosDeMdx } from './busqueda/crear-indice';
import { enIdioma } from './comando/texto';
import { tokenizar } from './comando/tokenizar';
import type { Herramienta, Opcion } from './comando/tipos';
import { tecnicaEnIdioma } from './walkthroughs';

export type TipoNodo = 'walkthrough' | 'technique' | 'command' | 'dictionary' | 'source';

export interface NodoConocimiento {
  tipo: TipoNodo;
  titulo: string;
  resumen: string;
  href: string;
  /** Si el título es código (un comando, una opción). */
  codigo?: boolean;
  /** true si el enlace sale del sitio (la documentación oficial). */
  externo?: boolean;
}

export interface EntradaCadena {
  id: string;
  titulo: string;
  resumen: string;
  tecnicas: string[];
  body: string;
}

/** Qué técnica representa mejor un comando de esta herramienta, si el walkthrough la tiene. */
const TECNICA_DE_CATEGORIA: Record<string, string> = {
  'Escaneo de red': 'Escaneo de puertos',
  'Enumeración web': 'Fuerza bruta de directorios',
};

const porNombre = new Map(HERRAMIENTAS.map((h) => [h.nombre, h]));

/** Primera herramienta del diccionario y sus opciones en un comando. */
function analizar(comando: string): { herramienta: Herramienta; opciones: Opcion[] } | null {
  let tokens;
  try {
    tokens = tokenizar(comando);
  } catch {
    return null;
  }
  const palabras = tokens.filter((t) => t.tipo === 'palabra').map((t) => t.valor);
  const herramienta = palabras.map((p) => porNombre.get(p)).find(Boolean);
  if (!herramienta) return null;
  // Primero la forma exacta (-sV); si no, la opción corta con el valor pegado
  // (-p- es -p con el valor "-") o la larga con "=" (--min-rate=1000).
  const buscarOpcion = (p: string) =>
    herramienta.opciones.find((o) => o.nombres.includes(p)) ??
    herramienta.opciones.find((o) =>
      o.nombres.some((n) => p.startsWith(`${n}=`) || (o.valor && /^-[^-]$/.test(n) && p.startsWith(n))),
    );
  const opciones = palabras
    .filter((p) => p.startsWith('-'))
    .map(buscarOpcion)
    .filter((o): o is Opcion => Boolean(o));
  return { herramienta, opciones };
}

/**
 * La cadena de un walkthrough, o `null` si no tiene ningún comando con una
 * herramienta del diccionario que tenga opciones explicadas.
 *
 * Elige el primer comando con al menos una opción explicada (el más didáctico),
 * y la técnica que corresponde a esa herramienta si el walkthrough la usa.
 */
export function cadenaDeWalkthrough(w: EntradaCadena, idioma: Idioma): NodoConocimiento[] | null {
  const elegido = comandosDeMdx(w.body)
    .map((c) => ({ comando: c, analisis: analizar(c) }))
    .find((x) => x.analisis && x.analisis.opciones.length > 0);
  if (!elegido?.analisis) return null;
  const { herramienta, opciones } = elegido.analisis;
  const opcion = opciones[0]!;

  const preferida = TECNICA_DE_CATEGORIA[herramienta.categoria];
  const canonica = preferida && w.tecnicas.includes(preferida) ? preferida : w.tecnicas[0];
  if (!canonica) return null;
  const tecnica = tecnicaEnIdioma(canonica, idioma);
  const diccionario = `${ruta('diccionario', idioma)}#${encodeURIComponent(herramienta.nombre)}`;

  return [
    {
      tipo: 'walkthrough',
      titulo: w.titulo,
      resumen: w.resumen,
      href: rutaHija('walkthroughs', idioma, w.id),
    },
    {
      tipo: 'technique',
      titulo: etiquetaTecnica(canonica, idioma),
      resumen: '',
      href: rutaHija('tecnicas', idioma, tecnica.slug),
    },
    {
      tipo: 'command',
      titulo: elegido.comando,
      resumen: '',
      href: rutaHija('walkthroughs', idioma, w.id),
      codigo: true,
    },
    {
      tipo: 'dictionary',
      titulo: `${herramienta.nombre} ${opcion.nombres[0]}`,
      resumen: enIdioma(opcion.descripcion, idioma),
      href: diccionario,
      codigo: true,
    },
    {
      tipo: 'source',
      titulo: new URL(herramienta.docs).hostname,
      resumen: '',
      href: herramienta.docs,
      externo: true,
    },
  ];
}

/** La cadena del walkthrough más reciente que tenga una (para la portada). */
export function primeraCadena(walkthroughs: EntradaCadena[], idioma: Idioma): NodoConocimiento[] | null {
  for (const w of walkthroughs) {
    const cadena = cadenaDeWalkthrough(w, idioma);
    if (cadena) return cadena;
  }
  return null;
}

export interface Relacionado<T> {
  item: T;
  /** Técnicas (canónicas) que comparte: es el "por qué" de la relación. */
  comparte: string[];
}

/**
 * Walkthroughs relacionados con uno: los que comparten más técnicas.
 *
 * Las técnicas que aparecen en más de la mitad de las máquinas (Escaneo de
 * puertos, en todas) no cuentan: relacionar por ellas no explica nada. El umbral
 * se calcula con el contenido, no se escribe a mano.
 */
export function relacionados<T extends { id: string; tecnicas: string[]; fecha: Date }>(
  actual: T,
  todos: readonly T[],
  max = 3,
): Relacionado<T>[] {
  const frecuencia = new Map<string, number>();
  for (const w of todos) for (const t of new Set(w.tecnicas)) frecuencia.set(t, (frecuencia.get(t) ?? 0) + 1);
  const comunes = new Set([...frecuencia].filter(([, n]) => n > todos.length / 2).map(([t]) => t));

  return todos
    .filter((w) => w.id !== actual.id)
    .map((w) => ({ item: w, comparte: w.tecnicas.filter((t) => actual.tecnicas.includes(t) && !comunes.has(t)) }))
    .filter((r) => r.comparte.length > 0)
    .sort((a, b) => b.comparte.length - a.comparte.length || b.item.fecha.getTime() - a.item.fecha.getTime())
    .slice(0, max);
}
