# Activar GitHub Copilot, Claude y Codex para la demo móvil

> Guía contrastada con documentación de GitHub, noviembre de 2026. La captura de «Modelos» **no confirma** que Claude y Codex estén habilitados como agentes. Estado comprobado el 25/11 en la prueba #72: los **tres agentes funcionan** en este repo y completaron el relevo (Copilot #73, Claude #88 y Codex #94). Son asignables `copilot-swe-agent`, `anthropic-code-agent` y `openai-code-agent`.

## Preparación web (titular de `davidop`)

1. Iniciar sesión en GitHub desde un navegador con la cuenta `davidop`.
2. Abrir la foto de perfil y entrar en **Copilot settings**.
3. En el menú lateral, abrir **Copilot → Cloud agent**.
4. Dentro de **Policies / Repository access**, seleccionar **All repositories** o **Only selected repositories** e incluir `davidop/academyverso-2026`.
5. En **Partner agents**, activar **Anthropic Claude** y **OpenAI Codex**. Se requiere un plan de pago de GitHub Copilot para usar estos agentes. Para organizaciones, puede haber restricciones empresariales.
6. En **GitHub Mobile**, abrir **Copilot / Agents → Nueva sesión**, seleccionar el repositorio y **Nube**. Usar el selector de **agente de programación** cuando esté disponible. El desplegable «Modelos» (por ejemplo, Sonnet o GPT) es distinto y no demuestra que haya agentes asociados habilitados.
7. Probar con un cambio pequeño y seguro sobre una rama de demo: pedir un README de prueba y abrir un pull request. Revisar la ejecución y permisos antes del evento.

## Lanzar una sesión de agente sin caer en el chat

**Claude y Codex se lanzan desde la web, con el entorno Actions:**

1. Abrir la pestaña **Agents** del repo: <https://github.com/davidop/academyverso-2026/agents>
2. En el desplegable de entorno elegir **Actions**. Con **Cloud** solo aparece Copilot; Claude y Codex solo salen en el selector con **Actions**.
3. **Selector de agente:** Claude o Codex. No el desplegable de «Modelos».
4. **Rama:** la de demo (por ejemplo, `demo/portal-seed-26nov`), no `main`.
5. Pegar el prompt de la fase y lanzar. La sesión corre como un workflow de Actions («Claude» u «OpenAI Codex») y abre el PR contra esa rama.

**Copilot** se lanza igual, con el entorno Cloud, o desde GitHub Mobile: **Copilot → Agents → Nueva sesión** (no **Chat**) → repositorio → **Nube** → rama → prompt. En la prueba, una sesión lanzada desde el móvil acabó en el **chat** de Copilot con el modelo Claude: respondió en la conversación y no dejó ni rama ni PR.

**Comprobación inmediata:** en 1–3 minutos tiene que aparecer un PR contra la rama de demo. Si no aparece, no era el agente: relanzar.

## Comportamientos observados con agentes reales (25/11)

| | Copilot (`copilot-swe-agent`) | Claude (`anthropic-code-agent`) | Codex (`openai-code-agent`) |
|---|---|---|---|
| Cómo se lanzó en la prueba | Asignando la Issue por la API (#73) | Pestaña Agents, entorno Actions (#88) | Pestaña Agents, entorno Actions (#94) |
| Rama base | Respeta la rama si se indica por la API (`agent_assignment.base_branch`) o en Agents | Desde Agents, respeta la rama elegida. **Asignando la Issue la ignora**: parte de `main` y abre el PR contra `main` (#74) | Respeta la rama elegida en Agents |
| Tiempo en una tarea mínima | unos 3 min | unos 70 s | unos 3 min |
| PR | Borrador, a nombre de quien lanza la sesión | Borrador, a nombre de la app del agente | **Listo para revisar**, a nombre de la app del agente |
| Commits | Copilot como coautor | Firmados por `Claude` | Firmados por `Codex` |
| `Refs` en el cuerpo | Añade `Fixes` + número de Issue por su cuenta | Desde Agents, respetó `Refs` sin `Fixes`. Asignado por la API (#74) añadió `Fixes` | Respetó `Refs` sin `Fixes` |

- **Rama equivocada:** si un PR llega contra `main`, cambiar la base no sirve, porque arrastra todos los commits de `main`. Hay que cerrarlo y relanzar desde Agents eligiendo la rama.
- **CI pendiente de aprobación:** el CI de cada PR de agente queda en `action_required` hasta pulsar **«Approve and run workflows»**. Desde la CLI, `gh run rerun <id>` funciona; el endpoint `.../runs/{id}/approve` no (solo vale para forks).
- **Relevo al fusionar:** el workflow de relevo (`pull_request_target`) comenta el avance en la Issue de misión tanto con `Fixes #N` como con `Refs #N`. Lo de `Refs` se arregló en #90; antes solo funcionaba si el agente añadía `Fixes`. En #88 y #94 arrancó solo al fusionar; en #73 quedó pendiente y hubo que relanzarlo. Mirar Actions después de cada fusión.
- **Borrador:** Copilot y Claude abren el PR en borrador; hay que marcarlo como listo antes de fusionar.
- **Menciones:** no escribir `@claude` en comentarios para invocar al agente. Es una cuenta real de GitHub y no activa al agente. Tampoco `@codex`: puede responder otra integración (ChatGPT Codex Connector).

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
