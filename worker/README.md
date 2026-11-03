# Contador de «me ha servido»

Worker de Cloudflare que guarda **un número entero**: cuánta gente ha pulsado el botón de la portada.
Se despliega aparte de la web; `yconfi.github.io` sigue siendo estática en GitHub Pages y solo llama a
este endpoint desde el navegador.

## Qué guarda y qué no

Guarda tres números: el total, el minuto en curso y cuántos votos lleva ese minuto. **Nada más.** Ni IPs,
ni hashes de IP, ni cookies, ni identificadores. Que una misma persona no vote dos veces se resuelve en su
navegador con `localStorage`, no aquí.

Consecuencia, asumida a propósito: el contador es **aproximado**. Quien se empeñe puede votar otra vez
desde incógnito o desde otro dispositivo. La alternativa —identificar a cada visitante— se descartó porque
el coste en privacidad no compensa para un contador de «esto me ha servido».

## Por qué Durable Objects y no KV

La documentación de KV lo desaconseja para este caso:

- «KV is not ideal for applications where you need support for atomic operations»
- «concurrent writes to the same key can end up overwriting one another»
- una escritura tarda «up to 60 seconds or more» en verse en el resto del mundo

Con KV, dos votos a la vez pierden uno, y quien vote y recargue podría no ver su propio voto durante un
minuto. Un Durable Object tiene almacenamiento «private, transactional, and strongly consistent» y atiende
las peticiones de una en una, así que ninguna de las dos cosas pasa.

## Desplegarlo

Hace falta una cuenta de Cloudflare (el plan gratuito sobra: 100.000 peticiones y 100.000 escrituras de
fila al día) y Node instalado. Desde esta carpeta:

```bash
npx wrangler@latest login
```

```bash
npx wrangler@latest deploy
```

El segundo comando imprime la URL del Worker, con la forma
`https://contador-util.<tu-subdominio>.workers.dev`. Hay que pegarla en `endpoint`, dentro de
`CONTADOR_UTIL` en [`src/data/site.ts`](../src/data/site.ts). **Mientras ese campo esté vacío, el botón no
aparece en la web**: así nunca se publica un número inventado.

## Comprobarlo

Leer el total:

```bash
curl https://contador-util.<tu-subdominio>.workers.dev
```

Sumar un voto (hace falta la cabecera `Origin`, si no responde 403):

```bash
curl -X POST -H "Origin: https://yconfi.github.io" https://contador-util.<tu-subdominio>.workers.dev
```

En local, sin desplegar nada:

```bash
npx wrangler@latest dev
```

## Protección

- **Origen**: solo se acepta sumar desde `yconfi.github.io` y desde `localhost:4321`. Está en la constante
  `ORIGENES` de [`src/index.js`](src/index.js). Una cabecera `Origin` se falsifica sin esfuerzo, así que
  esto filtra bots perezosos, no a quien se lo proponga.
- **Tope por minuto**: 20 votos para toda la web (`MAX_POR_MINUTO`). No identifica a nadie; solo impide que
  un bucle de peticiones agote la cuota diaria. Si se supera, el endpoint responde `429` y el contador se
  queda quieto hasta el minuto siguiente.

Ninguna de las dos evita que alguien decidido infle el número. Eso, sin pedir identidad, no tiene solución;
lo que sí se consigue es que el abuso no rompa nada ni cueste dinero.

## Si alguna vez hay que reiniciar la cuenta

Cambiar la constante `CLAVE` del componente
[`BotonUtil.astro`](../src/components/BotonUtil.astro) (por ejemplo a `util-votado-v2`) hace que todo el
mundo pueda votar otra vez, porque la marca que se busca en su navegador pasa a ser otra. Para poner el
total a cero hay que borrar el Durable Object con `npx wrangler@latest delete` y volver a desplegar.
