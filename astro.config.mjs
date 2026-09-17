// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { validarCmd } from './src/lib/comando/validar-mdx.ts';

/**
 * Los borradores solo se muestran con `astro dev`. Se decide por el comando y no
 * por NODE_ENV/import.meta.env.DEV: con NODE_ENV=development o test, `astro build`
 * los publicaría (comprobado en tests/borradores.test.ts).
 * @returns {import('astro').AstroIntegration}
 */
function borradores() {
  return {
    name: 'borradores',
    hooks: {
      'astro:config:setup': ({ command, updateConfig }) => {
        updateConfig({ vite: { define: { __MOSTRAR_BORRADORES__: JSON.stringify(command === 'dev') } } });
      },
    },
  };
}

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
  integrations: [mdx(), borradores()],
});
