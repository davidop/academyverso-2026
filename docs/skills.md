# Skills locales y APM

## Fuente única

Las cinco skills del repositorio viven en **`.apm/skills/<nombre>/SKILL.md`**:

| Skill | Para qué |
| --- | --- |
| `academyverso-frontend` | Auditar y mejorar la web en móvil y proyector |
| `academyverso-motion` | Transiciones 3D, nacimiento de mundos y viajes accesibles |
| `academyverso-video` | Clips desde capturas reales de Three.js (Remotion/FFmpeg aparte) |
| `academyverso-worldgen` | Mundos procedurales con WorldSpecV1 |
| `academyverso-presentation` | Guion y revisión del deck escena a escena |

Son **adaptaciones originales** de estas referencias, no copias: <https://github.com/anthropics/skills>, <https://github.com/pbakaus/impeccable>, <https://github.com/LottieFiles/motion-design-skill>, <https://github.com/remotion-dev/skills>. No se importan instrucciones completas de terceros ni se instalan dependencias por ellas.

Si en el futuro interesa una skill oficial tal cual, se declara como dependencia en `apm.yml` (`dependencies.apm`) y se instala con APM; las locales se quedan solo con lo que es específico de AcademyVerso.

## Por qué hay tres carpetas desplegadas

Cada harness lee su propia ruta:

- `.agents/skills/` — ruta compartida que APM usa por defecto (`target: agent-skills`).
- `.claude/skills/` — Claude Code (`target: claude`).
- `.github/skills/` — GitHub Copilot (`target: copilot`).

Eso es lo que antes se mantenía a mano como tres copias idénticas. Ahora APM las genera desde `.apm/skills/` y las tres se versionan para que cualquier agente las encuentre sin ejecutar nada.

## Cómo se regeneran

Desde la raíz, con APM 0.33 o superior:

```bash
apm install --legacy-skill-paths
apm audit
```

- `--legacy-skill-paths` despliega por cliente (`.claude/skills`, `.github/skills`) además de la ruta compartida `.agents/skills`.
- `targets` está declarado en `apm.yml`; si añades una skill, créala en `.apm/skills/<nombre>/SKILL.md` y vuelve a ejecutar el comando.
- El lock (`apm.lock.yaml`) registra los archivos desplegados y sus hashes.

## Control de deriva en CI

`scripts/skills-sync.test.mjs` (dentro de `validate`) comprueba que:

1. Cada skill de `.apm/skills/` declara `name` y `description`.
2. Las copias de las tres carpetas existen y son **idénticas byte a byte** a la fuente.
3. No hay skills huérfanas en las carpetas desplegadas.

Si editas solo la copia desplegada, CI falla con el mensaje `run apm install --legacy-skill-paths`.

## Qué no hace APM aquí

- No hay paquetes externos, MCP ni LSP: `dependencies.apm` y `dependencies.mcp` están vacíos.
- No se toca la configuración global del equipo: todo es de proyecto.
