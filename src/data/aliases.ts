// Otras formas de nombrar algo, solo para la búsqueda: sinónimos reales en
// castellano e inglés que alguien puede escribir y que no salen tal cual en el
// texto. No son afirmaciones de contenido: no se muestran como datos.
//
// La clave es el id del registro del índice (src/lib/busqueda/tipos.ts):
//   technique:<slug de la técnica en castellano>, tool:<herramienta>, project:<id>.
// Si una clave no existe en el índice, la compilación falla (crear-indice.ts).

export const ALIASES: Record<string, readonly string[]> = {
  'technique:ftp': ['FTP anónimo', 'anonymous FTP'],
  'technique:acceso-anonimo': ['anonymous access', 'acceso sin credenciales'],
  'technique:winrm': ['Windows Remote Management'],
  'technique:captura-de-hashes-ntlm': ['NTLMv2', 'Net-NTLMv2', 'NTLM hash capture'],
  'technique:escaneo-de-puertos': ['port scan', 'port scanning'],
  'technique:fuerza-bruta-de-directorios': ['directory brute force', 'fuzzing de directorios'],
  'technique:inyeccion-sql': ['SQLi', 'SQL injection'],
  'technique:inyeccion-de-comandos': ['command injection'],
  'technique:credenciales-por-defecto': ['default credentials'],
  'technique:reenvio-de-puertos': ['port forwarding', 'túnel SSH', 'SSH tunnel'],
  'tool:nc': ['netcat', 'reverse shell', 'shell inversa'],
  'project:chatops-bot-seguro': ['ChatOps', 'HMAC-SHA256', 'anti-replay'],
};
