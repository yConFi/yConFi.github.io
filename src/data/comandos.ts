// Diccionario central de comandos.
//
// Reglas para añadir entradas (ver README):
// - Cada explicación debe poder comprobarse en la página man o en la documentación
//   oficial enlazada en `docs`.
// - Si el comportamiento cambia según la variante o la versión, indícalo.
// - Fuentes consultadas el 17/09/2026 (versiones indicadas en `variantes`).

import type { Herramienta, Opcion, Operador } from '../lib/comando/tipos';

// ============================================================
// nmap — https://nmap.org/book/man.html
// ============================================================
const nmap: Herramienta = {
  nombre: 'nmap',
  descripcion:
    'Escáner de red: descubre hosts, puertos abiertos, servicios y sus versiones, y el sistema operativo.',
  categoria: 'Escaneo de red',
  docs: 'https://nmap.org/book/man.html',
  estilo: 'posix',
  combinables: false,
  argumentos:
    'Objetivo del escaneo: dirección IP, nombre de host, red en notación CIDR (p. ej. 10.10.10.0/24) o rango (p. ej. 10.0.0-255.1-254).',
  opciones: [
    {
      nombres: ['-sS'],
      descripcion:
        'Escaneo TCP SYN: envía SYN y no completa la conexión. Es el tipo por defecto cuando hay privilegios de root.',
    },
    {
      nombres: ['-sT'],
      descripcion:
        'Escaneo TCP connect(): completa la conexión usando el sistema operativo. Es el tipo por defecto si no se puede usar -sS (sin privilegios).',
    },
    { nombres: ['-sU'], descripcion: 'Escaneo de puertos UDP.' },
    {
      nombres: ['-sC'],
      descripcion: 'Ejecuta los scripts NSE de la categoría "default". Equivale a --script=default.',
    },
    {
      nombres: ['-sV'],
      descripcion: 'Sondea los puertos abiertos para averiguar qué servicio y qué versión hay detrás.',
    },
    { nombres: ['-O'], descripcion: 'Intenta detectar el sistema operativo del objetivo.' },
    {
      nombres: ['-A'],
      descripcion:
        'Modo agresivo: activa detección de sistema operativo, detección de versiones, scripts por defecto y traceroute.',
    },
    {
      nombres: ['-Pn'],
      descripcion:
        'Trata todos los hosts como activos y se salta el descubrimiento de hosts. Útil si el objetivo no responde a ping.',
    },
    { nombres: ['-n'], descripcion: 'No hace resolución DNS.' },
    {
      nombres: ['-p'],
      descripcion: 'Escanea solo los puertos indicados. Admite listas y rangos, p. ej. 22,80,8000-8100.',
      valor: {
        nombre: 'puertos',
        descripcion:
          'Puertos a escanear. Si se omite el inicio o el final de un rango, nmap usa 1 y 65535; por eso "-" escanea del 1 al 65535.',
      },
    },
    {
      nombres: ['-F'],
      descripcion: 'Modo rápido: escanea los 100 puertos más comunes en lugar de los 1000 por defecto.',
    },
    {
      nombres: ['--top-ports'],
      descripcion: 'Escanea los N puertos más comunes según el fichero nmap-services.',
      valor: { nombre: 'número', descripcion: 'Cantidad de puertos más comunes que se escanean.' },
    },
    {
      nombres: ['-T'],
      descripcion:
        'Plantilla de temporización de 0 (paranoid) a 5 (insane): cuanto más alta, más rápido. -T4 (aggressive) es habitual en entornos de laboratorio.',
      valor: { nombre: '0-5', descripcion: 'Nivel de la plantilla de temporización.' },
    },
    {
      nombres: ['--min-rate'],
      descripcion: 'Envía paquetes a una velocidad no inferior a N por segundo.',
      valor: { nombre: 'número', descripcion: 'Paquetes por segundo como mínimo.' },
    },
    {
      nombres: ['-v', '-vv'],
      descripcion: 'Aumenta el nivel de detalle de la salida; -vv o más para más detalle.',
    },
    {
      nombres: ['-oN'],
      descripcion: 'Guarda el resultado en formato normal (el mismo que se ve en pantalla).',
      valor: { nombre: 'fichero', descripcion: 'Fichero donde se guarda la salida.' },
    },
    {
      nombres: ['-oX'],
      descripcion: 'Guarda el resultado en formato XML.',
      valor: { nombre: 'fichero', descripcion: 'Fichero donde se guarda la salida.' },
    },
    {
      nombres: ['-oG'],
      descripcion: 'Guarda el resultado en formato "grepable" (una línea por host).',
      valor: { nombre: 'fichero', descripcion: 'Fichero donde se guarda la salida.' },
    },
    {
      nombres: ['-oA'],
      descripcion: 'Guarda el resultado en los tres formatos principales a la vez (.nmap, .xml y .gnmap).',
      valor: { nombre: 'nombre base', descripcion: 'Nombre base de los ficheros, sin extensión.' },
    },
    {
      nombres: ['--script'],
      descripcion: 'Ejecuta scripts NSE. Acepta una lista separada por comas de scripts, categorías o directorios.',
      valor: { nombre: 'scripts', descripcion: 'Scripts, categorías o directorios NSE separados por comas.' },
    },
    { nombres: ['--open'], descripcion: 'Muestra solo los puertos abiertos (o posiblemente abiertos).' },
    {
      nombres: ['-iL'],
      descripcion: 'Lee la lista de objetivos desde un fichero.',
      valor: { nombre: 'fichero', descripcion: 'Fichero con un objetivo por línea.' },
    },
  ],
};

// ============================================================
// gobuster 3.8.2 — opciones sacadas del código fuente (cli/*.go)
// ============================================================
const GOBUSTER_GLOBALES: Opcion[] = [
  {
    nombres: ['-w', '--wordlist'],
    descripcion: 'Diccionario (wordlist) que se prueba. Con "-" se lee de la entrada estándar.',
    valor: { nombre: 'fichero', descripcion: 'Ruta del diccionario.' },
  },
  {
    nombres: ['-t', '--threads'],
    descripcion: 'Número de hilos concurrentes (por defecto, 10).',
    valor: { nombre: 'número', descripcion: 'Cantidad de hilos.' },
  },
  {
    nombres: ['-d', '--delay'],
    descripcion: 'Tiempo que espera cada hilo entre peticiones.',
    valor: { nombre: 'duración', descripcion: 'Duración con unidad, p. ej. 1500ms.' },
  },
  {
    nombres: ['-o', '--output'],
    descripcion: 'Guarda los resultados en un fichero (por defecto solo se muestran en pantalla).',
    valor: { nombre: 'fichero', descripcion: 'Fichero de salida.' },
  },
  { nombres: ['-q', '--quiet'], descripcion: 'No muestra el banner ni otra información accesoria.' },
  { nombres: ['-np', '--no-progress'], descripcion: 'No muestra el progreso.' },
  { nombres: ['-ne', '--no-error'], descripcion: 'No muestra los errores.' },
  { nombres: ['-nc', '--no-color'], descripcion: 'Desactiva los colores en la salida.' },
  { nombres: ['--debug'], descripcion: 'Activa la salida de depuración.' },
];

const GOBUSTER_HTTP: Opcion[] = [
  {
    nombres: ['-u', '--url'],
    descripcion: 'URL objetivo (obligatoria).',
    valor: { nombre: 'URL', descripcion: 'URL base sobre la que se prueban las palabras del diccionario.' },
  },
  {
    nombres: ['-c', '--cookies'],
    descripcion: 'Cookies que se envían en las peticiones.',
    valor: { nombre: 'cookies', descripcion: 'Cookies en formato "nombre=valor".' },
  },
  {
    nombres: ['-U', '--username'],
    descripcion: 'Usuario para autenticación HTTP Basic.',
    valor: { nombre: 'usuario', descripcion: 'Nombre de usuario.' },
  },
  {
    nombres: ['-P', '--password'],
    descripcion: 'Contraseña para autenticación HTTP Basic.',
    valor: { nombre: 'contraseña', descripcion: 'Contraseña.' },
  },
  { nombres: ['-r', '--follow-redirect'], descripcion: 'Sigue las redirecciones.' },
  {
    nombres: ['-H', '--headers'],
    descripcion: 'Añade una cabecera HTTP. Se puede repetir.',
    valor: { nombre: 'cabecera', descripcion: 'Cabecera en formato "Nombre: valor".' },
  },
  {
    nombres: ['-m', '--method'],
    descripcion: 'Método HTTP que se usa (por defecto, GET).',
    valor: { nombre: 'método', descripcion: 'Método HTTP, p. ej. POST.' },
  },
  {
    nombres: ['-a', '--useragent'],
    descripcion: 'Establece la cadena User-Agent.',
    valor: { nombre: 'user-agent', descripcion: 'Valor de la cabecera User-Agent.' },
  },
  { nombres: ['-rua', '--random-agent'], descripcion: 'Usa un User-Agent aleatorio.' },
  {
    nombres: ['--proxy'],
    descripcion: 'Proxy para las peticiones.',
    valor: { nombre: 'proxy', descripcion: 'http(s)://host:puerto o socks5://host:puerto.' },
  },
  {
    nombres: ['-to', '--timeout'],
    descripcion: 'Tiempo máximo de espera de cada petición HTTP (por defecto, 10s).',
    valor: { nombre: 'duración', descripcion: 'Duración con unidad, p. ej. 10s.' },
  },
  {
    nombres: ['-k', '--no-tls-validation'],
    descripcion: 'No verifica el certificado TLS (útil con certificados autofirmados).',
  },
];

const gobuster: Herramienta = {
  nombre: 'gobuster',
  descripcion:
    'Herramienta de fuerza bruta con diccionario para descubrir rutas web, subdominios DNS y virtual hosts, entre otros.',
  categoria: 'Enumeración web',
  docs: 'https://github.com/OJ/gobuster',
  variantes:
    'Opciones verificadas en el código de gobuster 3.8.2. A partir de la 3.7 cambió la librería de línea de comandos, por lo que algunas opciones cortas no existen en versiones anteriores.',
  estilo: 'go',
  argumentos: null,
  opciones: [],
  subcomandos: [
    {
      nombre: 'dir',
      descripcion: 'Modo de enumeración de directorios y ficheros en un servidor web.',
      opciones: [
        ...GOBUSTER_HTTP,
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-s', '--status-codes'],
          descripcion: 'Códigos de estado que se consideran resultado positivo. Admite rangos, p. ej. 200,300-400.',
          valor: { nombre: 'códigos', descripcion: 'Lista de códigos o rangos separados por comas.' },
        },
        {
          nombres: ['-b', '--status-codes-blacklist'],
          descripcion:
            'Códigos de estado que se descartan (por defecto, 404). Si se indica, tiene prioridad sobre -s.',
          valor: { nombre: 'códigos', descripcion: 'Lista de códigos o rangos separados por comas.' },
        },
        {
          nombres: ['-x', '--extensions'],
          descripcion: 'Extensiones de fichero que se añaden a cada palabra, p. ej. php,txt.',
          valor: { nombre: 'extensiones', descripcion: 'Extensiones separadas por comas.' },
        },
        {
          nombres: ['-X', '--extensions-file'],
          descripcion: 'Lee las extensiones desde un fichero.',
          valor: { nombre: 'fichero', descripcion: 'Fichero con extensiones.' },
        },
        { nombres: ['-e', '--expanded'], descripcion: 'Modo expandido: muestra las URL completas.' },
        { nombres: ['-n', '--no-status'], descripcion: 'No muestra los códigos de estado.' },
        { nombres: ['-f', '--add-slash'], descripcion: 'Añade "/" al final de cada petición.' },
        {
          nombres: ['-db', '--discover-backup'],
          descripcion: 'Al encontrar un fichero, busca copias de seguridad añadiendo extensiones típicas.',
        },
        {
          nombres: ['-xl', '--exclude-length'],
          descripcion: 'Descarta respuestas con estas longitudes de contenido, sin importar el código de estado.',
          valor: { nombre: 'longitudes', descripcion: 'Longitudes o rangos separados por comas, p. ej. 203-206.' },
        },
      ],
    },
    {
      nombre: 'dns',
      descripcion: 'Modo de enumeración de subdominios por DNS.',
      opciones: [
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-do', '--domain'],
          descripcion: 'Dominio objetivo (obligatorio).',
          valor: { nombre: 'dominio', descripcion: 'Dominio al que se añaden las palabras como subdominios.' },
        },
        { nombres: ['-c', '--check-cname'], descripcion: 'Comprueba también los registros CNAME.' },
        {
          nombres: ['-to', '--timeout'],
          descripcion: 'Tiempo máximo de espera del resolvedor DNS (por defecto, 1s).',
          valor: { nombre: 'duración', descripcion: 'Duración con unidad, p. ej. 1s.' },
        },
        {
          nombres: ['-wc', '--wildcard'],
          descripcion: 'Continúa aunque se detecte un DNS comodín (wildcard).',
        },
        {
          nombres: ['--resolver'],
          descripcion: 'Servidor DNS personalizado.',
          valor: { nombre: 'servidor', descripcion: 'servidor o servidor:puerto.' },
        },
      ],
    },
    {
      nombre: 'vhost',
      descripcion:
        'Modo de enumeración de virtual hosts: prueba nombres de host distintos contra el mismo servidor.',
      opciones: [
        ...GOBUSTER_HTTP,
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-ad', '--append-domain'],
          descripcion:
            'Añade el dominio principal de la URL a cada palabra. Sin esta opción, el diccionario debe contener nombres completos.',
        },
        {
          nombres: ['-do', '--domain'],
          descripcion: 'Dominio que se añade cuando la URL es una dirección IP.',
          valor: { nombre: 'dominio', descripcion: 'Dominio base de los virtual hosts.' },
        },
        {
          nombres: ['-xl', '--exclude-length'],
          descripcion: 'Descarta respuestas con estas longitudes de contenido.',
          valor: { nombre: 'longitudes', descripcion: 'Longitudes o rangos separados por comas.' },
        },
        {
          nombres: ['-xs', '--exclude-status'],
          descripcion: 'Descarta respuestas con estos códigos de estado.',
          valor: { nombre: 'códigos', descripcion: 'Códigos o rangos separados por comas.' },
        },
      ],
    },
  ],
};

// ============================================================
// ffuf — https://github.com/ffuf/ffuf
// ============================================================
const ffuf: Herramienta = {
  nombre: 'ffuf',
  descripcion:
    'Fuzzer web: sustituye la palabra clave FUZZ de la URL, las cabeceras o los datos por cada entrada de un diccionario.',
  categoria: 'Enumeración web',
  docs: 'https://github.com/ffuf/ffuf',
  estilo: 'go',
  argumentos: null,
  opciones: [
    {
      nombres: ['-u'],
      descripcion: 'URL objetivo. Debe contener la palabra clave (FUZZ) donde se sustituyen las entradas.',
      valor: { nombre: 'URL', descripcion: 'URL con la palabra clave FUZZ.' },
    },
    {
      nombres: ['-w'],
      descripcion:
        'Diccionario y, opcionalmente, su palabra clave separada por dos puntos (/ruta/lista:CLAVE). Sin clave se usa FUZZ.',
      valor: { nombre: 'fichero[:CLAVE]', descripcion: 'Ruta del diccionario, con palabra clave opcional.' },
    },
    {
      nombres: ['-H'],
      descripcion: 'Añade una cabecera "Nombre: valor". Se puede repetir.',
      valor: { nombre: 'cabecera', descripcion: 'Cabecera en formato "Nombre: valor".' },
    },
    {
      nombres: ['-X'],
      descripcion: 'Método HTTP que se usa.',
      valor: { nombre: 'método', descripcion: 'Método HTTP, p. ej. POST.' },
    },
    {
      nombres: ['-d'],
      descripcion: 'Datos que se envían en el cuerpo de la petición (POST).',
      valor: { nombre: 'datos', descripcion: 'Cuerpo de la petición.' },
    },
    {
      nombres: ['-b'],
      descripcion: 'Cookies que se envían, p. ej. "NOMBRE1=VALOR1; NOMBRE2=VALOR2".',
      valor: { nombre: 'cookies', descripcion: 'Cookies separadas por punto y coma.' },
    },
    {
      nombres: ['-mc'],
      descripcion:
        'Muestra solo respuestas con estos códigos de estado, o "all" para todos (por defecto: 200-299,301,302,307,401,403,405,500).',
      valor: { nombre: 'códigos', descripcion: 'Códigos o rangos separados por comas, o "all".' },
    },
    {
      nombres: ['-fc'],
      descripcion: 'Filtra (oculta) respuestas con estos códigos de estado.',
      valor: { nombre: 'códigos', descripcion: 'Códigos o rangos separados por comas.' },
    },
    {
      nombres: ['-fs'],
      descripcion: 'Filtra respuestas con este tamaño.',
      valor: { nombre: 'tamaños', descripcion: 'Tamaños o rangos separados por comas.' },
    },
    {
      nombres: ['-fw'],
      descripcion: 'Filtra respuestas con este número de palabras.',
      valor: { nombre: 'palabras', descripcion: 'Cantidades o rangos separados por comas.' },
    },
    {
      nombres: ['-fl'],
      descripcion: 'Filtra respuestas con este número de líneas.',
      valor: { nombre: 'líneas', descripcion: 'Cantidades o rangos separados por comas.' },
    },
    { nombres: ['-ac'], descripcion: 'Calibra automáticamente los filtros para descartar respuestas "falsas".' },
    {
      nombres: ['-t'],
      descripcion: 'Número de hilos concurrentes (por defecto, 40).',
      valor: { nombre: 'número', descripcion: 'Cantidad de hilos.' },
    },
    {
      nombres: ['-o'],
      descripcion: 'Guarda la salida en un fichero.',
      valor: { nombre: 'fichero', descripcion: 'Fichero de salida.' },
    },
    {
      nombres: ['-of'],
      descripcion: 'Formato del fichero de salida: json, ejson, html, md, csv, ecsv o all (por defecto, json).',
      valor: { nombre: 'formato', descripcion: 'Formato de salida.' },
    },
    {
      nombres: ['-recursion'],
      descripcion: 'Escaneo recursivo. Solo admite la clave FUZZ y la URL (-u) debe terminar en ella.',
    },
    {
      nombres: ['-e'],
      descripcion: 'Lista de extensiones separadas por comas que se añaden a la palabra clave FUZZ.',
      valor: { nombre: 'extensiones', descripcion: 'Extensiones separadas por comas, p. ej. .php,.txt.' },
    },
    {
      nombres: ['-x'],
      descripcion: 'Proxy HTTP o SOCKS5, p. ej. http://127.0.0.1:8080.',
      valor: { nombre: 'proxy', descripcion: 'URL del proxy.' },
    },
    { nombres: ['-ic'], descripcion: 'Ignora los comentarios del diccionario.' },
    { nombres: ['-c'], descripcion: 'Colorea la salida.' },
    {
      nombres: ['-v'],
      descripcion: 'Salida detallada: muestra la URL completa y, si la hay, la redirección de cada resultado.',
    },
    { nombres: ['-s'], descripcion: 'Modo silencioso: no muestra información adicional.' },
  ],
};

// ============================================================
// curl — https://curl.se/docs/manpage.html
// ============================================================
const curl: Herramienta = {
  nombre: 'curl',
  descripcion: 'Transfiere datos desde o hacia un servidor usando URL (HTTP, HTTPS, FTP y otros protocolos).',
  categoria: 'HTTP',
  docs: 'https://curl.se/docs/manpage.html',
  estilo: 'posix',
  combinables: true,
  argumentos: 'URL a la que se hace la petición.',
  opciones: [
    {
      nombres: ['-X', '--request'],
      descripcion: 'Usa un método HTTP personalizado en lugar del que curl usaría por defecto (GET, o POST con -d).',
      valor: { nombre: 'método', descripcion: 'Método HTTP, p. ej. PUT o DELETE.' },
    },
    {
      nombres: ['-d', '--data'],
      descripcion:
        'Envía datos por POST con Content-Type application/x-www-form-urlencoded. Si el valor empieza por @, lee los datos de ese fichero.',
      valor: { nombre: 'datos', descripcion: 'Datos que se envían, p. ej. "user=admin&pass=1234".' },
    },
    {
      nombres: ['--data-urlencode'],
      descripcion: 'Como -d, pero codifica los datos para URL (URL-encoding).',
      valor: { nombre: 'datos', descripcion: 'Datos que se codifican y envían.' },
    },
    {
      nombres: ['-F', '--form'],
      descripcion: 'Simula el envío de un formulario con multipart/form-data. Con @ se sube un fichero.',
      valor: { nombre: 'campo=valor', descripcion: 'Campo del formulario, p. ej. "file=@shell.php".' },
    },
    {
      nombres: ['-H', '--header'],
      descripcion: 'Añade una cabecera a la petición HTTP.',
      valor: { nombre: 'cabecera', descripcion: 'Cabecera en formato "Nombre: valor".' },
    },
    { nombres: ['-s', '--silent'], descripcion: 'Modo silencioso: no muestra la barra de progreso ni los errores.' },
    { nombres: ['-S', '--show-error'], descripcion: 'Con -s, muestra igualmente los mensajes de error.' },
    {
      nombres: ['-i', '--show-headers', '--include'],
      descripcion: 'Incluye las cabeceras de la respuesta en la salida. --include es el nombre anterior de esta opción.',
    },
    { nombres: ['-I', '--head'], descripcion: 'Pide solo las cabeceras (método HEAD).' },
    {
      nombres: ['-k', '--insecure'],
      descripcion: 'No verifica el certificado TLS del servidor (útil con certificados autofirmados).',
    },
    { nombres: ['-L', '--location'], descripcion: 'Sigue las redirecciones HTTP.' },
    {
      nombres: ['-o', '--output'],
      descripcion: 'Guarda la respuesta en un fichero en lugar de mostrarla.',
      valor: { nombre: 'fichero', descripcion: 'Fichero de destino.' },
    },
    { nombres: ['-O', '--remote-name'], descripcion: 'Guarda la respuesta con el nombre del fichero remoto.' },
    { nombres: ['-v', '--verbose'], descripcion: 'Modo detallado: muestra la petición y la respuesta, útil para depurar.' },
    {
      nombres: ['-u', '--user'],
      descripcion: 'Usuario y contraseña para autenticarse en el servidor.',
      valor: { nombre: 'usuario:contraseña', descripcion: 'Credenciales en formato usuario:contraseña.' },
    },
    {
      nombres: ['-b', '--cookie'],
      descripcion: 'Envía cookies, o las lee de un fichero si el valor no contiene "=".',
      valor: { nombre: 'cookies', descripcion: 'Cookies "NOMBRE=VALOR" o fichero de cookies.' },
    },
    {
      nombres: ['-A', '--user-agent'],
      descripcion: 'Establece la cabecera User-Agent.',
      valor: { nombre: 'user-agent', descripcion: 'Valor de User-Agent.' },
    },
    {
      nombres: ['-x', '--proxy'],
      descripcion: 'Envía las peticiones a través de un proxy.',
      valor: { nombre: 'proxy', descripcion: 'URL del proxy, p. ej. http://127.0.0.1:8080.' },
    },
  ],
};

// ============================================================
// nc (netcat) — tres variantes con opciones distintas
// ============================================================
const nc: Herramienta = {
  nombre: 'nc',
  descripcion:
    'Netcat: lee y escribe datos a través de conexiones TCP o UDP. Se usa para escuchar conexiones (p. ej. reverse shells), conectarse a puertos o escanearlos.',
  categoria: 'Conexiones',
  docs: 'https://man.openbsd.org/nc.1',
  docsVariantes: [
    {
      nombre: 'netcat-traditional',
      url: 'https://manpages.debian.org/unstable/netcat-traditional/nc.traditional.1.en.html',
    },
    { nombre: 'ncat (Nmap)', url: 'https://nmap.org/book/ncat-man.html' },
  ],
  variantes:
    'El comando "nc" puede ser netcat-traditional, netcat de OpenBSD o ncat de Nmap, según el sistema. Opciones como -p, -e o -c cambian de significado entre ellas: comprueba cuál tienes con "nc -h".',
  estilo: 'posix',
  combinables: true,
  argumentos:
    'Host y puerto de destino. En modo escucha, OpenBSD y ncat reciben aquí el puerto en el que escuchar; netcat-traditional lo toma de -p.',
  opciones: [
    { nombres: ['-l'], descripcion: 'Modo escucha: espera una conexión entrante en lugar de conectarse a un host.' },
    { nombres: ['-v'], descripcion: 'Salida detallada. Repetida (-vv) da más detalle.' },
    { nombres: ['-n'], descripcion: 'No resuelve nombres por DNS: trabaja solo con direcciones IP.' },
    {
      nombres: ['-p'],
      descripcion:
        'Depende de la variante. netcat-traditional: puerto local (con -l, el puerto en el que escucha). OpenBSD: puerto de origen, y su man indica que no se puede combinar con -l. ncat: puerto de origen (--source-port).',
      valor: { nombre: 'puerto', descripcion: 'Número de puerto.' },
    },
    {
      nombres: ['-e'],
      descripcion:
        'Depende de la variante. netcat-traditional y ncat: ejecuta el programa indicado tras conectar y le redirige la conexión. OpenBSD: no ejecuta nada; indica el nombre que debe tener el certificado TLS (requiere -c).',
      valor: { nombre: 'programa', descripcion: 'Programa que se ejecuta, p. ej. /bin/bash.' },
    },
    {
      nombres: ['-c'],
      descripcion:
        'Depende de la variante. netcat-traditional: ejecuta comandos de shell tras conectar (lleva valor). ncat: igual, mediante /bin/sh (--sh-exec). OpenBSD: activa TLS y no lleva valor.',
      valor: { nombre: 'comandos', descripcion: 'Comandos de shell que se ejecutan.' },
    },
    { nombres: ['-u'], descripcion: 'Usa UDP en lugar de TCP.' },
    {
      nombres: ['-z'],
      descripcion: 'Modo sin E/S: solo comprueba si los puertos están a la escucha, sin enviar datos (escaneo).',
    },
    {
      nombres: ['-w'],
      descripcion: 'Tiempo de espera en segundos para establecer la conexión (y, según la variante, de inactividad).',
      valor: { nombre: 'segundos', descripcion: 'Segundos de espera.' },
    },
    {
      nombres: ['-k'],
      descripcion:
        'Tras cerrar una conexión, sigue escuchando para aceptar otra (con -l). Existe en OpenBSD y ncat, no en netcat-traditional.',
    },
  ],
};

// ============================================================
// ssh (OpenSSH) — https://man.openbsd.org/ssh.1
// ============================================================
const ssh: Herramienta = {
  nombre: 'ssh',
  descripcion: 'Cliente de OpenSSH: inicia una sesión cifrada en un equipo remoto o ejecuta un comando en él.',
  categoria: 'Conexiones',
  docs: 'https://man.openbsd.org/ssh.1',
  estilo: 'posix',
  combinables: true,
  opcionesHastaArgumento: 2,
  argumentos:
    'Destino ([usuario@]host o ssh://[usuario@]host[:puerto]). Si después se escribe un comando, se ejecuta en el host remoto en lugar de abrir una shell.',
  opciones: [
    {
      nombres: ['-i'],
      descripcion: 'Fichero de la clave privada que se usa para autenticarse con clave pública.',
      valor: { nombre: 'fichero', descripcion: 'Ruta de la clave privada, p. ej. id_rsa.' },
    },
    {
      nombres: ['-p'],
      descripcion: 'Puerto del host remoto al que se conecta.',
      valor: { nombre: 'puerto', descripcion: 'Número de puerto (por defecto, 22).' },
    },
    {
      nombres: ['-l'],
      descripcion: 'Usuario con el que se inicia sesión en el equipo remoto.',
      valor: { nombre: 'usuario', descripcion: 'Nombre de usuario remoto.' },
    },
    {
      nombres: ['-L'],
      descripcion:
        'Reenvío de puerto local: las conexiones a un puerto de tu equipo se reenvían, a través del servidor SSH, al host y puerto indicados.',
      valor: {
        nombre: 'reenvío',
        descripcion: '[dirección:]puerto_local:host_destino:puerto_destino.',
      },
    },
    {
      nombres: ['-R'],
      descripcion:
        'Reenvío de puerto remoto: las conexiones a un puerto del servidor remoto se reenvían hacia tu lado.',
      valor: {
        nombre: 'reenvío',
        descripcion: '[dirección:]puerto_remoto:host_destino:puerto_destino.',
      },
    },
    {
      nombres: ['-D'],
      descripcion: 'Reenvío dinámico de puertos: abre un proxy SOCKS en el puerto local indicado.',
      valor: { nombre: 'puerto', descripcion: '[dirección:]puerto local del proxy SOCKS.' },
    },
    {
      nombres: ['-N'],
      descripcion: 'No ejecuta ningún comando remoto. Útil cuando solo se quiere reenviar puertos.',
    },
    { nombres: ['-v'], descripcion: 'Modo detallado: muestra mensajes de depuración de la conexión.' },
    {
      nombres: ['-o'],
      descripcion: 'Pasa una opción con el mismo formato que el fichero de configuración de ssh.',
      valor: { nombre: 'opción', descripcion: 'Opción de configuración, p. ej. StrictHostKeyChecking=no.' },
    },
    { nombres: ['-t'], descripcion: 'Fuerza la asignación de una pseudoterminal.' },
    {
      nombres: ['-J'],
      descripcion: 'Conecta primero a un host intermedio (jump host) y desde él al destino.',
      valor: { nombre: 'destino', descripcion: '[usuario@]host[:puerto] del salto intermedio.' },
    },
  ],
};

// ============================================================
// sudo — https://www.sudo.ws/docs/man/sudo.man/
// ============================================================
const sudo: Herramienta = {
  nombre: 'sudo',
  descripcion: 'Ejecuta un comando como otro usuario (por defecto, root), según lo que permita la política de sudoers.',
  categoria: 'Privilegios',
  docs: 'https://www.sudo.ws/docs/man/sudo.man/',
  estilo: 'posix',
  combinables: true,
  ejecutaComando: true,
  argumentos: 'Comando que se ejecuta con los privilegios del usuario objetivo.',
  opciones: [
    {
      nombres: ['-l', '--list'],
      descripcion:
        'Sin comando, lista los privilegios de sudo del usuario en este equipo. Clave en escalada de privilegios.',
    },
    {
      nombres: ['-u', '--user'],
      descripcion: 'Ejecuta el comando como el usuario indicado en lugar del usuario objetivo por defecto (root).',
      valor: { nombre: 'usuario', descripcion: 'Nombre o #UID del usuario.' },
    },
    {
      nombres: ['-i', '--login'],
      descripcion: 'Ejecuta la shell del usuario objetivo como shell de inicio de sesión.',
    },
    {
      nombres: ['-s', '--shell'],
      descripcion: 'Ejecuta la shell indicada en la variable SHELL o, si no existe, la del usuario que invoca sudo.',
    },
    {
      nombres: ['-S', '--stdin'],
      descripcion: 'Lee la contraseña desde la entrada estándar en lugar de la terminal.',
    },
    {
      nombres: ['-k', '--reset-timestamp'],
      descripcion: 'Sin comando, invalida las credenciales guardadas en caché para la sesión actual.',
    },
    {
      nombres: ['-n', '--non-interactive'],
      descripcion: 'No pide nada al usuario; si hace falta contraseña, falla en lugar de preguntarla.',
    },
    { nombres: ['-V', '--version'], descripcion: 'Muestra la versión de sudo y de sus plugins.' },
  ],
};

// ============================================================
// find (GNU findutils) — https://man7.org/linux/man-pages/man1/find.1.html
// ============================================================
const find: Herramienta = {
  nombre: 'find',
  descripcion: 'Busca ficheros en un árbol de directorios según una expresión (nombre, tipo, permisos, propietario…).',
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/find.1.html',
  estilo: 'exacto',
  argumentos: 'Punto de partida de la búsqueda (directorio). Si no se indica ninguno, find usa ".".',
  opciones: [
    {
      nombres: ['-name'],
      descripcion: 'Nombre del fichero (sin la ruta) que coincide con el patrón de shell.',
      valor: { nombre: 'patrón', descripcion: 'Patrón de nombre, p. ej. "*.conf". Conviene entrecomillarlo.' },
    },
    {
      nombres: ['-iname'],
      descripcion: 'Como -name, pero sin distinguir mayúsculas y minúsculas.',
      valor: { nombre: 'patrón', descripcion: 'Patrón de nombre.' },
    },
    {
      nombres: ['-type'],
      descripcion: 'Tipo de fichero: f (fichero regular), d (directorio), l (enlace simbólico), entre otros.',
      valor: { nombre: 'tipo', descripcion: 'Letra del tipo: f, d, l, b, c, p o s.' },
    },
    {
      nombres: ['-perm'],
      descripcion:
        'Permisos del fichero. "modo" exacto; "-modo" todos esos bits activados; "/modo" cualquiera de ellos. -perm -4000 busca binarios SUID.',
      valor: { nombre: 'modo', descripcion: 'Permisos en octal o simbólicos, p. ej. -4000 o -u=s.' },
    },
    {
      nombres: ['-user'],
      descripcion: 'Ficheros cuyo propietario es el usuario indicado (se admite el UID).',
      valor: { nombre: 'usuario', descripcion: 'Nombre de usuario o UID.' },
    },
    {
      nombres: ['-group'],
      descripcion: 'Ficheros que pertenecen al grupo indicado (se admite el GID).',
      valor: { nombre: 'grupo', descripcion: 'Nombre de grupo o GID.' },
    },
    { nombres: ['-writable'], descripcion: 'Ficheros en los que el usuario actual puede escribir.' },
    { nombres: ['-readable'], descripcion: 'Ficheros que el usuario actual puede leer.' },
    {
      nombres: ['-executable'],
      descripcion: 'Ficheros que el usuario actual puede ejecutar y directorios en los que puede entrar.',
    },
    {
      nombres: ['-newer'],
      descripcion: 'Ficheros modificados más recientemente que el fichero de referencia.',
      valor: { nombre: 'fichero', descripcion: 'Fichero de referencia.' },
    },
    {
      nombres: ['-size'],
      descripcion: 'Tamaño del fichero: n exacto, +n mayor que n, -n menor que n (unidades c, k, M, G…).',
      valor: { nombre: 'tamaño', descripcion: 'Tamaño con unidad opcional, p. ej. +1M.' },
    },
    {
      nombres: ['-maxdepth'],
      descripcion: 'Desciende como máximo N niveles de directorios por debajo del punto de partida.',
      valor: { nombre: 'niveles', descripcion: 'Número entero no negativo.' },
    },
    {
      nombres: ['-exec'],
      descripcion:
        'Ejecuta un comando por cada fichero encontrado; {} se sustituye por su ruta. Termina en \\; (una ejecución por fichero) o en + (agrupa varios ficheros en cada ejecución).',
      ejecutaComandoHasta: [';', '+'],
    },
    { nombres: ['-ls'], descripcion: 'Muestra cada fichero encontrado con un formato similar a "ls -dils".' },
    { nombres: ['-print'], descripcion: 'Muestra la ruta completa de cada fichero encontrado (acción por defecto).' },
    { nombres: ['-o', '-or'], descripcion: 'O lógico entre dos expresiones.' },
    { nombres: ['-not'], descripcion: 'Niega la expresión que va a continuación.' },
  ],
};

// ============================================================
// grep (GNU) — https://man7.org/linux/man-pages/man1/grep.1.html
// ============================================================
const grep: Herramienta = {
  nombre: 'grep',
  descripcion: 'Busca líneas que coinciden con un patrón en ficheros o en la entrada estándar.',
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/grep.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos:
    'El primer argumento es el patrón que se busca (salvo si se usa -e) y los siguientes, los ficheros donde buscar. Sin ficheros, grep lee la entrada estándar (con -r, el directorio actual).',
  opciones: [
    { nombres: ['-i', '--ignore-case'], descripcion: 'No distingue mayúsculas de minúsculas.' },
    { nombres: ['-v', '--invert-match'], descripcion: 'Invierte la búsqueda: muestra las líneas que NO coinciden.' },
    {
      nombres: ['-r', '--recursive'],
      descripcion:
        'Busca recursivamente en todos los ficheros de cada directorio. Solo sigue enlaces simbólicos si se indican en la línea de comandos.',
    },
    {
      nombres: ['-R', '--dereference-recursive'],
      descripcion: 'Como -r, pero sigue todos los enlaces simbólicos.',
    },
    { nombres: ['-n', '--line-number'], descripcion: 'Antepone a cada línea su número de línea.' },
    {
      nombres: ['-l', '--files-with-matches'],
      descripcion: 'Muestra solo el nombre de los ficheros que tienen alguna coincidencia.',
    },
    { nombres: ['-c', '--count'], descripcion: 'Muestra el número de líneas que coinciden en cada fichero.' },
    {
      nombres: ['-o', '--only-matching'],
      descripcion: 'Muestra solo la parte que coincide, cada una en su propia línea.',
    },
    { nombres: ['-E', '--extended-regexp'], descripcion: 'Interpreta el patrón como expresión regular extendida.' },
    { nombres: ['-F', '--fixed-strings'], descripcion: 'Interpreta el patrón como texto literal, no como expresión regular.' },
    { nombres: ['-w', '--word-regexp'], descripcion: 'Solo coincide con palabras completas.' },
    { nombres: ['-a', '--text'], descripcion: 'Procesa los ficheros binarios como si fueran texto.' },
    {
      nombres: ['-A', '--after-context'],
      descripcion: 'Muestra también N líneas después de cada coincidencia.',
      valor: { nombre: 'N', descripcion: 'Número de líneas.' },
    },
    {
      nombres: ['-B', '--before-context'],
      descripcion: 'Muestra también N líneas antes de cada coincidencia.',
      valor: { nombre: 'N', descripcion: 'Número de líneas.' },
    },
    {
      nombres: ['-C', '--context'],
      descripcion: 'Muestra N líneas de contexto antes y después de cada coincidencia.',
      valor: { nombre: 'N', descripcion: 'Número de líneas.' },
    },
    {
      nombres: ['--color', '--colour'],
      descripcion: 'Resalta en color las coincidencias. Acepta =always, =never o =auto.',
      valor: { nombre: 'cuándo', descripcion: 'always, never o auto.', soloConIgual: true },
    },
    { nombres: ['-H', '--with-filename'], descripcion: 'Muestra el nombre del fichero en cada coincidencia.' },
    {
      nombres: ['-s', '--no-messages'],
      descripcion: 'Oculta los errores de ficheros inexistentes o sin permiso de lectura.',
    },
    {
      nombres: ['-q', '--quiet', '--silent'],
      descripcion: 'No muestra nada; solo devuelve el código de salida (útil en scripts).',
    },
    {
      nombres: ['-e', '--regexp'],
      descripcion: 'Indica el patrón de forma explícita. Se puede repetir para buscar varios.',
      valor: { nombre: 'patrón', descripcion: 'Patrón que se busca.' },
    },
    {
      nombres: ['--include'],
      descripcion: 'Busca solo en los ficheros cuyo nombre coincide con el patrón (con -r).',
      valor: { nombre: 'patrón', descripcion: 'Patrón de nombre, p. ej. "*.php".' },
    },
  ],
};

// ============================================================
// ls, cat, id, whoami (GNU coreutils)
// ============================================================
const ls: Herramienta = {
  nombre: 'ls',
  descripcion: 'Lista el contenido de directorios o información de ficheros.',
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/ls.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: 'Fichero o directorio que se lista. Sin argumentos, el directorio actual.',
  opciones: [
    {
      nombres: ['-a', '--all'],
      descripcion: 'Muestra también las entradas que empiezan por "." (ficheros ocultos).',
    },
    { nombres: ['-A', '--almost-all'], descripcion: 'Como -a, pero sin mostrar "." ni "..".' },
    {
      nombres: ['-l'],
      descripcion: 'Formato largo: permisos, enlaces, propietario, grupo, tamaño, fecha y nombre.',
    },
    {
      nombres: ['-h', '--human-readable'],
      descripcion: 'Con -l o -s, muestra los tamaños en formato legible (1K, 234M, 2G…).',
    },
    { nombres: ['-R', '--recursive'], descripcion: 'Lista también los subdirectorios, de forma recursiva.' },
    { nombres: ['-t'], descripcion: 'Ordena por fecha de modificación, primero lo más reciente.' },
    { nombres: ['-r', '--reverse'], descripcion: 'Invierte el orden.' },
    { nombres: ['-S'], descripcion: 'Ordena por tamaño, primero lo más grande.' },
    {
      nombres: ['-d', '--directory'],
      descripcion: 'Muestra los directorios en sí, no su contenido.',
    },
    { nombres: ['-i', '--inode'], descripcion: 'Muestra el número de inodo de cada fichero.' },
    {
      nombres: ['-n', '--numeric-uid-gid'],
      descripcion: 'Como -l, pero muestra el UID y el GID numéricos.',
    },
    { nombres: ['-1'], descripcion: 'Muestra un fichero por línea.' },
  ],
};

const cat: Herramienta = {
  nombre: 'cat',
  descripcion: 'Concatena ficheros y los muestra por la salida estándar.',
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/cat.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: 'Fichero que se muestra. Sin ficheros, o con "-", lee la entrada estándar.',
  opciones: [
    { nombres: ['-n', '--number'], descripcion: 'Numera todas las líneas de la salida.' },
    {
      nombres: ['-b', '--number-nonblank'],
      descripcion: 'Numera solo las líneas que no están vacías (tiene prioridad sobre -n).',
    },
    { nombres: ['-s', '--squeeze-blank'], descripcion: 'Reduce las líneas vacías consecutivas a una sola.' },
    { nombres: ['-E', '--show-ends'], descripcion: 'Muestra "$" al final de cada línea.' },
    { nombres: ['-T', '--show-tabs'], descripcion: 'Muestra los tabuladores como ^I.' },
    {
      nombres: ['-v', '--show-nonprinting'],
      descripcion: 'Muestra los caracteres no imprimibles con notación ^ y M- (excepto saltos de línea y tabuladores).',
    },
    { nombres: ['-A', '--show-all'], descripcion: 'Equivale a -vET: muestra todos los caracteres ocultos.' },
  ],
};

const id: Herramienta = {
  nombre: 'id',
  descripcion:
    'Muestra el usuario y los grupos (UID, GID y grupos) del proceso actual o del usuario indicado.',
  categoria: 'Información del sistema',
  docs: 'https://man7.org/linux/man-pages/man1/id.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: 'Usuario del que se muestra la información. Sin argumento, el del proceso actual.',
  opciones: [
    { nombres: ['-u', '--user'], descripcion: 'Muestra solo el UID efectivo.' },
    { nombres: ['-g', '--group'], descripcion: 'Muestra solo el GID efectivo.' },
    { nombres: ['-G', '--groups'], descripcion: 'Muestra todos los ID de grupo.' },
    { nombres: ['-n', '--name'], descripcion: 'Con -u, -g o -G, muestra el nombre en lugar del número.' },
    { nombres: ['-r', '--real'], descripcion: 'Con -u, -g o -G, muestra el ID real en lugar del efectivo.' },
  ],
};

const whoami: Herramienta = {
  nombre: 'whoami',
  descripcion: 'Muestra el nombre del usuario efectivo actual. Equivale a "id -un".',
  categoria: 'Información del sistema',
  docs: 'https://man7.org/linux/man-pages/man1/whoami.1.html',
  estilo: 'posix',
  argumentos: null,
  opciones: [
    { nombres: ['--help'], descripcion: 'Muestra la ayuda y sale.' },
    { nombres: ['--version'], descripcion: 'Muestra la versión y sale.' },
  ],
};

// ============================================================
// python3 — https://docs.python.org/3/using/cmdline.html
// ============================================================
const python3: Herramienta = {
  nombre: 'python3',
  descripcion: 'Intérprete de Python 3: ejecuta scripts, código pasado como texto o módulos.',
  categoria: 'Intérpretes',
  docs: 'https://docs.python.org/3/using/cmdline.html',
  estilo: 'posix',
  combinables: false,
  valorPegado: false,
  opcionesHastaArgumento: 1,
  argumentos:
    'Script que se ejecuta (o "-" para leer el código de la entrada estándar). Los argumentos que siguen al script, o a -c/-m, se pasan al programa en sys.argv.',
  opciones: [
    {
      nombres: ['-c'],
      descripcion:
        'Ejecuta el código Python pasado como texto. Lo que venga detrás ya no son opciones del intérprete: se pasa al código en sys.argv.',
      valor: { nombre: 'código', descripcion: 'Código Python; conviene entrecomillarlo.' },
      terminaOpciones: true,
    },
    {
      nombres: ['-m'],
      descripcion:
        'Busca el módulo indicado y lo ejecuta como programa principal (__main__). Lo que venga detrás se pasa al módulo.',
      valor: { nombre: 'módulo', descripcion: 'Nombre del módulo, p. ej. http.server.' },
      terminaOpciones: true,
    },
    { nombres: ['-V', '--version'], descripcion: 'Muestra la versión de Python y sale.' },
    { nombres: ['-q'], descripcion: 'No muestra los mensajes de copyright y versión en modo interactivo.' },
    {
      nombres: ['-u'],
      descripcion: 'Desactiva el búfer de stdout y stderr: la salida se muestra al momento.',
    },
    { nombres: ['-i'], descripcion: 'Entra en modo interactivo después de ejecutar el script o el código.' },
  ],
};

export const HERRAMIENTAS: Herramienta[] = [
  nmap,
  gobuster,
  ffuf,
  curl,
  nc,
  ssh,
  sudo,
  find,
  grep,
  ls,
  cat,
  id,
  whoami,
  python3,
];

// ============================================================
// Operadores de shell (Bash) — https://www.gnu.org/software/bash/manual/
// ============================================================
export const OPERADORES: Operador[] = [
  {
    simbolo: '|',
    nombre: 'tubería (pipe)',
    descripcion:
      'Conecta la salida estándar del comando de la izquierda con la entrada estándar del comando de la derecha.',
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Pipelines.html',
  },
  {
    simbolo: '&&',
    nombre: 'lista AND',
    descripcion: 'Ejecuta el comando de la derecha solo si el de la izquierda termina con éxito (código de salida 0).',
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Lists.html',
  },
  {
    simbolo: ';',
    nombre: 'separador de comandos',
    descripcion:
      'Ejecuta los comandos uno detrás de otro: el shell espera a que termine el primero y luego ejecuta el siguiente, aunque el primero haya fallado.',
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Lists.html',
  },
  {
    simbolo: '>',
    nombre: 'redirección de salida',
    descripcion:
      'Envía la salida estándar a un fichero. Si no existe, lo crea; si existe, borra su contenido antes de escribir.',
    tipo: 'redireccion',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
  {
    simbolo: '>>',
    nombre: 'redirección añadiendo',
    descripcion: 'Envía la salida estándar al final de un fichero sin borrar lo que ya tiene. Si no existe, lo crea.',
    tipo: 'redireccion',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
  {
    simbolo: '2>/dev/null',
    nombre: 'descartar errores',
    descripcion:
      'Redirige la salida de errores (descriptor 2) a /dev/null, un fichero especial que descarta todo lo que recibe. Sirve para ocultar mensajes como los "Permission denied" de find.',
    tipo: 'redireccion-completa',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
];
