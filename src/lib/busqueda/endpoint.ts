// Respuesta de /search/es.json y /search/en.json: el índice de un idioma,
// generado en la compilación (salida estática, sin servidor).

import { HERRAMIENTAS, OPERADORES } from '../../data/comandos';
import type { Idioma } from '../../i18n';
import { obtenerProyectos, obtenerWalkthroughs } from '../coleccion';
import { crearIndice } from './crear-indice';

export async function respuestaIndice(idioma: Idioma): Promise<Response> {
  const [walkthroughs, proyectos] = await Promise.all([obtenerWalkthroughs(), obtenerProyectos()]);
  const registros = crearIndice({
    idioma,
    walkthroughs: walkthroughs.map((w) => ({ id: w.id, ...w.data, body: w.body ?? '' })),
    proyectos: proyectos.map((p) => ({ id: p.id, ...p.data, body: p.body ?? '' })),
    herramientas: HERRAMIENTAS,
    operadores: OPERADORES,
  });
  return new Response(JSON.stringify(registros), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
