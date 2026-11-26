// Índice de búsqueda en inglés. Se genera al compilar: ver src/lib/busqueda/.
import type { APIRoute } from 'astro';
import { respuestaIndice } from '../../lib/busqueda/endpoint';

export const GET: APIRoute = () => respuestaIndice('en');
