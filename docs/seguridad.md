# Riesgos y controles

**Audiencia 25–50 personas; posibles menores.** Evitar nombres reales, correos electrónicos, teléfonos y datos identificables en las Issues públicas. Mostrar un aviso en escenario y formulario.

- `main` protegido; los participantes crean Issues, no fusionan código.
- Worker valida tipo permitido, longitudes, enlaces y lista básica de vocabulario; 5 creaciones/IP/h. Este filtro **no es un sistema de moderación completo**: reforzar con revisión humana y reglas antes de evento público.
- Ocultar objetos desde API administrativa con token privado. El contenido puede seguir siendo visible en GitHub Issue pública; cerrar/editar/moderar la Issue si procede.
- CORS limitado al origen de GitHub Pages, token de GitHub sólo en secret del Worker; el frontend nunca recibe tokens.
- GitHub Actions firmada con HMAC. No interpolar texto de la Issue como código shell.
- No ejecutar código arbitrario generado a partir de prompts de asistentes ni desplegar automáticamente PRs no revisados.
- Escenario de spam: suspender formulario web, cerrar Issues temporalmente, ajustar permisos.
- Costes: GitHub Actions, Cloudflare Workers/D1 y Workers AI sujetos a cuotas y límites vigentes; usuarios sin licencias premium no ejecutarán agentes.
- Alcance de la IA: los prompts de creación de objetos son **datos**, no instrucciones para el agente de código. Proteger contra prompt injection.
