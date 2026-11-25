# Activar GitHub Copilot, Claude y Codex para la demo móvil

> Guía contrastada con documentación de GitHub, noviembre de 2026. La captura de «Modelos» **no confirma** que Claude y Codex estén habilitados como agentes. Estado comprobado el 25/11 en la prueba #72: **Copilot** y **Claude** funcionan como agentes en este repo (`copilot-swe-agent` y `anthropic-code-agent` son asignables); **Codex** no aparece como asignable y está sin probar.

## Preparación web (titular de `davidop`)

1. Iniciar sesión en GitHub desde un navegador con la cuenta `davidop`.
2. Abrir la foto de perfil y entrar en **Copilot settings**.
3. En el menú lateral, abrir **Copilot → Cloud agent**.
4. Dentro de **Policies / Repository access**, seleccionar **All repositories** o **Only selected repositories** e incluir `davidop/academyverso-2026`.
5. En **Partner agents**, activar **Anthropic Claude** y **OpenAI Codex**. Se requiere un plan de pago de GitHub Copilot para usar estos agentes. Para organizaciones, puede haber restricciones empresariales.
6. En **GitHub Mobile**, abrir **Copilot / Agents → Nueva sesión**, seleccionar el repositorio y **Nube**. Usar el selector de **agente de programación** cuando esté disponible. El desplegable «Modelos» (por ejemplo, Sonnet o GPT) es distinto y no demuestra que haya agentes asociados habilitados.
7. Probar con un cambio pequeño y seguro sobre una rama de demo: pedir un README de prueba y abrir un pull request. Revisar la ejecución y permisos antes del evento.

## Lanzar una sesión de agente sin caer en el chat

En la prueba del 25/11 (#72), una sesión lanzada desde el móvil acabó en el **chat** de Copilot con el modelo Claude: respondió en la conversación, terminó y no dejó ni rama ni PR. Para lanzar el **agente**:

1. **Copilot → Agents → Nueva sesión**, no **Chat**.
2. Repositorio `davidop/academyverso-2026`, opción **Nube** y **la rama de demo** (por ejemplo, `demo/portal-seed-26nov`).
3. **Selector de agente:** Copilot, Claude o Codex. No el desplegable de «Modelos».
4. Pegar el prompt de la fase y lanzar.

**Comprobación inmediata:** en 1–2 minutos tiene que aparecer un PR en borrador en el repo, y la sesión debe verse en la lista de Agents con un estado. Por la API, Copilot abrió el PR en unos 10 segundos y Claude en 7. Si no aparece, es el chat: relanzar.

## Comportamientos observados con agentes reales (25/11)

| | Copilot (`copilot-swe-agent`) | Claude (`anthropic-code-agent`) |
|---|---|---|
| Rama base al **asignar la Issue** | Respeta la rama si se indica por la API (`agent_assignment.base_branch`) | **La ignora**: parte de `main` y abre el PR contra `main` |
| Tiempo en una tarea mínima | ~3 min | <1 min |
| Autoría visible | PR a nombre de quien lanza la sesión; el agente aparece como co-autor de los commits | PR a nombre de quien lanza la sesión; commits firmados por `Claude` |
| Cuerpo del PR | Añade `Fixes` + número de Issue, aunque se pida Refs | También añade `Fixes` + número de Issue |

- **Rama equivocada:** si un PR llega contra `main`, cambiar la base no sirve, porque arrastra todos los commits de `main`. Hay que cerrarlo y relanzar desde Agents eligiendo la rama.
- **Workflows pendientes de aprobación:** el CI de cada PR de agente queda en `action_required` hasta pulsar **«Approve and run workflows»**. El workflow de relevo que corre al fusionar (`pull_request_target`) también queda pendiente y hay que aprobarlo o relanzarlo en Actions. Desde la CLI, `gh run rerun <id>` funciona; el endpoint `.../runs/{id}/approve` no (solo vale para forks).
- **Borrador:** los PRs llegan en borrador; marcarlos como listos antes de fusionar.
- **Menciones:** no escribir `@claude` en comentarios para invocar al agente. Es una cuenta real de GitHub y no activa al agente.

## Control de acceso y uso

- Los agentes de terceros heredan el acceso al repositorio del Cloud agent.
- GitHub instala una integración de agente asociada; no hace falta una suscripción independiente de Claude/ChatGPT para el agente cuando se utiliza a través de la suscripción GitHub Copilot compatible.
- Hay consumo de **GitHub Actions minutes** y **AI credits** según el plan. No afirmar que los agentes son gratuitos.
- Cada PR debe revisarse; no fusionar automáticamente cambios de código aportados por asistentes.
- Preparar ramas o PR de respaldo de forma explícita, sin simular que son resultados de la ejecución en directo.

## Fuentes oficiales

- [Administrar políticas de Copilot personal](https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies)
- [Copilot cloud desde GitHub Mobile](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-mobile)
- [Agentes de codificación de terceros](https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-third-party-coding-agents)
