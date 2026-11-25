# AcademyVerso · Guía para agentes

- Respeta las [instrucciones del repositorio](.github/copilot-instructions.md). Usa ramas de trabajo y conserva las limitaciones de seguridad, accesibilidad y verificación de la demo.
- Para editar la presentación, abre [el guion](presentation/storytelling.md), [DESIGN.md](presentation/DESIGN.md) y [el plan de escenas](presentation/plan-visual.md). Distingue la escena propuesta de lo que ya existe en Slidev.
- Las skills locales viven solo en [.apm/skills](.apm/skills); APM las despliega a .agents/skills (compartida, la lee Copilot) y .claude/skills (Claude Code). Desde la raíz, `apm install` regenera y `apm audit` verifica; no edites las carpetas desplegadas. Detalles en [docs/skills.md](docs/skills.md). No hay paquetes externos, MCP ni configuración global.
- Comprueba el formato del diseño desde la raíz:

      npm exec --yes --package=@google/design.md@0.4.0 -- designmd lint presentation/DESIGN.md

  Este lint comprueba el documento de diseño, no las escenas renderizadas.
