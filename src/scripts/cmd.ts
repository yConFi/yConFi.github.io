// Tooltips y botón de copiar de <Cmd>.
// Un único tooltip compartido por la página, en la capa superior (Popover API)
// para que no lo recorte el scroll del <pre>. Su contenido es una copia de la
// descripción que ya enlaza cada token con aria-describedby, así que el tooltip
// visual se oculta a los lectores de pantalla para no repetirlo.

const MARGEN = 8;
let iniciado = false;
let tooltip: HTMLDivElement;
let activo: HTMLElement | null = null;
let ultimoPuntero = 'mouse';

function crearTooltip(): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'cmd-tooltip';
  div.setAttribute('aria-hidden', 'true');
  if ('popover' in HTMLElement.prototype) div.popover = 'manual';
  else div.hidden = true;
  document.body.append(div);
  return div;
}

function mostrar(token: HTMLElement): void {
  const idDescripcion = token.getAttribute('aria-describedby');
  const origen = idDescripcion ? document.getElementById(idDescripcion) : null;
  if (!origen) return;

  if (activo && activo !== token) delete activo.dataset.activo;
  activo = token;
  token.dataset.activo = '';
  tooltip.innerHTML = origen.innerHTML;

  if (tooltip.popover) {
    if (!tooltip.matches(':popover-open')) tooltip.showPopover();
  } else {
    tooltip.hidden = false;
  }
  colocar(token);
}

function ocultar(): void {
  if (!activo) return;
  delete activo.dataset.activo;
  activo = null;
  if (tooltip.popover) {
    if (tooltip.matches(':popover-open')) tooltip.hidePopover();
  } else {
    tooltip.hidden = true;
  }
}

/** Debajo del token si cabe; si no, encima. Siempre dentro de la pantalla. */
function colocar(token: HTMLElement): void {
  const r = token.getBoundingClientRect();
  const ancho = tooltip.offsetWidth;
  const alto = tooltip.offsetHeight;
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  let top = r.bottom + MARGEN;
  if (top + alto > vh - MARGEN && r.top - alto - MARGEN >= MARGEN) top = r.top - alto - MARGEN;
  top = Math.max(MARGEN, Math.min(top, vh - alto - MARGEN));

  const left = Math.max(MARGEN, Math.min(r.left + r.width / 2 - ancho / 2, vw - ancho - MARGEN));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

async function copiar(boton: HTMLButtonElement): Promise<void> {
  const figura = boton.closest('[data-cmd]');
  const texto = boton.querySelector('[data-copiar-texto]');
  const estado = figura?.querySelector('[data-copiar-estado]');
  let mensaje: string;
  try {
    await navigator.clipboard.writeText(boton.dataset.copiar ?? '');
    mensaje = 'Copiado';
  } catch {
    mensaje = 'No se pudo copiar';
  }
  if (texto) texto.textContent = mensaje;
  if (estado) estado.textContent = mensaje === 'Copiado' ? 'Comando copiado al portapapeles' : mensaje;
  window.setTimeout(() => {
    if (texto) texto.textContent = 'Copiar';
    if (estado) estado.textContent = '';
  }, 2000);
}

const tokenDe = (e: Event) => (e.target as Element | null)?.closest<HTMLElement>('.cmd .tok') ?? null;

export function iniciarCmd(): void {
  if (iniciado) return;
  iniciado = true;
  tooltip = crearTooltip();

  document.addEventListener('pointerdown', (e) => {
    ultimoPuntero = e.pointerType;
  });

  // Ratón: hover
  document.addEventListener('pointerover', (e) => {
    const token = tokenDe(e);
    if (token && e.pointerType === 'mouse') mostrar(token);
  });
  document.addEventListener('pointerout', (e) => {
    const token = tokenDe(e);
    if (token && e.pointerType === 'mouse' && token === activo && document.activeElement !== token) ocultar();
  });

  // Teclado: foco
  document.addEventListener('focusin', (e) => {
    const token = tokenDe(e);
    if (token) mostrar(token);
  });
  document.addEventListener('focusout', (e) => {
    if (tokenDe(e) === activo) ocultar();
  });

  // Táctil: tocar abre/cierra; tocar fuera cierra. También copiar.
  document.addEventListener('click', (e) => {
    const boton = (e.target as Element | null)?.closest<HTMLButtonElement>('.cmd-copiar');
    if (boton) {
      void copiar(boton);
      return;
    }
    const token = tokenDe(e);
    if (token) {
      if (ultimoPuntero !== 'mouse' && activo === token) ocultar();
      else mostrar(token);
      return;
    }
    ocultar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') ocultar();
  });

  // Al hacer scroll o cambiar el tamaño, el tooltip sigue a su token.
  const recolocar = () => {
    if (activo) colocar(activo);
  };
  window.addEventListener('scroll', recolocar, { passive: true, capture: true });
  window.addEventListener('resize', recolocar);
}
