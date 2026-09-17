// Errores del análisis de comandos. Deben decir qué token falla, en qué comando
// y, cuando se conoce, en qué archivo, para poder corregirlo sin buscar.

export type MotivoError =
  | 'comilla-sin-cerrar'
  | 'herramienta-desconocida'
  | 'subcomando-desconocido'
  | 'falta-subcomando'
  | 'opcion-desconocida'
  | 'falta-valor'
  | 'valor-no-admitido'
  | 'argumento-no-admitido'
  | 'operador-desconocido'
  | 'falta-comando'
  | 'falta-destino'
  | 'exec-sin-terminar'
  | 'nota-sin-usar';

const SOLUCIONES: Record<MotivoError, string> = {
  'comilla-sin-cerrar': 'Cierra la comilla en el comando.',
  'herramienta-desconocida': 'Añade la herramienta a src/data/comandos.ts o corrige el comando.',
  'subcomando-desconocido': 'Añade el subcomando a src/data/comandos.ts o corrige el comando.',
  'falta-subcomando': 'Esta herramienta necesita un subcomando (p. ej. "gobuster dir").',
  'opcion-desconocida': 'Añade la opción a src/data/comandos.ts o corrige el comando.',
  'falta-valor': 'Esta opción necesita un valor detrás.',
  'valor-no-admitido': 'Esta opción no lleva valor: quita el "=valor" o revisa el diccionario.',
  'argumento-no-admitido': 'Esta herramienta no admite argumentos sueltos: revisa el comando o el diccionario.',
  'operador-desconocido': 'Añade el operador a OPERADORES en src/data/comandos.ts o reescribe el comando.',
  'falta-comando': 'Debe haber un comando antes y después de un separador (|, &&, ;).',
  'falta-destino': 'Indica el fichero de destino de la redirección.',
  'exec-sin-terminar': 'Termina el comando de -exec con \\; o con +.',
  'nota-sin-usar':
    'La clave de "notas" no coincide con ningún argumento o valor del comando: revisa que esté escrita igual.',
};

export class ErrorComando extends Error {
  readonly motivo: MotivoError;
  readonly token: string;
  readonly comando: string;

  constructor(motivo: MotivoError, detalle: string, token: string, comando: string) {
    super(detalle);
    this.name = 'ErrorComando';
    this.motivo = motivo;
    this.token = token;
    this.comando = comando;
  }
}

/** Mensaje completo y legible para mostrar en la consola al compilar. */
export function formatearError(error: ErrorComando, ubicacion?: string): string {
  return [
    `[Cmd] ${error.message}`,
    `  Comando:  ${error.comando}`,
    `  Token:    ${error.token}`,
    ...(ubicacion ? [`  Archivo:  ${ubicacion}`] : []),
    `  Solución: ${SOLUCIONES[error.motivo]}`,
  ].join('\n');
}
