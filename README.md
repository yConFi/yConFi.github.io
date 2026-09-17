# yConFi

Web personal de ciberseguridad de Ricardo Hidalgo Bejarano: portfolio y walkthroughs interactivos
en los que **cada parte de cada comando tiene un tooltip** con lo que hace.

- Publicada en: <https://yconfi.github.io>
- Hecha con [Astro](https://docs.astro.build) 7 y MDX, sin frameworks de CSS.

> Solo se publican soluciones de máquinas y retos **retirados**, según las normas de cada plataforma.

## Requisitos

- Node.js **22.12 o superior** (lo exige Astro 7).
- npm.

## Comandos

| Comando           | Qué hace                                                                      |
| ----------------- | ----------------------------------------------------------------------------- |
| `npm install`     | Instala las dependencias (solo la primera vez o al cambiar `package.json`).   |
| `npm run dev`     | Servidor local en <http://localhost:4321>. **Muestra los borradores.**        |
| `npm run build`   | Genera la web publicable en `dist/`. **Nunca incluye borradores.**            |
| `npm run preview` | Sirve `dist/` para revisar exactamente lo que se publicará.                   |
| `npm test`        | Ejecuta todos los tests (incluye compilaciones reales, tarda unos segundos).  |

## Estructura

```text
src/
├─ content/
│  ├─ walkthroughs/         # un .mdx por máquina (plantilla.mdx = plantilla, siempre borrador)
│  └─ proyectos/            # un .mdx por proyecto
├─ content.config.ts        # esquema del frontmatter (plataformas, dificultades, sistemas…)
├─ data/
│  ├─ comandos.ts           # diccionario de herramientas, opciones y operadores
│  └─ site.ts               # nombre, descripción y enlaces de la web
├─ components/              # Cmd, Pista, tarjetas, cabecera, pie…
├─ lib/comando/             # tokenizador, analizador y validación de <Cmd>
├─ pages/                   # rutas de la web
└─ styles/global.css        # colores (tema oscuro y claro) y estilos base
tests/                      # tests con Vitest
```

---

## Crear un walkthrough nuevo

1. **Copia la plantilla** con el nombre de la máquina en minúsculas. El nombre del archivo será la URL
   (`lame.mdx` → `/walkthroughs/lame/`):

   ```bash
   cp src/content/walkthroughs/plantilla.mdx src/content/walkthroughs/lame.mdx
   ```

2. **Rellena el frontmatter** (la cabecera entre `---`). Si falta un campo o tiene un valor no permitido,
   la compilación falla y te dice cuál:

   | Campo        | Valores                                                              |
   | ------------ | -------------------------------------------------------------------- |
   | `titulo`     | Texto.                                                               |
   | `plataforma` | `HackTheBox` o `TryHackMe`.                                          |
   | `dificultad` | `Fácil`, `Media`, `Difícil` o `Insana`.                              |
   | `so`         | `Linux`, `Windows`, `FreeBSD`, `OpenBSD`, `Android` u `Otro`.        |
   | `fecha`      | `AAAA-MM-DD`.                                                        |
   | `tecnicas`   | Lista. Escribe cada técnica **siempre igual** en todos los walkthroughs. |
   | `resumen`    | Una o dos frases (se usa también como descripción para buscadores).  |
   | `borrador`   | `true` mientras lo escribes; `false` para publicarlo.                |

   Para añadir otra plataforma, dificultad o sistema, amplía la lista en `src/content.config.ts`.

3. **Respeta las cinco secciones**, como títulos `##` y en este orden (la compilación falla si no):

   ```md
   ## Reconocimiento
   ## Enumeración
   ## Acceso inicial
   ## Escalada de privilegios
   ## Lecciones aprendidas
   ```

   Para subapartados usa `###`.

4. **Escribe los comandos con `<Cmd>`** (no hace falta importarlo):

   ```mdx
   <Cmd
     c="nmap -sC -sV -p- --min-rate 5000 -oN nmap.txt 10.10.10.10"
     notas={{ "10.10.10.10": "IP de la máquina objetivo" }}
   />
   ```

   - `c`: el comando tal cual.
   - `notas` (opcional): explicación concreta de argumentos o valores (IPs, rutas, puertos…). Si no
     pones nota, se usa la explicación genérica del diccionario. Una nota que no coincide con ningún
     token hace fallar la compilación (así se detectan erratas).
   - Si el comando lleva comillas dobles dentro, usa llaves y comillas invertidas:
     ``<Cmd c={`python3 -c 'import pty;pty.spawn("/bin/bash")'`} />``

5. **Añade pistas con `<Pista>`**, que aparecen plegadas:

   ```mdx
   <Pista>Fíjate en la versión del servicio FTP.</Pista>
   <Pista titulo="Solución">…</Pista>
   ```

6. **Revísalo** con `npm run dev` (verás la franja roja de BORRADOR). Cuando esté listo, pon
   `borrador: false` y [publica](#publicar).

Si un `<Cmd>` usa algo que no está en el diccionario, la compilación se detiene con un mensaje así:

```text
[Cmd] Opción "--inventada" no está en el diccionario de nmap.
  Comando:  nmap -sC --inventada 10.10.10.10
  Token:    --inventada
  Archivo:  src/content/walkthroughs/lame.mdx:18
  Solución: Añade la opción a src/data/comandos.ts o corrige el comando.
```

## Añadir comandos al diccionario

Todo está en `src/data/comandos.ts`. **Cada explicación debe poder comprobarse** en la página man o en
la documentación oficial enlazada en `docs`, y si cambia según la variante o la versión, hay que decirlo
(mira `nc` como ejemplo).

### Una opción en una herramienta existente

Busca la herramienta y añade un objeto a su lista `opciones`:

```ts
{
  nombres: ['-u', '--udp'],                 // todas las formas de escribirla
  descripcion: 'Usa UDP en lugar de TCP.',
},
{
  nombres: ['-w'],
  descripcion: 'Tiempo de espera en segundos.',
  valor: { nombre: 'segundos', descripcion: 'Segundos de espera.' }, // solo si lleva valor
},
```

Campos opcionales de una opción:

- `valor.soloConIgual: true`: el valor solo puede ir con `=` y es opcional (`grep --color=always`).
- `terminaOpciones: true`: lo que sigue ya no son opciones del programa (`python3 -c`).
- `ejecutaComandoHasta: [';', '+']`: ejecuta un comando anidado (`find -exec … \;`).

### Una herramienta nueva

Crea una constante `Herramienta` y añádela a `HERRAMIENTAS` al final del archivo:

```ts
const whoami: Herramienta = {
  nombre: 'whoami',
  descripcion: 'Muestra el nombre del usuario efectivo actual.',
  categoria: 'Información del sistema',
  docs: 'https://man7.org/linux/man-pages/man1/whoami.1.html',
  estilo: 'posix',
  argumentos: null,          // texto que explica los argumentos, o null si no admite
  opciones: [],
};
```

El campo **`estilo`** indica cómo lee las opciones el programa, porque no todos siguen las mismas reglas:

| `estilo`  | Programas              | Reglas                                                                                   |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| `posix`   | nmap, curl, grep, ls…  | `--larga=valor`, valor pegado (`-p80`) y, con `combinables: true`, agrupadas (`-la`).    |
| `go`      | gobuster, ffuf         | `-x` y `--x` son lo mismo; valor separado o con `=`; nada de agrupar ni pegar.           |
| `exacto`  | find                   | Cada opción se escribe tal cual, con su valor separado.                                   |

Otros campos útiles: `subcomandos` (p. ej. `gobuster dir`), `ejecutaComando: true` (el primer argumento
es otro comando, como en `sudo`), `opcionesHastaArgumento` (las opciones terminan tras N argumentos),
`variantes` y `docsVariantes` (diferencias entre versiones).

### Un operador de shell

Añádelo a `OPERADORES`. Si el tokenizador aún no lo reconoce, añádelo también a `OPERADORES_SHELL` en
`src/lib/comando/tokenizar.ts`.

Después de cambiar el diccionario, ejecuta `npm test`.

## Añadir un proyecto

Crea `src/content/proyectos/<nombre>.mdx`:

```mdx
---
titulo: "Nombre del proyecto"
resumen: "Una o dos frases."
tecnologias: [Python, Flask]
estado: En producción        # En producción | En desarrollo | Terminado | Archivado
fecha: 2026-01-01            # opcional
repositorio: https://github.com/yConFi/...   # opcional
borrador: false
---

## Qué hace
…
```

---

## Publicar

La web se publica sola en **GitHub Pages** cada vez que haces `push` a la rama `main`:

```bash
git add .
git commit -m "Añade walkthrough de Lame"
git push
```

El workflow `.github/workflows/deploy.yml` hace tres pasos, y si uno falla no se publica nada:

1. **test**: `npm test`.
2. **build**: `npm run build` (falla si hay un comando sin explicar o un frontmatter incorrecto).
3. **deploy**: sube `dist/` a GitHub Pages.

Puedes seguir el progreso en la pestaña **Actions** del repositorio.

### Antes de publicar un walkthrough

- [ ] La máquina o el reto está **retirado**.
- [ ] `borrador: false`.
- [ ] No quedan `TODO` (búscalos con `Ctrl+Shift+F` en VS Code).
- [ ] `npm test` y `npm run build` terminan sin errores.
- [ ] Lo has revisado con `npm run preview`.

### Dominio propio (opcional)

1. Cambia `site` en `astro.config.mjs` por tu dominio.
2. Crea `public/CNAME` con el dominio en una línea.
3. Configura el DNS y el dominio en **Settings → Pages** del repositorio, siguiendo la
   [documentación de GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
