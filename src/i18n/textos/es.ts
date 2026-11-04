// Textos de la interfaz en castellano. ES EL ORIGINAL: define qué claves existen
// y en.ts tiene que tener exactamente las mismas (lo comprueba tests/i18n.test.ts).
//
// Convenios:
// - Las claves que acaban en `Html` se pintan con `set:html` y pueden llevar
//   etiquetas (<strong>, <em>, <a>). Son textos nuestros, nunca de nadie de fuera.
// - Las que acaban en `Plantilla` llevan huecos {asi}. Algunas viajan en un
//   `data-*` hasta un script del navegador, porque el JavaScript es común a los
//   dos idiomas y no puede importar estos textos.
// - Lo que no se traduce (nombres propios, `yConFi`, `bash`) no está aquí.

export const es = {
  // Las claves de `nav` son las secciones de src/i18n/rutas.ts.
  nav: {
    inicio: 'Inicio',
    walkthroughs: 'Walkthroughs',
    tecnicas: 'Técnicas',
    proyectos: 'Proyectos',
    logros: 'Logros',
    diccionario: 'Diccionario',
  },

  general: {
    // Descripción por defecto para buscadores cuando una página no da la suya.
    descripcionSitio:
      'Portfolio de ciberseguridad y walkthroughs paso a paso de máquinas y retos retirados, con cada parte de cada comando explicada.',
    saltarContenido: 'Saltar al contenido',
    navPrincipal: 'Principal',
    irAlInicio: 'Inicio',
    redes: 'Redes',
    documentacionOficial: 'Documentación oficial',
    ojo: 'Ojo:',
    borrador: 'borrador',
    borradorFuerte: 'BORRADOR',
    borradorTexto: 'solo se ve en desarrollo y no se publicará.',
    tecnicasAria: 'Técnicas',
    tecnologiasAria: 'Tecnologías',
    avatarAlt: 'Avatar ilustrado de Ricardo Hidalgo',
  },

  tema: {
    aOscuro: 'Cambiar a tema oscuro',
    aClaro: 'Cambiar a tema claro',
  },

  idioma: {
    aria: 'Idioma',
    // El texto visible del enlace es el nombre del otro idioma (Español / English).
    cambiarPlantilla: 'Ver esta página en {idioma}',
  },

  portada: {
    lemaHtml: 'Estoy haciendo el camino hacia la <strong>ciberseguridad</strong>.',
    pitchHtml:
      'Aquí publico mis proyectos y los walkthroughs de las máquinas y retos <strong>retirados</strong> que voy resolviendo, con cada parte de cada comando explicada.',
    verWalkthroughs: 'Ver los walkthroughs',
    terminal: {
      barra: 'ricardo@yconfi: ~ — bash',
      whoami: 'ricardo · estudiante de ciberseguridad',
      ordenObjetivo: 'cat objetivo.txt',
      objetivo:
        'Lo que busco, sobre todo, es aprender. Y cuando se me dé la oportunidad, trabajar en ello para aprender aún más.',
      ordenFormacion: 'ls formacion/',
      formacion1: 'ASIR · LinkiaFP',
      formacion1Fecha: '→ sep 2027',
      formacion2: 'Máster en Ciberseguridad & IA · Evolve',
      formacion2Fecha: '→ abr 2027',
    },
    cifrasAria: 'En cifras',
    maquinaResuelta: 'máquina resuelta',
    maquinasResueltas: 'máquinas resueltas',
    herramientasExplicadas: 'herramientas explicadas',
    opcionesDiccionario: 'opciones en el diccionario',
    proyecto: 'proyecto',
    proyectos: 'proyectos',
    ultimasMaquinas: 'Últimas máquinas',
    verTodasPlantilla: 'ver todas ({n}) →',
    verTodosPlantilla: 'ver todos ({n}) →',
    sobreMi: 'Sobre mí',
    sobreMi1Html:
      'Decidí estudiar ciberseguridad por curiosidad y porque es algo que siempre me ha llamado la atención. Empezó cuando tenía unos 12 años, jugando al famoso <em>Habbo</em>.',
    sobreMi2Html:
      'Lo que busco, sobre todo, es <strong>aprender</strong>. Y cuando se me dé la oportunidad, trabajar en ello para aprender aún más. Por eso explico cada comando parte por parte: para entender bien cada paso y que también le sirvan a otros.',
    contacto: 'Contacto',
    logrosYPlataformas: 'Logros y plataformas',
  },

  util: {
    titulo: '¿Te ha servido?',
    texto:
      'Es anónimo de verdad: no se guarda tu nombre, ni tu correo, ni tu IP, ni nada tuyo. Solo un número. Me sirve para saber si lo que publico le ayuda a alguien.',
    boton: 'Me ha servido',
    gracias: '¡Gracias!',
    nadie: 'nadie lo ha votado todavía',
    una: 'persona lo ha encontrado útil',
    varias: 'personas lo han encontrado útil',
    falloMuchos: 'Ahora mismo hay mucho movimiento. Prueba dentro de un minuto.',
    falloGenerico: 'No se ha podido guardar tu voto. Inténtalo más tarde.',
  },

  walkthroughs: {
    titulo: 'Walkthroughs',
    descripcion: 'Walkthroughs paso a paso de máquinas y retos retirados, con cada comando explicado.',
    vacio: 'Todavía no hay walkthroughs publicados.',
    introHtml:
      'Máquinas y retos <strong>retirados</strong>, resueltos paso a paso. Pasa el ratón por cualquier parte de un comando y te dice qué hace.',
    todasLasTecnicasHtmlPlantilla: 'Todas las técnicas están en <a href="{href}">{ruta}</a>.',
    filtrosAria: 'Filtrar walkthroughs',
    buscar: 'Buscar',
    buscarPlaceholder: 'nombre, servicio, técnica…',
    serie: 'Serie',
    todasPlantilla: 'Todas · {n}',
    sistema: 'Sistema',
    sistemaTodos: 'Sistema: todos',
    dificultad: 'Dificultad',
    dificultadTodas: 'Dificultad: todas',
    plataforma: 'Plataforma',
    plataformaTodas: 'Plataforma: todas',
    tecnica: 'Técnica',
    tecnicaTodas: 'Técnica: todas',
    quitarFiltros: 'Quitar filtros',
    totalPlantilla: '{n} máquinas',
    totalUnaPlantilla: '{n} máquina',
    parcialPlantilla: '{visibles} de {total} máquinas',
    sinResultados: 'Ninguna máquina coincide con estos filtros.',
    migas: 'walkthroughs',
    fichaPlataforma: 'Plataforma',
    fichaSerie: 'Serie',
    fichaSistema: 'Sistema',
    fichaFecha: 'Fecha',
    indice: 'En esta máquina',
  },

  tecnicas: {
    titulo: 'Técnicas',
    descripcion: 'Técnicas de hacking usadas en los walkthroughs.',
    introHtmlPlantilla:
      'Otra forma de recorrer los <a href="{href}">walkthroughs</a>: por lo que se hace en cada máquina.',
    vacio: 'Todavía no hay técnicas: aparecerán al publicar walkthroughs.',
    migas: 'técnicas',
    tituloPlantilla: 'Técnica: {nombre}',
    descripcionPlantilla: 'Walkthroughs en los que se usa la técnica {nombre}.',
    usanUna: '1 máquina usa esta técnica.',
    usanPlantilla: '{n} máquinas usan esta técnica.',
  },

  proyectos: {
    titulo: 'Proyectos',
    descripcion: 'Proyectos que he construido y cómo los hice.',
    intro: 'Cosas que he construido para resolver problemas reales, y cómo las hice.',
    vacio: 'Todavía no hay proyectos publicados.',
    migas: 'proyectos',
    estado: 'Estado',
    fecha: 'Fecha',
    tecnologias: 'Tecnologías',
    codigo: 'Código',
    repositorio: 'Repositorio',
    demo: 'Demo',
  },

  logros: {
    titulo: 'Logros',
    descripcion: 'Certificaciones conseguidas y progreso en plataformas de práctica de ciberseguridad.',
    intro: 'Certificaciones que he conseguido y mi progreso en plataformas de práctica.',
    certificaciones: 'Certificaciones',
    sinCertificacionesHtmlPlantilla:
      'Todavía no tengo ninguna certificación. Mientras tanto, lo que voy aprendiendo está en los <a href="{href}">walkthroughs</a>.',
    verificar: 'Verificar credencial',
    plataformas: 'Plataformas',
    rango: 'Rango:',
    actualizadoEl: 'actualizado el',
    verPerfilPlantilla: 'Ver mi perfil en {plataforma}',
  },

  diccionario: {
    titulo: 'Diccionario',
    descripcion:
      'Herramientas, opciones y operadores de shell habituales en CTF, explicados con enlaces a su documentación oficial.',
    introHtmlPlantilla:
      'Todo lo que explican los comandos de los walkthroughs: <strong>{herramientas}</strong> herramientas, <strong>{opciones}</strong> opciones y <strong>{operadores}</strong> operadores de shell. Cada explicación se puede comprobar en la documentación oficial enlazada.',
    buscarLabel: 'Buscar herramienta, opción o descripción',
    buscarPlaceholder: 'p. ej. nmap -p, reverse shell, puerto…',
    herramientasAria: 'Herramientas',
    operadores: 'operadores',
    operadoresTitulo: 'Operadores de shell',
    argumentos: 'Argumentos:',
    manualBash: 'Manual de Bash',
    sinResultados: 'No hay nada en el diccionario que coincida con la búsqueda.',
    resultadoPlantilla: '{secciones} secciones y {entradas} entradas coinciden.',
    resultadoUnaPlantilla: '{secciones} sección y {entradas} entradas coinciden.',
  },

  pista: {
    titulo: 'Pista',
  },

  // Etiquetas y frases que pone el analizador de comandos (src/lib/comando/analizar.ts).
  // Lo que explica cada herramienta y cada opción NO está aquí: eso es el
  // diccionario (src/data/comandos.ts), que se traduce entrada por entrada.
  comando: {
    herramienta: 'herramienta',
    opcion: 'opción',
    opcionesCombinadas: 'opciones combinadas',
    subcomando: 'subcomando',
    argumento: 'argumento',
    operador: 'operador',
    valorDePlantilla: 'valor de {flag}',
    destinoDePlantilla: 'destino de {simbolo}',
    finDePlantilla: 'fin de {opcion}',
    equivaleAPlantilla: 'Equivale a {flags}.',
    destinoRedireccion: 'Fichero en el que se escribe la salida redirigida.',
    finOpciones:
      'Marca el final de las opciones: lo que sigue se trata como argumentos aunque empiece por "-".',
    llavesFind: 'find lo sustituye por la ruta de cada fichero encontrado.',
    porSuRuta:
      'Se ejecuta por su ruta: como el nombre contiene una barra, Bash no lo busca en el PATH y ejecuta ese fichero.',
    directorioActual: './ es el directorio actual.',
    execPuntoYComa:
      'Termina el comando de -exec y lo ejecuta una vez por fichero. Se escapa (\\;) para que el shell no lo interprete como separador.',
    execMas: 'Termina el comando de -exec y lo ejecuta agrupando muchos ficheros en cada ejecución.',
  },

  cmd: {
    ayuda: 'toca cada parte para saber qué hace',
    copiar: 'Copiar',
    copiarOculto: ' comando',
    copiado: 'Copiado',
    copiadoAnuncio: 'Comando copiado al portapapeles',
    falloCopiar: 'No se pudo copiar',
    desglose: 'Desglose del comando',
  },

  error404: {
    titulo: 'Página no encontrada',
    h1: 'Esta página no existe',
    errorPlantilla: 'bash: cd: {ruta}: No such file or directory',
    quizaHtmlPlantilla:
      'Quizá buscabas los <a href="{walkthroughs}">walkthroughs</a>, el <a href="{diccionario}">diccionario</a> o el <a href="{inicio}">inicio</a>.',
  },

  aviso: {
    // Estos dos solo se ven en las páginas en inglés cuyo texto sigue en castellano.
    contenidoEnOtroIdioma: 'Este texto todavía solo está en castellano. La traducción está en marcha.',
    resumenesEnOtroIdioma: 'Los resúmenes todavía están en castellano. La traducción está en marcha.',
    // La cuenta la calcula la página desde el propio diccionario: nunca se escribe a mano.
    diccionarioPlantilla:
      'Las explicaciones se están escribiendo desde la documentación oficial en inglés: van {traducidas} de {total}. Las que faltan se ven en castellano.',
  },
} as const;

/**
 * Forma que tienen que cumplir todos los idiomas.
 *
 * `as const` deja los textos de es.ts como tipos literales ('Inicio' y no string),
 * que es útil aquí pero no sirve como contrato: los demás idiomas tienen otras
 * palabras. `Ampliar` convierte cada literal en `string` y deja solo la ESTRUCTURA.
 */
type Ampliar<T> = T extends string ? string : { [K in keyof T]: Ampliar<T[K]> };

export type Textos = Ampliar<typeof es>;
