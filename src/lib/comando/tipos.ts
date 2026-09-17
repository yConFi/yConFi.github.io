// Tipos del diccionario de comandos y del resultado del análisis.

/**
 * Cómo interpreta cada herramienta sus opciones. No todas siguen las mismas reglas:
 *
 * - `posix`: estilo getopt. Admite `--larga=valor`, valor pegado a la opción
 *   corta (`-p80`, `-T4`) y, si `combinables` es true, opciones cortas
 *   agrupadas (`-la` = `-l -a`).
 * - `go`: paquete `flag` de Go (ffuf) o urfave/cli (gobuster). `-x` y `--x` son
 *   equivalentes, el valor va separado o con `=`, y no hay agrupación ni valor pegado.
 * - `exacto`: cada opción se escribe tal cual, con su valor separado (find).
 */
export type EstiloOpciones = 'posix' | 'go' | 'exacto';

export type Categoria =
  | 'Escaneo de red'
  | 'Enumeración web'
  | 'HTTP'
  | 'Conexiones'
  | 'Privilegios'
  | 'Ficheros y búsqueda'
  | 'Información del sistema'
  | 'Intérpretes';

export interface ValorOpcion {
  /** Nombre corto del valor, p. ej. "puertos" o "fichero". */
  nombre: string;
  /** Qué se espera como valor. Se muestra si no hay una nota más concreta. */
  descripcion: string;
  /** El valor solo puede ir con `=` y es opcional (p. ej. `grep --color[=WHEN]`). */
  soloConIgual?: boolean;
}

export interface Opcion {
  /** Todas las formas de escribirla: `['-u', '--url']`. */
  nombres: string[];
  descripcion: string;
  /** Si existe, la opción lleva un valor. */
  valor?: ValorOpcion;
  /** Lo que viene después ya no son opciones del programa (`python3 -c`, `python3 -m`). */
  terminaOpciones?: boolean;
  /** Ejecuta un comando anidado que termina en uno de estos tokens (`find -exec ... \;`). */
  ejecutaComandoHasta?: string[];
}

export interface Subcomando {
  nombre: string;
  descripcion: string;
  opciones: Opcion[];
}

export interface EnlaceDoc {
  nombre: string;
  url: string;
}

export interface Herramienta {
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  /** Documentación oficial (página man o web del proyecto). */
  docs: string;
  /** Documentación de otras variantes (p. ej. netcat). */
  docsVariantes?: EnlaceDoc[];
  /** Diferencias entre versiones o variantes que conviene conocer. */
  variantes?: string;
  estilo: EstiloOpciones;
  /** Solo `posix`: permite agrupar opciones cortas (`-la`). */
  combinables?: boolean;
  /** Solo `posix`: permite pegar el valor a la opción corta (`-p80`). Por defecto, true. */
  valorPegado?: boolean;
  /**
   * El análisis de opciones se detiene al llegar al N-ésimo argumento posicional.
   * python3: 1 (el script); ssh: 2 (destino y comando remoto).
   */
  opcionesHastaArgumento?: number;
  /** El primer argumento posicional es otro comando (sudo). */
  ejecutaComando?: boolean;
  /** Explicación genérica de los argumentos posicionales. `null` = no admite. */
  argumentos: string | null;
  opciones: Opcion[];
  subcomandos?: Subcomando[];
}

export type TipoOperador = 'separador' | 'redireccion' | 'redireccion-completa';

export interface Operador {
  simbolo: string;
  nombre: string;
  descripcion: string;
  tipo: TipoOperador;
  docs: string;
}

// ---------- Resultado del análisis ----------

export type ClaseToken = 'herramienta' | 'subcomando' | 'opcion' | 'valor' | 'argumento' | 'operador';

export interface ParteExplicada {
  texto: string;
  explicacion: string;
}

export interface Segmento {
  /** Texto tal y como aparece en el comando (con comillas si las tenía). */
  texto: string;
  clase: ClaseToken;
  /** Cabecera del tooltip, p. ej. "opción · nmap". */
  etiqueta: string;
  explicacion: string;
  /** Desglose de opciones combinadas (`-la` → `-l`, `-a`). */
  partes?: ParteExplicada[];
  /** Advertencia sobre variantes o versiones (p. ej. netcat). */
  aviso?: string;
  docs?: string;
  /** true si va pegado al segmento anterior sin espacio (`-p` + `-` en `-p-`). */
  pegadoAlAnterior: boolean;
}
