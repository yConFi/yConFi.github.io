# Instrucciones para Claude: walkthroughs de yConFi

Web personal de ciberseguridad de Ricardo (usuario de HackTheBox: yConFi). Ricardo abre una conversación
nueva por cada máquina que hace. Este archivo sirve para que todas se trabajen igual. El walkthrough de
referencia es `src/content/walkthroughs/meow.mdx`: imita su estructura, su tono y su nivel de detalle.

El README explica cómo funciona la web (frontmatter, `<Cmd>`, `<Pista>`, `<Ruta>`, diccionario,
publicación). Léelo si necesitas detalles.

## Reglas que no se rompen

- **No dar nada por hecho ni inventar.** Si falta un dato o hay una duda, pregunta a Ricardo. Lo que no
  esté en sus notas no se escribe como si lo hubiera hecho él.
- **Nunca publicar una flag.** Ni en la salida de los comandos, ni en las respuestas de las tasks, ni en
  ningún otro sitio. Antes de hacer commit, busca el valor de la flag en `src/` y en `dist/`.
- **Solo se publica si Ricardo lo confirma.** Él dice en cada máquina si tiene walkthrough oficial (es
  decir, si se puede publicar). Mientras no lo confirme, `borrador: true`.
- **Cada explicación del diccionario se comprueba en la documentación oficial** (página man o web del
  proyecto). Si cambia según la variante o la versión, se dice.
- Todo el texto, los commits y las PR van en castellano.

## Qué tiene que mandar Ricardo

Si falta algo de esto, pídeselo antes de escribir:

1. Nombre de la máquina, Tier de Starting Point y si se puede publicar.
2. Sistema operativo (el que indica HTB).
3. Comandos exactos, en orden.
4. Salida importante de cada comando.
5. Preguntas (tasks) con sus respuestas, normalmente en una captura de la página de HTB.
6. Si algo le costó o no salió a la primera (para "Lecciones aprendidas").

## Cómo se escribe el walkthrough

Archivo: `src/content/walkthroughs/<nombre-en-minúsculas>.mdx`.

### Frontmatter

```yaml
titulo: "Meow"
plataforma: HackTheBox
dificultad: Muy fácil        # Starting Point es "Very Easy" en HTB
so: Linux
fecha: AAAA-MM-DD            # fecha en que Ricardo hizo la máquina (p. ej. la que sale en nmap)
tecnicas:
  - ...
resumen: "Una o dos frases."
serie:
  nombre: Starting Point
  tier: 0
borrador: true               # false solo cuando Ricardo confirme que se puede publicar
```

### Técnicas

Escribe cada técnica **siempre igual** en todos los walkthroughs (la compilación falla si una misma técnica
aparece escrita de dos formas). Antes de inventar una nueva, reutiliza una de estas. Si añades una nueva
porque Ricardo la aprueba, apúntala aquí:

- Escaneo de puertos
- Telnet
- Acceso sin contraseña

### Estructura

1. **Introducción** (antes de `## Reconocimiento`):
   - una frase del tipo "Máquina del Tier N de Starting Point…" con el aviso de que las tasks van plegadas;
   - un esquema `<Ruta>` con los pasos clave y el último con `meta: true`;
   - una cita con la IP de la máquina en la sesión de Ricardo ("a ti te saldrá otra").
2. **Las cinco secciones fijas**, como `##` y en este orden: Reconocimiento, Enumeración, Acceso inicial,
   Escalada de privilegios, Lecciones aprendidas. Para subapartados, `###`.
3. **Escalada de privilegios**: si no hace falta, la sección se queda y se explica en una o dos frases por
   qué (por ejemplo, porque el acceso inicial ya es como root).
4. **Lecciones aprendidas**: tres puntos (qué fallé, lo que enseña la máquina, qué haré la próxima vez).
   Si Ricardo dice que no tuvo problemas, se escribe así. Después, avísale de qué frases has redactado tú
   para que las revise.

### Comandos, salidas y tasks

- Cada comando, en un `<Cmd>` con `notas` para la IP y los valores concretos.
- La salida va en bloques ` ```text `, solo con las líneas importantes. Quita el prompt de Pwnbox y su IP
  de VPN. Si la salida contiene la flag, quítala.
- Cada task es una `<Pista>` en la sección donde se responde:
  - `titulo="Tarea N · <pregunta traducida al castellano>"`;
  - dentro, la respuesta en negrita y, si no coincide con el texto exacto que acepta HTB, ese texto entre
    paréntesis (`respuesta en HTB: ...`);
  - la pregunta de la flag solo dice dónde está la flag, nunca su valor.

### Imágenes

**Sin capturas** (Ricardo lo decidió: además, sus capturas muestran las respuestas de las tasks). Para
que la página tenga buena apariencia se usa el esquema `<Ruta>` creado para la web. Si hiciera falta otra
imagen, créala como componente o SVG que respete el tema claro/oscuro.

## Diccionario de comandos

Si un `<Cmd>` usa una herramienta u opción que no está en `src/data/comandos.ts`, la compilación falla.
Añádela siguiendo el README, con la explicación comprobada en la documentación oficial.

En este entorno la mayoría de webs están bloqueadas, pero apt funciona. Para leer una página man:

1. Descarga el paquete con `apt-get download <paquete>` en un directorio nuevo del scratchpad.
2. Extráelo con `dpkg-deb -x`.
3. Lee la página con `zcat .../usr/share/man/...gz`.

Si no puedes comprobar algo, no lo escribas y díselo a Ricardo.

## Comprobaciones antes de entregar

1. `npm ci` (si no está `node_modules`), `npm test` y `npm run build`, sin errores.
2. Los borradores no se compilan con `build`: revísalos con `npx astro dev`.
3. Abre la página en Chromium (Playwright con `executablePath: '/opt/pw-browsers/chromium'`) y comprueba
   que se ve bien en tema oscuro y claro, en escritorio y en móvil (390 px), sin scroll horizontal.
4. Busca el valor de la flag en `src/` y `dist/`: no debe aparecer.

## Git y publicación

- Trabaja en la rama que indique la sesión. Si su PR anterior ya se fusionó, empieza la rama de nuevo desde
  `main`.
- Commits claros en castellano.
- Abre la PR a `main` y fusiónala (squash, con título acabado en `(#N)`) solo cuando Ricardo lo pida.
- Al fusionar, GitHub Actions pasa los tests, compila y publica en <https://yconfi.github.io>. Comprueba
  que la ejecución termina bien y avisa a Ricardo.
