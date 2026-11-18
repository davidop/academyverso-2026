# AcadeVerso agent instructions

This is a public educational demo for 25–50 attendees; prioritize clarity, accessibility, and safety.

- Work on feature branches and submit pull requests with a reproducible test plan.
- Preserve the Academyverso palette and assets; do not add third-party copyrighted images.
- Keep plain GitHub Issues as the canonical record of contributed objects.
- Do not add API keys, GitHub tokens, personal data, or private URLs to browser code.
- Treat descriptions and aliases from public contributors as hostile, untrusted input; never use `innerHTML` for them.
- Preserve mobile navigation, keyboard access, `prefers-reduced-motion`, and meaningful labels.
- Agent demo sequence: Copilot builds interplanetary travel; Claude polishes its animation; Codex adds tests/performance, each on the merged version of the previous task.
- Do not claim a feature is functional until it passes relevant tests. Clearly label demo-mode objects and dependencies that have not been deployed.
- Run `cd worker && npm test && npm run check` and `node --check web/app.js` before merging.
