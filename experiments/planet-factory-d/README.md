# D: Copilot SDK (#100)
One parent workflow, three named inline subagents with fixed candidate models across families. No publishing and no production token. The parent controls delegation, unlike C's deterministic stage scheduling; therefore a valid JSON bundle is not sufficient evidence. Check audit/session telemetry for actual calls/model resolutions and sequence; run evaluate.mjs on bundle.json and manually assess fidelity. A missing or incompatible model is a failed trial, not an excuse to silently route elsewhere. The lock is committed (gh-aw v1.2.3) and CI fails if the `.md` changes without recompiling. Manual dispatch requires registration on an isolated default branch. SDK version/dependency pin requirements and compatibility are pending compile/run. No inferencing on PR.

## Cambios para que el ensayo mida lo que pretende

- **Cuatro modelos distintos:** orquestador `claude-sonnet-5.5`, diseñador `claude-haiku-5.5`, constructor `gemini-3.8-flash` y revisor `gpt-6-luna`. Con modelos distintos, la telemetría puede probar que cada delegación ocurrió de verdad y que el orquestador no respondió por un subagente. Todos son IDs candidatos que hay que verificar en el catálogo, igual que antes.
- **El bundle se escribe siempre**, con `status` (`complete`, `rejected` o `failed`) y `stage` (el subagente que rechazó o falló). Un rechazo deja sus motivos en el artefacto, y `evaluate.mjs` los muestra.
- **Aprobar implica no tener hallazgos:** se lo dice el prompt del revisor y `evaluate.mjs` lo exige.
- El prompt permite expresamente escribir `planet-output/bundle.json`, y solo eso. Sigue prohibido ejecutar código generado.
- `tools.github: false`: el agente no tiene el servidor MCP de GitHub. `timeout-minutes: 15`, porque 5 no daban para arrancar el entorno y hacer tres delegaciones.
- Tests del evaluador: `node --test experiments/planet-factory-d/evaluate.test.mjs`.

