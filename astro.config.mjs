// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { validarCmd } from './src/lib/comando/validar-mdx.ts';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: poner la URL pública cuando se decida el despliegue (fase 6).
  // Es necesaria para el sitemap y las URL canónicas.
  // site: 'https://...',
  markdown: {
    // Sätteri es el procesador por defecto de Astro 7; MDX hereda esta configuración.
    // validarCmd hace fallar la compilación si un <Cmd> usa algo que no está en el diccionario.
    processor: satteri({ mdastPlugins: [validarCmd] }),
  },
  integrations: [mdx()],
});
