// Colecciones de contenido (API de Astro 7: loader glob + z de astro/zod).
// https://docs.astro.build/en/guides/content-collections/

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Para añadir una plataforma, dificultad o sistema, amplía estas listas.
export const PLATAFORMAS = ['HackTheBox', 'TryHackMe'] as const;
export const DIFICULTADES = ['Fácil', 'Media', 'Difícil', 'Insana'] as const;
export const SISTEMAS = ['Linux', 'Windows', 'FreeBSD', 'OpenBSD', 'Android', 'Otro'] as const;

const walkthroughs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/walkthroughs' }),
  schema: z.object({
    titulo: z.string().min(1),
    plataforma: z.enum(PLATAFORMAS),
    dificultad: z.enum(DIFICULTADES),
    so: z.enum(SISTEMAS),
    fecha: z.coerce.date(),
    tecnicas: z.array(z.string().min(1)).min(1),
    resumen: z.string().min(1),
    /** true = no se publica (solo visible con `npm run dev`). */
    borrador: z.boolean(),
  }),
});

export const ESTADOS_PROYECTO = ['En producción', 'En desarrollo', 'Terminado', 'Archivado'] as const;

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string().min(1),
    resumen: z.string().min(1),
    tecnologias: z.array(z.string().min(1)).min(1),
    estado: z.enum(ESTADOS_PROYECTO),
    /** Opcional: solo si se conoce la fecha real. */
    fecha: z.coerce.date().optional(),
    /** Opcional: repositorio público. */
    repositorio: z.url().optional(),
    /** true = no se publica (solo visible con `npm run dev`). */
    borrador: z.boolean(),
  }),
});

export const collections = { walkthroughs, proyectos };
