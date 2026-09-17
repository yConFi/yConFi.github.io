// Plugin mdast para Sätteri (procesador Markdown/MDX por defecto de Astro 7).
// Revisa cada <Cmd c="..." notas={...} /> mientras se compila el MDX, cuando todavía
// se conoce el archivo y la línea, y hace fallar la compilación si algo del
// comando no está en el diccionario.

import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import type { MdastPluginDefinition, MdxJsxFlowElement, MdxJsxTextElement } from 'satteri';
import { analizarComando } from './analizar';
import { ErrorComando, formatearError } from './errores';

type ElementoJsx = MdxJsxFlowElement | MdxJsxTextElement;

/**
 * Evalúa una expresión literal de un atributo (`c={"..."}` o `notas={{ ... }}`).
 * Solo se usa con contenido propio del repositorio, que MDX ejecutaría igualmente
 * al renderizar. Si la expresión depende de variables, devuelve undefined y se
 * deja la validación al componente.
 */
function evaluarLiteral(codigo: string): unknown {
  try {
    return new Function(`"use strict"; return (${codigo});`)();
  } catch {
    return undefined;
  }
}

function leerAtributo(nodo: ElementoJsx, nombre: string): { valor: unknown; estatico: boolean } | undefined {
  for (const attr of nodo.attributes) {
    if (attr.type !== 'mdxJsxAttribute' || attr.name !== nombre) continue;
    if (typeof attr.value === 'string') return { valor: attr.value, estatico: true };
    if (attr.value && typeof attr.value === 'object') {
      const valor = evaluarLiteral(attr.value.value);
      return { valor, estatico: valor !== undefined };
    }
    return { valor: undefined, estatico: false };
  }
  return undefined;
}

function ubicacion(nodo: ElementoJsx, fileURL: URL | undefined): string {
  const archivo = fileURL ? relative(process.cwd(), fileURLToPath(fileURL)).replaceAll('\\', '/') : '(archivo desconocido)';
  const linea = nodo.position?.start.line;
  return linea ? `${archivo}:${linea}` : archivo;
}

function revisar(nodo: ElementoJsx, fileURL: URL | undefined): void {
  if (nodo.name !== 'Cmd') return;
  const donde = ubicacion(nodo, fileURL);

  const c = leerAtributo(nodo, 'c');
  if (!c || !c.estatico) {
    // Sin comando literal no se puede comprobar aquí; <Cmd> lo validará al renderizar.
    if (!c) throw new Error(`[Cmd] Falta el atributo "c" con el comando.\n  Archivo:  ${donde}`);
    return;
  }
  if (typeof c.valor !== 'string') {
    throw new Error(`[Cmd] El atributo "c" debe ser un texto.\n  Archivo:  ${donde}`);
  }

  const notas = leerAtributo(nodo, 'notas');
  try {
    analizarComando(c.valor, {
      notas: notas?.estatico ? (notas.valor as Record<string, string>) : undefined,
      comprobarNotas: notas === undefined || notas.estatico,
    });
  } catch (e) {
    if (e instanceof ErrorComando) throw new Error(formatearError(e, donde));
    throw e;
  }
}

export const validarCmd: MdastPluginDefinition = {
  name: 'validar-cmd',
  options: { position: true },
  mdxJsxFlowElement(nodo, ctx) {
    revisar(nodo, ctx.fileURL);
  },
  mdxJsxTextElement(nodo, ctx) {
    revisar(nodo, ctx.fileURL);
  },
};
