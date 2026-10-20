// Filtros del índice de walkthroughs. Sin JavaScript se ve la lista completa;
// con JavaScript aparece el formulario. Los filtros se guardan en la URL
// (?plataforma=...&serie=...&tecnica=...) para poder compartir un enlace ya filtrado.

const CAMPOS = ['plataforma', 'dificultad', 'serie', 'tecnica'] as const;
type Campo = (typeof CAMPOS)[number];

export function iniciarFiltros(): void {
  const form = document.querySelector<HTMLFormElement>('[data-filtros]');
  if (!form) return;

  const tarjetas = [...document.querySelectorAll<HTMLElement>('[data-walkthrough]')];
  const contador = document.querySelector<HTMLElement>('[data-contador]');
  const sinResultados = document.querySelector<HTMLElement>('[data-sin-resultados]');
  // El selector de serie solo existe si algún walkthrough tiene serie.
  const select = (campo: Campo) => form.elements.namedItem(campo) as HTMLSelectElement | null;
  const valor = (campo: Campo) => select(campo)?.value ?? '';

  // Valores iniciales desde la URL (solo si existen como opción).
  const params = new URLSearchParams(location.search);
  for (const campo of CAMPOS) {
    const inicial = params.get(campo);
    const s = select(campo);
    if (s && inicial && [...s.options].some((o) => o.value === inicial)) s.value = inicial;
  }

  const aplicar = () => {
    const plataforma = valor('plataforma');
    const dificultad = valor('dificultad');
    const serie = valor('serie');
    const tecnica = valor('tecnica');

    let visibles = 0;
    for (const t of tarjetas) {
      const coincide =
        (!plataforma || t.dataset.plataforma === plataforma) &&
        (!dificultad || t.dataset.dificultad === dificultad) &&
        (!serie || (t.dataset.serie ?? '').split('|').includes(serie)) &&
        (!tecnica || (t.dataset.tecnicas ?? '').split('|').includes(tecnica));
      t.hidden = !coincide;
      if (coincide) visibles++;
    }

    if (contador) {
      const total = tarjetas.length;
      contador.textContent =
        visibles === total
          ? `${total} ${total === 1 ? 'walkthrough' : 'walkthroughs'}`
          : `${visibles} de ${total} walkthroughs`;
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
  // "reset" cambia los valores después del evento: se aplica en el siguiente ciclo.
  form.addEventListener('reset', () => setTimeout(aplicar));
  form.addEventListener('submit', (e) => e.preventDefault());

  form.hidden = false;
  aplicar();
}
