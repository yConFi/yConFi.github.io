// Búsqueda de texto sencilla para el diccionario: sin distinguir mayúsculas ni tildes.

/** "Enumeración WEB" → "enumeracion web" */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/** true si TODAS las palabras de la consulta aparecen en el texto (en cualquier orden). */
export function coincide(texto: string, consulta: string): boolean {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return true;
  const destino = normalizar(texto);
  return palabras.every((p) => destino.includes(p));
}
