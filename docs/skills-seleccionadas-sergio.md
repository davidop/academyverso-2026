# Skills seleccionadas a partir de referencias de Sergio

Referencias verificadas: https://github.com/anthropics/skills, https://github.com/pbakaus/impeccable, https://github.com/LottieFiles/motion-design-skill y https://github.com/remotion-dev/skills.

Se incorporan tres skills originales adaptadas a AcademyVerso: academyverso-frontend, academyverso-motion y academyverso-video. No se ha copiado código ni instrucciones completas de terceros y no se han instalado dependencias.

Las fuentes recomendadas son guías de trabajo para agentes, no funcionalidades ejecutables del navegador. Three.js ya está en la app. Se evalúan three.quarks y GSAP tras medir FPS y bundle; Remotion/FFmpeg pertenecen a un pipeline audiovisual separado, posterior a P0.

Las referencias de X no se recuperaron íntegramente; consultar el contenido exacto antes de atribuir cada herramienta a un post específico.

## Pruebas antes de fusionar

- CI verde y tests del contrato WorldSpec.
- Capturas reales en móvil y escritorio; evitar imágenes simuladas como evidencia.
- Respetar prefers-reduced-motion, navegación y URL pública.
- No tocar secrets, OAuth, Worker de producción ni D1 sin gate de seguridad.
