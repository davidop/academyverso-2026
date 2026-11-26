# B: Copilot CLI (#99)
Three separate noninteractive calls, own fixed model policy (not VS Code Model Router), identical synthetic fixture to C. No inference on PR; manual dispatch only after review and default-branch registration in an isolated test repo. CLI pinned to existing gh-aw engine version 1.0.103; verify flags and model catalog before run, including --silent and --disable-builtin-mcps. No blanket tool approval, temporary HOME/cwd, no production token, no public issues. This is NOT a strong sandbox for arbitrary public input; do not adapt to public submissions without isolation and secret/credit limits. Model IDs are candidates, not verified. Logs show configured model and elapsed time, actual model/credits need session/billing evidence. A rejection due to V1 limitations is a valid outcome. Do not execute generated code.

## Salvaguardas añadidas

- **Prueba de modelos antes de las fases:** `run.mjs` llama una vez a cada modelo de `models.json` con un prompt mínimo y exige `OK`. Un ID inexistente falla ahí, antes de gastar en interpretar y generar. Son tres llamadas mínimas de inferencia por ejecución.
- **CLI sin interacción ni red:** `--no-ask-user` (como el engine de gh-aw) y `--deny-tool url` además de `shell`, `write` y `read`.
- **Instalación verificada:** el workflow descarga `@github/copilot@1.0.103` con `npm pack` y compara su hash `sha512` con uno fijado antes de instalarlo. Si no coincide, no se instala.
- **Revisión atada a los bytes:** el revisor recibe `candidate_json`, el texto exacto de `generate.json`, y `spec_sha256`, su hash. Debe devolver ese mismo campo.
- **Respuestas robustas:** se acepta JSON envuelto en ```` ```json ````, y un JSON no válido o que no sea objeto falla con el nombre de la fase.
- **Tests:** `node --test experiments/planet-factory-b/run.test.mjs`, que se ejecuta en cada PR y comprueba también los imports de `run.mjs`.

