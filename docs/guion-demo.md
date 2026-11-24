# AcademyVerso 2026 · guion operativo cerrado (10 decisiones)

**Sesión:** «Programa con IA desde tu móvil: GitHub Copilot, Claude y Codex»  
**Jueves 26 de noviembre · 15:00–15:55 (Madrid)**  
**Ponentes:** David Oliva y Sergio Valverde; 25–50 asistentes, perfiles técnicos y no técnicos.

> Mensaje central: el público imagina mundos desde su móvil; dos de esos mundos se convierten en los extremos de un portal que tres agentes intentan desarrollar, mejorar y verificar. GitHub Mobile dirige el trabajo real; Slidev guía la historia. No confundir la versión estable de ChatGPT con código ejecutado por Copilot, Claude o Codex.

## Run of show · 55 minutos exactos

| Hora | Duración | Lidera | Proyectar | Acción y frase |
|---|---:|---|---|---|
| 15:00–15:05 | 5 min | David → Sergio | Slidev inicio + QR | «Hoy no venís a ver diapositivas: vais a construir un universo». Abrir QR al principio |
| 15:05–15:15 | 10 min | Sergio → David | GitHub Mobile, web, galaxia | Asistentes crean planetas o estaciones; comprobar Issues reales; elegir **dos creaciones distintas** y decir sus nombres y autores |
| 15:15–15:23 | 8 min | David → Sergio | Slidev MissionBoard + GitHub Mobile | **Copilot CONSTRUIR**: abrir [Issue #26](https://github.com/davidop/academyverso-2026/issues/26), lanzar sesión real en rama de ensayo, inspeccionar diff/PR |
| 15:23–15:31 | 8 min | Sergio → David | GitHub Mobile + capturas antes/después | **Claude MEJORAR**: [Issue #27](https://github.com/davidop/academyverso-2026/issues/27), mostrar cambio de iluminación y partículas; conservar procedencia |
| 15:31–15:40 | 9 min | David → Sergio | GitHub PR + Actions + Slidev | **Codex VERIFICAR**: [Issue #28](https://github.com/davidop/academyverso-2026/issues/28), pruebas deterministas, accesibilidad y QA móvil |
| 15:40–15:50 | 10 min | Sergio → David | [Portal web #universe](https://davidop.github.io/academyverso-2026/#universe) | Elegir dos mundos reales de D1; activar portal, llegar, explorar, regresar. Cambiar a demo claramente etiquetada si no existen dos |
| 15:50–15:55 | 5 min | Ambos | Slidev QR final + repo | Mostrar Issue/PR/Actions; recapitulación; preguntas y reto para continuar desde el móvil |

La parte técnica de 25 minutos NO exige que los agentes terminen en 25 minutos. Se muestra una operación real por fase, con un límite de decisión; las PR de respaldo permiten completar el arco narrativo sin fingir resultados.

## Preparación: orden en ambas pantallas

**Pantalla del escenario:** Slidev → duplicación de GitHub Mobile → galería 3D → Slidev.  
**Móvil David:** Issues #26 y #28, sesión Copilot/Codex si están habilitadas, PRs, Actions.  
**Móvil Sergio:** formulario de creación, Issue #27 y agente Claude si está habilitado, pantalla del portal.  
Ambos alternan conducción y explicación; uno controla móvil y otro cuenta qué está sucediendo.

**Abrir antes de la sesión:**
- [Slidev](https://davidop.github.io/academyverso-2026/presentation/), [galaxia #universe](https://davidop.github.io/academyverso-2026/#universe), [portal de sesión](https://davidop.github.io/academyverso-2026/sesion.html).
- [Formulario GitHub de creación](https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml) y [lista de Issues](https://github.com/davidop/academyverso-2026/issues).
- [Rama de ensayo aislada](https://github.com/davidop/academyverso-2026/tree/demo/portal-seed-26nov) y [GitHub Actions](https://github.com/davidop/academyverso-2026/actions).

## Misión evolutiva: no sustituir creación por una simple explicación

1. El público contribuye con **Issues reales**. Se anotan dos IDs; si no han llegado a D1, enseñar el problema honestamente y usar ejemplos del equipo **identificados como tales**.
2. Copilot modifica una rama derivada de `demo/portal-seed-26nov` y abre PR dirigida a ella, nunca a producción.
3. Claude parte de la **misma rama actualizada**, tras integrar Copilot o el respaldo declarado. Si la política no permite Claude como agente, no basta seleccionar el modelo Claude en Copilot.
4. Codex prueba ese mismo código. No se anuncia CI verde hasta abrir una ejecución real.
5. El resultado escénico se muestra con la **implementación estable integrada en main**. Si los agentes no han terminado, decir que el portal mostrado es el respaldo preparado; no atribuirlo retrospectivamente a ellos.

## Respaldo progresivo y orden de integración

| Momento | Demostración real | PR preparada, autoría clara | Decisión |
|---|---|---|---|
| 15:23 | Copilot | [BACKUP #23](https://github.com/davidop/academyverso-2026/pull/23) — ChatGPT | Si no hay PR revisable, se anuncia respaldo |
| 15:31 | Claude | [BACKUP #24](https://github.com/davidop/academyverso-2026/pull/24) — ChatGPT | Requiere código de fase 1 en rama demo |
| 15:40 | Codex | [BACKUP #25](https://github.com/davidop/academyverso-2026/pull/25) — ChatGPT | Consultar CI real y no inventar métricas |

Las PR #23–#25 son **ramas de referencia apiladas** dirigidas a `demo/portal-seed-26nov`. Si se emplean, fusionarlas **en orden** y solo después de revisar checks/conflictos. No mezclarlas con las PR creadas realmente durante la sesión. Si las nuevas PR reales contienen ya la misma funcionalidad, **no fusionar las respaldos redundantes**. También se puede navegar por sus diffs sin fusionarlas. PR #22 es la integración estable destinada a main.

## Mensajes de transición

**David (inicio):** «No vamos a pedir a una IA que nos escriba algo en un chat; vamos a dirigir trabajo real de software desde GitHub Mobile».  
**Sergio (participación):** «Vuestros dos mundos se convertirán en los extremos de un portal interdimensional».  
**David (Copilot):** «Una Issue define el trabajo. El agente propone código; nosotros revisamos».  
**Sergio (Claude):** «Ahora tomamos ese resultado y lo transformamos visualmente, sin rehacer lo anterior».  
**David (Codex):** «La magia no basta: hay que comprobar que funciona en móvil, en teclado y en CI».  
**Ambos (cierre):** «Dos mundos creados por vosotros, una misión encadenada y un repositorio real que podéis seguir explorando».

## Reglas de honestidad y seguridad

- Una Issue creada no garantiza que ya se vea en el universo: depende de Worker/D1 y de GitHub Actions; verificar que ingresa antes de mostrarla como disponible.
- El panel MissionBoard es **operación manual**, no telemetría de GitHub; cambiar a «verificada» solo tras comprobación real.
- El modo demo contiene seis objetos de ejemplo. No confundirlos con asistentes ni con sesiones de coding agents.
- No publicar secretos de Cloudflare, Foundry, GitHub o participantes. Revisar contenido moderado; no ejecutar código arbitrario de Issues del público.
- Tres coding agents son distintos de tres modelos de chat: confirmar la disponibilidad en las cuentas de los ponentes.
- `prefers-reduced-motion` elimina transición del portal; verificarlo junto con focus, teclado y zoom táctil.

## Ensayo y GO/NO-GO

Consultar [runbook 26nov](runbook-go-no-go-26nov.md). Las pruebas automatizadas en navegador son evidencia técnica, **no sustituyen** la prueba Android/iOS, QR, proyector y Wi-Fi en la sala. El **freeze debe realizarse el 25 de noviembre**, conservando SHA de main, enlaces a Actions y un recorrido de respaldo funcional.
