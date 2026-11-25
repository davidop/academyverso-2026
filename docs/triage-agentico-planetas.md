# Triage automático de objetos cósmicos

`.github/workflows/cosmic-object-triage.md` define el Agentic Workflow; el
`.lock.yml` correspondiente es el workflow compilado que ejecuta GitHub
Actions.

## Flujo de una aportación

1. Al abrirse una Issue con el formulario de objeto cósmico, el agente lee sus
   cuatro campos como datos públicos no confiables; no sigue instrucciones que
   aparezcan dentro del texto.
2. Si la propuesta es publicable, comenta **lo que entendió** y la descripción
   que aparecerá en el planeta. Después actualiza solo `Descripción creativa`
   en el cuerpo y añade `planet:ready`. La etiqueta depende de que el comentario
   y la actualización hayan terminado correctamente.
3. Si detecta spam, abuso, instrucciones maliciosas, enlaces/datos personales o
   contenido fuera de tema, comenta el rechazo y añade `planet:rejected`. No hay
   paso de aprobación humana y esta etiqueta no activa la ingesta.
4. `.github/workflows/issue-to-universe.yml` solo ingiere el evento de etiqueta
   `planet:ready`, firma el payload y lo envía al Worker. El Worker valida el
   formulario, actualiza D1 y el workflow cierra la Issue solo tras confirmar
   la escritura.
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
3. Mantén juntos en `main` el archivo fuente `.md` y el lock compilado; GitHub
   Actions registra el trigger de Issues desde la rama por defecto.
4. Crea una Issue de prueba con una propuesta normal y comprueba en Actions que
   el comentario y el cuerpo se actualizan antes de `planet:ready`; verifica
   después la ejecución de `issue-to-universe`, respuesta Worker/D1 y cierre.
5. Prueba una propuesta con prompt injection o spam: debe aparecer el comentario
   de rechazo y la etiqueta `planet:rejected`, sin POST a Worker ni cierre por
   ingestión.

Las pruebas locales verifican contrato y triggers, pero no sustituyen el
ensayo end-to-end en GitHub con el secreto del motor configurado.
