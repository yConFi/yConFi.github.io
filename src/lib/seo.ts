// Datos estructurados (JSON-LD) por tipo de página. Funciones puras: las usa
// BaseLayout y las prueban los tests.
//
// Solo con datos reales: fechas y autor salen del frontmatter y de site.ts.
// Nada de SearchAction (la búsqueda es estática, no hay URL de búsqueda en un
// servidor que la acepte como promete ese esquema).

import { ENLACES, SITE } from '../data/site';
import { LANG, type Idioma } from '../i18n';

export type TipoSeo = 'inicio' | 'biblioteca' | 'articulo' | 'proyecto' | 'pagina';

export interface MigaSeo {
  nombre: string;
  /** URL absoluta. */
  url: string;
}

type Nodo = Record<string, unknown>;

const iso = (fecha: Date) => fecha.toISOString().slice(0, 10);

export function persona(sitio: string): Nodo {
  return {
    '@type': 'Person',
    '@id': `${sitio}#ricardo`,
    name: SITE.autor,
    alternateName: SITE.titulo,
    url: sitio,
    sameAs: [ENLACES.github, ENLACES.linkedin],
  };
}

export interface DatosSeo {
  tipo: TipoSeo;
  idioma: Idioma;
  /** URL absoluta de la página. */
  url: string;
  /** URL absoluta de la raíz del sitio, con barra final. */
  sitio: string;
  titulo: string;
  descripcion: string;
  /** Idioma del CONTENIDO (puede ser castellano en una página inglesa sin traducir). */
  idiomaContenido?: Idioma;
  fecha?: Date;
  actualizado?: Date;
  migas?: MigaSeo[];
  repositorio?: string;
  palabrasClave?: string[];
}

/** Los nodos JSON-LD de una página, en un @graph. */
export function jsonLd(d: DatosSeo): Nodo {
  const grafo: Nodo[] = [];
  const autor = { '@id': `${d.sitio}#ricardo` };
  const lengua = LANG[d.idiomaContenido ?? d.idioma];

  switch (d.tipo) {
    case 'inicio':
      grafo.push(persona(d.sitio), {
        '@type': 'WebSite',
        '@id': `${d.sitio}#sitio`,
        name: SITE.titulo,
        url: d.sitio,
        inLanguage: [LANG.es, LANG.en],
        author: autor,
      });
      break;
    case 'articulo':
      grafo.push({
        '@type': 'TechArticle',
        headline: d.titulo,
        description: d.descripcion,
        url: d.url,
        inLanguage: lengua,
        author: { '@type': 'Person', name: SITE.autor, url: d.sitio },
        ...(d.fecha && { datePublished: iso(d.fecha) }),
        ...(d.actualizado && { dateModified: iso(d.actualizado) }),
        ...(d.palabrasClave?.length && { keywords: d.palabrasClave.join(', ') }),
      });
      break;
    case 'proyecto':
      grafo.push({
        // SoftwareSourceCode solo si hay un repositorio público que lo respalde.
        '@type': d.repositorio ? 'SoftwareSourceCode' : 'CreativeWork',
        name: d.titulo,
        description: d.descripcion,
        url: d.url,
        inLanguage: lengua,
        author: { '@type': 'Person', name: SITE.autor, url: d.sitio },
        ...(d.repositorio && { codeRepository: d.repositorio }),
        ...(d.fecha && { dateCreated: iso(d.fecha) }),
        ...(d.palabrasClave?.length && { keywords: d.palabrasClave.join(', ') }),
      });
      break;
    case 'biblioteca':
    case 'pagina':
      grafo.push({
        '@type': 'WebPage',
        name: d.titulo,
        description: d.descripcion,
        url: d.url,
        inLanguage: LANG[d.idioma],
      });
      break;
  }

  if (d.migas && d.migas.length > 1) {
    grafo.push({
      '@type': 'BreadcrumbList',
      itemListElement: d.migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.nombre, item: m.url })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': grafo };
}

/** JSON listo para un <script type="application/ld+json"> (sin "<" que cierre la etiqueta). */
export const serializar = (nodo: Nodo) => JSON.stringify(nodo).replaceAll('<', '\\u003c');
