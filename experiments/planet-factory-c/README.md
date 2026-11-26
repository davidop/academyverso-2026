# Planet Factory C (#97)

Tres engines y fase 0 integrada: Luna Decisions (skip-if-decision) antes del Copilot/Gemini Flash de diseño; Claude/Haiku construye; Codex/Luna revisa. Los modelos son candidatos fijos, no disponibilidad verificada. El filtro de decisión experimental abstiene ante errores; Gemini conserva moderación completa. Si no hay brief, no hay construcción ni publicación: en vivo queda planet:held, no un rechazo inventado. Auditar harness.decision / retries.decisions y créditos reales. Foundry y Jev no son dependencias.

## Estado verificado de la rama (26/11/2026)

El commit [`ed80caf`](https://github.com/davidop/academyverso-2026/commit/ed80caf97ca1e85307979143a5b9162d38a6375e) ya incorpora los tres locks `planet-c-{design,build,review}.lock.yml`, el lock legacy y `.github/workflows/planet-factory-c.yml`. La [compilación](https://github.com/davidop/academyverso-2026/actions/runs/45730240728) y la [CI general](https://github.com/davidop/academyverso-2026/actions/runs/45730240671) de ese commit finalizaron correctamente. No falta volver a añadir esos archivos; sí falta evidencia de inferencia real y de integración desplegada. Comprobar siempre los checks del último head, no trasladar este resultado a commits posteriores.

La [PR #102](https://github.com/davidop/academyverso-2026/pull/102) sigue abierta y actualmente no es draft. Ese estado no demuestra que haya pasado los gates de activación ni autoriza el merge. El checklist operativo de David está en [#107](https://github.com/davidop/academyverso-2026/issues/107).

La fase 0 ya está en `.github/workflows/planet-c-design.md`: no hay que añadir otro workflow de admisión. Según la [referencia de gh-aw](https://github.github.com/gh-aw/reference/frontmatter/#invocation-skip-questions), `skip-if-decision` utiliza `gpt-6-luna-decisions` con el proveedor Copilot; no es el modelo de revisión `copilot/gpt-6-luna`. Es una capacidad experimental: comprobar acceso y eventos reales con la versión fijada antes de afirmar que se ejecutó. TypeSafe Jev y Foundry no son requisitos de este camino.

## Secuencia y estado

coordinator.yml es el único coordinador: prepare (validación determinista y snapshot), design (decisión + curaduría), gate-brief, construct, gate-spec, review, gate-review, publish. Los tres callee workflows no escriben Issues. needs y artefactos del mismo run/attempt controlan el relevo, no las labels. Las labels reflejan trabajo solicitado, no prueban que el modelo se ejecutara: admission durante prepare, design al invocar el workflow que contiene Luna Decisions, build/review tras superar gates, ready exclusivamente por la App final, rejected si el brief rechaza explícitamente, held si hay skip sin brief, fallo, edición o falta de evidencia. Añadir/retirar solo labels del sistema; una interrupción entre operaciones requiere reconciliación manual. Serializar por Issue. El evento planet:ready de la App activa el issue-to-universe.yml existente; su HMAC cubre el comentario con el spec exacto y hash. D1 confirma ese hash antes del cierre.

## E0: WorldSpecV1, sin GLB/R2 (#101 solo dependencia futura)

El constructor produce datos declarativos, no JavaScript. El publicador verifica snapshot, brief, SHA-256 y revisión, y publica comentario de App con marcador compatible y bytes base64url + hash. La rama añade ingesta específica y migración D1 0003, validación de App/etiqueta/Issue/hash/tipo y persistencia transaccional del spec exacto con revisión histórica. No llama a Foundry ni fallback para ese candidato. GET /api/objects entrega world_spec cuando WORLDGEN_ENABLED está activo; resolvedWorldSpec y buildWorld existentes lo consumen. Se añaden tests con SQLite y Worker real para contenido exacto, replay, firma, bloqueo administrativo y resolución sin fallback. El renderer no ejecuta JS de agentes. No se realiza migración ni despliegue desde la PR.

## Preparar y ensayar

CI recompila con gh-aw v1.2.3 los tres locks y el lock legacy con selector, y copia el coordinador fuente a `.github/workflows/planet-factory-c.yml`; genera un artefacto de preview para inspección. Las versiones auténticas ya están incorporadas en la rama. Ante cambios de fuentes, recompilar y revisar la actualización; no editar locks a mano. Confirmar nombres de artefactos, permisos y secretos de workflow_call. En un repo aislado, registrar workflows en default branch y ejecutar manualmente fixtures valid, unsupported, reject; las ejecuciones manuales NO escriben Issues/D1. Comprobar resolución de modelo, decisión nativa, proveedor Copilot para Claude/Codex, render, créditos y tiempos. Los reintentos parciales no reutilizan artefactos de otro run_attempt; repetir ejecución completa. Los tests de contrato no prueban inferencia real.

## Activación posterior (no activar todavía)

1. Comprobar que los locks versionados corresponden a sus fuentes y que la CI del último head pasa; ensayar realmente los tres engines y el gate de decisión. Verificar threat detection y propagación de errores; no usar propuestas públicas sin ello. Confirmar presupuesto y límites por Issue/usuario.
2. Ensayar camino App con Issue real y Worker/D1 de staging, firma y revisiones. Migrar 0001, 0002, 0003 una vez con backup, verificar schema y health.
3. Drenar propuestas legacy/in-flight. Worker mantiene WORLDGEN_ENABLED y PLANET_FACTORY_ENABLED false hasta el cambio coordinado; para E0 habilitar ambas con DB migrada. Variable Actions ACADEMYVERSO_PLANET_FACTORY_ENABLED=true acepta issues.opened y desactiva triage legacy, solo con nuevo lock legacy versionado. Un mismatch puede dejar propuestas retenidas; no activar por separado. Validar rollback con propuestas en curso; no revertir ciegamente ni perder columnas.
4. Verificar D1 exacto, GET, Three.js y cierre. Proteger contra ediciones concurrentes entre lectura/patch/label (GitHub API no ofrece transacción multioperación), comprobar reconciliación de fallos; limitar a una propuesta de ensayo antes de exposición pública. Si falta modelo o revisión, no publicar ni usar fallback automático. El fallback sigue para objetos legacy.

#101 E1-E3 (WorldSpecV2, código aislado, GLB, R2) no se implementan aquí.

## Relación con las demás PRs

| Issue / PR | Papel y siguiente paso |
| --- | --- |
| #97 / #102 (C) | Única implementación E0: admisión, diseño, construcción, revisión y publicador. Revisar primero; migración, ensayo y activación siguen el checklist #107. No está desplegada por existir la PR. |
| #85 / #86 (WebMCP) | Canal de lectura/navegación, no otro generador. Después de estabilizar C, sincronizar con main y repetir CI y pruebas con cliente real. No añadir creación ni cerrar #85 por esta primera fase. |
| #98 / #103 (A) | Comparar `auto` y `router/economy` en triaje aislado. No encadena tres fases ni es requisito para C. |
| #99 / #104 (B) | Tres procesos Copilot CLI con modelos fijos; alternativa de orquestación, no Model Router de VS Code. Mantener aislada hasta medirla. |
| #100 / #105 (D) | Un workflow SDK con subagentes; exigir telemetría de delegación real, no solo JSON correcto. Alternativa, no paso posterior obligatorio a B. |
| #101 | Evolución del artefacto E1-E3 después de E0: comparar WorldSpecV2 y GLB sin duplicar la factoría. R2 no es necesario para el ensayo E0. |

No fusionar A/B/D por orden alfabético ni combinar sus workflows con C. El orden C → WebMCP es de integración operativa, no una dependencia del protocolo WebMCP. El relevo humano de la demo (Copilot construye → Claude mejora → Codex verifica sobre el merge anterior) es otro flujo, no la secuencia de publicación de planetas.

Para comparar B/C/D, ampliar el fixture inicial al mismo corpus de diez propuestas sintéticas, incluyendo casos representables, fuera de catálogo y maliciosos; A compara moderación sobre esas mismas entradas, no calidad 3D. Registrar commit, hash de entrada/salida, run/attempt, versiones, modelo configurado y ejecutado, decisión, latencia, créditos, fidelidad, fallos y peso/rendimiento visual cuando corresponda. El corpus completo y sus mediciones siguen pendientes; no atribuir costes o calidad a una familia sin evidencia. En C distinguir invocación de Luna, abstención/skip y moderación completa.

La ingesta vuelve a consultar el cuerpo/estado/label actual antes de firmar el evento: si cambió desde ready, se detiene. Sigue siendo necesaria reconciliación de escrituras concurrentes entre llamadas GitHub. En modo factoría, GET falla si no puede acceder al esquema WorldGen (no degrada silenciosamente a legacy por un fallo de schema). La suite de Three.js incluye una comprobación de que world_spec persistido determina geometría/POIs aunque el texto no incluya las palabras clave.
