# Planet Factory C (#97)

Tres engines y fase 0 integrada: Luna Decisions (skip-if-decision) antes del Copilot/Gemini Flash de diseño; Claude/Haiku construye; Codex/Luna revisa. Los modelos son candidatos fijos, no disponibilidad verificada. El filtro de decisión experimental abstiene ante errores; Gemini conserva moderación completa. Si no hay brief, no hay construcción ni publicación: en vivo queda planet:held, no un rechazo inventado. Auditar harness.decision / retries.decisions y créditos reales. Foundry y Jev no son dependencias.

## Secuencia y estado

coordinator.yml es el único coordinador: prepare (validación determinista y snapshot), design (decisión + curaduría), gate-brief, construct, gate-spec, review, gate-review, publish. Los tres callee workflows no escriben Issues. needs y artefactos del mismo run/attempt controlan el relevo, no las labels. Las labels reflejan trabajo solicitado, no prueban que el modelo se ejecutara: admission durante prepare, design al invocar el workflow que contiene Luna Decisions, build/review tras superar gates, ready exclusivamente por la App final, rejected si el brief rechaza explícitamente, held si hay skip sin brief, fallo, edición o falta de evidencia. Añadir/retirar solo labels del sistema; una interrupción entre operaciones requiere reconciliación manual. Serializar por Issue. El evento planet:ready de la App activa el issue-to-universe.yml existente; su HMAC cubre el comentario con el spec exacto y hash. D1 confirma ese hash antes del cierre.

## E0: WorldSpecV1, sin GLB/R2 (#101 solo dependencia futura)

El constructor produce datos declarativos, no JavaScript. El publicador verifica snapshot, brief, SHA-256 y revisión, y publica comentario de App con marcador compatible y bytes base64url + hash. La rama añade ingesta específica y migración D1 0003, validación de App/etiqueta/Issue/hash/tipo y persistencia transaccional del spec exacto con revisión histórica. No llama a Foundry ni fallback para ese candidato. GET /api/objects entrega world_spec cuando WORLDGEN_ENABLED está activo; resolvedWorldSpec y buildWorld existentes lo consumen. Se añaden tests con SQLite y Worker real para contenido exacto, replay, firma, bloqueo administrativo y resolución sin fallback. El renderer no ejecuta JS de agentes. No se realiza migración ni despliegue desde la PR.

## Preparar y ensayar

CI compila los tres locks, el lock legacy con selector y copia coordinador a .github/workflows/planet-factory-c.yml; genera artefacto para versionar. No editar locks a mano. Confirmar nombres de artefactos, permisos y secretos de workflow_call. En un repo aislado, registrar workflows en default branch y ejecutar manualmente fixtures valid, unsupported, reject; las ejecuciones manuales NO escriben Issues/D1. Comprobar resolución de modelo, decisión nativa, proveedor Copilot para Claude/Codex, render, créditos y tiempos. Los reintentos parciales no reutilizan artefactos de otro run_attempt; repetir ejecución completa. Los tests de contrato no prueban inferencia real.

## Activación posterior (no activar todavía)

1. Versionar locks auténticos, resolver CI/lock drift y comprobar tres engines/gate en ensayo. Verificar threat detection y propagación de errores; no usar propuestas públicas sin ello. Confirmar presupuesto y límites por Issue/usuario.
2. Ensayar camino App con Issue real y Worker/D1 de staging, firma y revisiones. Migrar 0001, 0002, 0003 una vez con backup, verificar schema y health.
3. Drenar propuestas legacy/in-flight. Worker mantiene WORLDGEN_ENABLED y PLANET_FACTORY_ENABLED false hasta el cambio coordinado; para E0 habilitar ambas con DB migrada. Variable Actions ACADEMYVERSO_PLANET_FACTORY_ENABLED=true acepta issues.opened y desactiva triage legacy, solo con nuevo lock legacy versionado. Un mismatch puede dejar propuestas retenidas; no activar por separado. Validar rollback con propuestas en curso; no revertir ciegamente ni perder columnas.
4. Verificar D1 exacto, GET, Three.js y cierre. Proteger contra ediciones concurrentes entre lectura/patch/label (GitHub API no ofrece transacción multioperación), comprobar reconciliación de fallos; limitar a una propuesta de ensayo antes de exposición pública. Si falta modelo o revisión, no publicar ni usar fallback automático. El fallback sigue para objetos legacy.

#101 E1-E3 (WorldSpecV2, código aislado, GLB, R2) no se implementan aquí.

La ingesta vuelve a consultar el cuerpo/estado/label actual antes de firmar el evento: si cambió desde ready, se detiene. Sigue siendo necesaria reconciliación de escrituras concurrentes entre llamadas GitHub. En modo factoría, GET falla si no puede acceder al esquema WorldGen (no degrada silenciosamente a legacy por un fallo de schema). La suite de Three.js incluye una comprobación de que world_spec persistido determina geometría/POIs aunque el texto no incluya las palabras clave.
