// Comportamiento de <Cmd> (CommandExplorer).
//
// Cada comando es un toolbar con roving tabindex:
// - En reposo, todos los tokens tienen tabindex="-1": la única parada de Tab es
//   el botón «Explorar comando».
// - Al explorar, el token actual tiene tabindex="0" y el foco. Flechas mueven,
//   Inicio/Fin van a los extremos y Escape sale devolviendo el foco al botón.
// - Al salir del comando con Tab, vuelve al reposo (pero la explicación se queda).
// - Clic o toque en un token: lo selecciona.
// La explicación se copia a una región aria-live="polite" del propio comando.
//
// Un solo conjunto de escuchadores para toda la página (delegación), así da igual
// cuántos comandos haya.

let iniciado = false;

const tokensDe = (figura: HTMLElement) => [...figura.querySelectorAll<HTMLButtonElement>('[data-tokens] .tok')];
const figuraDe = (el: Element | null) => el?.closest<HTMLElement>('[data-cmd]') ?? null;
const botonExplorar = (figura: HTMLElement) => figura.querySelector<HTMLButtonElement>('[data-explorar]');

/** Marca el token como seleccionado y pinta su explicación. */
function seleccionar(figura: HTMLElement, token: HTMLButtonElement): void {
  for (const otro of tokensDe(figura)) {
    if (otro === token) otro.dataset.activo = '';
    else delete otro.dataset.activo;
  }
  const origen = document.getElementById(token.dataset.explica ?? '');
  const region = figura.querySelector<HTMLElement>('[data-explicacion]');
  // El contenido viene del propio HTML generado en la compilación, nunca de fuera.
  if (origen && region) region.innerHTML = origen.innerHTML;
}

/** Roving tabindex: solo el token indicado es alcanzable con Tab. */
function hacerActual(figura: HTMLElement, token: HTMLButtonElement | null): void {
  for (const otro of tokensDe(figura)) otro.tabIndex = otro === token ? 0 : -1;
}

function entrar(figura: HTMLElement, token?: HTMLButtonElement): void {
  const tokens = tokensDe(figura);
  const destino = token ?? tokens.find((t) => 'activo' in t.dataset) ?? tokens[0];
  if (!destino) return;
  figura.dataset.explorando = '';
  botonExplorar(figura)?.setAttribute('aria-pressed', 'true');
  hacerActual(figura, destino);
  seleccionar(figura, destino);
  destino.focus();
}

/** Vuelve al reposo. La explicación seleccionada se queda a la vista. */
function salir(figura: HTMLElement, devolverFoco: boolean): void {
  delete figura.dataset.explorando;
  botonExplorar(figura)?.setAttribute('aria-pressed', 'false');
  hacerActual(figura, null);
  if (devolverFoco) botonExplorar(figura)?.focus();
}

function mover(figura: HTMLElement, actual: HTMLButtonElement, tecla: string): boolean {
  const tokens = tokensDe(figura);
  const i = tokens.indexOf(actual);
  let j: number;
  switch (tecla) {
    case 'ArrowRight':
    case 'ArrowDown':
      j = Math.min(i + 1, tokens.length - 1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      j = Math.max(i - 1, 0);
      break;
    case 'Home':
      j = 0;
      break;
    case 'End':
      j = tokens.length - 1;
      break;
    default:
      return false;
  }
  const destino = tokens[j];
  if (destino && destino !== actual) {
    hacerActual(figura, destino);
    seleccionar(figura, destino);
    destino.focus();
  }
  return true;
}

async function copiar(boton: HTMLButtonElement): Promise<void> {
  const figura = figuraDe(boton);
  const texto = boton.querySelector('[data-copiar-texto]');
  const estado = figura?.querySelector('[data-copiar-estado]');
  // Los textos los pone <Cmd> en la figura: este script es el mismo para los dos idiomas.
  const txt = {
    copiar: figura?.dataset.txtCopiar ?? 'Copiar',
    copiado: figura?.dataset.txtCopiado ?? 'Copiado',
    anuncio: figura?.dataset.txtAnuncio ?? '',
    fallo: figura?.dataset.txtFallo ?? 'No se pudo copiar',
  };
  let ok: boolean;
  try {
    await navigator.clipboard.writeText(boton.dataset.copiar ?? '');
    ok = true;
  } catch {
    ok = false;
  }
  boton.toggleAttribute('data-fallo', !ok);
  if (texto) texto.textContent = ok ? txt.copiado : txt.fallo;
  if (estado) estado.textContent = ok ? txt.anuncio : txt.fallo;
  window.setTimeout(() => {
    boton.removeAttribute('data-fallo');
    if (texto) texto.textContent = txt.copiar;
    if (estado) estado.textContent = '';
  }, 2500);
}

export function iniciarCmd(): void {
  if (iniciado) return;
  iniciado = true;

  document.addEventListener('click', (e) => {
    const objetivo = e.target as Element | null;
    const figura = figuraDe(objetivo);
    if (!figura) return;

    const copiarBoton = objetivo?.closest<HTMLButtonElement>('[data-copiar]');
    if (copiarBoton) {
      void copiar(copiarBoton);
      return;
    }

    const explorar = objetivo?.closest<HTMLButtonElement>('[data-explorar]');
    if (explorar) {
      if ('explorando' in figura.dataset) salir(figura, false);
      else entrar(figura);
      return;
    }

    const token = objetivo?.closest<HTMLButtonElement>('[data-tokens] .tok');
    if (token) entrar(figura, token);
  });

  document.addEventListener('keydown', (e) => {
    const token = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-tokens] .tok');
    const figura = figuraDe(token ?? null);
    if (!token || !figura) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      salir(figura, true);
      return;
    }
    if (mover(figura, token, e.key)) e.preventDefault();
  });

  // Si el foco sale de los tokens (Tab hacia otro sitio), el comando vuelve al
  // reposo: así en la página siempre hay una sola parada de Tab por comando.
  document.addEventListener('focusout', (e) => {
    const desde = (e.target as Element | null)?.closest('[data-tokens]');
    if (!desde) return;
    const hacia = e.relatedTarget as Element | null;
    if (hacia && desde.contains(hacia)) return;
    const figura = figuraDe(desde);
    if (figura && 'explorando' in figura.dataset) salir(figura, false);
  });
}
