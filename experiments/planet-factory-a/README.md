# A: economy vs auto (#98)
Two manual-only gh-aw workflows with identical fixture and moderation task. No existing production workflow or lock changed. Compare exact model resolution, AI credits, latency, rejection and description fidelity. Audit using gh aw audit <run-url>; compare runtime evidence rather than assuming lower cost. Run evaluate.mjs against the downloaded triage.json from each run, plus manual review. Both locks are committed (compiled with gh-aw v1.2.3) and CI fails if a `.md` changes without recompiling. workflow_dispatch needs registration on the default branch of an isolated test repo. Never activate the economy setting in production until negative tests pass and cost is measured. No inferencing has been started.

## Aislamiento de la prueba

- Las fixtures usan ids opacos (`f1`, `f2`, `f3`) y llevan los cuatro campos del formulario, para que la política de `cosmic-object-triage.md` se aplique tal cual.
- `expected.json` se borra del workspace en un `pre-agent-steps` antes de que actúe el agente, y el prompt no lo menciona como disponible. **Riesgo residual:** con shell, el agente podría recuperarlo del historial de git (`git show HEAD:…`). Revisa en el audit que no lo haga.
- `tools.github: false`: el agente no tiene el servidor MCP de GitHub. Solo lee los ficheros del checkout.
- `evaluate.mjs` exige una descripción no vacía en las aceptadas y un motivo en todas, y rechaza cualquier salida que repita texto de las fixtures rechazadas. Tests: `node --test experiments/planet-factory-a/evaluate.test.mjs`.
- `max-ai-credits: 1` es el mismo tope para las dos variantes. Si `auto` resuelve un modelo caro y se corta antes de escribir `triage.json`, se estaría midiendo el tope y no el modelo: comprueba en el audit que ninguna ejecución termine por presupuesto antes de comparar.
