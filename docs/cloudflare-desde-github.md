# Activar AcademyVerso desde Cloudflare y GitHub (sin instalar herramientas)

El repositorio público es **[davidop/academyverso-2026](https://github.com/davidop/academyverso-2026)**. No se necesita comprar dominio: la aplicación 3D y Slidev permanecen en GitHub Pages; Cloudflare alojará únicamente la API.

## Paso 1 · Crear la D1 desde Cloudflare

1. Entra en https://dash.cloudflare.com/ con tu cuenta Cloudflare.
2. Abre **Workers & Pages → D1 SQL Database** o busca **D1 SQL Database** en el menú del dashboard.
3. **Create Database**, nombre exacto: `academyverso`. No incluyas espacios, acentos ni el año.
4. Copia el **Database ID (UUID)**. Ese ID **no es una contraseña**: puedes facilitármelo para que actualice `worker/wrangler.toml`.
5. Hasta que el ID no sustituya a `REEMPLAZAR_CON_ID_D1` en el repositorio, no conectes el despliegue: fallaría.

## Paso 2 · Inicializar tablas desde D1 Console

En la nueva base `academyverso`, abre la pestaña **Console**. Ejecuta las sentencias de `worker/schema.sql`:
https://github.com/davidop/academyverso-2026/blob/main/worker/schema.sql

Debe crear `objects`, el índice `idx_objects_visible` y `rates`. Todo se crea con `IF NOT EXISTS`, por lo que las sentencias son seguras para un segundo intento.

## Paso 3 · Importar el Worker desde GitHub

Solo después de actualizar el UUID del repositorio:

1. Abre https://dash.cloudflare.com/ → **Workers & Pages → Create application**.
2. Selecciona **GitHub** y autoriza el acceso a **solo** `davidop/academyverso-2026`.
3. Configura:
   - **Nombre del Worker:** `academyverso-api`.
   - **Rama:** `main`.
   - **Root directory:** `worker` (importante: el repositorio también tiene la app Three.js y Slidev).
   - **Build command:** vacío si no se requiere; el Worker es JavaScript nativo.
   - **Deploy command:** `npx wrangler deploy`.
4. Pulsa **Save and Deploy**. El nombre debe coincidir con el valor `name` de `worker/wrangler.toml`.
5. Guarda la dirección `https://academyverso-api.<tu-subdominio>.workers.dev` que Cloudflare muestre.

La [documentación oficial de Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) describe esta integración de GitHub para que posteriores commits desplieguen automáticamente el Worker.

## Paso 4 · Secrets sin publicarlos

En el Worker → **Settings → Variables and Secrets** agrega como secretos **de ejecución**:

| Nombre | Contenido | Dónde obtenerlo |
| --- | --- | --- |
| `GITHUB_TOKEN` | Token GitHub *fine-grained* con acceso solo a este repositorio y permiso **Issues: read and write** | GitHub → Settings → Developer settings → Personal access tokens |
| `INGEST_SECRET` | Cadena aleatoria fuerte, de al menos 32 caracteres | Generador local de contraseñas; debe coincidir con secret GitHub |
| `ADMIN_TOKEN` | Otra cadena aleatoria fuerte, distinta de la anterior | Gestor de contraseñas |

En GitHub → repositorio → **Settings → Secrets and variables → Actions**, configura:
- `ACADEMYVERSO_WORKER_URL`: URL pública del Worker, **sin /** final (esto no es una contraseña).
- `ACADEMYVERSO_INGEST_SECRET`: exactamente el valor del secret `INGEST_SECRET` del Worker.

**Nunca pegues tokens, contraseñas o secrets en una Issue, chat ni commit.** Ni siquiera si te solicitan una captura.

## Paso 5 · Enlazar GitHub Pages al Worker

Cuando facilites únicamente la URL pública `workers.dev`, puedo actualizar `web/config.js`, fijar `API_BASE` y provocar el despliegue automático en GitHub Pages.

## Paso 6 · Validación real, no simulada

- `GET /api/health` responde `ok: true`.
- Crea una Issue desde GitHub Mobile; el workflow firmado `Registro de objeto cósmico` debe completarse.
- La Issue aparece en `GET /api/objects` y en la galaxia 3D.
- Crea otro objeto desde el formulario web sin cuenta de GitHub; el Worker crea una Issue pública y la guarda en D1.
- Comprueba filtros, límites y capacidad de ocultar objetos.

**Aclaración:** crear cuenta Cloudflare con GitHub no equivale a autorizar el repositorio a Workers Builds: eso se hace en el paso 3. Hasta completar el circuito, el formulario de la web sigue ofreciendo la alternativa de preparar una Issue para GitHub.

Documentación: [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/) · [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) · [Secrets de Workers](https://developers.cloudflare.com/workers/configuration/secrets/).

## Conexión real completada (19/11/2026)

URL confirmada en la cuenta Cloudflare: **https://academyverso-api.david-oliva-paredes.workers.dev**. El usuario verificó `/api/health` con `ok: true` y `database_connected: true`; queda pendiente activar `GITHUB_TOKEN`, `INGEST_SECRET`, `ADMIN_TOKEN` y los secretos correspondientes de GitHub Actions. La web queda configurada para consumir D1 y mostrar un plan B para creación si el Worker no tiene token GitHub.
