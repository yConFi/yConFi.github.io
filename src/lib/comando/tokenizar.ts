// Divide un comando en tokens como lo haría el shell (versión simplificada):
// respeta comillas simples y dobles, escapes con "\" y separa los operadores
// aunque vayan pegados (`ls;id`, `cat a|grep b`).

import { ErrorComando } from './errores';

export interface Token {
  tipo: 'palabra' | 'operador';
  /** Texto original, con comillas y escapes. Es lo que se muestra. */
  texto: string;
  /** Valor tras quitar comillas y escapes. Es lo que se busca en el diccionario. */
  valor: string;
}

// De más largo a más corto, para que ">>" gane a ">" y "&&" a "&".
// Algunos no están en el diccionario a propósito (||, <, &, 2>, 2>&1): se
// reconocen para que el análisis falle con un mensaje claro en vez de mezclarlos
// con palabras.
const OPERADORES_SHELL = ['2>/dev/null', '2>&1', '&&', '||', '>>', '2>', '|', '>', '<', ';', '&'];

// Solo tienen sentido al principio de un token (en `a2>b`, el 2 es parte de la palabra).
const SOLO_AL_INICIO = new Set(['2>/dev/null', '2>&1', '2>']);

export function tokenizar(comando: string): Token[] {
  const tokens: Token[] = [];
  let texto = '';
  let valor = '';
  let enPalabra = false;
  let comilla: "'" | '"' | null = null;

  const cerrarPalabra = () => {
    if (enPalabra) tokens.push({ tipo: 'palabra', texto, valor });
    texto = '';
    valor = '';
    enPalabra = false;
  };

  let i = 0;
  while (i < comando.length) {
    const ch = comando[i]!;

    if (comilla === "'") {
      texto += ch;
      if (ch === "'") comilla = null;
      else valor += ch;
      i++;
      continue;
    }

    if (comilla === '"') {
      texto += ch;
      if (ch === '"') {
        comilla = null;
      } else if (ch === '\\' && i + 1 < comando.length && '"\\$`'.includes(comando[i + 1]!)) {
        texto += comando[i + 1];
        valor += comando[i + 1];
        i++;
      } else {
        valor += ch;
      }
      i++;
      continue;
    }

    // Fuera de comillas
    if (/\s/.test(ch)) {
      cerrarPalabra();
      i++;
      continue;
    }

    const operador = OPERADORES_SHELL.find(
      (op) => comando.startsWith(op, i) && (!SOLO_AL_INICIO.has(op) || !enPalabra),
    );
    if (operador) {
      cerrarPalabra();
      tokens.push({ tipo: 'operador', texto: operador, valor: operador });
      i += operador.length;
      continue;
    }

    enPalabra = true;
    if (ch === "'" || ch === '"') {
      comilla = ch;
      texto += ch;
    } else if (ch === '\\' && i + 1 < comando.length) {
      texto += ch + comando[i + 1];
      valor += comando[i + 1];
      i++;
    } else {
      texto += ch;
      valor += ch;
    }
    i++;
  }

  if (comilla) {
    throw new ErrorComando('comilla-sin-cerrar', `Comilla ${comilla} sin cerrar.`, comilla, comando);
  }
  cerrarPalabra();
  return tokens;
}
