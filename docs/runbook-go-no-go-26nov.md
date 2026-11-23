# AcademyVerso 2026 · GO/NO-GO operativo — 26 de noviembre

**Evento:** jueves 26 de noviembre de 2026, 15:00–15:55 (Europe/Madrid)  
**Ponentes:** David Oliva + Sergio Valverde  
**Público:** 25–50 asistentes, perfiles técnicos y no técnicos  
**Objetivo:** el público crea mundos desde el móvil; los ponentes utilizan GitHub Mobile para dirigir tres agentes sobre un portal que conecta dos mundos, con resultados y responsabilidades trazables.

> Documento operativo; ninguna casilla vacía implica prueba completada. **El código generado por ChatGPT para referencias de respaldo NO se atribuye a GitHub Copilot, Claude ni Codex.** Slidev MissionBoard solo informa estados introducidos manualmente.

## 1. Entregables y evidencias de GitHub

| Entregable | Enlace | Interpretación |
|---|---|---|
| Portal Three.js + Slidev y documentación | [PR #22](https://github.com/davidop/academyverso-2026/pull/22) | Integración de referencia desarrollada con ChatGPT; revisar CI y merge a main antes del evento |
| Rama sin portal de partida | [demo/portal-seed-26nov](https://github.com/davidop/academyverso-2026/tree/demo/portal-seed-26nov) | Aislamiento para misiones reales, sin tocar producción |
| Copilot construir | [Issue #26](https://github.com/davidop/academyverso-2026/issues/26) · [Backup PR #23](https://github.com/davidop/academyverso-2026/pull/23) | Backup escrito por ChatGPT |
| Claude enriquecer | [Issue #27](https://github.com/davidop/academyverso-2026/issues/27) · [Backup PR #24](https://github.com/davidop/academyverso-2026/pull/24) | Backup escrito por ChatGPT |
| Codex verificar | [Issue #28](https://github.com/davidop/academyverso-2026/issues/28) · [Backup PR #25](https://github.com/davidop/academyverso-2026/pull/25) | Backup escrito por ChatGPT |
| Renderizador WorldGen | [PR #19 ya fusionada](https://github.com/davidop/academyverso-2026/pull/19) | Fallback procedural, no prueba de Foundry live |
| Ingesta de ensayo | [Issue #10](https://github.com/davidop/academyverso-2026/issues/10) y [#11](https://github.com/davidop/academyverso-2026/issues/11) | Dos objetos reales del equipo, no asistentes ni demostración de origen GitHub Mobile |
| GitHub CI principal | [Actions](https://github.com/davidop/academyverso-2026/actions/workflows/ci.yml) | Consultar último SHA/resultado antes del GO |
| Pages + preflight | [Pages](https://github.com/davidop/academyverso-2026/actions/workflows/pages.yml) · [Preflight](https://github.com/davidop/academyverso-2026/actions/workflows/event-preflight.yml) | Consultar ejecución asociada al SHA fusionado |

## 2. Lunes 23 · Entrega técnica

- [x] Definidas diez decisiones con misión colaborativa, tiempos y respaldo.
- [x] Creados Issues de los tres agentes con prompts verificables.
- [x] Creadas PR preparadas #23–#25 y rama de ensayo separada (no son ejecuciones de agentes).
- [ ] Revisar y fusionar PR #22 **solo si** pasan CI Node, navegador WebGL escritorio/móvil y compilación Slidev.
- [ ] Publicar y comprobar la nueva versión de GitHub Pages; registrar SHA del despliegue.
- [ ] Verificar en web el selector de dos mundos y el portal con datos actuales de Worker/D1.

## 3. Martes 24 · Prueba en móviles y agentes

- [ ] **David:** GitHub Mobile autenticado → abrir Issue #26, crear sesión real Copilot cloud agent, rama base demo y PR contra esa rama.
- [ ] **Sergio:** confirmar habilitación del coding agent Claude en GitHub Mobile y permisos para ese repositorio. No inferirlo de modelos de chat.
- [ ] **Ambos:** confirmar disponibilidad de Codex coding agent, consumo/créditos y políticas.
- [ ] Android + otro móvil: abrir QR, generar Issue, navegar por portal, pulsar Intercambiar, Regresar y selección por teclado.
- [ ] Comprobar modo movimiento reducido, zoom, focos y panel accesible; registrar capturas.
- [ ] Comprobar qué ocurre con 0/1/2/50 mundos, en D1 y simulados; no usar pruebas sintéticas como evidencia de público real.
- [ ] **No ejecutar** Foundry WorldGen ni migraciones D1 remotamente para esta misión: no son necesarias.

## 4. Miércoles 25 · Ensayo + freeze

- [ ] Ensayo completo **15:00–15:55** con David y Sergio; registrar duración real de cada bloque: 5 + 10 + 25 + 10 + 5 minutos.
- [ ] Probar dos teléfonos, proyector/HDMI, resolución 16:9, visibilidad desde la última fila y red de respaldo.
- [ ] Fotografiar el QR en pantalla y abrirlo **desde ambos móviles**; confirmar que la URL dirige a creación real.
- [ ] Ejecutar una Issue desde GitHub Mobile identificada como ensayo → validar registro en D1 y objeto visible; comprobar latencia real y moderación.
- [ ] Iniciar una sesión real de cada coding agent o anotar **NO DISPONIBLE** y ensayar la transición al backup sin atribución falsa.
- [ ] Abrir Slidev con panel manual; accionar estado de agentes y verificar que no se muestra «VERIFICADA» sin evidencia.
- [ ] Guardar capturas y enlaces a PR, diffs, Actions, Issues y a la escena final.
- [ ] **Freeze al cerrar el día:** apuntar SHA principal, comprobar Pages y no introducir cambios no ensayados.

## 5. Jueves 26 · Checklist en sala

**13:30–14:00**
- [ ] [GitHub Pages](https://davidop.github.io/academyverso-2026/) abre y dibuja canvas Three.js.
- [ ] [Slidev](https://davidop.github.io/academyverso-2026/presentation/) abre con panel de misiones y QR legibles.
- [ ] [Worker health](https://academyverso-api.david-oliva-paredes.workers.dev/api/health): `ok`, `database_connected`, `create_enabled` verificados. `worldgen_enabled` NO es requisito.
- [ ] Comprobar dos objetos visibles en `/api/objects`; guardar sus Issues auténticas y distinguir ensayos de audiencia.
- [ ] Accesos GitHub Mobile, red, batería, proyector y modo presentador.

**14:30–14:55**
- [ ] Abrir pestañas: Slidev, galaxia con `#universe`, GitHub Issues, PRs #22–#25 y Actions.
- [ ] QR comprobado desde cámara móvil; pantalla y audio listos.
- [ ] Acordar quién controla teléfono/proyector en cada momento.
- [ ] Confirmar estado de tres sesiones reales y las rutas alternativas.

## 6. Decisión GO/NO-GO por funcionalidad

**GO de experiencia escénica si**
- [ ] Pages con portal y Slidev publicada en un SHA probado.
- [ ] Dos mundos distintos válidos y seleccionables en universo; o modo demo etiquetado con dos ejemplos (sin atribuirlos al público).
- [ ] Portal atraviesa de origen a destino, llega, regresa; uso móvil y accesibilidad ensayados.
- [ ] QR y creación de Issues probados desde móvil.
- [ ] Uno de los dos ponentes puede contar la historia sin dependencia de respuestas instantáneas de la IA.

**GO de demostración de agentes solo si**
- [ ] Se abre una sesión real y su PR/commits/Actions trazables. Si falla una de las tres, usar respaldo indicado, explicar el cambio y NO afirmar que los tres ejecutaron.
- [ ] No se fusionan PR automatizadas no revisadas ni se trabaja en `main` durante la sesión.
- [ ] Slidev refleja estado manual consistente con la evidencia.

**NO-GO parcial** significa omitir la capacidad afectada y explicar la limitación, no cancelar toda la charla.

## 7. Plan B de escenario

| Incidencia | Respuesta |
|---|---|
| No llegan dos mundos del público | Seleccionar dos creaciones auténticas de ensayo; decir explícitamente que son del equipo |
| Worker/D1/Actions no responde | Mostrar Issues existentes y portal en modo demo solo cuando aparezca claramente indicado |
| Un agente tarda o no existe el permiso | Enseñar Issue/sesión en curso, luego su PR de respaldo #23/#24/#25 como referencia ChatGPT |
| Problema con rama/CI de demo | No fusionar; enseñar diff de referencia + Actions previas y mantener main estable |
| Portal falla en móvil | Usar proyector escritorio y capturas de navegador verificadas; no afirmar que funciona en móvil físico |
| Slidev no carga | Abrir app 3D en pestaña independiente y navegar por Issues/PRs; usar las notas del guion impreso |
| Caída de Internet | No fingir participación en directo; usar capturas y explicación offline de la arquitectura |
| Falta tiempo | Priorizar creación del público, una demostración de agente auténtica y viaje final |

**Frase de transparencia:** «Esta PR es nuestro respaldo, preparado antes de la charla. Lo que veis en GitHub Mobile es la ejecución real; os enseñamos por separado lo que ya habíamos validado».

## 8. Cierre de ejecución

Guion 55 min: [docs/guion-demo.md](guion-demo.md) · Prompts: [docs/prompts-agentes.md](prompts-agentes.md) · Política de agentes: [docs/activar-agentes.md](activar-agentes.md).

**Campos a rellenar en ensayo:** `main SHA`, `Pages run`, `CI run`, `captura Android`, `captura iOS`, `Issue creada desde móvil`, `PR Copilot real`, `PR Claude real`, `PR Codex real`, `resultado proyector`, `GO/NO-GO firmado por ambos`.
