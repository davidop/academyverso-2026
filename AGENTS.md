# AcademyVerso · Guía para agentes

- Respeta las [instrucciones del repositorio](.github/copilot-instructions.md). Usa ramas de trabajo y conserva las limitaciones de seguridad, accesibilidad y verificación de la demo.
- Para editar la presentación, abre [el guion](presentation/storytelling.md), [DESIGN.md](presentation/DESIGN.md) y [el plan de escenas](presentation/plan-visual.md). Distingue la escena propuesta de lo que ya existe en Slidev.
- La skill de proyecto [academyverso-presentation](.apm/skills/academyverso-presentation/SKILL.md) recoge el flujo recurrente de revisión por escenas. Desde la raíz, apm install --frozen y apm audit instalan y verifican la skill local. No hay paquetes externos, MCP ni configuración global.
- Comprueba el formato del diseño desde la raíz:

      npm exec --yes --package=@google/design.md@0.4.0 -- designmd lint presentation/DESIGN.md

  Este lint comprueba el documento de diseño, no las escenas renderizadas.
