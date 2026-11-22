# AcademyVerso 2026 · Runbook GO / NO-GO

**Evento:** jueves 26 de noviembre de 2026 · 15:00–15:55 (Europe/Madrid)
**Ponentes:** David Oliva y Sergio Valverde
**Título oficial:** Programa con IA desde tu móvil: GitHub Copilot, Claude y Codex

> Documento operativo, no acta de pruebas completadas. Actualizar cada casilla con URL/captura/log auténticos antes de marcarla. La aplicación publicada en `main` es la versión estable hasta que una PR supere revisión, checks y ensayo en dispositivos.

## 0. Estado verificado al 22/11/2026

| Elemento | Evidencia | Estado |
|---|---|---|
| GitHub Actions CI de `main` | [Run 44955212122](https://github.com/davidop/academyverso-2026/actions/runs/44955212122) | Verde (última ejecución de `main` observada) |
| Publicación GitHub Pages | [Run 44955212123](https://github.com/davidop/academyverso-2026/actions/runs/44955212123) | Workflow completado; prueba visual actual pendiente |
| Ingesta firmada Vice Nebula | [Issue #10](https://github.com/davidop/academyverso-2026/issues/10) · [Run 44960074451](https://github.com/davidop/academyverso-2026/actions/runs/44960074451) | HTTP 200 + cierre automático |
| Ingesta firmada Colonia Centinela | [Issue #11](https://github.com/davidop/academyverso-2026/issues/11) · [Run 44960081404](https://github.com/davidop/academyverso-2026/actions/runs/44960081404) | HTTP 200 + cierre automático |
| Viaje 3D | [PR #9](https://github.com/davidop/academyverso-2026/pull/9) · [CI 44961961644](https://github.com/davidop/academyverso-2026/actions/runs/44961961644) | Código en rama y CI verde, sin merge; preview Cloudflare fallida |
| Presentación visual renovada | [PR #1](https://github.com/davidop/academyverso-2026/pull/1) | Draft con conflictos; no reemplazar slides estables sin revisión |
| Sesiones reales de Copilot/Claude/Codex | [Guía](activar-agentes.md) | **No verificadas** en GitHub Mobile |
| Dispositivos, proyector, QR y Wi-Fi | — | **No probados** en sala |

Los objetos #10/#11 son **ensayos del equipo**, no votos de asistentes. El pipeline confirma ingesta, pero no demuestra que la Issue se originara desde GitHub Mobile.

## 1. Secuencia de cierre

### Domingo 22 · Integración candidata

- [ ] En [PR #9](https://github.com/davidop/academyverso-2026/pull/9), revisar el diff y la accesibilidad con una persona, comprobar el motivo de la comprobación Cloudflare `Preview Build Failed`; no confundirla con CI verde.
- [ ] Confirmar que las transiciones usan solo objetos con `[GTA:VICE-NEBULA]` o `[GTA:COLONIA-CENTINELA]`.
- [ ] Preparar la rama de demo de respaldo y un commit estable; **no** fusionar PR #9 sin revisión humana (restricción expresa en la PR).
- [ ] Revisar [PR #1](https://github.com/davidop/academyverso-2026/pull/1): identificar y resolver conflictos en su propia rama, mantenerla en Draft mientras faltan escenas y proyección.

### Lunes 23 · Navegador y móvil

- [ ] Con PR #9 aprobada, fusionar con intervención humana y verificar [CI](https://github.com/davidop/academyverso-2026/actions/workflows/ci.yml) + [Deploy Pages](https://github.com/davidop/academyverso-2026/actions).
- [ ] Android y un segundo dispositivo: abrir [web](https://davidop.github.io/academyverso-2026/) y [presentación](https://davidop.github.io/academyverso-2026/presentation/).
- [ ] Ensayar viaje → regresar durante vuelo → viaje de nuevo → zoom por pellizco → Escape / teclado → lector de pantalla → `prefers-reduced-motion`.
- [ ] Abrir los objetos **#10** y **#11** en D1/web; comprobar contadores, colores, ficha y enlaces a Issue. Sin inventar métricas de participantes.
- [ ] Confirmar que objetos sin etiqueta no ofrecen viaje y que una lista vacía no rompe el render.

### Martes 24 · Agentes y versión de escena

- [ ] David: sesión **real** GitHub Copilot desde GitHub Mobile sobre un cambio pequeño revisable (p. ej. mejora de foco/teclado); registrar Issue, sesión, commits, PR y CI.
- [ ] Sergio: verificar si **Claude como agente de programación** está disponible (no confundir modelo Claude en Copilot con Claude Code). Si se ejecuta, guardar PR real con identidad visual original, no branding GTA ajeno.
- [ ] Ambos: verificar **Codex como agente de programación** y usarlo para tests o una misión local pequeña; guardar PR real. Si no está disponible, explicar limitación y usar PR de respaldo identificado como tal.
- [ ] Una mejora visual corta y una misión local son **opcionales**: no bloquear el flujo principal por terminar fases #6/#7.

### Miércoles 25 · Ensayo general y freeze

- [ ] Ejecutar el [guion de 55 minutos](guion-demo.md) completo con David y Sergio, sin saltarse los tiempos.
- [ ] Probar QR **con las cámaras de dos móviles**, red Wi-Fi/4G, cuentas, GitHub Mobile, teclado, audio, monitor externo y modo presentador.
- [ ] Crear una Issue **desde GitHub Mobile**, identificarla como `ensayo`, verificar en Actions `HTTP 200`, estado `closed`, registro D1 y aparición real en la web.
- [ ] Revisar nombre, descripción, legibilidad de letras, recuentos, contraste y `prefers-reduced-motion` en la pantalla real.
- [ ] Guardar 2 pestañas de reserva: [galaxia](https://davidop.github.io/academyverso-2026/), [Issues](https://github.com/davidop/academyverso-2026/issues), [Actions](https://github.com/davidop/academyverso-2026/actions) y PRs trazables.
- [ ] **Freeze:** fijar SHA de `main`, URL y capturas reales; no modificar secretos ni desplegar features no esenciales.

### Jueves 26 · Preflight

- [ ] 13:30–14:00: verificar salud Worker, lectura D1, publicación Pages, acceso a tres agentes y conexión de reserva; si algo falla activar plan B.
- [ ] 14:30: abrir slide inicial, galaxia y dos PRs preparados; QR y móvil listos; confirmar quién controla cada pantalla.
- [ ] 15:00: iniciar sesión. Evitar merges o cambios de configuración en directo salvo que formen parte de una demo **aislada** y claramente intencionada.

## 2. Criterios de GO / NO-GO

**GO mínimo (debe cumplirse todo):**
- [ ] Web pública carga Three.js y la presentación existente se puede ejecutar.
- [ ] Dos objetos auténticos del equipo visibles y enlazados a Issues reales.
- [ ] Formulario/Issue → Actions → Worker/D1 → Three.js validado con una creación nueva desde GitHub Mobile o plan B demostrado.
- [ ] Al menos **una sesión auténtica de agente de programación**, con PR/diff auditable, o relato reescrito para no afirmar ejecución en directo.
- [ ] Ensayo David + Sergio y plan de contingencia completados.

**GO avanzado (deseable, no imprescindible):**
- [ ] PR #9 revisada, integrada y viaje/retorno comprobados en producción.
- [ ] Una aportación visual real atribuible a Claude y tests reales atribuibles a Codex (solo si sus sesiones existen y quedan trazadas).
- [ ] PR #1 de Slidev revisada y sin conflictos, pero no imprescindible para dar la charla con la presentación actual.

**NO-GO para la función afectada, no para toda la conferencia:** falla de integración, móvil, red, webGL o agentes. Retirar esa función de la demo y usar el plan B; no simular ejecuciones.

## 3. Run of show (55 minutos)

| Hora | Responsable | Ejecución | Respaldo |
|---|---|---|---|
| 15:00–15:04 | Ambos | Hook y universo | Slides estáticas |
| 15:04–15:08 | Sergio | GitHub Mobile y agentes | Capturas auténticas previas |
| 15:08–15:13 | David | Modelos vs agentes | Tabla en presentación |
| 15:13–15:17 | Sergio | Vice Nebula y Centinela | Página de misión |
| 15:17–15:24 | Ambos | QR + nuevas Issues | #10/#11 como ensayos identificados |
| 15:24–15:32 | David | Copilot abre PR real | PR previo atribuido correctamente |
| 15:32–15:40 | Sergio | Claude Code/agente aporta estética | Diff de respaldo, sin atribución falsa |
| 15:40–15:48 | Ambos | Codex revisa, testea y CI | Tests existentes y PR verificada |
| 15:48–15:52 | Sergio | Viajes 3D si integrados, recuentos | Galaxia estable y fichas |
| 15:52–15:55 | David | Síntesis y reto a comunidad | URL/QR de repositorio |

## 4. Enlaces de control

- [Universo 3D](https://davidop.github.io/academyverso-2026/)
- [Escenario de misiones](https://davidop.github.io/academyverso-2026/#grand-terraforming-agents)
- [Slidev](https://davidop.github.io/academyverso-2026/presentation/)
- [Worker health](https://academyverso-api.david-oliva-paredes.workers.dev/api/health)
- [Objetos D1](https://academyverso-api.david-oliva-paredes.workers.dev/api/objects)
- [Issues](https://github.com/davidop/academyverso-2026/issues) y [Actions](https://github.com/davidop/academyverso-2026/actions)
- [PR #9](https://github.com/davidop/academyverso-2026/pull/9) y [PR #1](https://github.com/davidop/academyverso-2026/pull/1)

No publicar secretos, tokens, datos personales de asistentes ni asignar contenido artificialmente a agentes.
