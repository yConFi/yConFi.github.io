// Crea el índice de búsqueda de un idioma a partir de las colecciones y del
// diccionario. Es una función pura (no importa astro:content): el endpoint le
// pasa los datos ya filtrados y los tests pueden llamarla igual.
//
// Qué entra:
// - walkthroughs y proyectos: título, resumen, técnicas/tecnologías, las
//   herramientas y opciones de sus <Cmd>, y el VOCABULARIO de su texto (palabras
//   únicas), no el texto. Los bloques de código no entran: ahí van salidas de
//   comandos, que pueden llevar hashes.
// - técnicas: derivadas de los walkthroughs.
// - herramientas, opciones y operadores: del diccionario.
//
// Qué no entra: borradores (los quita quien llama, y aquí se vuelve a comprobar),
// la plantilla, y cualquier palabra con forma de flag.

import { ALIASES } from '../../data/aliases';
import { ruta, rutaHija, etiquetaTecnica, type Idioma } from '../../i18n';
import { enIdioma } from '../comando/texto';
import { tokenizar } from '../comando/tokenizar';
import type { Herramienta, Opcion, Operador } from '../comando/tipos';
import { slugTecnica, tecnicaEnIdioma } from '../walkthroughs';
import { esOpcion, palabrasTexto } from './normalizar';
import type { RegistroBusqueda, Relacion } from './tipos';

export interface EntradaWalkthrough {
  id: string;
  titulo: string;
  resumen: string;
  tecnicas: string[];
  fecha: Date;
  borrador: boolean;
  /** Cuerpo MDX sin frontmatter. */
  body: string;
}

export interface EntradaProyecto {
  id: string;
  titulo: string;
  resumen: string;
  tecnologias: string[];
  estado: string;
  fecha?: Date;
  borrador: boolean;
  body: string;
}

export interface DatosIndice {
  idioma: Idioma;
  walkthroughs: EntradaWalkthrough[];
  proyectos: EntradaProyecto[];
  herramientas: readonly Herramienta[];
  operadores: readonly Operador[];
}

const iso = (fecha?: Date) => fecha?.toISOString().slice(0, 10);

/**
 * Formas que nunca pueden acabar en el índice: flags tipo HTB{…}, hashes MD5/NTLM
 * (32 hex) o más largos. Es una segunda red: las flags no se publican nunca.
 */
export const PARECE_FLAG = /\{|^[a-f0-9]{16,}$/i;

/** Los comandos literales de los <Cmd c="..."> (o c={`...`}) de un MDX. */
export function comandosDeMdx(body: string): string[] {
  const comandos: string[] = [];
  const patron = /<Cmd\b[^>]*?\bc=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/gs;
  for (const m of body.matchAll(patron)) comandos.push(m[1] ?? m[2] ?? m[3] ?? '');
  return comandos.filter(Boolean);
}

/** Herramientas y opciones de un comando: `nmap -p- 10.0.0.1` → nmap, -p-. */
function piezasDeComando(comando: string, herramientas: ReadonlySet<string>): { herramientas: string[]; opciones: string[] } {
  const resultado = { herramientas: [] as string[], opciones: [] as string[] };
  let tokens;
  try {
    tokens = tokenizar(comando);
  } catch {
    return resultado;
  }
  for (const t of tokens) {
    if (t.tipo !== 'palabra') continue;
    if (herramientas.has(t.valor)) resultado.herramientas.push(t.valor);
    else if (esOpcion(t.valor)) resultado.opciones.push(t.valor.split('=')[0]!);
  }
  return resultado;
}

/**
 * Vocabulario de un texto MDX: palabras únicas fuera de los bloques de código,
 * sin etiquetas JSX/HTML ni atributos, y sin nada con forma de flag.
 */
export function vocabulario(body: string): string[] {
  const limpio = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<Cmd\b[\s\S]*?\/>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');
  return palabrasTexto(limpio, 3).filter((p) => !PARECE_FLAG.test(p));
}

/** Títulos `##`/`###` del MDX: fragmentos controlados que sí se pueden mostrar. */
const encabezados = (body: string) => [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1]!.trim());

export function crearIndice(datos: DatosIndice): RegistroBusqueda[] {
  const { idioma } = datos;
  const registros: RegistroBusqueda[] = [];
  const nombresHerramientas = new Set(datos.herramientas.map((h) => h.nombre));
  const walkthroughs = datos.walkthroughs.filter((w) => !w.borrador);
  const proyectos = datos.proyectos.filter((p) => !p.borrador);

  // ---------- Walkthroughs ----------
  const usosTecnica = new Map<string, { canonico: string; walkthroughs: EntradaWalkthrough[] }>();
  for (const w of walkthroughs) {
    const piezas = comandosDeMdx(w.body).map((c) => piezasDeComando(c, nombresHerramientas));
    const herramientas = [...new Set(piezas.flatMap((p) => p.herramientas))];
    const opciones = [...new Set(piezas.flatMap((p) => p.opciones))];
    const tecnicas = w.tecnicas.map((canonico) => {
      const slug = slugTecnica(canonico);
      const uso = usosTecnica.get(slug) ?? { canonico, walkthroughs: [] };
      uso.walkthroughs.push(w);
      usosTecnica.set(slug, uso);
      return { slug, nombre: etiquetaTecnica(canonico, idioma) };
    });

    registros.push({
      id: `walkthrough:${w.id}`,
      lang: idioma,
      kind: 'walkthrough',
      title: w.titulo,
      slug: w.id,
      url: rutaHija('walkthroughs', idioma, w.id),
      summary: w.resumen,
      tokens: [
        ...new Set([
          ...tecnicas.flatMap((t) => palabrasTexto(t.nombre, 1)),
          ...herramientas,
          ...opciones,
          ...encabezados(w.body).flatMap((e) => palabrasTexto(e)),
          ...vocabulario(w.body),
        ]),
      ],
      aliases: [],
      relations: [
        ...tecnicas.map((t): Relacion => ({ id: `technique:${t.slug}`, kind: 'technique' })),
        ...herramientas.map((h): Relacion => ({ id: `tool:${h}`, kind: 'tool' })),
      ],
      updated: iso(w.fecha),
    });
  }

  // ---------- Técnicas (derivadas) ----------
  for (const [slug, uso] of usosTecnica) {
    const { nombre, slug: slugIdioma } = tecnicaEnIdioma(uso.canonico, idioma);
    const titulos = uso.walkthroughs.map((w) => w.titulo);
    registros.push({
      id: `technique:${slug}`,
      lang: idioma,
      kind: 'technique',
      title: nombre,
      slug: slugIdioma,
      url: rutaHija('tecnicas', idioma, slugIdioma),
      summary: titulos.join(' · '),
      tokens: [...new Set([...palabrasTexto(nombre, 1), ...palabrasTexto(uso.canonico, 1)])],
      aliases: [],
      relations: uso.walkthroughs.map((w): Relacion => ({ id: `walkthrough:${w.id}`, kind: 'walkthrough' })),
    });
  }

  // ---------- Proyectos ----------
  for (const p of proyectos) {
    const herramientas = p.tecnologias.map((t) => t.toLowerCase()).filter((t) => nombresHerramientas.has(t));
    registros.push({
      id: `project:${p.id}`,
      lang: idioma,
      kind: 'project',
      title: p.titulo,
      slug: p.id,
      url: rutaHija('proyectos', idioma, p.id),
      summary: p.resumen,
      tokens: [
        ...new Set([
          ...p.tecnologias.flatMap((t) => palabrasTexto(t, 1)),
          ...palabrasTexto(p.estado, 1),
          ...encabezados(p.body).flatMap((e) => palabrasTexto(e)),
          ...vocabulario(p.body),
        ]),
      ],
      aliases: [],
      relations: herramientas.map((h): Relacion => ({ id: `tool:${h}`, kind: 'tool' })),
      updated: iso(p.fecha),
    });
  }

  // ---------- Diccionario: herramientas y opciones ----------
  const diccionario = ruta('diccionario', idioma);
  const registroOpcion = (h: Herramienta, o: Opcion, subcomando?: string): RegistroBusqueda => {
    const principal = o.nombres[0]!;
    const prefijo = subcomando ? `${h.nombre} ${subcomando}` : h.nombre;
    // Las opciones de un subcomando llevan su nombre en el id: gobuster/dir:-u.
    const herramienta = subcomando ? `${h.nombre}/${subcomando}` : h.nombre;
    return {
      id: `option:${herramienta}:${principal}`,
      lang: idioma,
      kind: 'option',
      title: `${prefijo} ${principal}`,
      slug: `${herramienta}:${principal}`,
      url: `${diccionario}#${encodeURIComponent(h.nombre)}`,
      summary: enIdioma(o.descripcion, idioma),
      tokens: [...o.nombres, ...(o.valor ? palabrasTexto(enIdioma(o.valor.nombre, idioma)) : [])],
      aliases: o.nombres.slice(1).map((n) => `${prefijo} ${n}`),
      relations: [{ id: `tool:${h.nombre}`, kind: 'tool' }],
    };
  };

  for (const h of datos.herramientas) {
    registros.push({
      id: `tool:${h.nombre}`,
      lang: idioma,
      kind: 'tool',
      title: h.nombre,
      slug: h.nombre,
      url: `${diccionario}#${encodeURIComponent(h.nombre)}`,
      summary: enIdioma(h.descripcion, idioma),
      tokens: [...new Set([h.nombre, ...palabrasTexto(h.categoria, 1), ...(h.subcomandos ?? []).map((s) => s.nombre)])],
      aliases: [],
      relations: [],
    });
    for (const o of h.opciones) registros.push(registroOpcion(h, o));
    for (const s of h.subcomandos ?? []) {
      for (const o of s.opciones) registros.push(registroOpcion(h, o, s.nombre));
    }
  }

  // ---------- Diccionario: operadores de shell ----------
  for (const op of datos.operadores) {
    registros.push({
      id: `dictionary:${encodeURIComponent(op.simbolo)}`,
      lang: idioma,
      kind: 'dictionary',
      title: `${op.simbolo} · ${enIdioma(op.nombre, idioma)}`,
      slug: op.simbolo,
      url: `${diccionario}#operadores`,
      summary: enIdioma(op.descripcion, idioma),
      tokens: [op.simbolo],
      aliases: [],
      relations: [],
    });
  }

  // ---------- Alias y comprobaciones ----------
  const porId = new Map(registros.map((r) => [r.id, r]));
  for (const [id, aliases] of Object.entries(ALIASES)) {
    const registro = porId.get(id);
    if (!registro) {
      throw new Error(`[búsqueda] src/data/aliases.ts usa "${id}", que no existe en el índice. Corrige la clave o quítala.`);
    }
    registro.aliases.push(...aliases);
  }
  for (const r of registros) {
    for (const rel of r.relations) {
      if (!porId.has(rel.id)) {
        throw new Error(`[búsqueda] "${r.id}" se relaciona con "${rel.id}", que no existe en el índice.`);
      }
    }
  }
  if (porId.size !== registros.length) {
    const vistos = new Set<string>();
    const repetido = registros.find((r) => (vistos.has(r.id) ? true : (vistos.add(r.id), false)));
    throw new Error(`[búsqueda] Id repetido en el índice: "${repetido?.id}".`);
  }

  return registros;
}
