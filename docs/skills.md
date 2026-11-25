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

Son **adaptaciones originales** de estas referencias, no copias: <https://github.com/anthropics/skills>, <https://github.com/pbakaus/impeccable>, <https://github.com/LottieFiles/motion-design-skill>, <https://github.com/remotion-dev/skills>. Si algún día interesa una skill oficial tal cual, se declara en `dependencies.apm` y se instala con APM.

## Dónde lee cada harness

Copilot descubre skills de proyecto en **`.github/skills/`, `.agents/skills/` o `.claude/skills/`** (lo imprime `copilot skill --help`).

- **`.agents/skills/`** — ruta compartida de APM (`target: agent-skills`). La lee Copilot y cualquier harness nuevo que siga esa convención.
- **`.claude/skills/`** — solo Claude Code (`target: claude`).

**No desplegamos `.github/skills/`**: Copilot ya lee `.agents/skills/`, así que mantener una tercera copia era duplicar sin consumidor. Si un harness futuro solo entiende `.github/skills/`, se añade el target y APM lo genera.

## Copias, no symlinks

APM **copia** los archivos en cada ruta; no hay modo symlink ni hardlink (no existe flag en `install`, y los identificadores de archivo son distintos).

Es lo que conviene aquí: los symlinks no viajan bien en Windows, git los guarda con modo `120000` y muchos clientes no los resuelven al cargar skills. La contrapartida son dos copias, y `scripts/skills-sync.test.mjs` impide que se desincronicen.

Si algún día se quiere una sola carpeta, la alternativa es dejar de versionar `.agents/skills/` y `.claude/skills/`, añadirlas al `.gitignore` y exigir `apm install` en cada checkout. Hoy se versionan para que cualquier agente tenga las skills sin ejecutar nada.

## Cómo se regeneran

Desde la raíz, con **APM 0.38.1 o superior**:

```bash
apm install
apm audit
```

- `targets` se declara en `apm.yml`; si añades una skill, créala en `.apm/skills/<nombre>/SKILL.md` y vuelve a ejecutar el comando.
- No hace falta `--legacy-skill-paths`: ese flag duplica también en `.github/skills/` y no aporta nada mientras Copilot lea `.agents/skills/`.
- `apm.lock.yaml` (formato v4) registra las rutas desplegadas, sus hashes y la versión de APM que los generó.

## Control de deriva en CI

`scripts/skills-sync.test.mjs` (dentro de `validate`) comprueba que:

1. Cada skill de `.apm/skills/` declara `name` y `description`.
2. Las copias de `.agents/skills/` y `.claude/skills/` existen y son **idénticas byte a byte** a la fuente.
3. No hay skills huérfanas en las carpetas desplegadas.

Si editas solo la copia desplegada, CI falla con el mensaje `run apm install`.

## Qué no hace APM aquí

- No hay paquetes externos, MCP ni LSP: `dependencies.apm` y `dependencies.mcp` están vacíos.
- No toca la configuración global del equipo: todo es de proyecto.
