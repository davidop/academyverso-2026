---
theme: default
layout: default
title: AcademyVerso 2026 · Programa con IA desde tu móvil
colorSchema: dark
aspectRatio: 16/9
canvasWidth: 1280
routerMode: hash
transition: fade
fonts:
  sans: Arial
  mono: Consolas
---

<MissionCover />

<!-- David abre preguntando quién ha programado desde el móvil. Sergio anuncia que juntos poblaremos una galaxia. -->

---
transition: slide-left
---

<div class="kicker">01 · LA IDEA</div>
<div class="headline">No vamos a hablar de IA.<br><span class="gradient">Vamos a ponerla a trabajar.</span></div>
<div class="two-up" style="margin-top:60px">
 <div class="glass dim"><div class="eyebrow">ANTES</div><div class="emoji">💬</div><h2>«Escríbeme código»</h2><p>Copiar. Pegar. Repetir.</p></div>
 <div class="glass highlight" v-click><div class="eyebrow">AHORA</div><div class="emoji">🚀</div><h2>«Hazte cargo de esta tarea»</h2><p>Repositorio · agente · PR · revisión.</p></div>
</div>
<div class="footnote">La ventaja que demostramos es el flujo de desarrollo integrado, no la superioridad universal de un modelo.</div>

<!-- Sergio explica la diferencia entre preguntar a un chatbot y delegar un cambio real sobre GitHub. -->

---
transition: slide-left
---

<div class="kicker">02 · LA MISIÓN</div>
<div class="headline">Un universo.<br><span class="mint">50 exploradores.</span></div>
<div class="mission-layout">
 <GalaxyOrbit />
 <div class="stats"><div><b>25–50</b><span>personas en la sala</span></div><div><b>∞</b><span>ideas espaciales</span></div><div><b>3</b><span>agentes trabajando juntos</span></div></div>
</div>
<div class="footnote">Planetas, estrellas, lunas y estaciones espaciales: cada asistente imagina su propia creación.</div>

<!-- David introduce AcademyVerso. El universo 3D está creado; la integración en directo requiere su backend. -->

---
transition: fade
---

<div class="kicker">03 · TRIPULACIÓN</div>
<div class="headline">Dos ponentes.<br><span class="gradient">Una misión compartida.</span></div>
<div class="speaker-grid">
 <div class="speaker"><img src="https://avatars.githubusercontent.com/u/7433346?v=4" alt="David Oliva"/><div><h2>DAVID OLIVA</h2><p>Microsoft MVP · Microsoft Specialist</p><small>Arquitectura · agentes · demo</small></div></div>
 <div class="speaker"><img src="https://github.com/svg153.png?size=360" alt="Sergio Valverde"/><div><h2>SERGIO VALVERDE</h2><p>Platform Engineer · Lunik · GitHub Star</p><small>GitHub · experiencia · demo</small></div></div>
</div>

<!-- Sergio y David se presentan brevemente. Alternarán explicaciones y demostraciones. -->

---
transition: slide-left
---

<div class="kicker">04 · EL MÓVIL COMO CONSOLA DE MANDO</div>
<div class="headline">Diriges trabajo.<br><span class="mint">No escribes cientos de líneas.</span></div>
<div class="flow">
 <div class="node" v-click><div>📱</div><b>GitHub Mobile</b><small>Instrucciones</small></div><span class="arrow" v-after>→</span>
 <div class="node" v-click><div>🤖</div><b>Agente IA</b><small>Modifica el repo</small></div><span class="arrow" v-after>→</span>
 <div class="node" v-click><div>🔀</div><b>Pull request</b><small>Revisión humana</small></div><span class="arrow" v-after>→</span>
 <div class="node" v-click><div>✨</div><b>App mejorada</b><small>Validación</small></div>
</div>
<div class="footnote">La IA propone cambios; las personas revisan permisos, pruebas y resultado.</div>

<!-- David y Sergio avanzan las cuatro etapas con clics. -->

---
transition: slide-left
---

<div class="kicker">05 · TRES AGENTES / UN REPO</div>
<div class="headline">Cada uno aporta<br><span class="gradient">algo diferente.</span></div>
<div class="agent-grid">
 <div class="agent" v-click><img src="https://cdn.simpleicons.org/githubcopilot/ffffff" alt="Logo GitHub Copilot"/><h2>COPILOT</h2><b>CONSTRUIR</b><p>Implementar viajes entre planetas.</p></div>
 <div class="agent" v-click><img src="https://cdn.simpleicons.org/anthropic/ffffff" alt="Logo Anthropic"/><h2>CLAUDE</h2><b>MEJORAR</b><p>Enriquecer UI, movimiento y experiencia.</p></div>
 <div class="agent" v-click><img src="https://cdn.simpleicons.org/openai/ffffff" alt="Logo OpenAI"/><h2>CODEX</h2><b>VALIDAR</b><p>Pruebas, accesibilidad y correcciones.</p></div>
</div>
<div class="footnote warning">Un modelo Claude dentro del chat Copilot no es el agente independiente Claude Code.</div>

<!-- Explicar que los agentes pueden requerir planes, políticas y habilitación específicos. -->

---
transition: fade
---

<div class="kicker">06 · CONECTAMOS LOS AGENTES</div>
<div class="headline">Tres comprobaciones<br><span class="mint">antes de despegar.</span></div>
<div class="stack">
 <div class="stack-row" v-click><b>01</b><div><strong>GitHub Mobile + repositorio</strong><p>Abre tu cuenta y selecciona academyverso-2026.</p></div><span>📱</span></div>
 <div class="stack-row" v-click><b>02</b><div><strong>Nueva sesión en la nube</strong><p>Selecciona rama, agente disponible y tarea.</p></div><span>☁️</span></div>
 <div class="stack-row" v-click><b>03</b><div><strong>Permisos y políticas</strong><p>Claude y Codex requieren acceso habilitado en GitHub.</p></div><span>🔐</span></div>
</div>
<div class="footnote"><a href="https://github.com/davidop/academyverso-2026/blob/main/docs/activar-agentes.md" target="_blank">Guía de activación y comprobación de agentes ↗</a></div>

<!-- Sergio enseña la app real desde Android. Evitar confundir selector de modelos con selector de agentes. -->

---
transition: fade
clicks: 1
---

<ContributionPortal :clicks="$clicks" />

<!-- Sergio facilita el QR. David revisa las Issues reales. Una Issue sí se crea aunque aún no esté desplegado el Worker. -->

---
transition: slide-left
---

<div class="kicker">08 · EL PROMPT ES TU IMAGINACIÓN</div>
<div class="headline">¿Qué mundo<br><span class="mint">quieres inventar?</span></div>
<div class="prompt-example"><div class="prompt-tag">🪐 NUEVA ISSUE · PLANETA</div><div class="prompt-text">«Quiero un planeta <b>violeta</b> con anillos de cristal, <b>tres lunas</b> y tormentas eléctricas. Se llama <b>Neón-42</b> y mi alias es <b>Comandante Pixel</b>».</div><div class="prompt-footer">TIPO · PLANETA　 |　 ALIAS · COMANDANTE PIXEL　 |　 ISSUE · TRAZABLE</div></div>

<!-- David pide al público una propuesta divertida. Sergio muestra la estructura de una Issue. -->

---
transition: fade
---

<div class="kicker">09 · ACADEMYVERSO 3D</div>
<div class="headline compact">Un universo<br><span class="gradient">para explorar.</span></div>
<LiveUniverse />

<!-- Enseñar navegación 3D. Aclarar estado demo vs. live. -->

---
transition: fade
clicks: 3
---

<MissionTrace :clicks="$clicks" />

<!-- Explicar la arquitectura real sin prometer latencias fijas por la cola de Actions. -->

---
transition: slide-left
---

<div class="kicker">11 · TRABAJO ENCADENADO</div>
<div class="headline">Una función.<br><span class="gradient">Tres agentes. Tres PRs.</span></div>
<div class="agent-chain">
 <div class="chain" v-click><img src="https://cdn.simpleicons.org/githubcopilot/ffffff"/><b>COPILOT</b><p>Construye viajes interplanetarios</p><small>PR #1</small></div><span v-after>→</span>
 <div class="chain" v-click><img src="https://cdn.simpleicons.org/anthropic/ffffff"/><b>CLAUDE</b><p>Mejora animaciones y UI</p><small>PR #2</small></div><span v-after>→</span>
 <div class="chain" v-click><img src="https://cdn.simpleicons.org/openai/ffffff"/><b>CODEX</b><p>Valida y añade pruebas</p><small>PR #3</small></div>
</div>
<div class="footnote">Cada nuevo agente parte de una versión revisada e integrada del trabajo anterior.</div>

<!-- Alternar Sergio y David. Si no finaliza una tarea, usar PRs preparados e identificados como respaldo. -->

---
transition: fade
---

<div class="kicker">12 · DEMO COPILOT / CONSTRUIR</div>
<div class="demo-layout">
 <div><div class="pill">01 · CONSTRUIR</div><div class="headline compact">Viajamos<br><span class="mint">entre planetas.</span></div><div class="prompt-small">«Implementa la navegación interplanetaria: selecciona un planeta, permite viajar a él y muestra su ficha. Mantén accesibilidad y estabilidad».</div></div>
 <div class="travel"><div class="planet left"></div><div class="dash"></div><span class="rocket">🚀</span><div class="planet right"></div><small>ORIGEN → VIAJE → DESTINO</small></div>
</div>

<!-- David crea una sesión Copilot y Sergio revisa el PR. La animación es ilustrativa; no representa una ejecución completada. -->

---
transition: fade
---

<div class="kicker">13 · DEMO CLAUDE / ENRIQUECER</div>
<div class="demo-layout">
 <div><div class="pill amber-pill">02 · MEJORAR</div><div class="headline compact">Del código<br><span class="gradient">a la experiencia.</span></div><div class="prompt-small">«Mejora el viaje con estelas, partículas, transiciones fluidas y soporte prefers-reduced-motion. Respeta el estilo AcademyVerso».</div></div>
 <div class="cosmic-art"><div class="ring r1"></div><div class="ring r2"></div><div class="core"></div><span>✦　✧　✦</span></div>
</div>

<!-- Sergio utiliza Claude sobre el código integrado de Copilot. David explica las mejoras visuales y accesibilidad. -->

---
transition: fade
---

<div class="kicker">14 · DEMO CODEX / VALIDAR</div>
<div class="demo-layout">
 <div><div class="pill blue-pill">03 · VALIDAR</div><div class="headline compact">La IA genera.<br><span class="mint">Tú verificas.</span></div><div class="prompt-small">«Añade pruebas de navegación, teclado, accesibilidad y regresión. Corrige errores y documenta las comprobaciones en el PR».</div></div>
 <div class="console"><div class="console-header">● ● ●　 academyverso / CI</div><p>✓ navigation · planet-to-planet</p><p>✓ keyboard · accessible</p><p>✓ reduced-motion · supported</p><p>✓ regression · monitored</p><b>CI SUCCESS <i>●</i></b><small>Ejemplo visual. Comprobar el CI real durante la demo.</small></div>
</div>

<!-- David ejecuta la tarea de Codex. Sergio muestra resultados reales de CI; el panel de la diapositiva es una maqueta, no una afirmación de ejecución. -->

---
transition: slide-left
---

<div class="kicker">15 · MISIÓN FINAL</div>
<div class="headline">¿Quién encuentra<br><span class="gradient">su propio planeta?</span></div>
<div class="mission-cards"><div v-click><span>📱</span><b>ENVÍA</b><p>Tu descripción en una Issue</p></div><div v-click><span>🌌</span><b>EXPLORA</b><p>Visita un universo compartido</p></div><div v-click><span>🚀</span><b>VIAJA</b><p>Prueba la funcionalidad creada por agentes</p></div></div>
<div class="footnote warning">Si no está activo el backend, distinguir objetos de muestra e Issues reales. No simular aportaciones en tiempo real.</div>

<!-- Reto colectivo con condiciones reales comprobadas; si hay incidencias, mostrar la demo ya construida. -->

---
transition: fade
---

<MissionClosing />

<!-- Cierre conjunto con QR persistente del repositorio; animar a seguir aprendiendo y revisando pull requests. -->
