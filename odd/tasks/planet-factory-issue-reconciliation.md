# Reconcile Planet Factory and WebMCP issues and PRs
Branch: `feature/planet-factory-c` (#102). Delivery: update the existing PR; forecast 150 authored lines, no new PR or merge.
Checks: structural readback, `git diff --check`, Node contract/Worker tests and syntax checks; test-first exception: passive documentation, no behavior change. RDD: disabled globally.

## Specs

- **S1** — "revisa los issues, evalúa las PRs asociadas". Scope: #85/#86, #97/#102, #98/#103, #99/#104, #100/#105, #101 and #107. Acceptance: distinguish implemented branch code, CI evidence and unverified live behavior; preserve unrelated content and current PR states.
- **S2** — "si crees que a lo mejor da más información tanto en el issue de añadir más información en la descripción, lo haces. Y también pues avanzas la PR con los cambios correspondientes." Acceptance: reconcile stale descriptions and the C runbook against existing source; verify GitHub readback and the branch update. No new production behavior is assumed necessary without a reproduced gap.
- **S3** — "el flujo más o menos de mezcla que creo que está documentado entre ellos" and "vamos a utilizar el modelo de decision de Luna GPT-6". Acceptance: document C as the E0 implementation, A/B/D as independent experiments, WebMCP as a separate entry channel, and #101 as visual evolution; identify native Luna Decisions without adding another dependency.
- **S4** — "si, te autorizo todo hazl o". This accepts the preceding proposal: use the connected GitHub integration to update the named issues/PRs, without merge, deployment, flag changes or migrations. Local clone only; preserve the original Motion Pilot checkout.

## Tasks

- [x] **T1** (S1-S3): reconcile the C runbook and verify the documentation delta; route: inline after completed delegated read-only mapping (>5 lookups); status: complete; commit: this work unit (SHA recorded by T2).
- [ ] **T2** (S1-S4): update issue/PR bodies, verify readback and publish the bounded documentation work unit to #102; route: inline, understood metadata reconciliation; status: active; commit: pending.

## Log

### L1 — Original request (2026-11-26)

> Revisa del repositorio de Academy Verso 2026 los issues que hay relacionados con los que creé yo. Que uno es el de WebMCP, el dos design workflow, evaluar el model routing del triaje de GHW que habrá que verlo. Luego el de Agentic Workflow copia el de SDK y luego evolucionar presentación del 3D y la de Copilot CLI con los tres modelos con sus PRs asociadas para ver si falta algo. Habría que emplear alguna cosa o qué. También ten en cuenta el flujo más o menos de mezcla que creo que está documentado entre ellos, cómo van. Y me interesa también el que no sé si está en la C o en cuál está relacionada en con el tema de utilizar Chef, pero en este caso vamos a utilizar el modelo de decision de Luna GPT-6. ¿En algún lado estará? No sé en cuál, porque eso habría que cambiarlo. Y demás. Entonces revisa los issues, evalúa las PRs asociadas y si crees que a lo mejor da más información tanto en el issue de añadir más información en la descripción, lo haces. Y también pues avanzas la PR con los cambios correspondientes. Teniendo en cuenta de dónde salió todo esto, que ahora te lo paso

### L2 — Authorization (2026-11-26)

> si, te autorizo todo hazl o

Accepted proposal: connected GitHub session, issue/PR updates only; no merge, deployment, flags or migrations.

### L3 — Starting evidence and boundaries

- C head `ed80caf97ca1e85307979143a5b9162d38a6375e`: authentic v1.2.3 locks and registered coordinator exist. PR #102 is open and **not draft**; preserve that state. General CI and compiler preview succeeded, not proof of live inference.
- Native `skip-if-decision` already lives in C design. It is advisory; Gemini still moderates. No candidate after skip means held, not approval or an invented rejection. Do not add a second factory or require Chef/TypeSafe/Foundry credentials.
- A/B/D and WebMCP remain draft. Their latest associated PR workflows succeeded; live model/delegation/WebMCP evidence remains pending.
- #84 corrected pending web creation in main; #85/#86 retain stale pre-triage wording. C-specific exact-spec ingestion exists in its branch, not deployed main.
- Risk: none for this documentation-only delta; no workflow, Worker, shared helper, permission or data-contract bytes will change. Runtime harness: N/A for passive docs; focused existing checks guard against an accidentally dirty checkout.
- Rollback: revert only this work unit's README/task-document paths and restore the previous GitHub bodies if necessary; do not revert earlier C implementation or migrations.
- Next: update the runbook, run checks, reconcile descriptions, and publish only the two documentation paths with an expected-head lease through the authorized connector.

### L4 — T1 verification (2026-11-26)

- Updated the existing Spanish C runbook: authentic locks are already present; decision and review models are distinct; the integration table separates the demo relay, C, WebMCP, independent A/B/D experiments and visual E1-E3.
- `node --test experiments/planet-factory-c/contract.test.mjs worker/test/factory-ingest.test.mjs`: 10 passed, 0 failed.
- `python scripts/test_d1_migrations.py`: passed on local disposable SQLite; no remote migration.
- `node --check web/app.js` and `npm --prefix worker run check`: passed.
- `npm --prefix worker test`: 65 passed, 0 failed. Only expected experimental SQLite warnings; no live model requests.
- `git diff --check`: passed. Structural readback confirmed the documented coordinator, source paths and flags against the branch.
- Full browser/Slidev builds, native WebMCP clients, cloud schema, live inference and deployed E2E were not run: no executable bytes changed. Existing CI evidence belongs to head `ed80caf`, not this documentation commit.
- Current authored delta forecast remains below 150 lines. T2 will update seven issue bodies and five PR descriptions without changing state, labels, reviewers or base branches.
