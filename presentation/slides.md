---
theme: default
title: AcademyVerso 2026 · Programa con IA desde tu móvil
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
routerMode: hash
transition: fade
layout: cover
fonts:
  sans: Host Grotesk
  serif: Unbounded
  mono: JetBrains Mono
  weights: '400,500,600,700,800'
  provider: google
---

<div class="cover-kicker">ACADEMYVERSO 2026 · MISIÓN INTERACTIVA</div>
<h1 class="cover-title">Programa<br>con IA desde<br>tu <span class="lime">móvil</span></h1>
<div class="cover-sub">Un móvil. Tres agentes. Un universo creado por todos.</div>
<div class="cover-platforms"><span>◈ GitHub Mobile</span><span>◉ Copilot</span><span>✳ Claude</span><span>◎ Codex</span></div>
<div class="cover-stamp">DAVID OLIVA + SERGIO VALVERDE · 26 NOVIEMBRE · 15:00</div>

<!-- David abre preguntando quién ha programado desde el móvil. Sergio anuncia que juntos poblaremos una galaxia. -->

---
layout: space
transition: fade
---

<div class="kicker">APERTURA · UNA PARODIA TECNOLÓGICA INDEPENDIENTE</div>
<div class="gta-hero">
 <div><div class="gta-roman">GTA <span>VII</span></div>
 <div class="gta-subtitle">GRAND<br>TERRAFORMING<br>AGENTS</div>
 <p>Todos hablan del próximo gran mundo abierto.<br>¿Y si esta vez <strong>no lo jugáramos, sino que lo construyéramos</strong> con IA desde el móvil?</p>
 <div class="gta-mini">📱 GITHUB MOBILE　·　🤖 COPILOT　·　✳ CLAUDE　·　◎ CODEX</div></div>
 <div class="gta-orbital" aria-hidden="true"><div class="gta-sphere"></div><div class="gta-orbit o1"></div><div class="gta-orbit o2"></div><img class="gta-astronaut" src="./assets/template/astronauta-volando.svg" alt="" /></div>
</div>
<div class="footnote">GTA VII: Grand Terraforming Agents es un concepto paródico propio, no afiliado a Rockstar Games. Sin imágenes ni logotipos del videojuego.</div>

<!-- Sergio lanza el hook de 30 segundos: «No vamos a crear un GTA: vamos a construir mundos mediante Issues y agentes sobre GitHub». David abre la aplicación real. -->


---
layout: space
transition: fade
clicks: 1
---

<div class="kicker">PARTICIPA · ESCANEA EL QR</div>
<div class="headline">Escanea. Imagina.<br><span class="gradient">Crea tu planeta.</span></div>
<ContributionPortal :clicks="$clicks" />

<!-- Sergio facilita el QR. David revisa las Issues reales. Una Issue sí se crea aunque aún no esté desplegado el Worker. -->

---
transition: slide-left
---

<div class="kicker">PARTICIPA · IMAGINA TU MUNDO</div>
<div class="headline">¿Qué mundo<br><span class="mint">quieres inventar?</span></div>
<div class="imagine-layout">
 <div class="prompt-example"><div class="prompt-tag">🪐 NUEVA ISSUE · PLANETA</div><div class="prompt-text">«Quiero un planeta <b>violeta</b> con anillos de cristal, <b>tres lunas</b> y tormentas eléctricas. Se llama <b>Neón-42</b> y mi alias es <b>Comandante Pixel</b>».</div><div class="prompt-footer">TIPO · PLANETA　 |　 ALIAS · COMANDANTE PIXEL　 |　 ISSUE · TRAZABLE</div></div>
 <img class="imagine-astronaut" src="./assets/template/astronauta-lapiz.svg" alt="" />
</div>

<!-- David pide al público una propuesta divertida. Sergio muestra la estructura de una Issue. -->

---
transition: slide-left
---

<div class="kicker">MISIÓN PARTICIPATIVA · EL PÚBLICO DECIDE</div>
<div class="headline compact">Cada persona crea un mundo.<br><span class="gradient">Elegiremos dos para conectarlos.</span></div>
<div class="gta-vote">
 <div class="gta-choice vice" v-click><span class="gta-choice-icon">🌆</span><small>RUTA A · METRÓPOLIS</small><h2>VICE NEBULA</h2><p>Neón, avenidas flotantes y vehículos antigravedad.</p></div>
 <div class="gta-choice sentinel" v-click><span class="gta-choice-icon">🛰️</span><small>RUTA B · COLONIA</small><h2>COLONIA CENTINELA</h2><p>Cúpulas espaciales, drones de rescate y rutas seguras.</p></div>
</div>
<div class="gta-bottom"><a class="action-link" href="https://davidop.github.io/academyverso-2026/#grand-terraforming-agents" target="_blank">ABRIR MISIÓN EN DIRECTO ↗</a><span>Vice Nebula y Centinela son ejemplos. Al final seleccionaremos dos mundos registrados por asistentes; los contadores no equivalen a votos únicos.</span></div>

<!-- Sergio enseña dos opciones en la web. David pide al público crear un planeta desde el formulario o GitHub Mobile. El recuento se alimenta de D1; nunca simular participación. -->

---
layout: space
transition: fade
---

<div class="kicker">PARTICIPA · ACADEMYVERSO 3D</div>
<div class="headline compact">Un universo<br><span class="gradient">que conectaremos con un portal.</span></div>
<LiveUniverse />

<!-- Enseñar navegación 3D. Aclarar estado demo vs. live. -->

---
transition: slide-left
---

<div class="kicker">CÓMO FUNCIONA · LA IDEA</div>
<div class="headline">No vamos a hablar de IA.<br><span class="gradient">Vamos a ponerla a trabajar.</span></div>
<div class="two-up">
 <div class="glass dim"><div class="eyebrow">ANTES</div><div class="emoji">💬</div><h2>«Escríbeme código»</h2><p>Copiar. Pegar. Repetir.</p></div>
 <div class="glass highlight" v-click><div class="eyebrow">AHORA</div><div class="emoji">🚀</div><h2>«Hazte cargo de esta tarea»</h2><p>Repositorio · agente · PR · revisión.</p></div>
</div>
<div class="footnote">La ventaja que demostramos es el flujo de desarrollo integrado, no la superioridad universal de un modelo.</div>

<!-- Sergio explica la diferencia entre preguntar a un chatbot y delegar un cambio real sobre GitHub. -->

---
transition: slide-left
---

<div class="kicker">CÓMO FUNCIONA · LA MISIÓN</div>
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

<div class="kicker">CÓMO FUNCIONA · TRIPULACIÓN</div>
<div class="headline">Dos ponentes.<br><span class="gradient">Una misión compartida.</span></div>
<div class="speaker-grid">
 <div class="speaker"><div class="speaker-photo"><SpeakerPortrait person="david" name="David Oliva"/></div><div><h2>DAVID OLIVA</h2><p>Microsoft MVP · Microsoft Specialist</p><div class="speaker-handle"><i><img src="https://cdn.simpleicons.org/github/DBD6FC" alt=""/></i><span>davidop</span></div><small>ARQUITECTURA · AGENTES · DEMO</small></div></div>
 <div class="speaker"><div class="speaker-photo"><SpeakerPortrait person="sergio" name="Sergio Valverde"/></div><div><h2>SERGIO VALVERDE</h2><p>Platform Engineer · Lunik · GitHub Star</p><div class="speaker-handle"><i><img src="https://cdn.simpleicons.org/github/DBD6FC" alt=""/></i><span>svg153</span></div><small>GITHUB · EXPERIENCIA · DEMO</small></div></div>
</div>

<!-- Sergio y David se presentan brevemente. Alternarán explicaciones y demostraciones. -->

---
transition: slide-left
---

<div class="kicker">CÓMO FUNCIONA · EL MÓVIL COMO CONSOLA</div>
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

<div class="kicker">CÓMO FUNCIONA · TRES AGENTES / UN REPO</div>
<div class="headline">Cada uno aporta<br><span class="gradient">algo diferente.</span></div>
<div class="agent-grid">
 <div class="agent" v-click><img src="https://cdn.simpleicons.org/githubcopilot/DBD6FC" alt="Logo GitHub Copilot"/><h2>COPILOT</h2><b>CONSTRUIR</b><p>Construir un portal entre dos mundos del público.</p></div>
 <div class="agent" v-click><img src="https://cdn.simpleicons.org/anthropic/DBD6FC" alt="Logo Anthropic"/><h2>CLAUDE</h2><b>MEJORAR</b><p>Dar energía y personalidad visual al portal.</p></div>
 <div class="agent" v-click><span class="agent-glyph" aria-hidden="true">◎</span><h2>CODEX</h2><b>VALIDAR</b><p>Validar cruce, accesibilidad y móvil.</p></div>
</div>
<div class="footnote warning">Un modelo Claude dentro del chat Copilot no es el agente independiente Claude Code.</div>

<!-- Explicar que los agentes pueden requerir planes, políticas y habilitación específicos. -->

---
transition: fade
---

<div class="kicker">PREPARACIÓN · AGENTES EN GITHUB MOBILE</div>
<div class="headline">Tres comprobaciones<br><span class="mint">antes de despegar.</span></div>
<div class="stack">
 <div class="stack-row" v-click><b>01</b><div><strong>GitHub Mobile + repositorio</strong><p>Abre tu cuenta y selecciona academyverso-2026.</p></div><span>📱</span></div>
 <div class="stack-row" v-click><b>02</b><div><strong>Nueva sesión en la nube</strong><p>Selecciona rama, agente disponible y tarea.</p></div><span>☁️</span></div>
 <div class="stack-row" v-click><b>03</b><div><strong>Permisos y políticas</strong><p>Claude y Codex requieren acceso habilitado en GitHub.</p></div><span>🔐</span></div>
</div>
<div class="footnote"><a href="https://github.com/davidop/academyverso-2026/blob/main/docs/activar-agentes.md" target="_blank">Guía de activación y comprobación de agentes ↗</a></div>

<!-- Sergio enseña la app real desde Android. Evitar confundir selector de modelos con selector de agentes. -->


---
layout: space
transition: fade
clicks: 4
---

<div class="kicker">CÓMO FUNCIONA · DE LA ISSUE A LA GALAXIA</div>
<div class="headline compact">Cada objeto tiene<br><span class="mint">una historia en GitHub.</span></div>
<MissionTrace :clicks="$clicks" tone="space" />
<div class="footnote">GitHub Pages sirve la experiencia 3D; Worker y D1 sincronizan las aportaciones. Cada propuesta queda trazada en una Issue pública.</div>

<!-- Explicar la arquitectura real sin prometer latencias fijas por la cola de Actions. -->

---
transition: slide-left
---

<div class="kicker">MISIÓN · TRABAJO ENCADENADO</div>
<div class="headline">Un escenario.<br><span class="gradient">Tres agentes. PRs revisados.</span></div>
<div class="agent-chain">
 <div class="chain" v-click><img src="https://cdn.simpleicons.org/githubcopilot/DBD6FC"/><b>COPILOT</b><p>Conecta dos mundos del público</p><small>TAREA 1</small></div><span v-after>→</span>
 <div class="chain" v-click><img src="https://cdn.simpleicons.org/anthropic/DBD6FC"/><b>CLAUDE</b><p>Convierte el enlace en portal de energía</p><small>TAREA 2</small></div><span v-after>→</span>
 <div class="chain" v-click><span class="agent-glyph" aria-hidden="true">◎</span><b>CODEX</b><p>Valida cruce, móvil y CI</p><small>TAREA 3</small></div>
</div>
<div class="footnote">Cada nuevo agente parte de una versión revisada e integrada del trabajo anterior.</div>

<!-- David y Sergio alternan GitHub Mobile y las explicaciones. Las ramas de referencia son de ChatGPT, no de coding agents. -->

---
layout: space
transition: fade
---

<div class="kicker">CENTRO DE CONTROL · EN DIRECTO</div>
<div class="headline compact">Una misión. <span class="gradient">Tres etapas verificables.</span></div>
<MissionBoard />
<div class="footnote warning">Los estados se actualizan manualmente: NO simulan telemetría de GitHub. Una PR de respaldo es trabajo preparado, nunca una ejecución de agente en directo.</div>

<!-- Control de la sesión: 15:15–15:40. Sergio y David alternan móvil y proyector. Mostrar una Issue y una PR real por fase si el acceso está disponible. -->


---
transition: fade
---

<div class="kicker">FASE 1/3 · COPILOT / CONSTRUIR</div>
<div class="demo-layout">
 <div><div class="pill">01 · CONSTRUIR</div><div class="headline compact">Construimos<br><span class="mint">un portal entre mundos.</span></div><div class="prompt-small">«Conecta dos objetos válidos del universo, elegidos entre Issues reales. Implementa el portal sin alterar D1; conserva regreso, teclado y reduced-motion».</div></div>
 <div class="travel"><div class="planet left"></div><div class="dash"></div><span class="rocket">🚀</span><div class="planet right"></div><small>CREACIÓN A → PORTAL → CREACIÓN B</small></div>
</div>

<!-- La base del portal preparada en PR #22 es código de referencia ChatGPT, no atribuirla a Copilot. Ejecutar el prompt vivo en rama de misión nueva o enseñar una PR marcada «respaldo». -->

---
transition: fade
---

<div class="kicker">FASE 2/3 · CLAUDE / MEJORAR</div>
<div class="demo-layout">
 <div><div class="pill amber-pill">02 · MEJORAR</div><div class="headline compact">Del código<br><span class="gradient">a la experiencia.</span></div><div class="prompt-small">«Mejora el portal que ya construyó Copilot: anillos de energía, partículas ligeras, contraste y una transición memorable. Respeta rendimiento y reduced-motion».</div></div>
 <div class="cosmic-art"><div class="ring r1"></div><div class="ring r2"></div><div class="core"></div><span>✦　✧　✦</span></div>
</div>

<!-- Sergio usa Claude únicamente si el agente real está habilitado. Si se utiliza referencia previa, indicar explícitamente que es un respaldo. -->

---
transition: fade
---

<div class="kicker">FASE 3/3 · CODEX / VERIFICAR</div>
<div class="demo-layout">
 <div><div class="pill blue-pill">03 · VALIDAR</div><div class="headline compact">La IA genera.<br><span class="mint">Tú verificas.</span></div><div class="prompt-small">«Sobre la PR anterior, añade pruebas para dos destinos distintos, sincronización D1, tránsito, regreso, modo reducido y 50 objetos. Verifica CI y no inventes resultados».</div></div>
 <div class="console"><div class="console-header">● ● ●　 academyverso / CI</div><p>✓ navigation · planet-to-planet</p><p>✓ keyboard · accessible</p><p>✓ reduced-motion · supported</p><p>✓ regression · monitored</p><b>CI SUCCESS <i>●</i></b><small>Ejemplo visual. Comprobar el CI real durante la demo.</small></div>
</div>

<!-- David abre la PR real de Codex en GitHub Mobile; Sergio muestra la ejecución de Actions. Consola ilustrativa, nunca sustituye evidencia real. -->

---
layout: space
transition: slide-left
---

<div class="kicker">GRAN FINAL · PORTAL INTERDIMENSIONAL</div>
<div class="headline">Dos mundos de asistentes.<br><span class="gradient">Un portal construido con agentes.</span></div>
<div class="mission-cards"><div v-click><span>📱</span><b>ENVÍA</b><p>Tu descripción en una Issue</p></div><div v-click><span>🌌</span><b>EXPLORA</b><p>Visita un universo compartido</p></div><div v-click><span>🚀</span><b>VIAJA</b><p>Atravesad el portal entre dos creaciones</p></div></div>
<div class="footnote warning">Seleccionar dos creaciones visibles y distintas. Si no hay suficientes aportaciones reales, usar dos mundos de respaldo identificados como ejemplo.</div>

<!-- 15:40–15:50: Sergio selecciona origen; David elige destino. Abrir #universe y activar el portal. Mostrar vuelta a galaxia y enlace a Issues. -->

---
transition: fade
---

<div class="sponsors">
 <span class="sponsor-label top">PATROCINA</span>
 <img class="sponsor-main" src="./assets/template/logo-vvalley-dark.svg" alt="V-Valley" />
 <span class="sponsor-label bottom">COLABORAN</span>
 <div class="sponsor-row"><img src="./assets/template/logo-tajamar-dark.svg" alt="Tajamar" /><img src="./assets/template/logo-techriders.svg" alt="Tech Riders" /></div>
 <div class="sponsor-bubble"><b>¡Gracias<br>sponsors!</b></div>
 <img class="sponsor-astronaut" src="./assets/template/astronauta-corazon.svg" alt="" />
</div>

<!-- Agradecimiento a patrocinadores y colaboradores del evento (diapositiva de la plantilla oficial). -->

---
transition: fade
---

<div class="banco">
 <img class="banco-logo" src="./assets/template/logo-academyverso.svg" alt="AcademyVerso" />
 <p class="banco-text">Colabora en este evento con la<br><b>Fundación Banco de Alimentos de Madrid</b></p>
 <img class="banco-org" src="./assets/template/logo-banco-alimentos.svg" alt="Fundación Banco de Alimentos de Madrid" />
 <img class="banco-qr" src="./assets/template/qr-banco-alimentos.png" alt="QR para colaborar con la Fundación Banco de Alimentos de Madrid" />
 <img class="banco-astronaut" src="./assets/template/astronauta-bolsa.svg" alt="" />
</div>

<!-- Diapositiva solidaria de la plantilla oficial: invitar a colaborar con el Banco de Alimentos. -->

---
layout: space
transition: fade
---

<div class="kicker">CIERRE · EL UNIVERSO CONTINÚA</div>
<div class="final-title">Esto no<br><span class="lime">termina hoy.</span></div>
<div class="final-layout">
 <QrPortal url="https://davidop.github.io/academyverso-2026/sesion.html" label="ENLACES Y CÓDIGO"/>
 <div>
  <p>Tu móvil puede dirigir agentes.</p><p>Tu idea puede convertirse en código.</p><p>Tu contribución puede quedarse en GitHub.</p>
  <div class="final-links">
   <a class="action-link" href="https://davidop.github.io/academyverso-2026/sesion.html" target="_blank" rel="noopener noreferrer">ENLACES DE LA SESIÓN ↗</a>
   <a class="final-link" href="https://davidop.github.io/academyverso-2026/" target="_blank" rel="noopener noreferrer">Explorar el universo 3D ↗</a>
   <a class="final-link" href="https://github.com/davidop/academyverso-2026" target="_blank" rel="noopener noreferrer">Código y documentación ↗</a>
  </div>
 </div>
</div>
<img class="final-astronaut" src="./assets/template/astronauta-capa.svg" alt="" />
<div class="final-stamp">DAVID OLIVA × SERGIO VALVERDE · ACADEMYVERSO 2026</div>

<!-- Cierre conjunto con QR persistente del repositorio; animar a seguir aprendiendo y revisando pull requests. -->
