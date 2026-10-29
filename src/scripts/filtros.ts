// Filtros del índice de walkthroughs. Sin JavaScript se ve la lista completa;
// con JavaScript aparecen el buscador y los filtros. Lo elegido se guarda en la
// URL (?q=...&serie=...&tecnica=...) para poder compartir un enlace ya filtrado.

import { coincide } from '../lib/buscar';

const CAMPOS = ['q', 'serie', 'plataforma', 'dificultad', 'so', 'tecnica'] as const;
type Campo = (typeof CAMPOS)[number];

/** Un filtro puede ser el buscador, un grupo de botones (radios) o una lista desplegable. */
type Control = HTMLInputElement | HTMLSelectElement | RadioNodeList;

export function iniciarFiltros(): void {
  const form = document.querySelector<HTMLFormElement>('[data-filtros]');
  if (!form) return;

  const tarjetas = [...document.querySelectorAll<HTMLElement>('[data-walkthrough]')];
  const contador = document.querySelector<HTMLElement>('[data-contador]');
  const sinResultados = document.querySelector<HTMLElement>('[data-sin-resultados]');

  // Cada filtro existe solo si tiene algo que filtrar (p. ej. no hay "Sistema" con un único sistema).
  const control = (campo: Campo) => form.elements.namedItem(campo) as Control | null;
  const valor = (campo: Campo) => control(campo)?.value ?? '';

  /** true si ese valor se puede elegir: evita aceptar basura que venga en la URL. */
  const admite = (campo: Campo, v: string) => {
    const c = control(campo);
    if (!c) return false;
    if (c instanceof HTMLSelectElement) return [...c.options].some((o) => o.value === v);
    if (c instanceof HTMLInputElement) return true; // el buscador acepta cualquier texto
    return [...c].some((r) => (r as HTMLInputElement).value === v);
  };

  // Valores iniciales desde la URL.
  const params = new URLSearchParams(location.search);
  for (const campo of CAMPOS) {
    const inicial = params.get(campo);
    const c = control(campo);
    if (c && inicial && admite(campo, inicial)) c.value = inicial;
  }

  const aplicar = () => {
    const consulta = valor('q');
    const serie = valor('serie');
    const plataforma = valor('plataforma');
    const dificultad = valor('dificultad');
    const so = valor('so');
    const tecnica = valor('tecnica');

    let visibles = 0;
    for (const t of tarjetas) {
      const ok =
        (!plataforma || t.dataset.plataforma === plataforma) &&
        (!dificultad || t.dataset.dificultad === dificultad) &&
        (!so || t.dataset.so === so) &&
        (!serie || (t.dataset.serie ?? '').split('|').includes(serie)) &&
        (!tecnica || (t.dataset.tecnicas ?? '').split('|').includes(tecnica)) &&
        coincide(t.dataset.texto ?? '', consulta);
      t.hidden = !ok;
      if (ok) visibles++;
    }

    if (contador) {
      const total = tarjetas.length;
      const palabra = total === 1 ? 'máquina' : 'máquinas';
      contador.textContent = visibles === total ? `${total} ${palabra}` : `${visibles} de ${total} ${palabra}`;
    }
    if (sinResultados) sinResultados.hidden = visibles > 0;

    const url = new URL(location.href);
    for (const campo of CAMPOS) {
      const v = valor(campo);
      if (v) url.searchParams.set(campo, v);
      else url.searchParams.delete(campo);
    }
    history.replaceState(null, '', url);
  };

  form.addEventListener('change', aplicar);
  form.addEventListener('input', aplicar);
  // "reset" cambia los valores después del evento: se aplica en el siguiente ciclo.
  form.addEventListener('reset', () => setTimeout(aplicar));
  form.addEventListener('submit', (e) => e.preventDefault());

  form.hidden = false;
  aplicar();
}
