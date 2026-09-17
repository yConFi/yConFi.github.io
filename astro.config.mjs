// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: poner la URL pública cuando se decida el despliegue (fase 6).
  // Es necesaria para el sitemap y las URL canónicas.
  // site: 'https://...',
  integrations: [mdx()],
});
