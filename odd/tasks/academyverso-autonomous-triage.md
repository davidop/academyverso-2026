# AcademyVerso · triage autónomo y compuerta de ingesta

## Objetivo
Actualizar la PR #39 para que las Issues públicas de objetos cósmicos pasen por un triage automático antes de entrar en D1: el agente deja un comentario visible con lo que entendió y una descripción mejorada, actualiza el campo usado por la web y añade una etiqueta de salida; solo la etiqueta `planet:ready` dispara la ingesta existente. No hay aprobación humana.

## Problema y motivación
La PR #39 ya incorpora un Agentic Workflow, pero la ingesta actual escucha `opened`, `edited` y `reopened`; por tanto, registra la entrada original antes de terminar el triage. Además, el triage actual reemplaza el cuerpo sin explicar públicamente lo que entendió y no añade una etiqueta de compuerta.

## Alcance autorizado
- Continuar en `svg153-triage-issues-planetas` y actualizar la PR existente #39 (no crear una PR duplicada).
- Cambiar el Agentic Workflow para comentar la interpretación, conservar la intención en una descripción mejorada y añadir `planet:ready` únicamente tras completar las salidas requeridas.
- Para contenido que el agente clasifique como spam/abuso/no apto, comentar y marcar `planet:rejected`; no activar D1. Sin paso de aprobación manual.
- Cambiar `.github/workflows/issue-to-universe.yml` para ingerir solo la etiqueta exacta `planet:ready`; ignorar aperturas, ediciones y otras etiquetas.
- Actualizar pruebas y documentación del flujo, incluyendo activación y límites de seguridad.
- Mantener el WorldGen/Foundry apagado: activar modelos por caso queda fuera de esta PR.

## Restricciones
- Tratar título, cuerpo y comentarios de Issues como entrada hostil.
- El agente no recibe shell ni permisos de escritura directa; solo safe outputs enumerados y limitados.
- El comentario explicará la interpretación y mostrará el texto final; la etiqueta solo se aplica si la propuesta y la actualización del contenido terminan correctamente.
- La ingesta comprobará el marcador visible `[academyverso-triage:ready:v1]` tanto en el cuerpo actualizado como en el comentario antes de llamar al Worker. Además, el evento de etiqueta y el comentario deben proceder del login exacto de GitHub App configurado en `ACADEMYVERSO_TRIAGE_BOT` (con sufijo `[bot]`); el marcador visible aislado se puede falsificar y no prueba autenticidad. Se requiere App porque eventos `issues.labeled` creados con GITHUB_TOKEN no inician workflows posteriores.
- Mantener intactos los workflows de comandos de evolución/rollback y el secreto HMAC existente.
- No publicar cambios remotos aparte de commits y actualización de la PR #39 expresamente solicitados.

## Ruta, TDD y entrega
- Ruta: direct inline. Evidencia: un comportamiento cohesivo entre dos workflows, su test y su documentación; el cambio se mantiene en la PR ya abierta.
- Riesgo: item 1 — workflow de GitHub Actions y permisos de escritura con Issues públicas no confiables; requiere verificación independiente de automatización.
- TDD: no hay configuración de modo encontrada en el proyecto/sesión; aplicar ciclos tracer-bullet RED/GREEN/REFACTOR por la skill `tdd` y por el contrato conductual ya descrito por el usuario. Runner: `npm --prefix worker test` y los checks específicos de Actions/gh-aw.
- RDD: disabled/unmanaged (global OFF observado); no iniciar reviews ni pedir consentimientos de RDD.
- Entrega: `single-pr`; la PR #39 ya existe. Estimación authored restante ~150 líneas, más cambios al material existente; el lock compilado se contabiliza como generado.

## Criterios de aceptación y checks
- [x] AVT-1: el agente publica el comentario de interpretación y texto mejorado, después actualiza el Issue y añade una etiqueta terminal segura; Issue aceptada recibe `planet:ready`, contenido no publicable recibe `planet:rejected`, sin aprobación humana.
- [x] AVT-2: solo `issues.labeled` con `planet:ready`, marcador de cuerpo, comentario y atribución a login de la GitHub App configurada provoca POST firmado a Worker; opened/edited/reopened, re-etiquetado manual y otras labels no lo hacen. Los comandos existentes de evolución/rollback siguen funcionando.
- [x] AVT-3: pruebas automáticas cubren la compuerta y la ruta de rechazo; docs explican el flujo. Compilar/validar Agentic Workflow y lock; ejecutar tests Worker/scripts, checks CI disponibles, `git diff --check`.
- [x] AVT-4: revisión independiente read-only de seguridad del workflow de GitHub Actions completada; actualizar y verificar PR #39.

## Progreso y evidencia
- 2026-11-25: PR #39 existente y abierta (`https://github.com/davidop/academyverso-2026/pull/39`). Rama remota `svg153-triage-issues-planetas` contiene `1095413` y `d39227b`; el commit local `ed5c1b0` contiene la corrección final y está pendiente de push a ese head. Checks previos de PR: browser-worldgen, slidev-build y validate pasan.
- Baseline: `npm test --prefix worker -- --help` (realmente ejecuta suite npm; 31/31 pasan).
- RED observado: el nuevo test multilinea falló porque `parseIssue` descartaba la segunda línea; el test de trigger falló porque la ingesta aún escuchaba `opened`.
- GREEN observado en commit `1095413`: `gh aw compile cosmic-object-triage --strict`, `gh aw validate cosmic-object-triage`, `npm test --prefix worker` (32/32), `python scripts/test_issue_flow.py`, `npm run check --prefix worker`, `node --check web/app.js` y `git diff --cached --check` pasaron.
- Revisión independiente del commit `1095413` detectó que el label por sí solo no demostraba triage. Corrección en curso: exigir marcador en body y comentario antes del POST.
- Hallazgo de sanitización: gh-aw elimina comentarios HTML de safe outputs; el marcador de integridad debe ser texto visible en el comment y en el pie del cuerpo.
- Segunda verificación independiente halló que el marcador público podía falsificarse o quedar obsoleto. Corrección inicial con GITHUB_TOKEN quedó descartada: GitHub no dispara otros workflows por eventos creados con ese token. Solución actual: usar una GitHub App de safe outputs y comprobar el login bot configurado en evento y comentario. La identidad queda parametrizada en `ACADEMYVERSO_TRIAGE_BOT`; la configuración externa aún no se verifica ni se aprovisiona.
- Verificación local final: `gh aw compile cosmic-object-triage --strict --approve` compila el token de App en el lock; `gh aw validate cosmic-object-triage`, `python scripts/test_issue_flow.py`, `npm test --prefix worker` (32/32), `npm run check --prefix worker`, `node --check web/app.js` y `git diff --check` pasan. gh-aw señala revisión de seguridad por el nuevo secreto `ACADEMYVERSO_TRIAGE_APP_PRIVATE_KEY`; revisado: solo permite acuñar el token de instalación scoped de safe outputs. La nueva acción `actions/create-github-app-token@v3.3.0` está fijada a SHA; no se añadió redirect. El PR debe documentar estas adiciones y que las credenciales/config reales siguen sin verificarse.
- Revisión independiente final: automation_verifier no detectó bypass adicional; verificó token App scoped y condición/autor contra el bot configurado. Las variables/secret y la instalación externa de la App no se inspeccionaron. Commit de trabajo: `ed5c1b0feb569badc40fec089b0a283169b2e7e8` (`fix(issues): authenticate autonomous planet triage`). Push y PR completados: `cadfea2` actualiza el head de `svg153-triage-issues-planetas` a `cadfea2ed942a372856b2424231d9257a6d8f4b7`; PR #39 sigue abierta. Se añadió a su descripción la nota de revisión del secreto y acción, más los requisitos de configuración que siguen sin aprovisionar/verificar. CI remoto para ese head: `validate`, `browser-worldgen` y `slidev-build` pasan. Sin cambios pendientes de código; antes de activar producción, el propietario debe instalar la App y configurar sus variables/secreto.
