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
  descripcion: {
    es: 'Escáner de red: descubre hosts, puertos abiertos, servicios y sus versiones, y el sistema operativo.',
    en: 'Network scanner: finds hosts, open ports, the services behind them and their versions, and the operating system.',
  },
  categoria: 'Escaneo de red',
  docs: 'https://nmap.org/book/man.html',
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Objetivo del escaneo: dirección IP, nombre de host, red en notación CIDR (p. ej. 10.10.10.0/24) o rango (p. ej. 10.0.0-255.1-254).',
    en: 'What to scan: an IP address, a hostname, a network in CIDR notation (e.g. 10.10.10.0/24) or a range (e.g. 10.0.0-255.1-254).',
  },
  opciones: [
    {
      nombres: ['-sS'],
      descripcion: {
        es: 'Escaneo TCP SYN: envía SYN y no completa la conexión. Es el tipo por defecto cuando hay privilegios de root.',
        en: 'TCP SYN scan: sends a SYN and never completes the connection. It is the default scan type when running with root privileges.',
      },
    },
    {
      nombres: ['-sT'],
      descripcion: {
        es: 'Escaneo TCP connect(): completa la conexión usando el sistema operativo. Es el tipo por defecto si no se puede usar -sS (sin privilegios).',
        en: 'TCP connect() scan: completes the connection through the operating system. It is the default type when -sS is not available (no raw packet privileges).',
      },
    },
    { nombres: ['-sU'], descripcion: { es: 'Escaneo de puertos UDP.', en: 'UDP port scan.' } },
    {
      nombres: ['-sC'],
      descripcion: {
        es: 'Ejecuta los scripts NSE de la categoría "default". Equivale a --script=default.',
        en: 'Runs the NSE scripts in the "default" category. Same as --script=default.',
      },
    },
    {
      nombres: ['-sV'],
      descripcion: {
        es: 'Sondea los puertos abiertos para averiguar qué servicio y qué versión hay detrás.',
        en: 'Probes open ports to work out which service and which version is behind them.',
      },
    },
    { nombres: ['-O'], descripcion: { es: 'Intenta detectar el sistema operativo del objetivo.', en: 'Tries to detect the target\'s operating system.' } },
    {
      nombres: ['-A'],
      descripcion: {
        es: 'Modo agresivo: activa detección de sistema operativo, detección de versiones, scripts por defecto y traceroute.',
        en: 'Aggressive mode: turns on OS detection, version detection, the default scripts and traceroute.',
      },
    },
    {
      nombres: ['-Pn'],
      descripcion: {
        es: 'Trata todos los hosts como activos y se salta el descubrimiento de hosts. Útil si el objetivo no responde a ping.',
        en: 'Treats every host as online and skips host discovery. Useful when the target does not answer ping.',
      },
    },
    { nombres: ['-n'], descripcion: { es: 'No hace resolución DNS.', en: 'Never does DNS resolution.' } },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Escanea solo los puertos indicados. Admite listas y rangos, p. ej. 22,80,8000-8100.',
        en: 'Scans only the given ports. Takes lists and ranges, e.g. 22,80,8000-8100.',
      },
      valor: {
        nombre: {
          es: 'puertos',
          en: 'ports',
        },
        descripcion: {
          es: 'Puertos a escanear. Si se omite el inicio o el final de un rango, nmap usa 1 y 65535; por eso "-" escanea del 1 al 65535.',
          en: 'Ports to scan. If the start or the end of a range is left out, nmap uses 1 and 65535; that is why "-" scans from 1 to 65535.',
        },
      },
    },
    {
      nombres: ['-F'],
      descripcion: {
        es: 'Modo rápido: escanea los 100 puertos más comunes en lugar de los 1000 por defecto.',
        en: 'Fast mode: scans the 100 most common ports instead of the default 1000.',
      },
    },
    {
      nombres: ['--top-ports'],
      descripcion: {
        es: 'Escanea los N puertos más comunes según el fichero nmap-services.',
        en: 'Scans the N most common ports according to the nmap-services file.',
      },
      valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Cantidad de puertos más comunes que se escanean.', en: 'How many of the most common ports get scanned.' } },
    },
    {
      nombres: ['-T'],
      descripcion: {
        es: 'Plantilla de temporización de 0 (paranoid) a 5 (insane): cuanto más alta, más rápido. -T4 (aggressive) es habitual en entornos de laboratorio.',
        en: 'Timing template from 0 (paranoid) to 5 (insane): the higher, the faster. -T4 (aggressive) is the usual choice on lab networks.',
      },
      valor: { nombre: { es: '0-5', en: '0-5' }, descripcion: { es: 'Nivel de la plantilla de temporización.', en: 'Timing template level.' } },
    },
    {
      nombres: ['--min-rate'],
      descripcion: {
        es: 'Envía paquetes a una velocidad no inferior a N por segundo.',
        en: 'Sends packets no slower than N per second.',
      },
      valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Paquetes por segundo como mínimo.', en: 'Packets per second, as a minimum.' } },
    },
    {
      nombres: ['-v', '-vv'],
      descripcion: {
        es: 'Aumenta el nivel de detalle de la salida; -vv o más para más detalle.',
        en: 'Increases how much detail the output shows; -vv or more for even more.',
      },
    },
    {
      nombres: ['-oN'],
      descripcion: {
        es: 'Guarda el resultado en formato normal (el mismo que se ve en pantalla).',
        en: 'Saves the result in normal format (the same one shown on screen).',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero donde se guarda la salida.', en: 'File the output is saved to.' } },
    },
    {
      nombres: ['-oX'],
      descripcion: {
        es: 'Guarda el resultado en formato XML.',
        en: 'Saves the result in XML format.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero donde se guarda la salida.', en: 'File the output is saved to.' } },
    },
    {
      nombres: ['-oG'],
      descripcion: {
        es: 'Guarda el resultado en formato "grepable" (una línea por host).',
        en: 'Saves the result in "grepable" format (one line per host).',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero donde se guarda la salida.', en: 'File the output is saved to.' } },
    },
    {
      nombres: ['-oA'],
      descripcion: {
        es: 'Guarda el resultado en los tres formatos principales a la vez (.nmap, .xml y .gnmap).',
        en: 'Saves the result in the three major formats at once (.nmap, .xml and .gnmap).',
      },
      valor: { nombre: { es: 'nombre base', en: 'base name' }, descripcion: { es: 'Nombre base de los ficheros, sin extensión.', en: 'Base name for the files, without extension.' } },
    },
    {
      nombres: ['--script'],
      descripcion: {
        es: 'Ejecuta scripts NSE. Acepta una lista separada por comas de scripts, categorías o directorios.',
        en: 'Runs NSE scripts. Takes a comma-separated list of scripts, categories or directories.',
      },
      valor: { nombre: { es: 'scripts', en: 'scripts' }, descripcion: { es: 'Scripts, categorías o directorios NSE separados por comas.', en: 'NSE scripts, categories or directories, comma-separated.' } },
    },
    { nombres: ['--open'], descripcion: { es: 'Muestra solo los puertos abiertos (o posiblemente abiertos).', en: 'Shows only the open (or possibly open) ports.' } },
    {
      nombres: ['-iL'],
      descripcion: {
        es: 'Lee la lista de objetivos desde un fichero.',
        en: 'Reads the list of targets from a file.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero con un objetivo por línea.', en: 'File with one target per line.' } },
    },
  ],
};

// ============================================================
// gobuster 3.8.2 — opciones sacadas del código fuente (cli/*.go)
// ============================================================
const GOBUSTER_GLOBALES: Opcion[] = [
  {
    nombres: ['-w', '--wordlist'],
    descripcion: {
      es: 'Diccionario (wordlist) que se prueba. Con "-" se lee de la entrada estándar.',
      en: 'Wordlist that gets tried. With "-" it is read from standard input.',
    },
    valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Ruta del diccionario.', en: 'Path of the wordlist.' } },
  },
  {
    nombres: ['-t', '--threads'],
    descripcion: {
      es: 'Número de hilos concurrentes (por defecto, 10).',
      en: 'Number of concurrent threads (10 by default).',
    },
    valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Cantidad de hilos.', en: 'How many threads.' } },
  },
  {
    nombres: ['-d', '--delay'],
    descripcion: {
      es: 'Tiempo que espera cada hilo entre peticiones.',
      en: 'How long each thread waits between requests.',
    },
    valor: { nombre: { es: 'duración', en: 'duration' }, descripcion: { es: 'Duración con unidad, p. ej. 1500ms.', en: 'Duration with a unit, e.g. 1500ms.' } },
  },
  {
    nombres: ['-o', '--output'],
    descripcion: {
      es: 'Guarda los resultados en un fichero (por defecto solo se muestran en pantalla).',
      en: 'Saves the results to a file (by default they are only shown on screen).',
    },
    valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero de salida.', en: 'Output file.' } },
  },
  { nombres: ['-q', '--quiet'], descripcion: { es: 'No muestra el banner ni otra información accesoria.', en: 'Does not show the banner or any other incidental information.' } },
  { nombres: ['-np', '--no-progress'], descripcion: { es: 'No muestra el progreso.', en: 'Does not show the progress.' } },
  { nombres: ['-ne', '--no-error'], descripcion: { es: 'No muestra los errores.', en: 'Does not show the errors.' } },
  { nombres: ['-nc', '--no-color'], descripcion: { es: 'Desactiva los colores en la salida.', en: 'Turns off the colours in the output.' } },
  { nombres: ['--debug'], descripcion: { es: 'Activa la salida de depuración.', en: 'Turns on the debugging output.' } },
];

const GOBUSTER_HTTP: Opcion[] = [
  {
    nombres: ['-u', '--url'],
    descripcion: {
      es: 'URL objetivo (obligatoria).',
      en: 'Target URL (required).',
    },
    valor: { nombre: { es: 'URL', en: 'URL' }, descripcion: { es: 'URL base sobre la que se prueban las palabras del diccionario.', en: 'Base URL the words of the wordlist are tried against.' } },
  },
  {
    nombres: ['-c', '--cookies'],
    descripcion: {
      es: 'Cookies que se envían en las peticiones.',
      en: 'Cookies sent with the requests.',
    },
    valor: { nombre: { es: 'cookies', en: 'cookies' }, descripcion: { es: 'Cookies en formato "nombre=valor".', en: 'Cookies in "name=value" form.' } },
  },
  {
    nombres: ['-U', '--username'],
    descripcion: {
      es: 'Usuario para autenticación HTTP Basic.',
      en: 'User name for HTTP Basic authentication.',
    },
    valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre de usuario.', en: 'User name.' } },
  },
  {
    nombres: ['-P', '--password'],
    descripcion: {
      es: 'Contraseña para autenticación HTTP Basic.',
      en: 'Password for HTTP Basic authentication.',
    },
    valor: { nombre: { es: 'contraseña', en: 'password' }, descripcion: { es: 'Contraseña.', en: 'Password.' } },
  },
  { nombres: ['-r', '--follow-redirect'], descripcion: { es: 'Sigue las redirecciones.', en: 'Follows redirects.' } },
  {
    nombres: ['-H', '--headers'],
    descripcion: {
      es: 'Añade una cabecera HTTP. Se puede repetir.',
      en: 'Adds an HTTP header. It can be repeated.',
    },
    valor: { nombre: { es: 'cabecera', en: 'header' }, descripcion: { es: 'Cabecera en formato "Nombre: valor".', en: 'Header in "Name: value" form.' } },
  },
  {
    nombres: ['-m', '--method'],
    descripcion: {
      es: 'Método HTTP que se usa (por defecto, GET).',
      en: 'HTTP method to use (GET by default).',
    },
    valor: { nombre: { es: 'método', en: 'method' }, descripcion: { es: 'Método HTTP, p. ej. POST.', en: 'HTTP method, e.g. POST.' } },
  },
  {
    nombres: ['-a', '--useragent'],
    descripcion: {
      es: 'Establece la cadena User-Agent.',
      en: 'Sets the User-Agent string.',
    },
    valor: { nombre: { es: 'user-agent', en: 'user-agent' }, descripcion: { es: 'Valor de la cabecera User-Agent.', en: 'Value of the User-Agent header.' } },
  },
  { nombres: ['-rua', '--random-agent'], descripcion: { es: 'Usa un User-Agent aleatorio.', en: 'Uses a random User-Agent.' } },
  {
    nombres: ['--proxy'],
    descripcion: {
      es: 'Proxy para las peticiones.',
      en: 'Proxy for the requests.',
    },
    valor: { nombre: { es: 'proxy', en: 'proxy' }, descripcion: { es: 'http(s)://host:puerto o socks5://host:puerto.', en: 'http(s)://host:port or socks5://host:port.' } },
  },
  {
    nombres: ['-to', '--timeout'],
    descripcion: {
      es: 'Tiempo máximo de espera de cada petición HTTP (por defecto, 10s).',
      en: 'Time limit for each HTTP request (10s by default).',
    },
    valor: { nombre: { es: 'duración', en: 'duration' }, descripcion: { es: 'Duración con unidad, p. ej. 10s.', en: 'Duration with a unit, e.g. 10s.' } },
  },
  {
    nombres: ['-k', '--no-tls-validation'],
    descripcion: {
      es: 'No verifica el certificado TLS (útil con certificados autofirmados).',
      en: 'Does not verify the TLS certificate (handy with self-signed ones).',
    },
  },
];

const gobuster: Herramienta = {
  nombre: 'gobuster',
  descripcion: {
    es: 'Herramienta de fuerza bruta con diccionario para descubrir rutas web, subdominios DNS y virtual hosts, entre otros.',
    en: 'Wordlist brute-force tool for discovering web paths, DNS subdomains and virtual hosts, among others.',
  },
  categoria: 'Enumeración web',
  docs: 'https://github.com/OJ/gobuster',
  variantes: {
    es: 'Opciones verificadas en el código de gobuster 3.8.2. A partir de la 3.7 cambió la librería de línea de comandos, por lo que algunas opciones cortas no existen en versiones anteriores.',
    en: 'Options checked against the source of gobuster 3.8.2. From 3.7 on it changed its command-line library, so some short options do not exist in earlier versions.',
  },
  estilo: 'go',
  argumentos: null,
  opciones: [],
  subcomandos: [
    {
      nombre: 'dir',
      descripcion: {
        es: 'Modo de enumeración de directorios y ficheros en un servidor web.',
        en: 'Mode for enumerating directories and files on a web server.',
      },
      opciones: [
        ...GOBUSTER_HTTP,
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-s', '--status-codes'],
          descripcion: {
            es: 'Códigos de estado que se consideran resultado positivo. Admite rangos, p. ej. 200,300-400.',
            en: 'Status codes treated as a hit. It takes ranges, e.g. 200,300-400.',
          },
          valor: { nombre: { es: 'códigos', en: 'codes' }, descripcion: { es: 'Lista de códigos o rangos separados por comas.', en: 'List of codes or ranges, comma-separated.' } },
        },
        {
          nombres: ['-b', '--status-codes-blacklist'],
          descripcion: {
            es: 'Códigos de estado que se descartan (por defecto, 404). Si se indica, tiene prioridad sobre -s.',
            en: 'Status codes that get discarded (404 by default). If it is given, it takes precedence over -s.',
          },
          valor: { nombre: { es: 'códigos', en: 'codes' }, descripcion: { es: 'Lista de códigos o rangos separados por comas.', en: 'List of codes or ranges, comma-separated.' } },
        },
        {
          nombres: ['-x', '--extensions'],
          descripcion: {
            es: 'Extensiones de fichero que se añaden a cada palabra, p. ej. php,txt.',
            en: 'File extensions added to each word, e.g. php,txt.',
          },
          valor: { nombre: { es: 'extensiones', en: 'extensions' }, descripcion: { es: 'Extensiones separadas por comas.', en: 'Comma-separated extensions.' } },
        },
        {
          nombres: ['-X', '--extensions-file'],
          descripcion: {
            es: 'Lee las extensiones desde un fichero.',
            en: 'Reads the extensions from a file.',
          },
          valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero con extensiones.', en: 'File with extensions.' } },
        },
        { nombres: ['-e', '--expanded'], descripcion: { es: 'Modo expandido: muestra las URL completas.', en: 'Expanded mode: shows the full URLs.' } },
        { nombres: ['-n', '--no-status'], descripcion: { es: 'No muestra los códigos de estado.', en: 'Does not show the status codes.' } },
        { nombres: ['-f', '--add-slash'], descripcion: { es: 'Añade "/" al final de cada petición.', en: 'Adds a "/" to the end of each request.' } },
        {
          nombres: ['-db', '--discover-backup'],
          descripcion: {
            es: 'Al encontrar un fichero, busca copias de seguridad añadiendo extensiones típicas.',
            en: 'When it finds a file, looks for backups by adding typical extensions.',
          },
        },
        {
          nombres: ['-xl', '--exclude-length'],
          descripcion: {
            es: 'Descarta respuestas con estas longitudes de contenido, sin importar el código de estado.',
            en: 'Discards responses with these content lengths, whatever the status code.',
          },
          valor: { nombre: { es: 'longitudes', en: 'lengths' }, descripcion: { es: 'Longitudes o rangos separados por comas, p. ej. 203-206.', en: 'Lengths or ranges, comma-separated, e.g. 203-206.' } },
        },
      ],
    },
    {
      nombre: 'dns',
      descripcion: {
        es: 'Modo de enumeración de subdominios por DNS.',
        en: 'Mode for enumerating subdomains over DNS.',
      },
      opciones: [
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-do', '--domain'],
          descripcion: {
            es: 'Dominio objetivo (obligatorio).',
            en: 'Target domain (required).',
          },
          valor: { nombre: { es: 'dominio', en: 'domain' }, descripcion: { es: 'Dominio al que se añaden las palabras como subdominios.', en: 'Domain the words get added to as subdomains.' } },
        },
        { nombres: ['-c', '--check-cname'], descripcion: { es: 'Comprueba también los registros CNAME.', en: 'Also checks the CNAME records.' } },
        {
          nombres: ['-to', '--timeout'],
          descripcion: {
            es: 'Tiempo máximo de espera del resolvedor DNS (por defecto, 1s).',
            en: 'Time limit for the DNS resolver (1s by default).',
          },
          valor: { nombre: { es: 'duración', en: 'duration' }, descripcion: { es: 'Duración con unidad, p. ej. 1s.', en: 'Duration with a unit, e.g. 1s.' } },
        },
        {
          nombres: ['-wc', '--wildcard'],
          descripcion: {
            es: 'Continúa aunque se detecte un DNS comodín (wildcard).',
            en: 'Carries on even when a wildcard DNS is detected.',
          },
        },
        {
          nombres: ['--resolver'],
          descripcion: {
            es: 'Servidor DNS personalizado.',
            en: 'Custom DNS server.',
          },
          valor: { nombre: { es: 'servidor', en: 'server' }, descripcion: { es: 'servidor o servidor:puerto.', en: 'server or server:port.' } },
        },
      ],
    },
    {
      nombre: 'vhost',
      descripcion: {
        es: 'Modo de enumeración de virtual hosts: prueba nombres de host distintos contra el mismo servidor.',
        en: 'Mode for enumerating virtual hosts: it tries different host names against the same server.',
      },
      opciones: [
        ...GOBUSTER_HTTP,
        ...GOBUSTER_GLOBALES,
        {
          nombres: ['-ad', '--append-domain'],
          descripcion: {
            es: 'Añade el dominio principal de la URL a cada palabra. Sin esta opción, el diccionario debe contener nombres completos.',
            en: 'Adds the main domain of the URL to each word. Without this option, the wordlist must hold full names.',
          },
        },
        {
          nombres: ['-do', '--domain'],
          descripcion: {
            es: 'Dominio que se añade cuando la URL es una dirección IP.',
            en: 'Domain added when the URL is an IP address.',
          },
          valor: { nombre: { es: 'dominio', en: 'domain' }, descripcion: { es: 'Dominio base de los virtual hosts.', en: 'Base domain of the virtual hosts.' } },
        },
        {
          nombres: ['-xl', '--exclude-length'],
          descripcion: {
            es: 'Descarta respuestas con estas longitudes de contenido.',
            en: 'Discards responses with these content lengths.',
          },
          valor: { nombre: { es: 'longitudes', en: 'lengths' }, descripcion: { es: 'Longitudes o rangos separados por comas.', en: 'Lengths or ranges, comma-separated.' } },
        },
        {
          nombres: ['-xs', '--exclude-status'],
          descripcion: {
            es: 'Descarta respuestas con estos códigos de estado.',
            en: 'Discards responses with these status codes.',
          },
          valor: { nombre: { es: 'códigos', en: 'codes' }, descripcion: { es: 'Códigos o rangos separados por comas.', en: 'Codes or ranges, comma-separated.' } },
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
  descripcion: {
    es: 'Fuzzer web: sustituye la palabra clave FUZZ de la URL, las cabeceras o los datos por cada entrada de un diccionario.',
    en: 'Web fuzzer: it replaces the FUZZ keyword in the URL, the headers or the data with each entry of a wordlist.',
  },
  categoria: 'Enumeración web',
  docs: 'https://github.com/ffuf/ffuf',
  estilo: 'go',
  argumentos: null,
  opciones: [
    {
      nombres: ['-u'],
      descripcion: {
        es: 'URL objetivo. Debe contener la palabra clave (FUZZ) donde se sustituyen las entradas.',
        en: 'Target URL. It must hold the keyword (FUZZ) where the entries get substituted.',
      },
      valor: { nombre: { es: 'URL', en: 'URL' }, descripcion: { es: 'URL con la palabra clave FUZZ.', en: 'URL with the FUZZ keyword.' } },
    },
    {
      nombres: ['-w'],
      descripcion: {
        es: 'Diccionario y, opcionalmente, su palabra clave separada por dos puntos (/ruta/lista:CLAVE). Sin clave se usa FUZZ.',
        en: 'Wordlist and, optionally, its keyword after a colon (/path/list:KEYWORD). With no keyword, FUZZ is used.',
      },
      valor: { nombre: { es: 'fichero[:CLAVE]', en: 'file[:KEYWORD]' }, descripcion: { es: 'Ruta del diccionario, con palabra clave opcional.', en: 'Path of the wordlist, with an optional keyword.' } },
    },
    {
      nombres: ['-H'],
      descripcion: {
        es: 'Añade una cabecera "Nombre: valor". Se puede repetir.',
        en: 'Adds a "Name: value" header. It can be repeated.',
      },
      valor: { nombre: { es: 'cabecera', en: 'header' }, descripcion: { es: 'Cabecera en formato "Nombre: valor".', en: 'Header in "Name: value" form.' } },
    },
    {
      nombres: ['-X'],
      descripcion: {
        es: 'Método HTTP que se usa.',
        en: 'HTTP method to use.',
      },
      valor: { nombre: { es: 'método', en: 'method' }, descripcion: { es: 'Método HTTP, p. ej. POST.', en: 'HTTP method, e.g. POST.' } },
    },
    {
      nombres: ['-d'],
      descripcion: {
        es: 'Datos que se envían en el cuerpo de la petición (POST).',
        en: 'Data sent in the body of the request (POST).',
      },
      valor: { nombre: { es: 'datos', en: 'data' }, descripcion: { es: 'Cuerpo de la petición.', en: 'Body of the request.' } },
    },
    {
      nombres: ['-b'],
      descripcion: {
        es: 'Cookies que se envían, p. ej. "NOMBRE1=VALOR1; NOMBRE2=VALOR2".',
        en: 'Cookies that get sent, e.g. "NAME1=VALUE1; NAME2=VALUE2".',
      },
      valor: { nombre: { es: 'cookies', en: 'cookies' }, descripcion: { es: 'Cookies separadas por punto y coma.', en: 'Semicolon-separated cookies.' } },
    },
    {
      nombres: ['-mc'],
      descripcion: {
        es: 'Muestra solo respuestas con estos códigos de estado, o "all" para todos (por defecto: 200-299,301,302,307,401,403,405,500).',
        en: 'Shows only responses with these status codes, or "all" for every one (default: 200-299,301,302,307,401,403,405,500).',
      },
      valor: { nombre: { es: 'códigos', en: 'codes' }, descripcion: { es: 'Códigos o rangos separados por comas, o "all".', en: 'Codes or ranges, comma-separated, or "all".' } },
    },
    {
      nombres: ['-fc'],
      descripcion: {
        es: 'Filtra (oculta) respuestas con estos códigos de estado.',
        en: 'Filters out (hides) responses with these status codes.',
      },
      valor: { nombre: { es: 'códigos', en: 'codes' }, descripcion: { es: 'Códigos o rangos separados por comas.', en: 'Codes or ranges, comma-separated.' } },
    },
    {
      nombres: ['-fs'],
      descripcion: {
        es: 'Filtra respuestas con este tamaño.',
        en: 'Filters out responses of this size.',
      },
      valor: { nombre: { es: 'tamaños', en: 'sizes' }, descripcion: { es: 'Tamaños o rangos separados por comas.', en: 'Sizes or ranges, comma-separated.' } },
    },
    {
      nombres: ['-fw'],
      descripcion: {
        es: 'Filtra respuestas con este número de palabras.',
        en: 'Filters out responses with this number of words.',
      },
      valor: { nombre: { es: 'palabras', en: 'words' }, descripcion: { es: 'Cantidades o rangos separados por comas.', en: 'Amounts or ranges, comma-separated.' } },
    },
    {
      nombres: ['-fl'],
      descripcion: {
        es: 'Filtra respuestas con este número de líneas.',
        en: 'Filters out responses with this number of lines.',
      },
      valor: { nombre: { es: 'líneas', en: 'lines' }, descripcion: { es: 'Cantidades o rangos separados por comas.', en: 'Amounts or ranges, comma-separated.' } },
    },
    { nombres: ['-ac'], descripcion: { es: 'Calibra automáticamente los filtros para descartar respuestas "falsas".', en: 'Calibrates the filters automatically to discard "false" responses.' } },
    {
      nombres: ['-t'],
      descripcion: {
        es: 'Número de hilos concurrentes (por defecto, 40).',
        en: 'Number of concurrent threads (40 by default).',
      },
      valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Cantidad de hilos.', en: 'How many threads.' } },
    },
    {
      nombres: ['-o'],
      descripcion: {
        es: 'Guarda la salida en un fichero.',
        en: 'Saves the output to a file.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero de salida.', en: 'Output file.' } },
    },
    {
      nombres: ['-of'],
      descripcion: {
        es: 'Formato del fichero de salida: json, ejson, html, md, csv, ecsv o all (por defecto, json).',
        en: 'Format of the output file: json, ejson, html, md, csv, ecsv or all (json by default).',
      },
      valor: { nombre: { es: 'formato', en: 'format' }, descripcion: { es: 'Formato de salida.', en: 'Output format.' } },
    },
    {
      nombres: ['-recursion'],
      descripcion: {
        es: 'Escaneo recursivo. Solo admite la clave FUZZ y la URL (-u) debe terminar en ella.',
        en: 'Recursive scan. It only takes the FUZZ keyword, and the URL (-u) must end in it.',
      },
    },
    {
      nombres: ['-e'],
      descripcion: {
        es: 'Lista de extensiones separadas por comas que se añaden a la palabra clave FUZZ.',
        en: 'Comma-separated list of extensions that get added to the FUZZ keyword.',
      },
      valor: { nombre: { es: 'extensiones', en: 'extensions' }, descripcion: { es: 'Extensiones separadas por comas, p. ej. .php,.txt.', en: 'Comma-separated extensions, e.g. .php,.txt.' } },
    },
    {
      nombres: ['-x'],
      descripcion: {
        es: 'Proxy HTTP o SOCKS5, p. ej. http://127.0.0.1:8080.',
        en: 'HTTP or SOCKS5 proxy, e.g. http://127.0.0.1:8080.',
      },
      valor: { nombre: { es: 'proxy', en: 'proxy' }, descripcion: { es: 'URL del proxy.', en: 'Proxy URL.' } },
    },
    { nombres: ['-ic'], descripcion: { es: 'Ignora los comentarios del diccionario.', en: 'Ignores the comments in the wordlist.' } },
    { nombres: ['-c'], descripcion: { es: 'Colorea la salida.', en: 'Colours the output.' } },
    {
      nombres: ['-v'],
      descripcion: {
        es: 'Salida detallada: muestra la URL completa y, si la hay, la redirección de cada resultado.',
        en: 'Verbose output: it shows the full URL and, if there is one, the redirect of each hit.',
      },
    },
    { nombres: ['-s'], descripcion: { es: 'Modo silencioso: no muestra información adicional.', en: 'Silent mode: it shows no extra information.' } },
  ],
};

// ============================================================
// dirb 2.22 — https://manpages.ubuntu.com/manpages/noble/man1/dirb.1.html
// Comprobado con la página man y el README del paquete dirb 2.22+dfsg-5build2 de Ubuntu.
// ============================================================
const dirb: Herramienta = {
  nombre: 'dirb',
  descripcion: {
    es: 'Escáner de contenido web: busca objetos web existentes u ocultos (directorios y ficheros) probando las palabras de un diccionario contra el servidor y analizando las respuestas. No sigue los enlaces de las páginas ni busca vulnerabilidades.',
    en: 'Web content scanner: it looks for existing or hidden web objects (directories and files) by trying the words of a wordlist against the server and reading the responses. It does not follow the links on the pages nor look for vulnerabilities.',
  },
  categoria: 'Enumeración web',
  docs: 'https://manpages.ubuntu.com/manpages/noble/man1/dirb.1.html',
  variantes: {
    es: 'Explicaciones según dirb 2.22, la versión que trae Pwnbox.',
    en: 'Explanations follow dirb 2.22, the version Pwnbox ships.',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'URL base que se analiza (también puede ser un subdirectorio, o una URL HTTPS) y, opcionalmente, uno o varios diccionarios separados por comas, con una palabra por línea.',
    en: 'Base URL that gets scanned (it can also be a subdirectory, or an HTTPS URL) and, optionally, one or more comma-separated wordlists with one word per line.',
  },
  opciones: [
    {
      nombres: ['-a'],
      descripcion: {
        es: 'User-Agent personalizado para las peticiones.',
        en: 'Custom User-Agent for the requests.',
      },
      valor: { nombre: { es: 'user-agent', en: 'user-agent' }, descripcion: { es: 'Valor de la cabecera User-Agent.', en: 'Value of the User-Agent header.' } },
    },
    {
      nombres: ['-c'],
      descripcion: {
        es: 'Cookie que se envía en las peticiones HTTP.',
        en: 'Cookie sent with the HTTP requests.',
      },
      valor: { nombre: { es: 'cookie', en: 'cookie' }, descripcion: { es: 'Cookie en formato "nombre=valor".', en: 'Cookie in "name=value" form.' } },
    },
    {
      nombres: ['-H'],
      descripcion: {
        es: 'Añade una cabecera personalizada a las peticiones HTTP.',
        en: 'Adds a custom header to the HTTP requests.',
      },
      valor: { nombre: { es: 'cabecera', en: 'header' }, descripcion: { es: 'Cabecera en formato "Nombre: valor".', en: 'Header in "Name: value" form.' } },
    },
    { nombres: ['-i'], descripcion: { es: 'Búsqueda sin distinguir mayúsculas y minúsculas.', en: 'Case-insensitive search.' } },
    {
      nombres: ['-N'],
      descripcion: {
        es: 'Ignora las respuestas con este código HTTP.',
        en: 'Ignores the responses with this HTTP code.',
      },
      valor: { nombre: { es: 'código', en: 'code' }, descripcion: { es: 'Código de estado HTTP que se descarta.', en: 'HTTP status code that gets discarded.' } },
    },
    {
      nombres: ['-o'],
      descripcion: {
        es: 'Guarda la salida en un fichero.',
        en: 'Saves the output to a file.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero de salida.', en: 'Output file.' } },
    },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Envía las peticiones a través de un proxy (puerto por defecto, 1080).',
        en: 'Sends the requests through a proxy (default port, 1080).',
      },
      valor: { nombre: { es: 'proxy[:puerto]', en: 'proxy[:port]' }, descripcion: { es: 'Proxy y, opcionalmente, su puerto.', en: 'Proxy and, optionally, its port.' } },
    },
    { nombres: ['-r'], descripcion: { es: 'No busca de forma recursiva dentro de los directorios que encuentra.', en: 'Does not search recursively inside the directories it finds.' } },
    { nombres: ['-R'], descripcion: { es: 'Recursión interactiva: pregunta en qué directorios encontrados quieres seguir.', en: 'Interactive recursion: it asks which of the directories found you want to go on with.' } },
    { nombres: ['-S'], descripcion: { es: 'Modo silencioso: no muestra las palabras que va probando.', en: 'Silent mode: it does not show the words it is trying.' } },
    {
      nombres: ['-u'],
      descripcion: {
        es: 'Usuario y contraseña para autenticarse en el servidor.',
        en: 'User name and password to authenticate with the server.',
      },
      valor: { nombre: { es: 'usuario:contraseña', en: 'user:password' }, descripcion: { es: 'Credenciales en formato usuario:contraseña.', en: 'Credentials in user:password form.' } },
    },
    { nombres: ['-v'], descripcion: { es: 'Muestra también las páginas que no existen.', en: 'Also shows the pages that do not exist.' } },
    { nombres: ['-w'], descripcion: { es: 'No se detiene con los mensajes de aviso (WARNING).', en: 'Does not stop on WARNING messages.' } },
    {
      nombres: ['-x'],
      descripcion: {
        es: 'Amplía la búsqueda con las extensiones que contiene un fichero.',
        en: 'Widens the search with the extensions held in a file.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero con las extensiones.', en: 'File with the extensions.' } },
    },
    {
      nombres: ['-X'],
      descripcion: {
        es: 'Amplía la búsqueda añadiendo a cada palabra estas extensiones, p. ej. .php,.html.',
        en: 'Widens the search by adding these extensions to each word, e.g. .php,.html.',
      },
      valor: { nombre: { es: 'extensiones', en: 'extensions' }, descripcion: { es: 'Extensiones separadas por comas.', en: 'Comma-separated extensions.' } },
    },
  ],
};

// ============================================================
// curl — https://curl.se/docs/manpage.html
// ============================================================
const curl: Herramienta = {
  nombre: 'curl',
  descripcion: {
    es: 'Transfiere datos desde o hacia un servidor usando URL (HTTP, HTTPS, FTP y otros protocolos).',
    en: 'Transfers data from or to a server using URLs (HTTP, HTTPS, FTP and other protocols).',
  },
  categoria: 'HTTP',
  docs: 'https://curl.se/docs/manpage.html',
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'URL a la que se hace la petición.',
    en: 'URL the request is made to.',
  },
  opciones: [
    {
      nombres: ['-X', '--request'],
      descripcion: {
        es: 'Usa un método HTTP personalizado en lugar del que curl usaría por defecto (GET, o POST con -d).',
        en: 'Uses a custom HTTP method instead of the one curl would use by default (GET, or POST with -d).',
      },
      valor: { nombre: { es: 'método', en: 'method' }, descripcion: { es: 'Método HTTP, p. ej. PUT o DELETE.', en: 'HTTP method, e.g. PUT or DELETE.' } },
    },
    {
      nombres: ['-d', '--data'],
      descripcion: {
        es: 'Envía datos por POST con Content-Type application/x-www-form-urlencoded. Si el valor empieza por @, lee los datos de ese fichero.',
        en: 'Sends data over POST with Content-Type application/x-www-form-urlencoded. If the value starts with @, the data is read from that file.',
      },
      valor: { nombre: { es: 'datos', en: 'data' }, descripcion: { es: 'Datos que se envían, p. ej. "user=admin&pass=1234".', en: 'Data that gets sent, e.g. "user=admin&pass=1234".' } },
    },
    {
      nombres: ['--data-urlencode'],
      descripcion: {
        es: 'Como -d, pero codifica los datos para URL (URL-encoding).',
        en: 'Like -d, but URL-encodes the data.',
      },
      valor: { nombre: { es: 'datos', en: 'data' }, descripcion: { es: 'Datos que se codifican y envían.', en: 'Data that gets encoded and sent.' } },
    },
    {
      nombres: ['-F', '--form'],
      descripcion: {
        es: 'Simula el envío de un formulario con multipart/form-data. Con @ se sube un fichero.',
        en: 'Mimics sending a form with multipart/form-data. With @ it uploads a file.',
      },
      valor: { nombre: { es: 'campo=valor', en: 'field=value' }, descripcion: { es: 'Campo del formulario, p. ej. "file=@shell.php".', en: 'Form field, e.g. "file=@shell.php".' } },
    },
    {
      nombres: ['-H', '--header'],
      descripcion: {
        es: 'Añade una cabecera a la petición HTTP.',
        en: 'Adds a header to the HTTP request.',
      },
      valor: { nombre: { es: 'cabecera', en: 'header' }, descripcion: { es: 'Cabecera en formato "Nombre: valor".', en: 'Header in "Name: value" form.' } },
    },
    { nombres: ['-s', '--silent'], descripcion: { es: 'Modo silencioso: no muestra la barra de progreso ni los errores.', en: 'Silent mode: it shows neither the progress bar nor the errors.' } },
    { nombres: ['-S', '--show-error'], descripcion: { es: 'Con -s, muestra igualmente los mensajes de error.', en: 'With -s, shows the error messages anyway.' } },
    {
      nombres: ['-i', '--show-headers', '--include'],
      descripcion: {
        es: 'Incluye las cabeceras de la respuesta en la salida. --include es el nombre anterior de esta opción.',
        en: 'Includes the response headers in the output. --include is this option\'s former name.',
      },
    },
    { nombres: ['-I', '--head'], descripcion: { es: 'Pide solo las cabeceras (método HEAD).', en: 'Asks for the headers only (HEAD method).' } },
    {
      nombres: ['-k', '--insecure'],
      descripcion: {
        es: 'No verifica el certificado TLS del servidor (útil con certificados autofirmados).',
        en: 'Does not verify the server\'s TLS certificate (handy with self-signed ones).',
      },
    },
    { nombres: ['-L', '--location'], descripcion: { es: 'Sigue las redirecciones HTTP.', en: 'Follows HTTP redirects.' } },
    {
      nombres: ['-o', '--output'],
      descripcion: {
        es: 'Guarda la respuesta en un fichero en lugar de mostrarla.',
        en: 'Saves the response to a file instead of showing it.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero de destino.', en: 'Target file.' } },
    },
    { nombres: ['-O', '--remote-name'], descripcion: { es: 'Guarda la respuesta con el nombre del fichero remoto.', en: 'Saves the response under the remote file name.' } },
    { nombres: ['-v', '--verbose'], descripcion: { es: 'Modo detallado: muestra la petición y la respuesta, útil para depurar.', en: 'Verbose mode: shows the request and the response, useful for debugging.' } },
    {
      nombres: ['-u', '--user'],
      descripcion: {
        es: 'Usuario y contraseña para autenticarse en el servidor.',
        en: 'User name and password to authenticate with the server.',
      },
      valor: { nombre: { es: 'usuario:contraseña', en: 'user:password' }, descripcion: { es: 'Credenciales en formato usuario:contraseña.', en: 'Credentials in user:password form.' } },
    },
    {
      nombres: ['-b', '--cookie'],
      descripcion: {
        es: 'Envía cookies, o las lee de un fichero si el valor no contiene "=".',
        en: 'Sends cookies, or reads them from a file if the value has no "=" in it.',
      },
      valor: { nombre: { es: 'cookies', en: 'cookies' }, descripcion: { es: 'Cookies "NOMBRE=VALOR" o fichero de cookies.', en: '"NAME=VALUE" cookies or a cookie file.' } },
    },
    {
      nombres: ['-A', '--user-agent'],
      descripcion: {
        es: 'Establece la cabecera User-Agent.',
        en: 'Sets the User-Agent header.',
      },
      valor: { nombre: { es: 'user-agent', en: 'user-agent' }, descripcion: { es: 'Valor de User-Agent.', en: 'User-Agent value.' } },
    },
    {
      nombres: ['-x', '--proxy'],
      descripcion: {
        es: 'Envía las peticiones a través de un proxy.',
        en: 'Sends the requests through a proxy.',
      },
      valor: { nombre: { es: 'proxy', en: 'proxy' }, descripcion: { es: 'URL del proxy, p. ej. http://127.0.0.1:8080.', en: 'Proxy URL, e.g. http://127.0.0.1:8080.' } },
    },
  ],
};

// ============================================================
// nc (netcat) — tres variantes con opciones distintas
// ============================================================
const nc: Herramienta = {
  nombre: 'nc',
  descripcion: {
    es: 'Netcat: lee y escribe datos a través de conexiones TCP o UDP. Se usa para escuchar conexiones (p. ej. reverse shells), conectarse a puertos o escanearlos.',
    en: 'Netcat: reads and writes data over TCP or UDP connections. It is used to listen for connections (reverse shells, for instance), to connect to ports or to scan them.',
  },
  categoria: 'Conexiones',
  docs: 'https://man.openbsd.org/nc.1',
  docsVariantes: [
    {
      nombre: 'netcat-traditional',
      url: 'https://manpages.debian.org/unstable/netcat-traditional/nc.traditional.1.en.html',
    },
    { nombre: 'ncat (Nmap)', url: 'https://nmap.org/book/ncat-man.html' },
  ],
  variantes: {
    es: 'El comando "nc" puede ser netcat-traditional, netcat de OpenBSD o ncat de Nmap, según el sistema. Opciones como -p, -e o -c cambian de significado entre ellas: comprueba cuál tienes con "nc -h".',
    en: 'The "nc" command may be netcat-traditional, OpenBSD netcat or Nmap ncat, depending on the system. Options such as -p, -e or -c mean different things in each: check which one you have with "nc -h".',
  },
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Host y puerto de destino. En modo escucha, OpenBSD y ncat reciben aquí el puerto en el que escuchar; netcat-traditional lo toma de -p.',
    en: 'Target host and port. In listen mode, OpenBSD and ncat take the port to listen on here; netcat-traditional takes it from -p.',
  },
  opciones: [
    { nombres: ['-l'], descripcion: { es: 'Modo escucha: espera una conexión entrante en lugar de conectarse a un host.', en: 'Listen mode: waits for an incoming connection instead of connecting to a host.' } },
    { nombres: ['-v'], descripcion: { es: 'Salida detallada. Repetida (-vv) da más detalle.', en: 'Verbose output. Repeated (-vv) it gives more detail.' } },
    { nombres: ['-n'], descripcion: { es: 'No resuelve nombres por DNS: trabaja solo con direcciones IP.', en: 'Does not resolve names over DNS: works with IP addresses only.' } },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Depende de la variante. netcat-traditional: puerto local (con -l, el puerto en el que escucha). OpenBSD: puerto de origen, y su man indica que no se puede combinar con -l. ncat: puerto de origen (--source-port).',
        en: 'Depends on the variant. netcat-traditional: local port (with -l, the port it listens on). OpenBSD: source port, and its manual says it cannot be combined with -l. ncat: source port (--source-port).',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: 'Número de puerto.', en: 'Port number.' } },
    },
    {
      nombres: ['-e'],
      descripcion: {
        es: 'Depende de la variante. netcat-traditional y ncat: ejecuta el programa indicado tras conectar y le redirige la conexión. OpenBSD: no ejecuta nada; indica el nombre que debe tener el certificado TLS (requiere -c).',
        en: 'Depends on the variant. netcat-traditional and ncat: runs the given program after connecting and hands the connection over to it. OpenBSD: runs nothing; it gives the name the TLS certificate must have (needs -c).',
      },
      valor: { nombre: { es: 'programa', en: 'program' }, descripcion: { es: 'Programa que se ejecuta, p. ej. /bin/bash.', en: 'Program that gets run, e.g. /bin/bash.' } },
    },
    {
      nombres: ['-c'],
      descripcion: {
        es: 'Depende de la variante. netcat-traditional: ejecuta comandos de shell tras conectar (lleva valor). ncat: igual, mediante /bin/sh (--sh-exec). OpenBSD: activa TLS y no lleva valor.',
        en: 'Depends on the variant. netcat-traditional: runs shell commands after connecting (takes a value). ncat: the same, through /bin/sh (--sh-exec). OpenBSD: turns on TLS and takes no value.',
      },
      valor: { nombre: { es: 'comandos', en: 'commands' }, descripcion: { es: 'Comandos de shell que se ejecutan.', en: 'Shell commands that get run.' } },
    },
    { nombres: ['-u'], descripcion: { es: 'Usa UDP en lugar de TCP.', en: 'Uses UDP instead of TCP.' } },
    {
      nombres: ['-z'],
      descripcion: {
        es: 'Modo sin E/S: solo comprueba si los puertos están a la escucha, sin enviar datos (escaneo).',
        en: 'No-I/O mode: only checks whether the ports are listening, without sending any data (scanning).',
      },
    },
    {
      nombres: ['-w'],
      descripcion: {
        es: 'Tiempo de espera en segundos para establecer la conexión (y, según la variante, de inactividad).',
        en: 'How long to wait, in seconds, for the connection to be set up (and, depending on the variant, for it to go idle).',
      },
      valor: { nombre: { es: 'segundos', en: 'seconds' }, descripcion: { es: 'Segundos de espera.', en: 'Seconds to wait.' } },
    },
    {
      nombres: ['-k'],
      descripcion: {
        es: 'Tras cerrar una conexión, sigue escuchando para aceptar otra (con -l). Existe en OpenBSD y ncat, no en netcat-traditional.',
        en: 'After a connection is closed, keeps listening to accept another one (with -l). OpenBSD and ncat have it, netcat-traditional does not.',
      },
    },
  ],
};

// ============================================================
// ssh (OpenSSH) — https://man.openbsd.org/ssh.1
// ============================================================
const ssh: Herramienta = {
  nombre: 'ssh',
  descripcion: {
    es: 'Cliente de OpenSSH: inicia una sesión cifrada en un equipo remoto o ejecuta un comando en él.',
    en: 'OpenSSH client: starts an encrypted session on a remote machine or runs a command on it.',
  },
  categoria: 'Conexiones',
  docs: 'https://man.openbsd.org/ssh.1',
  estilo: 'posix',
  combinables: true,
  opcionesHastaArgumento: 2,
  argumentos: {
    es: 'Destino ([usuario@]host o ssh://[usuario@]host[:puerto]). Si después se escribe un comando, se ejecuta en el host remoto en lugar de abrir una shell.',
    en: 'Destination ([user@]host or ssh://[user@]host[:port]). If a command is written after it, it runs on the remote host instead of opening a shell.',
  },
  opciones: [
    {
      nombres: ['-i'],
      descripcion: {
        es: 'Fichero de la clave privada que se usa para autenticarse con clave pública.',
        en: 'File holding the private key used for public key authentication.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Ruta de la clave privada, p. ej. id_rsa.', en: 'Path of the private key, e.g. id_rsa.' } },
    },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Puerto del host remoto al que se conecta.',
        en: 'Port on the remote host to connect to.',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: 'Número de puerto (por defecto, 22).', en: 'Port number (22 by default).' } },
    },
    {
      nombres: ['-l'],
      descripcion: {
        es: 'Usuario con el que se inicia sesión en el equipo remoto.',
        en: 'User to log in as on the remote machine.',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre de usuario remoto.', en: 'Remote user name.' } },
    },
    {
      nombres: ['-L'],
      descripcion: {
        es: 'Reenvío de puerto local: las conexiones a un puerto de tu equipo se reenvían, a través del servidor SSH, al host y puerto indicados.',
        en: 'Local port forwarding: connections to a port on your machine are forwarded, through the SSH server, to the given host and port.',
      },
      valor: {
        nombre: {
          es: 'reenvío',
          en: 'forwarding',
        },
        descripcion: {
          es: '[dirección:]puerto_local:host_destino:puerto_destino.',
          en: '[address:]local_port:target_host:target_port.',
        },
      },
    },
    {
      nombres: ['-R'],
      descripcion: {
        es: 'Reenvío de puerto remoto: las conexiones a un puerto del servidor remoto se reenvían hacia tu lado.',
        en: 'Remote port forwarding: connections to a port on the remote server are forwarded back to your side.',
      },
      valor: {
        nombre: {
          es: 'reenvío',
          en: 'forwarding',
        },
        descripcion: {
          es: '[dirección:]puerto_remoto:host_destino:puerto_destino.',
          en: '[address:]remote_port:target_host:target_port.',
        },
      },
    },
    {
      nombres: ['-D'],
      descripcion: {
        es: 'Reenvío dinámico de puertos: abre un proxy SOCKS en el puerto local indicado.',
        en: 'Dynamic port forwarding: opens a SOCKS proxy on the given local port.',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: '[dirección:]puerto local del proxy SOCKS.', en: '[address:]local port of the SOCKS proxy.' } },
    },
    {
      nombres: ['-N'],
      descripcion: {
        es: 'No ejecuta ningún comando remoto. Útil cuando solo se quiere reenviar puertos.',
        en: 'Does not run any remote command. Useful when all you want is to forward ports.',
      },
    },
    { nombres: ['-v'], descripcion: { es: 'Modo detallado: muestra mensajes de depuración de la conexión.', en: 'Verbose mode: shows debugging messages about the connection.' } },
    {
      nombres: ['-o'],
      descripcion: {
        es: 'Pasa una opción con el mismo formato que el fichero de configuración de ssh.',
        en: 'Passes an option in the same format as the ssh configuration file.',
      },
      valor: { nombre: { es: 'opción', en: 'option' }, descripcion: { es: 'Opción de configuración, p. ej. StrictHostKeyChecking=no.', en: 'Configuration option, e.g. StrictHostKeyChecking=no.' } },
    },
    { nombres: ['-t'], descripcion: { es: 'Fuerza la asignación de una pseudoterminal.', en: 'Forces pseudo-terminal allocation.' } },
    {
      nombres: ['-J'],
      descripcion: {
        es: 'Conecta primero a un host intermedio (jump host) y desde él al destino.',
        en: 'Connects first to an intermediate host (jump host) and from there to the destination.',
      },
      valor: { nombre: { es: 'destino', en: 'destination' }, descripcion: { es: '[usuario@]host[:puerto] del salto intermedio.', en: '[user@]host[:port] of the intermediate hop.' } },
    },
  ],
};

// ============================================================
// sudo — https://www.sudo.ws/docs/man/sudo.man/
// ============================================================
const sudo: Herramienta = {
  nombre: 'sudo',
  descripcion: {
    es: 'Ejecuta un comando como otro usuario (por defecto, root), según lo que permita la política de sudoers.',
    en: 'Runs a command as another user (root by default), as far as the sudoers policy allows.',
  },
  categoria: 'Privilegios',
  docs: 'https://www.sudo.ws/docs/man/sudo.man/',
  estilo: 'posix',
  combinables: true,
  ejecutaComando: true,
  argumentos: {
    es: 'Comando que se ejecuta con los privilegios del usuario objetivo.',
    en: 'Command that gets run with the target user\'s privileges.',
  },
  opciones: [
    {
      nombres: ['-l', '--list'],
      descripcion: {
        es: 'Sin comando, lista los privilegios de sudo del usuario en este equipo. Clave en escalada de privilegios.',
        en: 'With no command, lists the user\'s sudo privileges on this machine. A key step in privilege escalation.',
      },
    },
    {
      nombres: ['-u', '--user'],
      descripcion: {
        es: 'Ejecuta el comando como el usuario indicado en lugar del usuario objetivo por defecto (root).',
        en: 'Runs the command as the given user instead of the default target user (root).',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre o #UID del usuario.', en: 'Name or #UID of the user.' } },
    },
    {
      nombres: ['-i', '--login'],
      descripcion: {
        es: 'Ejecuta la shell del usuario objetivo como shell de inicio de sesión.',
        en: 'Runs the target user\'s shell as a login shell.',
      },
    },
    {
      nombres: ['-s', '--shell'],
      descripcion: {
        es: 'Ejecuta la shell indicada en la variable SHELL o, si no existe, la del usuario que invoca sudo.',
        en: 'Runs the shell given in the SHELL variable or, if it is not set, the one of the user invoking sudo.',
      },
    },
    {
      nombres: ['-S', '--stdin'],
      descripcion: {
        es: 'Lee la contraseña desde la entrada estándar en lugar de la terminal.',
        en: 'Reads the password from standard input instead of from the terminal.',
      },
    },
    {
      nombres: ['-k', '--reset-timestamp'],
      descripcion: {
        es: 'Sin comando, invalida las credenciales guardadas en caché para la sesión actual.',
        en: 'With no command, invalidates the credentials cached for the current session.',
      },
    },
    {
      nombres: ['-n', '--non-interactive'],
      descripcion: {
        es: 'No pide nada al usuario; si hace falta contraseña, falla en lugar de preguntarla.',
        en: 'Asks the user nothing; if a password is needed, it fails instead of prompting.',
      },
    },
    { nombres: ['-V', '--version'], descripcion: { es: 'Muestra la versión de sudo y de sus plugins.', en: 'Shows the version of sudo and of its plugins.' } },
  ],
};

// ============================================================
// find (GNU findutils) — https://man7.org/linux/man-pages/man1/find.1.html
// ============================================================
const find: Herramienta = {
  nombre: 'find',
  descripcion: {
    es: 'Busca ficheros en un árbol de directorios según una expresión (nombre, tipo, permisos, propietario…).',
    en: 'Looks for files in a directory tree according to an expression (name, type, permissions, owner…).',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/find.1.html',
  estilo: 'exacto',
  argumentos: {
    es: 'Punto de partida de la búsqueda (directorio). Si no se indica ninguno, find usa ".".',
    en: 'Starting point of the search (a directory). If none is given, find uses ".".',
  },
  opciones: [
    {
      nombres: ['-name'],
      descripcion: {
        es: 'Nombre del fichero (sin la ruta) que coincide con el patrón de shell.',
        en: 'Name of the file (without the path) matching the shell pattern.',
      },
      valor: { nombre: { es: 'patrón', en: 'pattern' }, descripcion: { es: 'Patrón de nombre, p. ej. "*.conf". Conviene entrecomillarlo.', en: 'Name pattern, e.g. "*.conf". Worth quoting.' } },
    },
    {
      nombres: ['-iname'],
      descripcion: {
        es: 'Como -name, pero sin distinguir mayúsculas y minúsculas.',
        en: 'Like -name, but without telling upper and lower case apart.',
      },
      valor: { nombre: { es: 'patrón', en: 'pattern' }, descripcion: { es: 'Patrón de nombre.', en: 'Name pattern.' } },
    },
    {
      nombres: ['-type'],
      descripcion: {
        es: 'Tipo de fichero: f (fichero regular), d (directorio), l (enlace simbólico), entre otros.',
        en: 'File type: f (regular file), d (directory), l (symbolic link), among others.',
      },
      valor: { nombre: { es: 'tipo', en: 'type' }, descripcion: { es: 'Letra del tipo: f, d, l, b, c, p o s.', en: 'Type letter: f, d, l, b, c, p or s.' } },
    },
    {
      nombres: ['-perm'],
      descripcion: {
        es: 'Permisos del fichero. "modo" exacto; "-modo" todos esos bits activados; "/modo" cualquiera de ellos. -perm -4000 busca binarios SUID.',
        en: '"mode" exactly; "-mode" all of those bits set; "/mode" any of them. -perm -4000 finds SUID binaries.',
      },
      valor: { nombre: { es: 'modo', en: 'mode' }, descripcion: { es: 'Permisos en octal o simbólicos, p. ej. -4000 o -u=s.', en: 'Permissions in octal or symbolic form, e.g. -4000 or -u=s.' } },
    },
    {
      nombres: ['-user'],
      descripcion: {
        es: 'Ficheros cuyo propietario es el usuario indicado (se admite el UID).',
        en: 'Files owned by the given user (a UID is accepted).',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre de usuario o UID.', en: 'User name or UID.' } },
    },
    {
      nombres: ['-group'],
      descripcion: {
        es: 'Ficheros que pertenecen al grupo indicado (se admite el GID).',
        en: 'Files belonging to the given group (a GID is accepted).',
      },
      valor: { nombre: { es: 'grupo', en: 'group' }, descripcion: { es: 'Nombre de grupo o GID.', en: 'Group name or GID.' } },
    },
    { nombres: ['-writable'], descripcion: { es: 'Ficheros en los que el usuario actual puede escribir.', en: 'Files the current user can write to.' } },
    { nombres: ['-readable'], descripcion: { es: 'Ficheros que el usuario actual puede leer.', en: 'Files the current user can read.' } },
    {
      nombres: ['-executable'],
      descripcion: {
        es: 'Ficheros que el usuario actual puede ejecutar y directorios en los que puede entrar.',
        en: 'Files the current user can execute and directories they can search.',
      },
    },
    {
      nombres: ['-newer'],
      descripcion: {
        es: 'Ficheros modificados más recientemente que el fichero de referencia.',
        en: 'Files modified more recently than the reference file.',
      },
      valor: { nombre: { es: 'fichero', en: 'file' }, descripcion: { es: 'Fichero de referencia.', en: 'Reference file.' } },
    },
    {
      nombres: ['-size'],
      descripcion: {
        es: 'Tamaño del fichero: n exacto, +n mayor que n, -n menor que n (unidades c, k, M, G…).',
        en: 'File size: n exactly, +n larger than n, -n smaller than n (units c, k, M, G…).',
      },
      valor: { nombre: { es: 'tamaño', en: 'size' }, descripcion: { es: 'Tamaño con unidad opcional, p. ej. +1M.', en: 'Size with an optional unit, e.g. +1M.' } },
    },
    {
      nombres: ['-maxdepth'],
      descripcion: {
        es: 'Desciende como máximo N niveles de directorios por debajo del punto de partida.',
        en: 'Descends at most N directory levels below the starting point.',
      },
      valor: { nombre: { es: 'niveles', en: 'levels' }, descripcion: { es: 'Número entero no negativo.', en: 'Non-negative whole number.' } },
    },
    {
      nombres: ['-exec'],
      descripcion: {
        es: 'Ejecuta un comando por cada fichero encontrado; {} se sustituye por su ruta. Termina en \\; (una ejecución por fichero) o en + (agrupa varios ficheros en cada ejecución).',
        en: 'Runs a command for each file found; {} is replaced by its path. It ends in \\; (one run per file) or in + (several files grouped into each run).',
      },
      ejecutaComandoHasta: [';', '+'],
    },
    { nombres: ['-ls'], descripcion: { es: 'Muestra cada fichero encontrado con un formato similar a "ls -dils".', en: 'Shows each file found in a format much like "ls -dils".' } },
    { nombres: ['-print'], descripcion: { es: 'Muestra la ruta completa de cada fichero encontrado (acción por defecto).', en: 'Shows the full path of each file found (the default action).' } },
    { nombres: ['-o', '-or'], descripcion: { es: 'O lógico entre dos expresiones.', en: 'Logical OR between two expressions.' } },
    { nombres: ['-not'], descripcion: { es: 'Niega la expresión que va a continuación.', en: 'Negates the expression that follows.' } },
  ],
};

// ============================================================
// grep (GNU) — https://man7.org/linux/man-pages/man1/grep.1.html
// ============================================================
const grep: Herramienta = {
  nombre: 'grep',
  descripcion: {
    es: 'Busca líneas que coinciden con un patrón en ficheros o en la entrada estándar.',
    en: 'Looks for lines matching a pattern in files or in standard input.',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/grep.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'El primer argumento es el patrón que se busca (salvo si se usa -e) y los siguientes, los ficheros donde buscar. Sin ficheros, grep lee la entrada estándar (con -r, el directorio actual).',
    en: 'The first argument is the pattern to look for (unless -e is used) and the rest are the files to search in. With no files, grep reads standard input (with -r, the current directory).',
  },
  opciones: [
    { nombres: ['-i', '--ignore-case'], descripcion: { es: 'No distingue mayúsculas de minúsculas.', en: 'Does not tell upper and lower case apart.' } },
    { nombres: ['-v', '--invert-match'], descripcion: { es: 'Invierte la búsqueda: muestra las líneas que NO coinciden.', en: 'Inverts the search: shows the lines that do NOT match.' } },
    {
      nombres: ['-r', '--recursive'],
      descripcion: {
        es: 'Busca recursivamente en todos los ficheros de cada directorio. Solo sigue enlaces simbólicos si se indican en la línea de comandos.',
        en: 'Searches recursively through every file in each directory. It follows symbolic links only when they are given on the command line.',
      },
    },
    {
      nombres: ['-R', '--dereference-recursive'],
      descripcion: {
        es: 'Como -r, pero sigue todos los enlaces simbólicos.',
        en: 'Like -r, but follows every symbolic link.',
      },
    },
    { nombres: ['-n', '--line-number'], descripcion: { es: 'Antepone a cada línea su número de línea.', en: 'Puts the line number in front of each line.' } },
    {
      nombres: ['-l', '--files-with-matches'],
      descripcion: {
        es: 'Muestra solo el nombre de los ficheros que tienen alguna coincidencia.',
        en: 'Shows only the names of the files that have at least one match.',
      },
    },
    { nombres: ['-c', '--count'], descripcion: { es: 'Muestra el número de líneas que coinciden en cada fichero.', en: 'Shows how many lines match in each file.' } },
    {
      nombres: ['-o', '--only-matching'],
      descripcion: {
        es: 'Muestra solo la parte que coincide, cada una en su propia línea.',
        en: 'Shows only the part that matches, each one on its own line.',
      },
    },
    { nombres: ['-E', '--extended-regexp'], descripcion: { es: 'Interpreta el patrón como expresión regular extendida.', en: 'Reads the pattern as an extended regular expression.' } },
    { nombres: ['-F', '--fixed-strings'], descripcion: { es: 'Interpreta el patrón como texto literal, no como expresión regular.', en: 'Reads the pattern as literal text, not as a regular expression.' } },
    { nombres: ['-w', '--word-regexp'], descripcion: { es: 'Solo coincide con palabras completas.', en: 'Matches whole words only.' } },
    { nombres: ['-a', '--text'], descripcion: { es: 'Procesa los ficheros binarios como si fueran texto.', en: 'Processes binary files as if they were text.' } },
    {
      nombres: ['-A', '--after-context'],
      descripcion: {
        es: 'Muestra también N líneas después de cada coincidencia.',
        en: 'Also shows N lines after each match.',
      },
      valor: { nombre: { es: 'N', en: 'N' }, descripcion: { es: 'Número de líneas.', en: 'Number of lines.' } },
    },
    {
      nombres: ['-B', '--before-context'],
      descripcion: {
        es: 'Muestra también N líneas antes de cada coincidencia.',
        en: 'Also shows N lines before each match.',
      },
      valor: { nombre: { es: 'N', en: 'N' }, descripcion: { es: 'Número de líneas.', en: 'Number of lines.' } },
    },
    {
      nombres: ['-C', '--context'],
      descripcion: {
        es: 'Muestra N líneas de contexto antes y después de cada coincidencia.',
        en: 'Shows N lines of context before and after each match.',
      },
      valor: { nombre: { es: 'N', en: 'N' }, descripcion: { es: 'Número de líneas.', en: 'Number of lines.' } },
    },
    {
      nombres: ['--color', '--colour'],
      descripcion: {
        es: 'Resalta en color las coincidencias. Acepta =always, =never o =auto.',
        en: 'Highlights the matches in colour. Takes =always, =never or =auto.',
      },
      valor: { nombre: { es: 'cuándo', en: 'when' }, descripcion: { es: 'always, never o auto.', en: 'always, never or auto.' }, soloConIgual: true },
    },
    { nombres: ['-H', '--with-filename'], descripcion: { es: 'Muestra el nombre del fichero en cada coincidencia.', en: 'Shows the file name on each match.' } },
    {
      nombres: ['-s', '--no-messages'],
      descripcion: {
        es: 'Oculta los errores de ficheros inexistentes o sin permiso de lectura.',
        en: 'Hides the errors about missing files or files that cannot be read.',
      },
    },
    {
      nombres: ['-q', '--quiet', '--silent'],
      descripcion: {
        es: 'No muestra nada; solo devuelve el código de salida (útil en scripts).',
        en: 'Shows nothing; it only returns the exit status (handy in scripts).',
      },
    },
    {
      nombres: ['-e', '--regexp'],
      descripcion: {
        es: 'Indica el patrón de forma explícita. Se puede repetir para buscar varios.',
        en: 'Gives the pattern explicitly. It can be repeated to look for several.',
      },
      valor: { nombre: { es: 'patrón', en: 'pattern' }, descripcion: { es: 'Patrón que se busca.', en: 'Pattern to look for.' } },
    },
    {
      nombres: ['--include'],
      descripcion: {
        es: 'Busca solo en los ficheros cuyo nombre coincide con el patrón (con -r).',
        en: 'Searches only in the files whose name matches the pattern (with -r).',
      },
      valor: { nombre: { es: 'patrón', en: 'pattern' }, descripcion: { es: 'Patrón de nombre, p. ej. "*.php".', en: 'Name pattern, e.g. "*.php".' } },
    },
  ],
};

// ============================================================
// ls, cat, id, whoami (GNU coreutils)
// ============================================================
const ls: Herramienta = {
  nombre: 'ls',
  descripcion: {
    es: 'Lista el contenido de directorios o información de ficheros.',
    en: 'Lists the contents of directories or information about files.',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/ls.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Fichero o directorio que se lista. Sin argumentos, el directorio actual.',
    en: 'File or directory to list. With no arguments, the current directory.',
  },
  opciones: [
    {
      nombres: ['-a', '--all'],
      descripcion: {
        es: 'Muestra también las entradas que empiezan por "." (ficheros ocultos).',
        en: 'Also shows the entries starting with "." (hidden files).',
      },
    },
    { nombres: ['-A', '--almost-all'], descripcion: { es: 'Como -a, pero sin mostrar "." ni "..".', en: 'Like -a, but without showing "." or "..".' } },
    {
      nombres: ['-l'],
      descripcion: {
        es: 'Formato largo: permisos, enlaces, propietario, grupo, tamaño, fecha y nombre.',
        en: 'Long format: permissions, links, owner, group, size, date and name.',
      },
    },
    {
      nombres: ['-h', '--human-readable'],
      descripcion: {
        es: 'Con -l o -s, muestra los tamaños en formato legible (1K, 234M, 2G…).',
        en: 'With -l or -s, shows sizes in a readable format (1K, 234M, 2G…).',
      },
    },
    { nombres: ['-R', '--recursive'], descripcion: { es: 'Lista también los subdirectorios, de forma recursiva.', en: 'Also lists subdirectories, recursively.' } },
    { nombres: ['-t'], descripcion: { es: 'Ordena por fecha de modificación, primero lo más reciente.', en: 'Sorts by modification time, newest first.' } },
    { nombres: ['-r', '--reverse'], descripcion: { es: 'Invierte el orden.', en: 'Reverses the order.' } },
    { nombres: ['-S'], descripcion: { es: 'Ordena por tamaño, primero lo más grande.', en: 'Sorts by size, largest first.' } },
    {
      nombres: ['-d', '--directory'],
      descripcion: {
        es: 'Muestra los directorios en sí, no su contenido.',
        en: 'Shows the directories themselves, not their contents.',
      },
    },
    { nombres: ['-i', '--inode'], descripcion: { es: 'Muestra el número de inodo de cada fichero.', en: 'Shows the inode number of each file.' } },
    {
      nombres: ['-n', '--numeric-uid-gid'],
      descripcion: {
        es: 'Como -l, pero muestra el UID y el GID numéricos.',
        en: 'Like -l, but shows the numeric UID and GID.',
      },
    },
    { nombres: ['-1'], descripcion: { es: 'Muestra un fichero por línea.', en: 'Shows one file per line.' } },
  ],
};

const cat: Herramienta = {
  nombre: 'cat',
  descripcion: {
    es: 'Concatena ficheros y los muestra por la salida estándar.',
    en: 'Concatenates files and prints them on standard output.',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://man7.org/linux/man-pages/man1/cat.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Fichero que se muestra. Sin ficheros, o con "-", lee la entrada estándar.',
    en: 'File to show. With no files, or with "-", it reads standard input.',
  },
  opciones: [
    { nombres: ['-n', '--number'], descripcion: { es: 'Numera todas las líneas de la salida.', en: 'Numbers every output line.' } },
    {
      nombres: ['-b', '--number-nonblank'],
      descripcion: {
        es: 'Numera solo las líneas que no están vacías (tiene prioridad sobre -n).',
        en: 'Numbers only the non-empty lines (it overrides -n).',
      },
    },
    { nombres: ['-s', '--squeeze-blank'], descripcion: { es: 'Reduce las líneas vacías consecutivas a una sola.', en: 'Squeezes repeated empty lines into a single one.' } },
    { nombres: ['-E', '--show-ends'], descripcion: { es: 'Muestra "$" al final de cada línea.', en: 'Shows a "$" at the end of each line.' } },
    { nombres: ['-T', '--show-tabs'], descripcion: { es: 'Muestra los tabuladores como ^I.', en: 'Shows tabs as ^I.' } },
    {
      nombres: ['-v', '--show-nonprinting'],
      descripcion: {
        es: 'Muestra los caracteres no imprimibles con notación ^ y M- (excepto saltos de línea y tabuladores).',
        en: 'Shows non-printing characters using ^ and M- notation (except line feeds and tabs).',
      },
    },
    { nombres: ['-A', '--show-all'], descripcion: { es: 'Equivale a -vET: muestra todos los caracteres ocultos.', en: 'Same as -vET: shows every hidden character.' } },
  ],
};

const id: Herramienta = {
  nombre: 'id',
  descripcion: {
    es: 'Muestra el usuario y los grupos (UID, GID y grupos) del proceso actual o del usuario indicado.',
    en: 'Shows the user and the groups (UID, GID and groups) of the current process or of the given user.',
  },
  categoria: 'Información del sistema',
  docs: 'https://man7.org/linux/man-pages/man1/id.1.html',
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Usuario del que se muestra la información. Sin argumento, el del proceso actual.',
    en: 'User whose information gets shown. With no argument, the one of the current process.',
  },
  opciones: [
    { nombres: ['-u', '--user'], descripcion: { es: 'Muestra solo el UID efectivo.', en: 'Shows the effective UID only.' } },
    { nombres: ['-g', '--group'], descripcion: { es: 'Muestra solo el GID efectivo.', en: 'Shows the effective GID only.' } },
    { nombres: ['-G', '--groups'], descripcion: { es: 'Muestra todos los ID de grupo.', en: 'Shows every group ID.' } },
    { nombres: ['-n', '--name'], descripcion: { es: 'Con -u, -g o -G, muestra el nombre en lugar del número.', en: 'With -u, -g or -G, shows the name instead of the number.' } },
    { nombres: ['-r', '--real'], descripcion: { es: 'Con -u, -g o -G, muestra el ID real en lugar del efectivo.', en: 'With -u, -g or -G, shows the real ID instead of the effective one.' } },
  ],
};

const whoami: Herramienta = {
  nombre: 'whoami',
  descripcion: {
    es: 'Muestra el nombre del usuario efectivo actual. Equivale a "id -un".',
    en: 'Shows the name of the current effective user. Same as "id -un".',
  },
  categoria: 'Información del sistema',
  docs: 'https://man7.org/linux/man-pages/man1/whoami.1.html',
  estilo: 'posix',
  argumentos: null,
  opciones: [
    { nombres: ['--help'], descripcion: { es: 'Muestra la ayuda y sale.', en: 'Shows the help and exits.' } },
    { nombres: ['--version'], descripcion: { es: 'Muestra la versión y sale.', en: 'Shows the version and exits.' } },
  ],
};

// ============================================================
// python3 — https://docs.python.org/3/using/cmdline.html
// ============================================================
const python3: Herramienta = {
  nombre: 'python3',
  descripcion: {
    es: 'Intérprete de Python 3: ejecuta scripts, código pasado como texto o módulos.',
    en: 'Python 3 interpreter: runs scripts, code passed as text, or modules.',
  },
  categoria: 'Intérpretes',
  docs: 'https://docs.python.org/3/using/cmdline.html',
  estilo: 'posix',
  combinables: false,
  valorPegado: false,
  opcionesHastaArgumento: 1,
  argumentos: {
    es: 'Script que se ejecuta (o "-" para leer el código de la entrada estándar). Los argumentos que siguen al script, o a -c/-m, se pasan al programa en sys.argv.',
    en: 'Script to run (or "-" to read the code from standard input). The arguments after the script, or after -c/-m, are passed to the program in sys.argv.',
  },
  opciones: [
    {
      nombres: ['-c'],
      descripcion: {
        es: 'Ejecuta el código Python pasado como texto. Lo que venga detrás ya no son opciones del intérprete: se pasa al código en sys.argv.',
        en: 'Runs the Python code passed as text. Whatever comes after it is no longer an interpreter option: it is passed to the code in sys.argv.',
      },
      valor: { nombre: { es: 'código', en: 'code' }, descripcion: { es: 'Código Python; conviene entrecomillarlo.', en: 'Python code; worth quoting.' } },
      terminaOpciones: true,
    },
    {
      nombres: ['-m'],
      descripcion: {
        es: 'Busca el módulo indicado y lo ejecuta como programa principal (__main__). Lo que venga detrás se pasa al módulo.',
        en: 'Looks up the given module and runs it as the main program (__main__). Whatever comes after it is passed to the module.',
      },
      valor: { nombre: { es: 'módulo', en: 'module' }, descripcion: { es: 'Nombre del módulo, p. ej. http.server.', en: 'Module name, e.g. http.server.' } },
      terminaOpciones: true,
    },
    { nombres: ['-V', '--version'], descripcion: { es: 'Muestra la versión de Python y sale.', en: 'Shows the Python version and exits.' } },
    { nombres: ['-q'], descripcion: { es: 'No muestra los mensajes de copyright y versión en modo interactivo.', en: 'Does not show the copyright and version messages in interactive mode.' } },
    {
      nombres: ['-u'],
      descripcion: {
        es: 'Desactiva el búfer de stdout y stderr: la salida se muestra al momento.',
        en: 'Turns off buffering on stdout and stderr: the output shows up right away.',
      },
    },
    { nombres: ['-i'], descripcion: { es: 'Entra en modo interactivo después de ejecutar el script o el código.', en: 'Enters interactive mode after running the script or the code.' } },
  ],
};

// ============================================================
// ping (iputils) — https://man7.org/linux/man-pages/man8/ping.8.html
// ============================================================
const ping: Herramienta = {
  nombre: 'ping',
  descripcion: {
    es: 'Envía paquetes ICMP ECHO_REQUEST a un host y espera su ECHO_RESPONSE: comprueba si responde y mide el tiempo de ida y vuelta. Sin -c sigue enviando hasta que lo paras con Ctrl+C (SIGINT), y entonces muestra un resumen.',
    en: 'Sends ICMP ECHO_REQUEST packets to a host and waits for its ECHO_RESPONSE: it checks whether the host answers and measures the round-trip time. Without -c it keeps sending until you stop it with Ctrl+C (SIGINT), and then prints a summary.',
  },
  categoria: 'Conexiones',
  docs: 'https://man7.org/linux/man-pages/man8/ping.8.html',
  variantes: {
    es: 'Explicaciones según ping de iputils (versión 20240117), el habitual en Linux.',
    en: 'Explanations follow the ping of iputils (version 20240117), the usual one on Linux.',
  },
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Host de destino: dirección IP o nombre.',
    en: 'Target host: IP address or name.',
  },
  opciones: [
    {
      nombres: ['-c'],
      descripcion: {
        es: 'Se detiene tras enviar el número de paquetes indicado.',
        en: 'Stops after sending the given number of packets.',
      },
      valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Número de paquetes que se envían.', en: 'How many packets get sent.' } },
    },
    {
      nombres: ['-i'],
      descripcion: {
        es: 'Segundos de espera entre cada paquete (por defecto, uno).',
        en: 'Seconds to wait between packets (one by default).',
      },
      valor: { nombre: { es: 'segundos', en: 'seconds' }, descripcion: { es: 'Intervalo en segundos; admite decimales con punto.', en: 'Interval in seconds; decimals with a dot are allowed.' } },
    },
    {
      nombres: ['-W'],
      descripcion: {
        es: 'Segundos que espera una respuesta cuando no ha recibido ninguna.',
        en: 'Seconds to wait for a response when none has arrived.',
      },
      valor: { nombre: { es: 'segundos', en: 'seconds' }, descripcion: { es: 'Tiempo de espera en segundos; 0 es infinito.', en: 'Wait time in seconds; 0 means no limit.' } },
    },
    {
      nombres: ['-w'],
      descripcion: {
        es: 'Segundos tras los que ping termina, sin importar cuántos paquetes haya enviado o recibido.',
        en: 'Seconds after which ping exits, no matter how many packets it has sent or received.',
      },
      valor: { nombre: { es: 'segundos', en: 'seconds' }, descripcion: { es: 'Tiempo límite en segundos.', en: 'Time limit in seconds.' } },
    },
    { nombres: ['-n'], descripcion: { es: 'Salida solo numérica: no resuelve los nombres de las direcciones.', en: 'Numeric output only: it does not look up the names of the addresses.' } },
    { nombres: ['-q'], descripcion: { es: 'Salida silenciosa: solo muestra las líneas de resumen al empezar y al terminar.', en: 'Quiet output: it only shows the summary lines at the start and at the end.' } },
    { nombres: ['-4'], descripcion: { es: 'Usa solo IPv4.', en: 'Uses IPv4 only.' } },
    { nombres: ['-6'], descripcion: { es: 'Usa solo IPv6.', en: 'Uses IPv6 only.' } },
  ],
};

// ============================================================
// telnet (GNU inetutils) — https://www.gnu.org/software/inetutils/manual/html_node/telnet-invocation.html
// ============================================================
const telnet: Herramienta = {
  nombre: 'telnet',
  descripcion: {
    es: 'Cliente del protocolo TELNET: abre una sesión de texto interactiva con otro host. El carácter de escape es Ctrl+] y lleva al modo de comandos (telnet>), donde "quit" sale.',
    en: 'TELNET protocol client: opens an interactive text session with another host. The escape character is Ctrl+] and takes you to command mode (telnet>), where "quit" exits.',
  },
  categoria: 'Conexiones',
  docs: 'https://www.gnu.org/software/inetutils/manual/html_node/telnet-invocation.html',
  variantes: {
    es: 'Explicaciones según telnet de GNU inetutils (versión 2.5), el que instalan Debian y Ubuntu actuales. Otras distribuciones pueden traer el de netkit, con opciones parecidas.',
    en: 'Explanations follow the telnet of GNU inetutils (version 2.5), the one current Debian and Ubuntu install. Other distributions may ship the netkit one, with similar options.',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Host remoto (nombre o dirección IP) y, opcionalmente, el puerto. Sin puerto se usa el de telnet (23/tcp). Sin host, entra en el modo de comandos.',
    en: 'Remote host (name or IP address) and, optionally, the port. With no port, the telnet one is used (23/tcp). With no host, it starts in command mode.',
  },
  opciones: [
    {
      nombres: ['-l', '--user'],
      descripcion: {
        es: 'Envía el usuario indicado al sistema remoto como variable USER, si este entiende la opción ENVIRON de TELNET.',
        en: 'Sends the given user to the remote system as the value of the USER variable, if that system understands the TELNET ENVIRON option.',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre de usuario remoto.', en: 'Remote user name.' } },
    },
    { nombres: ['-4', '--ipv4'], descripcion: { es: 'Usa IPv4 para conectarse.', en: 'Uses IPv4 to connect.' } },
    { nombres: ['-6', '--ipv6'], descripcion: { es: 'Usa IPv6 para conectarse.', en: 'Uses IPv6 to connect.' } },
  ],
};

// ============================================================
// xfreerdp (FreeRDP 3) — https://manpages.ubuntu.com/manpages/noble/man1/xfreerdp3.1.html
// Comprobado con las páginas man de FreeRDP 3.32 (freerdp3-x11) y 2.11 (freerdp2-x11).
// ============================================================
const xfreerdp: Herramienta = {
  nombre: 'xfreerdp',
  descripcion: {
    es: 'Cliente de RDP (Remote Desktop Protocol) para X11, del proyecto FreeRDP: abre en una ventana el escritorio remoto de un servidor RDP, como el que traen muchas ediciones de Windows.',
    en: 'RDP (Remote Desktop Protocol) client for X11, from the FreeRDP project: opens the remote desktop of an RDP server in a window, like the one many Windows editions ship.',
  },
  categoria: 'Conexiones',
  docs: 'https://manpages.ubuntu.com/manpages/noble/man1/xfreerdp3.1.html',
  docsVariantes: [{ nombre: 'FreeRDP 2', url: 'https://manpages.ubuntu.com/manpages/noble/man1/xfreerdp.1.html' }],
  variantes: {
    es: 'Explicaciones según FreeRDP 3. En Debian y Ubuntu, el cliente de FreeRDP 3 se instala como "xfreerdp3" (paquete freerdp3-x11) y "xfreerdp" es el de FreeRDP 2; en Pwnbox, "xfreerdp" ya es FreeRDP 3. Las opciones de aquí existen en las dos versiones, pero FreeRDP 2 admite además formas antiguas como /cert-ignore, que la 3 ya no incluye.',
    en: 'Explanations follow FreeRDP 3. On Debian and Ubuntu the FreeRDP 3 client installs as "xfreerdp3" (package freerdp3-x11) and "xfreerdp" is the FreeRDP 2 one; in Pwnbox, "xfreerdp" is already FreeRDP 3. The options here exist in both versions, but FreeRDP 2 also takes older forms such as /cert-ignore, which 3 no longer includes.',
  },
  estilo: 'freerdp',
  argumentos: {
    es: 'Opcionalmente, un fichero de conexión .rdp con una configuración guardada.',
    en: 'Optionally, an .rdp connection file with a saved configuration.',
  },
  opciones: [
    {
      nombres: ['/v'],
      descripcion: {
        es: 'Servidor al que se conecta: nombre de host, IPv4 o IPv6, con el puerto opcional detrás (/v:servidor:puerto).',
        en: 'Server to connect to: hostname, IPv4 or IPv6, with the port optionally after it (/v:server:port).',
      },
      valor: { nombre: { es: 'servidor[:puerto]', en: 'server[:port]' }, descripcion: { es: 'Servidor RDP y, opcionalmente, su puerto.', en: 'RDP server and, optionally, its port.' } },
    },
    {
      nombres: ['/u'],
      descripcion: {
        es: 'Usuario con el que se inicia sesión. Admite dominio: DOMINIO\\usuario o usuario@dominio.',
        en: 'User to log in as. It takes a domain: DOMAIN\\user or user@domain.',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre de usuario en el servidor remoto.', en: 'User name on the remote server.' } },
    },
    {
      nombres: ['/p'],
      descripcion: {
        es: 'Contraseña. En FreeRDP 3 puede ir sin valor (/p) para que no la pida cuando la conexión no necesita credenciales; en FreeRDP 2 el valor es obligatorio.',
        en: 'Password. In FreeRDP 3 it can go without a value (/p) so that it does not ask when the connection needs no credentials; in FreeRDP 2 the value is required.',
      },
      valor: { nombre: { es: 'contraseña', en: 'password' }, descripcion: { es: 'Contraseña del usuario.', en: 'The user\'s password.' }, soloConIgual: true },
    },
    {
      nombres: ['/d'],
      descripcion: {
        es: 'Dominio del usuario.',
        en: 'The user\'s domain.',
      },
      valor: { nombre: { es: 'dominio', en: 'domain' }, descripcion: { es: 'Nombre del dominio.', en: 'Domain name.' } },
    },
    {
      nombres: ['/port'],
      descripcion: {
        es: 'Puerto del servidor.',
        en: 'Server port.',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: 'Número de puerto.', en: 'Port number.' } },
    },
    {
      nombres: ['/cert'],
      descripcion: {
        es: 'Cómo se acepta el certificado del servidor. "ignore" no lo comprueba en absoluto; "tofu" lo acepta en la primera conexión y lo rechaza después si cambia; "deny" corta la conexión si no coincide, sin preguntar. La documentación avisa de usarlo con cuidado.',
        en: 'How the server certificate is accepted. "ignore" does not check it at all; "tofu" accepts it on the first connection and rejects it afterwards if it changes; "deny" drops the connection when it does not match, without asking. The documentation warns to use it carefully.',
      },
      valor: { nombre: { es: 'modo', en: 'mode' }, descripcion: { es: 'deny, ignore, tofu, name:<nombre> o fingerprint:<hash>.', en: 'deny, ignore, tofu, name:<name> or fingerprint:<hash>.' } },
    },
    { nombres: ['/help', '/?'], descripcion: { es: 'Muestra la ayuda con todas las opciones.', en: 'Shows the help with every option.' } },
  ],
};

// ============================================================
// ftp (tnftp) — https://man.netbsd.org/ftp.1
// ============================================================
const ftp: Herramienta = {
  nombre: 'ftp',
  descripcion: {
    es: 'Cliente del protocolo FTP: abre una sesión interactiva (prompt ftp>) para transferir ficheros con un servidor. Dentro, "ls" o "dir" listan, "get" descarga, "put" sube y "bye" sale.',
    en: 'FTP protocol client: opens an interactive session (ftp> prompt) to transfer files with a server. Inside it, "ls" or "dir" list, "get" downloads, "put" uploads and "bye" exits.',
  },
  categoria: 'Conexiones',
  docs: 'https://man.netbsd.org/ftp.1',
  variantes: {
    es: 'Explicaciones según tnftp (el cliente de NetBSD que Debian, Ubuntu y Parrot instalan como `ftp`; el paquete `ftp` es transicional a `tnftp`). Prueba a usar modo pasivo por defecto. Otros sistemas traen clientes `ftp` distintos, como el de GNU inetutils, con órdenes parecidas.',
    en: 'Explanations follow tnftp (the NetBSD client that Debian, Ubuntu and Parrot install as `ftp`; the `ftp` package is transitional to `tnftp`). It tries passive mode by default. Other systems ship different `ftp` clients, such as the GNU inetutils one, with similar commands.',
  },
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Opcionalmente `[usuario@]host` y un puerto. Sin ellos, arranca en modo interactivo y la conexión se abre con la orden "open". También admite una URL, p. ej. ftp://host/ruta.',
    en: 'Optionally `[user@]host` and a port. Without them it starts in interactive mode and the connection is opened with the "open" command. It also takes a URL, e.g. ftp://host/path.',
  },
  opciones: [
    {
      nombres: ['-?'],
      descripcion: {
        es: 'Muestra el mensaje de uso (la lista de opciones y argumentos) y termina.',
        en: 'Displays the help on standard output and exits.',
      },
    },
    {
      nombres: ['-n'],
      descripcion: {
        es: 'No intenta el inicio de sesión automático al conectarse; el usuario y la contraseña se introducen a mano con la orden "user".',
        en: 'Does not attempt the automatic login when connecting; the user name and the password are entered by hand with the "user" command.',
      },
    },
    {
      nombres: ['-A'],
      descripcion: {
        es: 'Fuerza el modo activo. Por defecto se usa modo pasivo y se recurre al activo solo si el servidor no lo admite.',
        en: 'Forces active mode. By default passive mode is used, falling back to active only if the server does not support it.',
      },
    },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Activa el modo pasivo, pensado para funcionar detrás de cortafuegos. Está en desuso porque el modo pasivo ya es el comportamiento por defecto.',
        en: 'Enables passive mode, meant for use behind connection-filtering firewalls. It is deprecated because passive mode is already the default.',
      },
    },
    {
      nombres: ['-i'],
      descripcion: {
        es: 'Desactiva la confirmación interactiva al transferir varios ficheros a la vez.',
        en: 'Turns off the interactive prompt when transferring several files at once.',
      },
    },
  ],
};

// ============================================================
// smbclient (Samba) — https://www.samba.org/samba/docs/current/man-html/smbclient.1.html
// ============================================================
const smbclient: Herramienta = {
  nombre: 'smbclient',
  descripcion: {
    es: 'Cliente de Samba para acceder a recursos compartidos SMB/CIFS, con una sesión interactiva parecida a la de ftp (prompt smb: \\>). Dentro, "ls" lista, "cd" cambia de directorio, "get" descarga y "quit" sale.',
    en: 'Samba client for reaching SMB/CIFS shares, with an interactive session much like the one in ftp (smb: \\> prompt). Inside it, "ls" lists, "cd" changes directory, "get" downloads and "quit" exits.',
  },
  categoria: 'Conexiones',
  docs: 'https://www.samba.org/samba/docs/current/man-html/smbclient.1.html',
  variantes: {
    es: 'Explicaciones según smbclient de Samba (versión 4.19.5).',
    en: 'Explanations follow smbclient from Samba (version 4.19.5).',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Recurso al que se conecta, con la forma //servidor/recurso (por ejemplo //10.10.10.10/C$). Opcionalmente, después, la contraseña.',
    en: 'The share to connect to, in the form //server/share (for example //10.10.10.10/C$). Optionally, the password after it.',
  },
  opciones: [
    {
      nombres: ['-L', '--list'],
      descripcion: {
        es: 'Muestra la lista de recursos compartidos que ofrece el servidor.',
        en: 'Shows the list of shares the server offers.',
      },
      valor: { nombre: { es: 'host', en: 'host' }, descripcion: { es: 'Servidor del que se listan los recursos.', en: 'Server whose shares get listed.' } },
    },
    {
      nombres: ['-N', '--no-pass'],
      descripcion: {
        es: 'No pide contraseña. Útil para recursos que no la necesitan. Sin esta opción ni una contraseña en la línea de comandos, smbclient la pide (con Enter se envía vacía).',
        en: 'Does not ask for a password. Useful for shares that do not need one. Without this option and without a password on the command line, smbclient asks for it (pressing Enter sends an empty one).',
      },
    },
    {
      nombres: ['-U', '--user'],
      descripcion: {
        es: 'Indica el usuario SMB y, opcionalmente, su contraseña tras un %. Si no se da contraseña, la pide.',
        en: 'Gives the SMB user and, optionally, their password after a %. With no password, it asks for one.',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: '[DOMINIO\\]USUARIO[%CONTRASEÑA].', en: '[DOMAIN\\]USERNAME[%PASSWORD].' } },
    },
  ],
};

// ============================================================
// redis-cli — https://redis.io/docs/latest/develop/tools/cli/
// ============================================================
const redisCli: Herramienta = {
  nombre: 'redis-cli',
  descripcion: {
    es: 'Cliente de línea de comandos de Redis. Sin una orden como argumento abre una sesión interactiva (prompt host:puerto>) donde se escriben órdenes de Redis como INFO, SELECT, KEYS o GET.',
    en: 'Redis command-line client. With no command as an argument it opens an interactive session (host:port> prompt) where you type Redis commands such as INFO, SELECT, KEYS or GET.',
  },
  categoria: 'Conexiones',
  docs: 'https://redis.io/docs/latest/develop/tools/cli/',
  variantes: {
    es: 'Explicaciones según redis-cli 8.0.2 (la versión de Pwnbox) y la documentación de redis.io.',
    en: 'Explanations follow redis-cli 8.0.2 (the version in Pwnbox) and the documentation on redis.io.',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Opcionalmente, una orden de Redis con sus argumentos, que se envía al servidor y después termina. Sin orden, entra en el modo interactivo. Ojo: el host no va como argumento sino con -h; sin -h se conecta a 127.0.0.1:6379.',
    en: 'Optionally, a Redis command with its arguments, which is sent to the server before exiting. With no command, it enters interactive mode. Careful: the host does not go as an argument but with -h; without -h it connects to 127.0.0.1:6379.',
  },
  opciones: [
    {
      nombres: ['-h'],
      descripcion: {
        es: 'Servidor al que se conecta, por nombre o dirección IP. Por defecto, 127.0.0.1.',
        en: 'Server to connect to, by name or IP address. 127.0.0.1 by default.',
      },
      valor: { nombre: { es: 'host', en: 'host' }, descripcion: { es: 'Nombre o dirección IP del servidor Redis.', en: 'Name or IP address of the Redis server.' } },
    },
    {
      nombres: ['-p'],
      descripcion: {
        es: 'Puerto del servidor. Por defecto, 6379.',
        en: 'Server port. 6379 by default.',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: 'Número de puerto.', en: 'Port number.' } },
    },
    {
      nombres: ['-a'],
      descripcion: {
        es: 'Contraseña para autenticarse al conectar, sin tener que enviar después la orden AUTH. Es más seguro pasarla en la variable de entorno REDISCLI_AUTH.',
        en: 'Password to authenticate with on connecting, without having to send the AUTH command afterwards. Passing it in the REDISCLI_AUTH environment variable is safer.',
      },
      valor: { nombre: { es: 'contraseña', en: 'password' }, descripcion: { es: 'Contraseña del servidor Redis.', en: 'Password of the Redis server.' } },
    },
    {
      nombres: ['-n'],
      descripcion: {
        es: 'Número de la base de datos que se usa. Por defecto, la 0.',
        en: 'Number of the database to use. 0 by default.',
      },
      valor: { nombre: { es: 'número', en: 'number' }, descripcion: { es: 'Índice de la base de datos, empezando por 0.', en: 'Database index, starting at 0.' } },
    },
    { nombres: ['--version'], descripcion: { es: 'Muestra la versión de redis-cli (del cliente, no del servidor) y termina.', en: 'Shows the redis-cli version (the client, not the server) and exits.' } },
    { nombres: ['--help'], descripcion: { es: 'Muestra la ayuda con todas las opciones y termina.', en: 'Shows the help with every option and exits.' } },
  ],
};

// ============================================================
// mongosh (MongoDB Shell) — https://www.mongodb.com/docs/mongodb-shell/
// ============================================================
const mongosh: Herramienta = {
  nombre: 'mongosh',
  descripcion: {
    es: 'MongoDB Shell, el cliente de línea de comandos de MongoDB. Abre una sesión interactiva (prompt base>) donde se escriben órdenes como show dbs, use, show collections o db.<colección>.find().',
    en: 'MongoDB Shell, the MongoDB command-line client. It opens an interactive session (database> prompt) where you type commands such as show dbs, use, show collections or db.<collection>.find().',
  },
  categoria: 'Conexiones',
  docs: 'https://www.mongodb.com/docs/mongodb-shell/connect/',
  variantes: {
    es: 'Explicaciones según la documentación de mongosh en mongodb.com (consultada el 02/11/2026). La documentación actual dice que se conecta a MongoDB 7.0 o superior.',
    en: 'Explanations follow the mongosh documentation on mongodb.com (checked on 02/11/2026). The current documentation says it connects to MongoDB 7.0 or later.',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Cadena de conexión con el servidor al que se conecta, p. ej. mongodb://host:puerto. Sin argumento ni --host, se conecta a localhost en el puerto 27017.',
    en: 'Connection string for the server to connect to, e.g. mongodb://host:port. With no argument and no --host, it connects to localhost on port 27017.',
  },
  opciones: [
    {
      nombres: ['--host'],
      descripcion: {
        es: 'Servidor al que se conecta, por nombre o dirección IP, en lugar de usar una cadena de conexión.',
        en: 'Server to connect to, by name or IP address, instead of using a connection string.',
      },
      valor: { nombre: { es: 'host', en: 'host' }, descripcion: { es: 'Nombre o dirección IP del servidor MongoDB.', en: 'Name or IP address of the MongoDB server.' } },
    },
    {
      nombres: ['--port'],
      descripcion: {
        es: 'Puerto del servidor. Si no se indica, el 27017.',
        en: 'Server port. If left out, 27017.',
      },
      valor: { nombre: { es: 'puerto', en: 'port' }, descripcion: { es: 'Número de puerto.', en: 'Port number.' } },
    },
    { nombres: ['--nodb'], descripcion: { es: 'Abre el shell sin conectarse a ningún servidor.', en: 'Opens the shell without connecting to any server.' } },
    { nombres: ['--version'], descripcion: { es: 'Muestra la versión de mongosh (del cliente, no del servidor) y termina.', en: 'Shows the mongosh version (the client, not the server) and exits.' } },
    { nombres: ['-h', '--help'], descripcion: { es: 'Muestra la ayuda con las opciones y termina.', en: 'Shows the help with the options and exits.' } },
  ],
};

// ============================================================
// mysql (cliente de MariaDB) — https://mariadb.com/docs/server/clients-and-utilities/mariadb-client/mariadb-command-line-client
// ============================================================
const mysql: Herramienta = {
  nombre: 'mysql',
  descripcion: {
    es: 'Cliente de línea de comandos de MySQL y MariaDB. Abre una sesión interactiva (prompt MariaDB [base]>) donde se escriben consultas SQL como SHOW DATABASES, USE, SHOW TABLES o SELECT, terminadas en ";".',
    en: 'MySQL and MariaDB command-line client. It opens an interactive session (MariaDB [database]> prompt) where you type SQL queries such as SHOW DATABASES, USE, SHOW TABLES or SELECT, ending in ";".',
  },
  categoria: 'Conexiones',
  docs: 'https://mariadb.com/docs/server/clients-and-utilities/mariadb-client/mariadb-command-line-client',
  variantes: {
    es: 'Explicaciones según la página man de mariadb 10.11.13 (Ubuntu 24.04), la ayuda (--help) del cliente 11.8.6 de la Pwnbox y la documentación de mariadb.com (consultada el 03/11/2026). En MariaDB el programa se llama mariadb y mysql es un enlace a él. Desde MariaDB 11.4 el cliente exige SSL por defecto.',
    en: 'Explanations follow the man page of mariadb 10.11.13 (Ubuntu 24.04), the help (--help) of the 11.8.6 client in Pwnbox and the documentation on mariadb.com (checked on 03/11/2026). In MariaDB the program is called mariadb and mysql is a link to it. From MariaDB 11.4 on, the client requires SSL by default.',
  },
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Opcionalmente, el nombre de la base de datos que se usa al entrar. Ojo: el servidor no va como argumento sino con -h; sin -h se conecta a localhost por un socket local.',
    en: 'Optionally, the name of the database to use on entry. Careful: the server does not go as an argument but with -h; without -h it connects to localhost over a local socket.',
  },
  opciones: [
    {
      nombres: ['-h', '--host'],
      descripcion: {
        es: 'Servidor al que se conecta, por nombre o dirección IP. Si no se indica, o se indica localhost, usa un socket Unix local en lugar de TCP/IP.',
        en: 'Server to connect to, by name or IP address. If it is left out, or set to localhost, a local Unix socket is used instead of TCP/IP.',
      },
      valor: { nombre: { es: 'host', en: 'host' }, descripcion: { es: 'Nombre o dirección IP del servidor.', en: 'Name or IP address of the server.' } },
    },
    {
      nombres: ['-u', '--user'],
      descripcion: {
        es: 'Usuario de la base de datos con el que se inicia sesión.',
        en: 'Database user to log in as.',
      },
      valor: { nombre: { es: 'usuario', en: 'user' }, descripcion: { es: 'Nombre del usuario de MariaDB o MySQL.', en: 'Name of the MariaDB or MySQL user.' } },
    },
    {
      nombres: ['--ssl'],
      descripcion: {
        es: 'Activa SSL (TLS) en la conexión. En el cliente 11.8.6 de la Pwnbox viene activado por defecto; se desactiva con --skip-ssl.',
        en: 'Turns SSL (TLS) on for the connection. On the 11.8.6 client in Pwnbox it is on by default; --skip-ssl turns it off.',
      },
    },
    {
      nombres: ['--skip-ssl'],
      descripcion: {
        es: 'Desactiva SSL (TLS) en la conexión. Hace falta con clientes modernos, que exigen SSL por defecto, para conectarse a servidores antiguos que no lo admiten.',
        en: 'Turns SSL (TLS) off for the connection. It is needed with modern clients, which require SSL by default, to reach old servers that do not support it.',
      },
    },
    { nombres: ['-?', '--help'], descripcion: { es: 'Muestra la ayuda con todas las opciones y termina.', en: 'Shows the help with every option and exits.' } },
  ],
};

// ============================================================
// tar (GNU tar) — https://www.gnu.org/software/tar/manual/
// ============================================================
const tar: Herramienta = {
  nombre: 'tar',
  descripcion: {
    es: 'Crea, lista y extrae archivos .tar, también comprimidos (.tar.gz, .tgz…).',
    en: 'Creates, lists and extracts .tar archives, compressed ones included (.tar.gz, .tgz…).',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://www.gnu.org/software/tar/manual/html_node/Option-Summary.html',
  variantes: {
    es: 'Explicaciones según GNU tar 1.35. Admite también el estilo antiguo, sin guion: "tar xvf fichero" equivale a "tar -xvf fichero". Al leer un archivo comprimido, GNU tar reconoce el formato solo, sin -z.',
    en: 'Explanations follow GNU tar 1.35. It also takes the old style, without a dash: "tar xvf file" is the same as "tar -xvf file". When reading a compressed archive, GNU tar works the format out on its own, without -z.',
  },
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Ficheros que se añaden al crear, o que se extraen o listan del archivo. Sin argumentos, todos.',
    en: 'Files to add when creating, or to extract or list from the archive. With no arguments, all of them.',
  },
  opciones: [
    { nombres: ['-x', '--extract', '--get'], descripcion: { es: 'Extrae los ficheros del archivo.', en: 'Extracts the files from the archive.' } },
    { nombres: ['-c', '--create'], descripcion: { es: 'Crea un archivo nuevo.', en: 'Creates a new archive.' } },
    { nombres: ['-t', '--list'], descripcion: { es: 'Lista el contenido del archivo sin extraerlo.', en: 'Lists the contents of the archive without extracting it.' } },
    {
      nombres: ['-v', '--verbose'],
      descripcion: {
        es: 'Muestra el nombre de cada fichero que procesa.',
        en: 'Shows the name of each file it processes.',
      },
    },
    {
      nombres: ['-f', '--file'],
      descripcion: {
        es: 'Archivo con el que trabaja tar.',
        en: 'Archive tar works with.',
      },
      valor: { nombre: { es: 'archivo', en: 'archive' }, descripcion: { es: 'Fichero .tar (o comprimido) que se crea, lista o extrae.', en: 'The .tar (or compressed) file that gets created, listed or extracted.' } },
    },
    { nombres: ['-z', '--gzip'], descripcion: { es: 'Comprime o descomprime con gzip.', en: 'Compresses or uncompresses with gzip.' } },
  ],
};

// ============================================================
// cd (orden interna de Bash) — https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html
// ============================================================
const cd: Herramienta = {
  nombre: 'cd',
  descripcion: {
    es: 'Orden interna del shell: cambia el directorio de trabajo.',
    en: 'Shell builtin: changes the working directory.',
  },
  categoria: 'Ficheros y búsqueda',
  docs: 'https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html',
  estilo: 'posix',
  combinables: false,
  argumentos: {
    es: 'Directorio al que se cambia. Sin argumento, el directorio personal ($HOME); con "-", el anterior.',
    en: 'Directory to change to. With no argument, the home directory ($HOME); with "-", the previous one.',
  },
  opciones: [
    { nombres: ['-L'], descripcion: { es: 'Sigue los enlaces simbólicos (es lo que hace por defecto).', en: 'Follows symbolic links (which is what it does by default).' } },
    { nombres: ['-P'], descripcion: { es: 'Usa la estructura física de directorios, sin seguir los enlaces simbólicos.', en: 'Uses the physical directory structure, without following symbolic links.' } },
  ],
};

// ============================================================
// rsync — https://man7.org/linux/man-pages/man1/rsync.1.html
// ============================================================
const rsync: Herramienta = {
  nombre: 'rsync',
  descripcion: {
    es: 'Copia ficheros entre directorios locales o con otro host. Con dos puntos dobles tras el host (host::módulo) habla directamente con un servidor rsync (demonio), que comparte carpetas llamadas módulos.',
    en: 'Copies files between local directories or with another host. With a double colon after the host (host::module) it talks straight to an rsync server (daemon), which shares folders called modules.',
  },
  categoria: 'Conexiones',
  docs: 'https://man7.org/linux/man-pages/man1/rsync.1.html',
  variantes: {
    es: 'Explicaciones según la página man oficial de rsync. En la Pwnbox la versión era la 3.4.1.',
    en: 'Explanations follow the official rsync man page. In Pwnbox the version was 3.4.1.',
  },
  estilo: 'posix',
  combinables: true,
  argumentos: {
    es: 'Origen y, opcionalmente, destino. Con un servidor rsync, el origen se escribe HOST::MÓDULO/RUTA; sin módulo (HOST::) lista los módulos que el servidor deja ver. Con un solo origen y sin destino, lista los ficheros en lugar de copiarlos.',
    en: 'Source and, optionally, destination. With an rsync server, the source is written HOST::MODULE/PATH; with no module (HOST::) it lists the modules the server lets you see. With a single source and no destination, it lists the files instead of copying them.',
  },
  opciones: [
    {
      nombres: ['--list-only'],
      descripcion: {
        es: 'Lista los ficheros del origen en lugar de transferirlos, aunque se indique un destino. Se aplica sola si hay un único origen y ningún destino.',
        en: 'Lists the files in the source instead of transferring them, even when a destination is given. It applies on its own when there is a single source and no destination.',
      },
    },
  ],
};

export const HERRAMIENTAS: Herramienta[] = [
  nmap,
  gobuster,
  ffuf,
  dirb,
  curl,
  nc,
  ping,
  telnet,
  xfreerdp,
  ftp,
  smbclient,
  rsync,
  redisCli,
  mongosh,
  mysql,
  ssh,
  sudo,
  find,
  grep,
  ls,
  cat,
  tar,
  cd,
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
    nombre: {
      es: 'tubería (pipe)',
      en: 'pipe',
    },
    descripcion: {
      es: 'Conecta la salida estándar del comando de la izquierda con la entrada estándar del comando de la derecha.',
      en: 'Connects the standard output of the command on the left with the standard input of the command on the right.',
    },
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Pipelines.html',
  },
  {
    simbolo: '&&',
    nombre: {
      es: 'lista AND',
      en: 'AND list',
    },
    descripcion: {
      es: 'Ejecuta el comando de la derecha solo si el de la izquierda termina con éxito (código de salida 0).',
      en: 'Runs the command on the right only if the one on the left finishes successfully (exit status 0).',
    },
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Lists.html',
  },
  {
    simbolo: ';',
    nombre: {
      es: 'separador de comandos',
      en: 'command separator',
    },
    descripcion: {
      es: 'Ejecuta los comandos uno detrás de otro: el shell espera a que termine el primero y luego ejecuta el siguiente, aunque el primero haya fallado.',
      en: 'Runs the commands one after another: the shell waits for the first to finish and then runs the next, even if the first one failed.',
    },
    tipo: 'separador',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Lists.html',
  },
  {
    simbolo: '>',
    nombre: {
      es: 'redirección de salida',
      en: 'output redirection',
    },
    descripcion: {
      es: 'Envía la salida estándar a un fichero. Si no existe, lo crea; si existe, borra su contenido antes de escribir.',
      en: 'Sends the standard output to a file. If it does not exist, it is created; if it does, its contents are wiped before writing.',
    },
    tipo: 'redireccion',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
  {
    simbolo: '>>',
    nombre: {
      es: 'redirección añadiendo',
      en: 'appending redirection',
    },
    descripcion: {
      es: 'Envía la salida estándar al final de un fichero sin borrar lo que ya tiene. Si no existe, lo crea.',
      en: 'Sends the standard output to the end of a file without wiping what it already has. If it does not exist, it is created.',
    },
    tipo: 'redireccion',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
  {
    simbolo: '2>/dev/null',
    nombre: {
      es: 'descartar errores',
      en: 'discard errors',
    },
    descripcion: {
      es: 'Redirige la salida de errores (descriptor 2) a /dev/null, un fichero especial que descarta todo lo que recibe. Sirve para ocultar mensajes como los "Permission denied" de find.',
      en: 'Redirects the error output (descriptor 2) to /dev/null, a special file that throws away everything it receives. It is used to hide messages such as the "Permission denied" ones from find.',
    },
    tipo: 'redireccion-completa',
    docs: 'https://www.gnu.org/software/bash/manual/html_node/Redirections.html',
  },
];
