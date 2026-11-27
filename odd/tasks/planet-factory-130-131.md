# Planet Factory gate for demo issues #130 and #131
Objective: make the user-requested visuals representable and rendered without weakening the review gate.
Branch: `codex/planet-factory-gate-130-131` | Delivery: `ask-on-risk` | Runner: Node.js `node --test` plus browser validation after publication.

## Specs

### S1 — Render demo issue #130 faithfully
User request: “arreglarlo y llegar a que consigas que la 130, 131 y el gate funcione para que esa 130, 131 se vean en la página web”. Issue #130 asks for “un anillo dorado que brilla al amanecer”. Add deterministic, validated WorldSpec support and rendering for the requested ring glow; retain candidate-bound approval and fail-closed behavior. Checks: regression test through the renderer/spec seam, Planet Factory contract tests, site/browser validation of #130 after publication.

### S2 — Keep #131 candidate within implemented behavior
User request: “arreglarlo y llegar a que consigas que la 130, 131 y el gate funcione para que esa 130, 131 se vean en la página web”. Issue #131 asks for an oceanic planet, a silver moon, and a gold ring; it does not request slow-orbit. Ensure generated WorldSpec either avoids unsupported animation or the renderer implements the declared animation. Do not weaken contract.mjs review checks. Checks: regression test for generated/validated animation behavior, Planet Factory contract tests, site/browser validation of #131 after publication.

### S3 — Preserve the rest for later
User request: “cuando veas que están funcionando y ya se han creado y arreglado, pues miramos para crear el resto. Y arreglar el resto.” Limit this task to #130, #131, and the gate/render behavior they expose; do not backfill other issues or create a GitHub Project / Issue Types design here.

## Tasks

- T1 — S1-S3; inline; partial; Risk: item 3 (WorldSpec is consumed by the factory, worker, and renderer), item 5 (GitHub Actions reopen trigger/state transition), item 6 (existing tests did not cover the renderer output for these visuals); local work-unit commit `c88b54e0aa45e94c90676dc011892b4bfc949bf0`; PR #132. Live issue progression and production rendering remain pending after user-authorized merge/deployment.

## Log

### L1 — Original user request
“Vale, pues continúa con esas  130, 131 para hablarlo del gate. Y me dices, espera, dentro de las pruebas que necesites y cuando veas que están funcionando y ya se han creado y arreglado, pues miramos para crear el resto. Y arreglar el resto. Y también me dices por qué narices hay tantas tags o cómo van las tags. Eso me imagino que serán por los steps, ¿no? De que van pasando de una a otra y por eso se añaden unas y se quitan otras y demás, ¿no? Si quieres podemos intentar hacer una mejora que me vas a decir aquí cómo la plantearías para abrirlo en otro subhilo, que sería de hacer un project concretamente con estos tipos de objetos y hacer el automatismo que para esto si quieres puedes utilizar el Computer Use o similar o directamente lanzando los comandos con GitHub CLI. Que revisa qué versión está y la actualizas a la última versión para así tener todos los comandos. Y si no por API o por GraphQL para trabajar con los projects. Porque creo que los projects tienen mejor API por GraphQL que por API REST. Pero bueno, con gh cli puedes intentarlo. Si no tiene el comando concreto de gh project, por así decirlo. Y lo miramos para en vez de tener también este concepto de labels, poder trabajar con el concepto de issue types para poder hacer un issue type de tipo objeto cósmico. Y eso irá a un project que irá pasando por sus diferentes stages que serían estos stages que añadiría los agentic workflows. Y así queda mucho más claro por qué pasos están cada uno y cómo se trabaja. De tal manera que más o menos empezaríamos como a trabajar en un concepto de factory as a software muy tonto y muy de ejemplo, pero así tendríamos ya para una charla de factory as a software con esta diapositiva. Pero como te digo, todo esto, esta idea nueva que me has comentado, dímelo, dame como el PRD o los documentos de funcionalidad para poder crear un issue para desgranarlo, crear el issue con toda la descripción concreta y luego implementarlo. Pero no aquí. Aquí solo déjatelo primero que te he dicho, de arreglarlo y llegar a que consigas que la 130, 131 y el gate funcione para que esa 130, 131 se vean en la página web, que la puedes luego validar también mediante Playwright o lo que necesites”

### L2 — Diagnosis and recovery
GitHub Actions runs #32/#33 rejected candidate reviews, not malformed or mismatched artifacts. #130 requested a ring glow not expressible in the current WorldSpec/render; #131's design invented `slow-orbit`, accepted by schema but ignored by the renderer, although the issue did not request it. Keep the fail-closed review contract. Worktree created from current `main` at `ecbc31d` to avoid the active motion-pilot checkout. Engram mirror unavailable (`Transport closed`); local file is the source until sync is possible.

### L3 — Scope and implementation decisions
Add an explicit validated `ring.glow: "dawn"` feature across fallback generation, strict worker schema, and renderer; represent actual ring animation in a dedicated motion helper and honor `static` versus `slow-orbit`. Keep the review contract unchanged and fail-closed. Reprocess the existing `planet:held` demos only on a deliberate issue reopen, with a narrowly gated held-to-admission transition; normal stage progression and `planet:ready` terminality remain unchanged. The installed `gh aw` is v1.2.2 while this checkout's locks are generated by v1.2.3, so avoid compiling/regenerating those unrelated lock files with the older compiler.

### L4 — Local verification
The targeted design/renderer/contract tests passed 25/25 before reopen support. Reopen-specific red tests were observed (2 failing), then the contract suite passed 13/13 after the narrowly scoped reopen implementation. Full repository Node suite initially passed 140/140. Syntax checks for changed JS modules and `git diff --check` passed. Workflow YAML parses; independent Actions review, commit/PR, deployment, replay of #130/#131, and live site verification are still pending. The Engram task mirror remains pending because the prior memory service call returned `Transport closed`.

### L5 — Continuation (2026-11-27)
- The local preview used a fixture API: #130 and #131 both appeared as cards and 3D worlds. This proves rendering from candidate data, not GitHub/D1 or the deployed site.
- `gh aw validate planet-c-build` passed with a warning that the `COPILOT_GITHUB_TOKEN` may be rejected by the Copilot model catalog. Installed gh-aw is v1.2.2 while checked-in locks were generated by v1.2.3; no lock/source prompt changes are in the current diff.
- The required independent Actions verifier could not run because the agent runtime reported its usage limit. This remains an unverified risk; do not present the change as independently reviewed.
- No commit, push, issue edit, PR, issue reopen, or deployment was performed. The remaining external step requires use of the current connected GitHub session for `davidop/academyverso-2026`; no main-branch change is authorized.

### L6 — Resume after user authorization (2026-11-27)
- User authorized continuing with the connected GitHub session, keeping main untouched, and creating a draft PR with David requested as reviewer.
- Fetched #130 and #131: both are open with `cosmic-object` + `planet:held`; #130 describes the dawn-glowing gold ring and #131 the oceanic planet, silver moon, and gold ring. No issue comments exist. The remote feature branch and PR do not exist yet.
- A fresh full-suite run exposed one stale expected value: the persisted #130 ring correctly includes both `finish: "gold"` and `glow: "dawn"`, but the test expected only the glow. Updated the assertion to cover both fields. Full Node suite now passes 142/142; `npm --prefix worker run check`, `node --check web/app.js`, and `git diff --check` pass.
- `gh aw validate planet-c-build` passes, with its existing warning that `COPILOT_GITHUB_TOKEN` might be rejected by the model catalog. RDD is explicitly off globally, so no native review transaction is started.
- Added an explicit label lifecycle section to the Planet Factory C README. Labels are a visible state projection; workflow dependencies and run-attempt-scoped artifacts do the actual sequencing. The section also explains stage replacement, terminal states, and deliberate held-issue reopen.
- Independent read-only workflow verification completed with no code-level blocker. It confirmed the source coordinator and checked-in entry workflow match, stage retry is gated by `planet:held`, and existing candidate hash/review/publication guards remain. The verifier noted and the README now corrects one outdated activation sentence that mentioned only `issues.opened`.
- Opened the deployed GitHub Pages site in the browser: it currently lists 8 D1-backed objects and neither #130 nor #131, so the production acceptance is not yet satisfied. Local fixture preview previously showed both worlds, but does not prove production persistence.
- Live progression cannot be triggered safely from this PR branch: the actual issues are open/held (not reopened), the issue workflow runs from the default branch, and changing state or deploying from the draft PR would exceed the no-main/no-deploy constraint. Do not close/reopen the live issues as a test. Re-run actual gate and production-page verification only after the PR is reviewed and merged by the user.
- Main remains untouched; no commit, remote branch, PR, issue edit, deployment, or reviewer request has yet been made.

### L7 — Draft PR and deployed-site check (2026-11-27)
- Committed the scoped implementation and tests on `codex/planet-factory-gate-130-131`: local commit `c88b54e0aa45e94c90676dc011892b4bfc949bf0` (`fix(planet-factory): render requested demo rings`). Using the authorized connected GitHub session, created the same-tree remote commit `1ecd097b33562d853df7f0f915aff8d27f3775e1` and branch `codex/planet-factory-gate-130-131` from `ecbc31d9bebb62f6fdfc320859793cacdf78aae7`.
- Opened draft PR [#132](https://github.com/davidop/academyverso-2026/pull/132), targeting `main`, explicitly referencing #130 and #131; requested reviewer `davidop` (David). PR remains draft and unmerged.
- The production page `https://davidop.github.io/academyverso-2026/` was opened read-only; it currently reports 8 D1-backed objects and does not include #130 or #131. The issues remain open with `cosmic-object` + `planet:held`; no issue body, labels, or state were changed.
- Cannot run the issue-triggered candidate workflow against the real issues from this draft: the live workflow definition comes from the default branch and the issues are currently open/held, not newly reopened. The available GitHub connector exposes no workflow-dispatch operation. No main change, merge, issue close/reopen, D1 write, or deployment was performed.
- The GitHub PR body cross-references #130/#131 and documents current limits. Actual gate progression and D1-backed browser confirmation remain pending a separate decision to merge/deploy; issue state stays untouched meanwhile.

## Next
Wait for David's review and the user's separate merge/deployment decision. Only after that, replay the held issues through the gate using an approved event, then verify their rendered worlds against production D1-backed data. Do not modify main directly or merge/deploy on the user's behalf. Local fixture rendering is verified, but live issue progression and production page validation remain pending. Keep the Project/Issue Types PRD out of this feature.
