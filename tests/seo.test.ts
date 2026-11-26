// Estructura de los datos estructurados (JSON-LD) por tipo de página.
import { describe, expect, it } from 'vitest';
import { jsonLd, serializar } from '../src/lib/seo';

const base = {
  idioma: 'es' as const,
  url: 'https://yconfi.github.io/x/',
  sitio: 'https://yconfi.github.io/',
  titulo: 'Título',
  descripcion: 'Descripción.',
};
const tipos = (n: Record<string, unknown>) => (n['@graph'] as Array<Record<string, unknown>>).map((x) => x['@type']);
const nodo = (n: Record<string, unknown>, i = 0) => (n['@graph'] as Array<Record<string, unknown>>)[i]!;

describe('jsonLd', () => {
  it('inicio: Person y WebSite, sin SearchAction', () => {
    const n = jsonLd({ ...base, tipo: 'inicio' });
    expect(tipos(n)).toEqual(['Person', 'WebSite']);
    expect(nodo(n).sameAs).toEqual(expect.arrayContaining([expect.stringContaining('github.com')]));
    expect(JSON.stringify(n)).not.toMatch(/SearchAction/);
  });

  it('walkthrough: TechArticle con fecha real y BreadcrumbList', () => {
    const n = jsonLd({
      ...base,
      tipo: 'articulo',
      fecha: new Date('2026-11-09'),
      migas: [
        { nombre: 'Inicio', url: 'https://yconfi.github.io/' },
        { nombre: 'Responder', url: 'https://yconfi.github.io/walkthroughs/responder/' },
      ],
    });
    expect(tipos(n)).toEqual(['TechArticle', 'BreadcrumbList']);
    expect(nodo(n).datePublished).toBe('2026-11-09');
    expect((nodo(n, 1).itemListElement as unknown[]).length).toBe(2);
  });

  it('sin fecha no se inventa una', () => {
    expect(nodo(jsonLd({ ...base, tipo: 'articulo' }))).not.toHaveProperty('datePublished');
  });

  it('proyecto: SoftwareSourceCode solo con repositorio', () => {
    expect(tipos(jsonLd({ ...base, tipo: 'proyecto', repositorio: 'https://github.com/yConFi/x' }))).toEqual([
      'SoftwareSourceCode',
    ]);
    expect(tipos(jsonLd({ ...base, tipo: 'proyecto' }))).toEqual(['CreativeWork']);
  });

  it('el idioma del contenido puede ser castellano en una página inglesa', () => {
    const n = jsonLd({ ...base, idioma: 'en', idiomaContenido: 'es', tipo: 'articulo' });
    expect(nodo(n).inLanguage).toBe('es');
  });

  it('se serializa sin "<" que pueda cerrar la etiqueta <script>', () => {
    expect(serializar({ a: '</script>' })).not.toContain('<');
  });
});
