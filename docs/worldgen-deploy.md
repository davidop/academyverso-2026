# WorldGen: despliegue controlado y evolución de mundos

**Estado:** código en PR #19 (draft). NO desplegado. No activar antes del ensayo de móvil y proyector del 25/11. Evento 26/11/2026.

## Requisitos

- Cloudflare Worker y D1 `academyverso` existentes con tabla `objects`.
- Acceso legítimo a Cloudflare Wrangler; no subir credenciales al repositorio.
- Microsoft Foundry con despliegue compatible con Chat Completions v1 y JSON Schema estricto. El cliente solo acepta recursos HTTPS `*.openai.azure.com` / `*.services.ai.azure.com` y ruta `/openai/v1/chat/completions`.
- No asumir que Anthropic/Claude acepta Azure OpenAI v1. Verificar modelo/deployment.
- Conservar `WORLDGEN_ENABLED = "false"` inicialmente.

## Backup y migraciones (desde worker/)

1. Guardar respaldo real y verificar los dos objetos de ensayo:

```bash
npx wrangler d1 export academyverso --remote --output=./academyverso-before-worldgen.sql
npx wrangler d1 execute academyverso --remote --command="SELECT issue_number,name FROM objects WHERE issue_number IN (10,11);"
```

No subir la copia exportada a GitHub.

2. Ensayar sobre un D1 local nuevo (no repetir sobre tablas ya inicializadas):

```bash
npx wrangler d1 execute academyverso --local --file=./schema.sql
npx wrangler d1 migrations apply academyverso --local
```

3. Comprobar migraciones pendientes y aplicar solo tras backup y revisión:

```bash
npx wrangler d1 migrations list academyverso --remote
npx wrangler d1 migrations apply academyverso --remote
npx wrangler d1 execute academyverso --remote --command="SELECT issue_number,name,world_version FROM objects WHERE issue_number IN (10,11);"
```

`0001_world_specs.sql` y `0002_world_revisions.sql` son aditivas. NO ejecutar `schema.sql` otra vez en producción.

4. Confirmar endpoint, modelo, cuotas y Structured Outputs del despliegue Foundry. Guardar secretos en Cloudflare:

```bash
npx wrangler secret put FOUNDRY_ENDPOINT
npx wrangler secret put FOUNDRY_DEPLOYMENT
npx wrangler secret put FOUNDRY_API_KEY
```

5. Configurar límite `FOUNDRY_DAILY_MAX` (predeterminado 75) y habilitar `WORLDGEN_ENABLED` solo después de probar el Worker en preview con D1 no productiva.

6. Comprobar `GET /api/health` y `GET /api/objects`. Crear una Issue nueva real, verificar estado, spec y versión en D1.

## Evolución y rollback

**GitHub Mobile**: el autor autenticado puede publicar un comentario en su Issue, incluso cerrada:

```text
/academyverso-evolve Añade dos lunas violetas y una ciudad flotante
/academyverso-rollback 1
```

La GitHub Action firma el evento con HMAC; el Worker confirma que `sender.id`, `comment.user.id` y `issue.user.id` coinciden. No basta con conocer alias o número de Issue.

**Formulario web**: al crear el objeto, el Worker devuelve una clave de edición aleatoria de 256 bits una sola vez. La UI permite copiarla y la conserva en la sesión de la pestaña actual. D1 guarda solo su hash SHA-256. Sin la clave no se puede recuperar la propiedad mediante alias.

**Historial**: `GET /api/worlds/:issue_number/history` devuelve versiones, estados y fecha de mundos públicos. Restaurar crea una nueva versión y conserva las anteriores. Límite inicial: ocho versiones por mundo. Si Foundry falla o se agota la cuota, se utiliza y etiqueta un diseño procedural.

## Gates de QA obligatorios antes de producción

- [ ] CI de contrato, Foundry simulado, seguridad, D1 y WebGL en Chromium en verde.
- [ ] D1 remota respaldada, migraciones probadas, objetos de ensayo #10 y #11 intactos.
- [ ] Modelo Foundry real compatible con JSON Schema estricto y consumo verificado.
- [ ] Android físico: tacto, pellizco, lector de pantalla, movimiento reducido, FPS y proyector.
- [ ] Evolución real: Issue GitHub Mobile del autor y objeto web con clave privada.
- [ ] Pruebas de timeout, error 429/5xx y fallback sin duplicar Issues.
- [ ] Ensayo David + Sergio y SHA de rollback fijado el 25/11.

**Desactivar WorldGen:** cambiar `WORLDGEN_ENABLED` a false en Cloudflare y volver a desplegar. No borrar las columnas nuevas ni el historial.

Referencias:
- https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/structured-outputs
- https://developers.cloudflare.com/d1/reference/migrations/
- https://developers.cloudflare.com/d1/best-practices/import-export-data/
