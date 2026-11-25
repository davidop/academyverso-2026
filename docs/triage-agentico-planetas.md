# Triage automático de objetos cósmicos

`.github/workflows/cosmic-object-triage.md` define el Agentic Workflow; el
`.lock.yml` correspondiente es el workflow compilado que ejecuta GitHub
Actions.

## Flujo de una aportación

0. Si la propuesta llega por el formulario web, `/api/create` abre la Issue y
   guarda el objeto en D1 **oculto** (`hidden=1`). La web avisa de que el agente
   la está revisando y de que aparecerá en unos minutos si la aprueba. Si llega
   por la plantilla de GitHub (web o Mobile), no hay nada en D1 hasta la ingesta.
1. Al abrirse una Issue con el formulario de objeto cósmico, el agente lee sus
   cuatro campos como datos públicos no confiables; no sigue instrucciones que
   aparezcan dentro del texto.
2. Si la propuesta es publicable, comenta **lo que entendió** y la sección
   «Descripción que aparecerá en el planeta», que es el texto que se publicará
   en el planeta. Después actualiza solo `Descripción creativa` en el cuerpo
   (manteniendo tipo, alias y nombre) y añade `planet:ready`. La etiqueta
   depende de que el comentario y la actualización hayan terminado
   correctamente. Ambos muestran el marcador `[academyverso-triage:ready:v1]`
   para que la ingesta pueda verificar las dos salidas.
3. Si detecta spam, abuso, instrucciones maliciosas, enlaces/datos personales o
   contenido fuera de tema, comenta el rechazo y añade `planet:rejected`. No hay
   paso de aprobación humana y esta etiqueta no activa la ingesta.
4. `.github/workflows/issue-to-universe.yml` solo ingiere el evento de etiqueta
   `planet:ready`, captura el comentario confiable del bot y lo adjunta al
   payload firmado como `triage_comment`. El Worker toma tipo, alias y nombre
   del cuerpo de la Issue y la descripción de la sección «Descripción que
   aparecerá en el planeta» del comentario; valida, actualiza D1 **y publica el
   objeto** (`hidden=0`), y el workflow cierra la Issue solo tras confirmar la
   escritura. Una propuesta rechazada nunca pasa por aquí, así que la del
   formulario se queda oculta. Sin `triage_comment` se conserva la ruta legacy,
   que lee todos los campos del cuerpo y no cambia la visibilidad de un objeto
   que ya existe.
5. La web lee D1 y muestra el objeto. El flag WorldGen/Foundry se configura por
   separado; este triage no activa proveedores ni modelos de generación.

La ingesta ignora `opened`, `edited`, `reopened` y etiquetas distintas de
`planet:ready`. Los comentarios con `/academyverso-evolve` y
`/academyverso-rollback` conservan su ruta condicionada a WorldGen.

## Seguridad y límites

- El agente tiene lectura de Issues y no dispone de shell, checkout del código
  de la aplicación ni escritura directa.
- Los únicos outputs disponibles son un comentario, una actualización limitada
  al cuerpo y una etiqueta de una lista cerrada. `planet:ready` se añade al
  final; `planet:rejected` solo marca una entrada bloqueada.
- El texto final conserva tipo, alias, nombre e intención; no inventa
  características y respeta el máximo de 280 caracteres validado por el Worker.
- El comentario evita repetir contenido sospechoso. La salida de safe-outputs
  aplica validación/sanitización y la compilación genera el lock endurecido.
- Si el modelo o la salida fallan, no se añade `planet:ready`, por lo que no se
  publica un objeto sin triage.
- El marcador de cierre es texto visible: gh-aw elimina comentarios HTML de los
  safe outputs, así que un marcador HTML oculto no serviría como evidencia. El
  marcador por sí solo no autentica: los safe outputs usan una GitHub App y la
  ingesta solo acepta evento y comentario atribuidos al bot configurado
  (`ACADEMYVERSO_TRIAGE_BOT`, con sufijo `[bot]`). Copiar el marcador o
  volver a etiquetar manualmente una Issue no basta. Se necesita una App porque
  el `GITHUB_TOKEN` no volvería a disparar el workflow `issues.labeled`.
- gh-aw escapa la sintaxis Markdown de los safe outputs, así que el marcador
  llega como `\[academyverso-triage:ready:v1\]`. El workflow busca el token
  sin corchetes y el Worker acepta las dos formas. La descripción se desescapa
  antes de publicarse, para que los markers GTA lleguen limpios.
- La vía `triage_comment` solo se acepta si la variable del Worker `TRIAGE_BOT`
  está configurada con el login exacto de la App (sufijo `[bot]`), el comentario
  procede de ese login y contiene el marcador; en caso contrario el Worker
  responde 400. Los markers GTA `[GTA:VICE-NEBULA]` y `[GTA:COLONIA-CENTINELA]`
  se conservan al inicio de la descripción para el conteo por escenario de la
  web.

## Activación y prueba

1. Instala/actualiza la extensión y compila el workflow tras modificar su
   Markdown:

   ```bash
   gh extension install github/gh-aw
   gh aw compile cosmic-object-triage
   gh aw validate cosmic-object-triage
   ```

2. Configura el motor Copilot para el repositorio y el secreto
   `COPILOT_GITHUB_TOKEN` con los permisos documentados por gh-aw. No guardes
   tokens en el repositorio. Si se usa facturación Copilot de organización,
   revisa los permisos de `copilot-requests` antes de habilitarlos.
3. Configura una GitHub App dedicada, instalada en `davidop/academyverso-2026`,
   con `Issues: write` y estos permisos de lectura que gh-aw necesita en su
   job de conclusión: `Actions: read`, `Checks: read` y `Pull requests: read`.
   Añade la variable `ACADEMYVERSO_TRIAGE_APP_CLIENT_ID`,
   el secreto `ACADEMYVERSO_TRIAGE_APP_PRIVATE_KEY` y la variable
   `ACADEMYVERSO_TRIAGE_BOT` con el login exacto de la App terminado en `[bot]`.
   No uses una identidad personal. La App permite que la etiqueta despierte el
   workflow siguiente y que la ingesta autentique el autor del evento y comentario.
4. Declara la variable del Worker `TRIAGE_BOT` en `worker/wrangler.toml`,
   dentro de `[vars]`, con el mismo login de la App que
   `ACADEMYVERSO_TRIAGE_BOT`. No la pongas solo en el panel de Cloudflare:
   `wrangler deploy` sustituye las variables por las del fichero. Sin ella, el
   Worker rechaza los payloads con `triage_comment`. El Worker se despliega solo
   con Cloudflare Workers Builds en cada merge a `main`.
5. Mantén juntos en `main` el archivo fuente `.md` y el lock compilado; GitHub
   Actions registra el trigger de Issues desde la rama por defecto.
6. Crea una Issue de prueba con una propuesta normal y comprueba en Actions que
   el comentario y el cuerpo se actualizan antes de `planet:ready`; verifica
   después la ejecución de `issue-to-universe`, respuesta Worker/D1 y cierre.
   Confirma que la descripción publicada en el planeta coincide con la sección
   «Descripción que aparecerá en el planeta» del comentario del bot.
7. Prueba una propuesta con prompt injection o spam: debe aparecer el comentario
   de rechazo y la etiqueta `planet:rejected`, sin POST a Worker ni cierre por
   ingestión.

Las pruebas locales verifican contrato y triggers, pero no sustituyen el
ensayo end-to-end en GitHub con el secreto del motor configurado.
