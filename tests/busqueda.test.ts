// Búsqueda: normalización, ranking de las consultas de aceptación del handoff y
// exclusión de borradores, plantilla y flags.
//
// El índice se crea con el contenido REAL de src/content (leído del disco, sin
// astro:content), así que si alguien cambia un walkthrough y rompe una consulta
// de aceptación, este test lo dice.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HERRAMIENTAS, OPERADORES } from '../src/data/comandos';
import { agruparPorIntencion, buscar } from '../src/lib/busqueda/buscar';
import {
  comandosDeMdx,
  crearIndice,
  vocabulario,
  type EntradaProyecto,
  type EntradaWalkthrough,
} from '../src/lib/busqueda/crear-indice';
import { coincidePalabra, normalizar, palabrasConsulta } from '../src/lib/busqueda/normalizar';
import type { Idioma } from '../src/i18n';

// ---------- Lectura mínima del frontmatter (solo los campos que usa el índice) ----------
function leerMdx(archivo: string) {
  const texto = readFileSync(archivo, 'utf8').replace(/\r\n/g, '\n');
  const m = texto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Sin frontmatter: ${archivo}`);
  const [, cabecera, body] = m as unknown as [string, string, string];
  const campo = (nombre: string) =>
    cabecera.match(new RegExp(`^${nombre}:\\s*(.*?)\\s*(#.*)?$`, 'm'))?.[1]?.replace(/^"|"$/g, '') ?? '';
  const lista = (nombre: string) => {
    const bloque = cabecera.match(new RegExp(`^${nombre}:.*\\n((?:\\s+- .*\\n?)+)`, 'm'))?.[1] ?? '';
    return [...bloque.matchAll(/- (.*)/g)].map((x) => x[1]!.trim());
  };
  return { campo, lista, body };
}

function leerColeccion(dir: string): Array<{ id: string } & ReturnType<typeof leerMdx>> {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ id: f.replace(/\.mdx$/, ''), ...leerMdx(join(dir, f)) }));
}

const walkthroughs: EntradaWalkthrough[] = leerColeccion('src/content/walkthroughs').map((w) => ({
  id: w.id,
  titulo: w.campo('titulo'),
  resumen: w.campo('resumen'),
  tecnicas: w.lista('tecnicas'),
  fecha: new Date(w.campo('fecha') || '2026-01-01'),
  borrador: w.campo('borrador') === 'true',
  body: w.body,
}));

const proyectos: EntradaProyecto[] = leerColeccion('src/content/proyectos').map((p) => ({
  id: p.id,
  titulo: p.campo('titulo'),
  resumen: p.campo('resumen'),
  tecnologias: p.lista('tecnologias'),
  estado: p.campo('estado'),
  borrador: p.campo('borrador') === 'true',
  body: p.body,
}));

const indice = (idioma: Idioma) =>
  crearIndice({ idioma, walkthroughs, proyectos, herramientas: HERRAMIENTAS, operadores: OPERADORES });

const ES = indice('es');
const EN = indice('en');
const ids = (consulta: string, idioma: Idioma = 'es') => buscar(idioma === 'es' ? ES : EN, consulta).map((r) => r.registro.id);

// ---------- Normalización ----------
describe('normalización', () => {
  it('quita tildes, mayúsculas y espacios de más', () => {
    expect(normalizar('  FTP   Anónimo ')).toBe('ftp anonimo');
    expect(normalizar('Enumeración')).toBe('enumeracion');
  });

  it('conserva los guiones y las mayúsculas de las opciones', () => {
    expect(palabrasConsulta('nmap -p')).toEqual(['nmap', '-p']);
    expect(palabrasConsulta('hydra -P --min-rate')).toEqual(['hydra', '-P', '--min-rate']);
    expect(palabrasConsulta('«WinRM»,')).toEqual(['winrm']);
  });

  it('una opción encuentra su forma con valor pegado, pero no otra opción', () => {
    expect(coincidePalabra('-p', '-p')).toBe(true);
    expect(coincidePalabra('-p', '-p-')).toBe(true);
    expect(coincidePalabra('--color', '--color=auto')).toBe(true);
    expect(coincidePalabra('-p', '-pn')).toBe(false);
    expect(coincidePalabra('-p', '-P')).toBe(false);
  });

  it('las palabras de tres letras o más encuentran por prefijo', () => {
    expect(coincidePalabra('shell', 'shells')).toBe(true);
    expect(coincidePalabra('ft', 'ftp')).toBe(false);
  });
});

// ---------- Consultas de aceptación del handoff ----------
describe('consultas de aceptación', () => {
  it('WinRM → la técnica y Responder', () => {
    const r = ids('WinRM');
    expect(r[0]).toBe('technique:winrm');
    expect(r).toContain('walkthrough:responder');
  });

  it('nmap -p → la opción -p de nmap primero, y los walkthroughs que la usan', () => {
    const r = ids('nmap -p');
    expect(r[0]).toBe('option:nmap:-p');
    expect(r.some((id) => id.startsWith('walkthrough:'))).toBe(true);
    // Otras herramientas con -p no salen: falta "nmap".
    expect(r.filter((id) => id.startsWith('option:') && !id.startsWith('option:nmap:'))).toEqual([]);
  });

  it('HMAC → Bot ChatOps seguro', () => {
    expect(ids('HMAC')).toContain('project:chatops-bot-seguro');
    expect(ids('HMAC')[0]).toBe('project:chatops-bot-seguro');
  });

  it('FTP anónimo → Funnel, Crocodile y Rickdiculously Easy', () => {
    const r = ids('FTP anónimo');
    for (const id of ['walkthrough:funnel', 'walkthrough:crocodile', 'walkthrough:rickdiculouslyeasy']) {
      expect(r).toContain(id);
    }
    // Sin tilde y en inglés, lo mismo.
    expect(ids('ftp anonimo')).toEqual(r);
    expect(ids('anonymous FTP', 'en')).toContain('walkthrough:funnel');
  });

  it('reverse shell → nc (Netcat) y Rickdiculously Easy', () => {
    const r = ids('reverse shell');
    expect(r).toContain('tool:nc');
    expect(r).toContain('walkthrough:rickdiculouslyeasy');
    expect(ids('netcat')).toContain('tool:nc');
  });

  it('agrupa por intención sin cambiar el orden de los puntos', () => {
    const resultados = buscar(ES, 'nmap -p');
    const grupos = agruparPorIntencion(resultados);
    expect(grupos[0]!.intencion).toBe('consultar');
    expect(grupos.flatMap((g) => g.resultados).length).toBe(resultados.length);
    for (const g of grupos) {
      const puntos = g.resultados.map((r) => r.puntos);
      expect(puntos).toEqual([...puntos].sort((a, b) => b - a));
    }
  });

  it('como mucho 20 resultados, y el filtro por tipo funciona', () => {
    expect(buscar(ES, 'nmap').length).toBeLessThanOrEqual(20);
    expect(buscar(ES, 'nmap', { tipo: 'option' }).every((r) => r.registro.kind === 'option')).toBe(true);
  });

  it('una consulta vacía o sin coincidencias no devuelve nada', () => {
    expect(buscar(ES, '   ')).toEqual([]);
    expect(buscar(ES, 'zzzzqqq')).toEqual([]);
  });
});

// ---------- Lo que no puede entrar ----------
describe('exclusiones', () => {
  it('no indexa borradores ni la plantilla', () => {
    const borradores = walkthroughs.filter((w) => w.borrador).map((w) => `walkthrough:${w.id}`);
    expect(borradores).toContain('walkthrough:plantilla');
    for (const id of borradores) expect(ES.some((r) => r.id === id)).toBe(false);
    expect(JSON.stringify(ES)).not.toMatch(/PLANTILLA/);
  });

  it('no indexa los bloques de código ni nada con forma de flag', () => {
    expect(vocabulario('texto ```\nb3f1c0ffee0123456789abcdef012345\n``` fin')).toEqual(['texto', 'fin']);
    expect(vocabulario('la flag HTB{no_esto} y 0123456789abcdef0123456789abcdef')).not.toContain(
      '0123456789abcdef0123456789abcdef',
    );
    const todo = JSON.stringify([ES, EN]);
    expect(todo).not.toMatch(/HTB\{/i);
    expect(todo).not.toMatch(/\b[a-f0-9]{32}\b/i);
  });

  it('extrae los comandos de los <Cmd>', () => {
    expect(comandosDeMdx('<Cmd c="nmap -p- 1.2.3.4" notas={{}} />\n<Cmd\n  c={`echo hola`} />')).toEqual([
      'nmap -p- 1.2.3.4',
      'echo hola',
    ]);
  });

  it('cada idioma enlaza a sus propias rutas', () => {
    expect(ES.find((r) => r.id === 'walkthrough:responder')?.url).toBe('/walkthroughs/responder/');
    expect(EN.find((r) => r.id === 'walkthrough:responder')?.url).toBe('/en/walkthroughs/responder/');
    expect(EN.find((r) => r.id === 'technique:winrm')?.url).toMatch(/^\/en\/techniques\//);
  });
});
