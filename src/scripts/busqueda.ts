// Búsqueda en el navegador: carga diferida del índice y pintado de resultados.
//
// - El índice (/search/<idioma>.json) se pide la primera vez que hace falta: al
//   enfocar o pasar por el lanzador, con Ctrl/⌘ K, al escribir o al abrir la
//   Biblioteca. Nunca bloquea la carga de la página. Se guarda en memoria.
// - Si falla, se dice y se ofrecen los índices HTML (nunca un panel vacío).
// - Los resultados se pintan con textContent: el índice es nuestro, pero así no
//   hay forma de que un texto se interprete como HTML.
// - La búsqueda es síncrona: para este tamaño de índice no hace falta debounce.

import { agruparPorIntencion, buscar } from '../lib/busqueda/buscar';
import type { Intencion, RegistroBusqueda, TipoRegistro } from '../lib/busqueda/tipos';

/** Textos de la interfaz (los pone BuscadorGlobal.astro en un <script type="application/json">). */
export interface TextosBusqueda {
  cargando: string;
  resultadosPlantilla: string;
  resultadoUnoPlantilla: string;
  vacioPlantilla: string;
  intenciones: Record<Intencion, string>;
  tipos: Record<TipoRegistro, string>;
}

let promesa: Promise<RegistroBusqueda[]> | null = null;

/** Carga el índice una sola vez. Si falla, el siguiente intento vuelve a pedirlo. */
export function cargarIndice(url: string): Promise<RegistroBusqueda[]> {
  promesa ??= fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<RegistroBusqueda[]>;
    })
    .catch((error: unknown) => {
      promesa = null;
      throw error;
    });
  return promesa;
}

export function leerTextos(): { textos: TextosBusqueda; indice: string } | null {
  const nodo = document.querySelector<HTMLScriptElement>('[data-textos-busqueda]');
  if (!nodo?.textContent) return null;
  return JSON.parse(nodo.textContent) as { textos: TextosBusqueda; indice: string };
}

const rellenar = (plantilla: string, valores: Record<string, string | number>) =>
  plantilla.replace(/\{(\w+)\}/g, (_, k: string) => String(valores[k] ?? ''));

const recortar = (texto: string, max = 180) => (texto.length > max ? `${texto.slice(0, max - 1).trimEnd()}…` : texto);

function elemento<K extends keyof HTMLElementTagNameMap>(tag: K, clase?: string, texto?: string) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/** Piezas de un panel de búsqueda (el del diálogo o el de la Biblioteca). */
export interface PanelBusqueda {
  raiz: HTMLElement;
  entrada: HTMLInputElement;
  estado: HTMLElement;
  resultados: HTMLElement;
  error: HTMLElement;
  /** Se ocultan cuando hay consulta. */
  ejemplos?: HTMLElement | null;
}

export function piezasPanel(raiz: HTMLElement): PanelBusqueda | null {
  const entrada = raiz.querySelector<HTMLInputElement>('[data-consulta]');
  const estado = raiz.querySelector<HTMLElement>('[data-estado]');
  const resultados = raiz.querySelector<HTMLElement>('[data-resultados]');
  const error = raiz.querySelector<HTMLElement>('[data-error]');
  if (!entrada || !estado || !resultados || !error) return null;
  return { raiz, entrada, estado, resultados, error, ejemplos: raiz.querySelector('[data-ejemplos]') };
}

/** Busca y pinta. Devuelve false si no se pudo cargar el índice. */
export async function pintar(
  panel: PanelBusqueda,
  textos: TextosBusqueda,
  urlIndice: string,
  tipo?: TipoRegistro,
): Promise<boolean> {
  const consulta = panel.entrada.value.trim();
  panel.resultados.replaceChildren();
  panel.error.hidden = true;
  if (panel.ejemplos) panel.ejemplos.hidden = consulta !== '';

  if (!consulta) {
    panel.estado.textContent = '';
    return true;
  }

  let registros: RegistroBusqueda[];
  try {
    panel.raiz.setAttribute('aria-busy', 'true');
    panel.estado.textContent = textos.cargando;
    registros = await cargarIndice(urlIndice);
  } catch {
    panel.estado.textContent = '';
    panel.error.hidden = false;
    return false;
  } finally {
    panel.raiz.removeAttribute('aria-busy');
  }

  // Mientras se cargaba, la persona pudo seguir escribiendo.
  if (panel.entrada.value.trim() !== consulta) return true;

  const resultados = buscar(registros, consulta, { tipo });
  const n = resultados.length;
  panel.estado.textContent =
    n === 0
      ? rellenar(textos.vacioPlantilla, { q: consulta })
      : rellenar(n === 1 ? textos.resultadoUnoPlantilla : textos.resultadosPlantilla, { n, q: consulta });

  for (const grupo of agruparPorIntencion(resultados)) {
    const seccion = elemento('section', 'grupo-resultados');
    const id = `${panel.raiz.id || 'busqueda'}-${grupo.intencion}`;
    const titulo = elemento('h3', 'grupo-titulo', textos.intenciones[grupo.intencion]);
    titulo.id = id;
    seccion.setAttribute('aria-labelledby', id);
    const lista = elemento('ul', 'lista-resultados');
    for (const { registro } of grupo.resultados) {
      const item = elemento('li');
      const enlace = elemento('a', `resultado resultado-${registro.kind}`);
      enlace.href = registro.url;
      enlace.append(
        elemento('span', 'resultado-tipo', textos.tipos[registro.kind]),
        elemento('span', 'resultado-titulo', registro.title),
        elemento('span', 'resultado-resumen', recortar(registro.summary)),
        elemento('span', 'resultado-ruta', registro.url),
      );
      item.append(enlace);
      lista.append(item);
    }
    seccion.append(titulo, lista);
    panel.resultados.append(seccion);
  }
  return true;
}

// ---------- Diálogo global ----------

export function iniciarBuscadorGlobal(): void {
  const dialogo = document.querySelector<HTMLDialogElement>('[data-buscador]');
  const datos = leerTextos();
  if (!dialogo || !datos || typeof dialogo.showModal !== 'function') return;
  const panel = piezasPanel(dialogo);
  if (!panel) return;
  const { textos, indice } = datos;
  const biblioteca = dialogo.querySelector<HTMLAnchorElement>('[data-ver-biblioteca]');
  const baseBiblioteca = biblioteca?.getAttribute('href') ?? '';
  let opener: HTMLElement | null = null;

  const precargar = () => void cargarIndice(indice).catch(() => {});

  const abrir = (desde: HTMLElement | null) => {
    opener = desde ?? (document.activeElement as HTMLElement | null);
    dialogo.showModal();
    panel.entrada.focus();
    panel.entrada.select();
    precargar();
  };

  for (const lanzador of document.querySelectorAll<HTMLElement>('[data-busqueda-abrir]')) {
    lanzador.addEventListener('click', (e) => {
      e.preventDefault();
      abrir(lanzador);
    });
    lanzador.addEventListener('focus', precargar, { once: true });
    lanzador.addEventListener('pointerenter', precargar, { once: true });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialogo.open) panel.entrada.focus();
      else abrir(document.querySelector('[data-busqueda-abrir]'));
    }
  });

  // Escape cierra siempre (en un campo type=search, el navegador solo lo vaciaría).
  // Al cerrar, el foco vuelve al lanzador.
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dialogo.close();
    }
  });
  dialogo.addEventListener('close', () => opener?.focus());
  dialogo.querySelector('[data-cerrar]')?.addEventListener('click', () => dialogo.close());
  // Clic en el fondo (fuera del panel) también cierra.
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close();
  });

  const actualizar = () => {
    void pintar(panel, textos, indice);
    if (biblioteca) {
      const q = panel.entrada.value.trim();
      biblioteca.href = q ? `${baseBiblioteca}?q=${encodeURIComponent(q)}` : baseBiblioteca;
    }
  };
  panel.entrada.addEventListener('input', actualizar);

  for (const ejemplo of dialogo.querySelectorAll<HTMLButtonElement>('[data-ejemplo]')) {
    ejemplo.addEventListener('click', () => {
      panel.entrada.value = ejemplo.dataset.ejemplo ?? '';
      actualizar();
      panel.entrada.focus();
    });
  }
}
