// Proyecto mínimo para tests/compilacion.test.ts: misma configuración MDX que la web.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { validarCmd } from '../../../src/lib/comando/validar-mdx.ts';

export default defineConfig({
  markdown: { processor: satteri({ mdastPlugins: [validarCmd] }) },
  integrations: [mdx()],
});
