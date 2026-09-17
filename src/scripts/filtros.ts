// Filtros del índice de walkthroughs. Sin JavaScript se ve la lista completa;
// con JavaScript aparece el formulario. Los filtros se guardan en la URL
// (?plataforma=...&tecnica=...) para poder compartir un enlace ya filtrado.

const CAMPOS = ['plataforma', 'dificultad', 'tecnica'] as const;
type Campo = (typeof CAMPOS)[number];

export function iniciarFiltros(): void {
  const form = document.querySelector<HTMLFormElement>('[data-filtros]');
  if (!form) return;

  const tarjetas = [...document.querySelectorAll<HTMLElement>('[data-walkthrough]')];
  const contador = document.querySelector<HTMLElement>('[data-contador]');
  const sinResultados = document.querySelector<HTMLElement>('[data-sin-resultados]');
  const select = (campo: Campo) => form.elements.namedItem(campo) as HTMLSelectElement;

  // Valores iniciales desde la URL (solo si existen como opción).
  const params = new URLSearchParams(location.search);
  for (const campo of CAMPOS) {
    const valor = params.get(campo);
    if (valor && [...select(campo).options].some((o) => o.value === valor)) select(campo).value = valor;
  }

  const aplicar = () => {
    const plataforma = select('plataforma').value;
    const dificultad = select('dificultad').value;
    const tecnica = select('tecnica').value;

    let visibles = 0;
    for (const t of tarjetas) {
      const coincide =
        (!plataforma || t.dataset.plataforma === plataforma) &&
        (!dificultad || t.dataset.dificultad === dificultad) &&
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
      const valor = select(campo).value;
      if (valor) url.searchParams.set(campo, valor);
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
