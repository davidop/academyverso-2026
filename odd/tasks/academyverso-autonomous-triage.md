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
- La ingesta comprobará el marcador visible `[academyverso-triage:ready:v1]` tanto en el cuerpo actualizado como en el comentario antes de llamar al Worker; una etiqueta por sí sola no prueba que el agente haya terminado.
- Mantener intactos los workflows de comandos de evolución/rollback y el secreto HMAC existente.
- No publicar cambios remotos aparte de commits y actualización de la PR #39 expresamente solicitados.

## Ruta, TDD y entrega
- Ruta: direct inline. Evidencia: un comportamiento cohesivo entre dos workflows, su test y su documentación; el cambio se mantiene en la PR ya abierta.
- Riesgo: item 1 — workflow de GitHub Actions y permisos de escritura con Issues públicas no confiables; requiere verificación independiente de automatización.
- TDD: no hay configuración de modo encontrada en el proyecto/sesión; aplicar ciclos tracer-bullet RED/GREEN/REFACTOR por la skill `tdd` y por el contrato conductual ya descrito por el usuario. Runner: `npm --prefix worker test` y los checks específicos de Actions/gh-aw.
- RDD: disabled/unmanaged (global OFF observado); no iniciar reviews ni pedir consentimientos de RDD.
- Entrega: `single-pr`; la PR #39 ya existe. Estimación authored restante ~150 líneas, más cambios al material existente; el lock compilado se contabiliza como generado.

## Criterios de aceptación y checks
- [ ] AVT-1: el agente publica el comentario de interpretación y texto mejorado, después actualiza el Issue y añade una etiqueta terminal segura; Issue aceptada recibe `planet:ready`, contenido no publicable recibe `planet:rejected`, sin aprobación humana.
- [ ] AVT-2: solo `issues.labeled` con `planet:ready`, marcador de cuerpo y comentario de triage presente provoca POST firmado a Worker; opened/edited/reopened y otras labels no lo hacen. Los comandos existentes de evolución/rollback siguen funcionando.
- [ ] AVT-3: pruebas automáticas cubren la compuerta y la ruta de rechazo; docs explican el flujo. Compilar/validar Agentic Workflow y lock; ejecutar tests Worker/scripts, checks CI disponibles, `git diff --check`.
- [ ] AVT-4: revisión independiente read-only de seguridad del workflow de GitHub Actions completada; actualizar y verificar PR #39.

## Progreso y evidencia
- 2026-11-25: PR #39 existente y abierta (`https://github.com/davidop/academyverso-2026/pull/39`); la rama de trabajo está limpia. Checks de PR observados: browser-worldgen, slidev-build y validate pasan. El workflow actual aún ingiere al abrir/editar Issue y el Agentic Workflow escribe el cuerpo sin comentar ni etiquetar.
- Baseline: `npm test --prefix worker -- --help` (realmente ejecuta suite npm; 31/31 pasan).
- RED observado: el nuevo test multilinea falló porque `parseIssue` descartaba la segunda línea; el test de trigger falló porque la ingesta aún escuchaba `opened`.
- GREEN observado en commit `1095413`: `gh aw compile cosmic-object-triage --strict`, `gh aw validate cosmic-object-triage`, `npm test --prefix worker` (32/32), `python scripts/test_issue_flow.py`, `npm run check --prefix worker`, `node --check web/app.js` y `git diff --cached --check` pasaron.
- Revisión independiente del commit `1095413` detectó que el label por sí solo no demostraba triage. Corrección en curso: exigir marcador en body y comentario antes del POST.
- Hallazgo de sanitización: gh-aw elimina comentarios HTML de safe outputs; el marcador de integridad debe ser texto visible en el comment y en el pie del cuerpo.
- Próximo paso: compilar y probar el gate determinista, repetir verificación independiente, actualizar el task doc/mirror, y empujar el cambio a la PR #39 existente.
