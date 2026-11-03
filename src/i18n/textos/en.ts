// Textos de la interfaz en inglés. Tiene que tener EXACTAMENTE las mismas claves
// que es.ts (lo comprueba tests/i18n.test.ts); es.ts es el original.
//
// Ojo con las frases de `portada` y `aviso`: no son interfaz, son la voz de
// Ricardo traducida. Están marcadas en la PR para que las revise.

import type { Textos } from './es';

export const en: Textos = {
  nav: {
    inicio: 'Home',
    walkthroughs: 'Walkthroughs',
    tecnicas: 'Techniques',
    proyectos: 'Projects',
    logros: 'Achievements',
    diccionario: 'Dictionary',
  },

  general: {
    descripcionSitio:
      'Cybersecurity portfolio and step-by-step walkthroughs of retired machines and challenges, with every part of every command explained.',
    saltarContenido: 'Skip to content',
    navPrincipal: 'Main',
    irAlInicio: 'Home',
    redes: 'Social',
    documentacionOficial: 'Official documentation',
    ojo: 'Careful:',
    borrador: 'draft',
    borradorFuerte: 'DRAFT',
    borradorTexto: 'only visible in development and will not be published.',
    tecnicasAria: 'Techniques',
    tecnologiasAria: 'Technologies',
    avatarAlt: 'Illustrated avatar of Ricardo Hidalgo',
  },

  tema: {
    aOscuro: 'Switch to dark theme',
    aClaro: 'Switch to light theme',
  },

  idioma: {
    aria: 'Language',
    cambiarPlantilla: 'View this page in {idioma}',
  },

  portada: {
    lemaHtml: "I'm making my way into <strong>cybersecurity</strong>.",
    pitchHtml:
      'Here I publish my projects and the walkthroughs of the <strong>retired</strong> machines and challenges I solve, with every part of every command explained.',
    verWalkthroughs: 'See the walkthroughs',
    terminal: {
      barra: 'ricardo@yconfi: ~ — bash',
      whoami: 'ricardo · cybersecurity student',
      ordenObjetivo: 'cat goal.txt',
      objetivo:
        "What I'm after, above all, is learning. And when I get the chance, working at it to learn even more.",
      ordenFormacion: 'ls education/',
      formacion1: 'ASIR · LinkiaFP',
      formacion1Fecha: '→ Sep 2027',
      formacion2: "Master's in Cybersecurity & AI · Evolve",
      formacion2Fecha: '→ Apr 2027',
    },
    cifrasAria: 'In numbers',
    maquinaResuelta: 'machine solved',
    maquinasResueltas: 'machines solved',
    herramientasExplicadas: 'tools explained',
    opcionesDiccionario: 'options in the dictionary',
    proyecto: 'project',
    proyectos: 'projects',
    ultimasMaquinas: 'Latest machines',
    verTodasPlantilla: 'see all ({n}) →',
    verTodosPlantilla: 'see all ({n}) →',
    sobreMi: 'About me',
    sobreMi1Html:
      'I decided to study cybersecurity out of curiosity, and because it is something that has always caught my attention. It started when I was about 12, playing the famous <em>Habbo</em>.',
    sobreMi2Html:
      "What I'm after, above all, is to <strong>learn</strong>. And when I get the chance, to work at it and learn even more. That is why I explain every command part by part: to understand each step properly, and so that it is useful to others too.",
    contacto: 'Contact',
    logrosYPlataformas: 'Achievements and platforms',
  },

  util: {
    titulo: 'Was this useful?',
    texto:
      'It is genuinely anonymous: your name, your email, your IP, nothing of yours is stored. Just a number. It tells me whether what I publish helps anyone.',
    boton: 'This helped me',
    gracias: 'Thanks!',
    nadie: 'nobody has voted yet',
    una: 'person found it useful',
    varias: 'people found it useful',
    falloMuchos: 'There is a lot going on right now. Try again in a minute.',
    falloGenerico: 'Your vote could not be saved. Please try again later.',
  },

  walkthroughs: {
    titulo: 'Walkthroughs',
    descripcion: 'Step-by-step walkthroughs of retired machines and challenges, with every command explained.',
    vacio: 'There are no walkthroughs published yet.',
    introHtml:
      '<strong>Retired</strong> machines and challenges, solved step by step. Hover over any part of a command and it tells you what it does.',
    todasLasTecnicasHtmlPlantilla: 'All the techniques are at <a href="{href}">{ruta}</a>.',
    filtrosAria: 'Filter walkthroughs',
    buscar: 'Search',
    buscarPlaceholder: 'name, service, technique…',
    serie: 'Series',
    todasPlantilla: 'All · {n}',
    sistema: 'OS',
    sistemaTodos: 'OS: all',
    dificultad: 'Difficulty',
    dificultadTodas: 'Difficulty: all',
    plataforma: 'Platform',
    plataformaTodas: 'Platform: all',
    tecnica: 'Technique',
    tecnicaTodas: 'Technique: all',
    quitarFiltros: 'Clear filters',
    totalPlantilla: '{n} machines',
    totalUnaPlantilla: '{n} machine',
    parcialPlantilla: '{visibles} of {total} machines',
    sinResultados: 'No machine matches these filters.',
    migas: 'walkthroughs',
    fichaPlataforma: 'Platform',
    fichaSerie: 'Series',
    fichaSistema: 'OS',
    fichaFecha: 'Date',
    indice: 'In this walkthrough',
  },

  tecnicas: {
    titulo: 'Techniques',
    descripcion: 'Hacking techniques used in the walkthroughs.',
    introHtmlPlantilla:
      'Another way through the <a href="{href}">walkthroughs</a>: by what gets done on each machine.',
    vacio: 'There are no techniques yet: they will show up as walkthroughs get published.',
    migas: 'techniques',
    tituloPlantilla: 'Technique: {nombre}',
    descripcionPlantilla: 'Walkthroughs that use the {nombre} technique.',
    usanUna: '1 machine uses this technique.',
    usanPlantilla: '{n} machines use this technique.',
  },

  proyectos: {
    titulo: 'Projects',
    descripcion: 'Projects I have built and how I did it.',
    intro: 'Things I have built to solve real problems, and how I did it.',
    vacio: 'There are no projects published yet.',
    migas: 'projects',
    estado: 'Status',
    fecha: 'Date',
    tecnologias: 'Technologies',
    codigo: 'Code',
    repositorio: 'Repository',
    demo: 'Demo',
  },

  logros: {
    titulo: 'Achievements',
    descripcion: 'Certifications earned and progress on cybersecurity practice platforms.',
    intro: 'Certifications I have earned and my progress on practice platforms.',
    certificaciones: 'Certifications',
    sinCertificacionesHtmlPlantilla:
      'I do not have any certification yet. In the meantime, what I am learning is in the <a href="{href}">walkthroughs</a>.',
    verificar: 'Verify credential',
    plataformas: 'Platforms',
    rango: 'Rank:',
    actualizadoEl: 'updated on',
    verPerfilPlantilla: 'See my profile on {plataforma}',
  },

  diccionario: {
    titulo: 'Dictionary',
    descripcion:
      'Tools, options and shell operators common in CTFs, explained with links to their official documentation.',
    introHtmlPlantilla:
      'Everything the commands in the walkthroughs explain: <strong>{herramientas}</strong> tools, <strong>{opciones}</strong> options and <strong>{operadores}</strong> shell operators. Every explanation can be checked against the official documentation linked here.',
    buscarLabel: 'Search for a tool, an option or a description',
    buscarPlaceholder: 'e.g. nmap -p, reverse shell, port…',
    herramientasAria: 'Tools',
    operadores: 'operators',
    operadoresTitulo: 'Shell operators',
    argumentos: 'Arguments:',
    manualBash: 'Bash manual',
    sinResultados: 'Nothing in the dictionary matches your search.',
    resultadoPlantilla: '{secciones} sections and {entradas} entries match.',
    resultadoUnaPlantilla: '{secciones} section and {entradas} entries match.',
  },

  pista: {
    titulo: 'Hint',
  },

  cmd: {
    ayuda: 'tap any part to see what it does',
    copiar: 'Copy',
    copiarOculto: ' command',
    copiado: 'Copied',
    copiadoAnuncio: 'Command copied to the clipboard',
    falloCopiar: 'Could not copy',
    desglose: 'Command breakdown',
  },

  error404: {
    titulo: 'Page not found',
    h1: 'This page does not exist',
    errorPlantilla: 'bash: cd: {ruta}: No such file or directory',
    quizaHtmlPlantilla:
      'Maybe you were looking for the <a href="{walkthroughs}">walkthroughs</a>, the <a href="{diccionario}">dictionary</a> or the <a href="{inicio}">home page</a>.',
  },

  aviso: {
    contenidoEnOtroIdioma: 'This write-up is only available in Spanish for now. The translation is on its way.',
    resumenesEnOtroIdioma: 'The summaries are still in Spanish. The translation is on its way.',
    entradasEnOtroIdioma:
      'The dictionary explanations are still in Spanish. They are being translated one by one.',
  },
};
