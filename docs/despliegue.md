# Despliegue de AcademyVerso: pasos reales

**Ruta recomendada para la sesión:** [Despliegue desde el navegador con Cloudflare + GitHub](cloudflare-desde-github.md). No requiere instalar Wrangler en el móvil.


## 1. Repositorio GitHub

- [ ] Mantener `davidop/academyverso-2026` público.
- [ ] Mantener **Issues** activadas. El flujo procesa formularios cósmicos validados sin depender de etiquetas precreadas.
- [ ] En **Settings → Pages → Build and deployment**, elegir **GitHub Actions**.
- [ ] En **Settings → Collaborators**, invitar a Sergio (@svg153, verificar su GitHub username antes de conceder acceso).
- [ ] Configurar branch protection/ruleset para `main`: PR obligatorio, CI requerido, no push del público.
- [ ] Activar **Settings → Actions** con permisos de lectura por defecto. Dar privilegios sólo a workflows que los requieran.
- [ ] Comprobar el enlace `/issues/new?template=crear-objeto.yml` desde **GitHub Mobile** y navegador.

## 2. Cloudflare Worker y D1 (plan gratuito cuando se respeten cuotas vigentes)

```bash
npm i -g wrangler
wrangler login
wrangler d1 create academyverso
# Pegar database_id en worker/wrangler.toml
cd worker
wrangler d1 execute academyverso --remote --file=schema.sql
wrangler secret put GITHUB_TOKEN
wrangler secret put INGEST_SECRET
wrangler secret put ADMIN_TOKEN
wrangler deploy
```

**GITHUB_TOKEN:** token fine-grained del usuario/robot, sólo al repo AcademyVerso, permiso **Issues: Read and write**. Usar token con caducidad, guardado **únicamente** como secret del Worker, nunca en la web. Si se automatiza a largo plazo, preferir GitHub App con autenticación de instalación.

**INGEST_SECRET:** cadena aleatoria de 32+ caracteres, compartida entre Worker y GitHub Actions. **ADMIN_TOKEN:** cadena independiente de alta entropía. No guardar ninguno en `wrangler.toml` ni en commits.

Configurar secrets del repositorio:
- `ACADEMYVERSO_WORKER_URL`: `https://academyverso-api.<subdominio>.workers.dev` (sin `/` final).
- `ACADEMYVERSO_INGEST_SECRET`: el mismo valor que en Worker.

La `GITHUB_TOKEN` de GitHub Actions propia no sirve para publicar Issues desde usuarios anónimos. El formulario web llama al Worker, que actúa mediante credencial privada y controla el abuso.

## 3. Conectar el frontend

Modificar `web/config.js`:

```js
window.ACADEMYVERSO_CONFIG = Object.freeze({
  API_BASE:'https://academyverso-api.<subdominio>.workers.dev',
  REPO:'davidop/academyverso-2026',
  POLL_MS:5000
});
```

Publicar el commit en `main`, ejecutar `Deploy · GitHub Pages` y probar desde dos teléfonos distintos.

## 4. Validación E2E obligatoria

- [ ] `/api/health` responde `ok: true`.
- [ ] Desde GitHub Mobile, crear una Issue con plantilla: la ejecución `Registro de objeto cósmico` termina correctamente; el objeto aparece en el universo.
- [ ] Desde el formulario web, crear objeto: aparece en GitHub **y** en el universo; revisar alias.
- [ ] 50 objetos de prueba sin cuelgues, 5 peticiones/h por IP y pruebas de spam.
- [ ] La Issue conserva el número y URL; la ficha enlaza a ella.
- [ ] Comprobar ocultación: `curl -X POST "$WORKER_URL/api/admin/hide" -H "Authorization: Bearer $ADMIN_TOKEN" -H "content-type: application/json" -d '{"issue_number":42,"hidden":true}'`.
- [ ] Desactivar / recuperar conectividad y comprobar modo de error.
- [ ] Test de móvil real y proyector 1080p, Wi-Fi del evento y datos 4G.
- [ ] Plan B: pestaña con galaxia de ejemplo y PRs de respaldo identificados.

## 5. Enriquecimiento IA opcional

Habilitar binding `[ai] binding="AI"` de Workers AI en `wrangler.toml` únicamente tras validar cuotas. La enriquecimiento es posterior y **no condiciona que el objeto aparezca**. El campo `ai_detail` queda almacenado si el modelo responde. El cliente actual muestra descripción original, por lo que el enriquecimiento debe exponerse en una iteración posterior si se quiere visualizar al usuario.

## Nota de latencia

El formulario web inserta tras crear Issue, así que suele ser el camino más rápido. Las Issues creadas **directamente** desde GitHub Mobile pasan por la cola de GitHub Actions; no prometer aparición garantizada en menos de X segundos. Si el reto exige latencia más determinista, crear webhook de Issues firmado directamente en Worker y mantener Actions como respaldo.
