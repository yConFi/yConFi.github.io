// Normalización para la búsqueda: lo mismo en la compilación (al crear el índice)
// y en el navegador (al buscar), para que los dos lados comparen igual.
//
// - Sin tildes ni diacríticos (NFD) y en minúsculas: "Anónimo" = "anonimo".
// - Espacios colapsados.
// - Los guiones se conservan: "-p", "--min-rate" y "-p-" son cosas distintas.
// - Las palabras que empiezan por "-" (opciones de comandos) conservan las
//   mayúsculas: en hydra, -p es una contraseña y -P un fichero de contraseñas.

/** "  Escaneo   de PUERTOS " → "escaneo de puertos" */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** true si la palabra es una opción de comando (empieza por guion y sigue algo). */
export const esOpcion = (palabra: string): boolean => /^-{1,2}[^\s-]/.test(palabra) || palabra === '-';

/**
 * Palabras de una consulta. Las opciones conservan las mayúsculas; el resto se
 * normaliza. Se quitan los signos de puntuación que rodean a una palabra
 * ("WinRM," → "winrm"), pero no los guiones de dentro ni del principio.
 */
export function palabrasConsulta(consulta: string): string[] {
  return consulta
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/\s+/)
    .map((p) => p.replace(/^[^\p{L}\p{N}-]+|[^\p{L}\p{N}-]+$/gu, ''))
    .filter(Boolean)
    .map((p) => (esOpcion(p) ? p : p.toLowerCase()));
}

/**
 * Palabras sueltas de un texto libre, para los tokens del índice: normalizadas,
 * únicas y de al menos `minimo` caracteres.
 */
export function palabrasTexto(texto: string, minimo = 2): string[] {
  const palabras = normalizar(texto).match(/[\p{L}\p{N}][\p{L}\p{N}._+-]*/gu) ?? [];
  return [...new Set(palabras.map((p) => p.replace(/[._-]+$/, '')).filter((p) => p.length >= minimo))];
}

/**
 * true si una palabra de la consulta coincide con un token del índice.
 *
 * - Opciones (empiezan por "-"): igualdad exacta, o el token es la opción seguida
 *   de un separador ("-p" encuentra "-p-" y "--color" encuentra "--color=auto",
 *   pero "-p" no encuentra "-pn" ni "-P").
 * - Resto: igualdad, o el token empieza por la palabra si tiene al menos 3 letras
 *   ("shell" encuentra "shells"; "ft" no encuentra "ftp").
 */
export function coincidePalabra(palabra: string, token: string): boolean {
  if (palabra === token) return true;
  if (esOpcion(palabra)) {
    return token.startsWith(palabra) && /^[-=:,]/.test(token.slice(palabra.length));
  }
  return palabra.length >= 3 && token.startsWith(palabra);
}
