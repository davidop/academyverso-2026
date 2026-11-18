# Activar GitHub Copilot, Claude y Codex para la demo móvil

> Guía contrastada con documentación de GitHub, noviembre de 2026. Los permisos **no se pueden verificar** desde la conexión actual de GitHub y la captura de «Modelos» **no confirma** que Claude y Codex estén habilitados como agentes.

## Preparación web (titular de `davidop`)

1. Iniciar sesión en GitHub desde un navegador con la cuenta `davidop`.
2. Abrir la foto de perfil y entrar en **Copilot settings**.
3. En el menú lateral, abrir **Copilot → Cloud agent**.
4. Dentro de **Policies / Repository access**, seleccionar **All repositories** o **Only selected repositories** e incluir `davidop/academyverso-2026`.
5. En **Partner agents**, activar **Anthropic Claude** y **OpenAI Codex**. Se requiere un plan de pago de GitHub Copilot para usar estos agentes. Para organizaciones, puede haber restricciones empresariales.
6. En **GitHub Mobile**, abrir **Copilot / Agents → Nueva sesión**, seleccionar el repositorio y **Nube**. Usar el selector de **agente de programación** cuando esté disponible. El desplegable «Modelos» (por ejemplo, Sonnet o GPT) es distinto y no demuestra que haya agentes asociados habilitados.
7. Probar con un cambio pequeño y seguro sobre una rama de demo: pedir un README de prueba y abrir un pull request. Revisar la ejecución y permisos antes del evento.

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
