# AcademyVerso 2026 · Guion narrativo propuesto

**Guion de trabajo aprobado para la revisión visual.** 26 de noviembre · 15:00–15:55 · Sala Trabaja con IA · David Oliva y Sergio Valverde.

Una pregunta abre la charla: **¿puede un móvil dirigir trabajo de desarrollo real?** La respuesta se demuestra dos veces: el público crea una Issue para imaginar un mundo; los ponentes toman una función concreta —viajar entre planetas— y muestran cómo pasa de encargo a cambio revisado. Son dos recorridos distintos: **un planeta es una contribución; el viaje es un cambio de código**. No se presentan como el mismo flujo.

Este documento es el guion del corte de rediseño (17 escenas). El deck publicado sigue el guion de main con **22 escenas** sobre la plantilla oficial, y la misión se cuenta en una sola Issue con relevo Copilot → Claude → Codex. Los IDs S01–S17 de aquí no son los números actuales de Slidev; el mapa es: S01→S01, S02→S07, S03→S08, S04→S09, S05→S10, S06→S11, S07→S12, S08→S03, S09→S04, S10→S06, S11→S13, S12→S14, S13→S16, S14→S17, S15→S18, S16→S19, S17→S22. S20 y S21 son las escenas de patrocinadores y Banco de Alimentos de la plantilla.

## Acto I · Del chat al encargo · 15:00–15:14

| Escena | Titular en pantalla | Qué pasa en sala |
| --- | --- | --- |
| S01 · Portada | **¿Y si dirigieras un repo desde el móvil?** | David pregunta quién lo ha intentado. El subtítulo conserva el título de la sesión y los nombres. Sergio adelanta el resultado: construir y revisar desde GitHub. |
| S02 · La idea | **No pides código. Delegas un cambio.** | Sergio compara «escríbeme código» con «encárgate de esta tarea del repo». Se pasa de texto para copiar a trabajo con una PR que alguien revisa. |
| S03 · La misión | **Vamos a poblar una galaxia.** | David enseña un universo de ejemplo y plantea el reto de inventar un mundo; no promete que vayan a aparecer objetos en directo. |
| S04 · Tripulación | **Dos ponentes. Una misión.** | Presentación breve de David y Sergio. Separar quién enseña y quién verifica en la demo, no repartir credenciales ni cargos no revisados. |
| S05 · Consola · A3 | **Diriges trabajo. No escribes cientos de líneas.** | Sergio sigue un encargo: GitHub Mobile → agente → PR → revisión humana → resultado validado. David pregunta quién decide que entra el cambio. |
| S06 · Los agentes | **Tres agentes, un repositorio.** | David asigna construir, mejorar y validar en esta demo. Son papeles de la historia, no características exclusivas ni una comparativa de modelos. |
| S07 · Preparación | **Antes de despegar, comprueba el acceso.** | Sergio muestra dónde están el repositorio, el selector de agentes y la rama. Un modelo en el chat no equivale a un agente habilitado. Los permisos y la disponibilidad se comprueban antes. |

## Acto II · La sala deja su huella · 15:14–15:27

| Escena | Titular en pantalla | Qué pasa en sala |
| --- | --- | --- |
| S08 · Portal · A1 | **Escanea. Imagina. Crea tu planeta.** | Sergio deja el QR y su enlace visibles desde el inicio. Se explica que GitHub pide sesión. El público elige tipo, alias y descripción y envía la Issue. |
| S09 · Imaginación · A2 | **¿Qué mundo quieres inventar?** | David propone Neón-42: anillos de cristal y tres lunas. Dejar el QR accesible al avanzar (desde el enlace de apoyo o volver un plano). El ejemplo no se atribuye al público. |
| S10 · La galaxia | **Ahora mira el universo.** | David muestra Three.js. Si hay una contribución validada y trazable, abre su objeto. Si no, muestra la Issue real y una galaxia de ejemplo, señaladas por separado. |
| S11 · Trazabilidad | **Cada mundo tiene una historia en GitHub.** | Sergio sigue una Issue por validación, almacenamiento y renderizado. La Issue es el registro; la aparición en la galaxia depende de la integración comprobada. |

## Acto III · Un viaje, tres cambios revisados · 15:27–15:50

| Escena | Titular en pantalla | Qué pasa en sala |
| --- | --- | --- |
| S12 · Relevo · A4 | **Una función. Tres agentes. Tres PRs.** | El mismo viaje atraviesa tres versiones. Cada paso parte del trabajo anterior ya revisado e integrado. Es un plan de trabajo, no un contador de PRs ya abiertas. |
| S13 · Copilot | **Primero: que podamos viajar.** | David delega el viaje y muestra sesión o PR. Sergio revisa la interacción y el diff: seleccionar destino, acercarse y poder volver. |
| S14 · Claude | **Ahora: que se entienda el viaje.** | Sergio pide mejorar estela, transición y feedback accesible sobre la versión integrada. David compara exactamente el mismo trayecto antes/después. |
| S15 · Codex | **La IA genera. Tú verificas.** | David pide pruebas y correcciones; Sergio abre las comprobaciones reales y un caso concreto. Sin un resultado observado, no se muestra un verde de CI como real. |
| S16 · Resultado | **¿Podemos hacer el viaje y volver?** | Ambos prueban el recorrido, la vuelta y al menos un control accesible (teclado o movimiento reducido). Si no hay build funcional, muestran respaldo identificado. |

## Acto IV · La misión sigue · 15:50–15:55

| Escena | Titular en pantalla | Qué pasa en sala |
| --- | --- | --- |
| S17 · Cierre | **Tu móvil delega. Tú decides qué entra.** | Recap en una frase: delegar, revisar, validar. QR y enlace al repo; preguntas. No usar el QR de creación como enlace de cierre. |

## Run of show de la demo

| Hora | Acción y prueba visible | Si algo falla |
| --- | --- | --- |
| 15:14–15:22 | Una persona abre el formulario, crea una Issue y David la localiza por su número. | Wi-Fi o login: usar captura o Issue previamente preparada y decirlo. Ofrecer lectura de la galaxia; no prometer envío anónimo sin integración verificada. |
| 15:22–15:27 | Contrastar Issue con Three.js. Solo llamar «en directo» al objeto vinculado si se comprueba de extremo a extremo. | Iframe fuera: abrir la galaxia aparte. Worker/D1/cola sin comprobar: Issue real por un lado, universo de muestra por otro. |
| 15:27–15:34 | Abrir el encargo de Copilot, enseñar sesión y revisar un diff o una PR verificable. | Si a los ~3 minutos no hay avance visible o falta acceso, pasar al PR de respaldo y explicitar su procedencia. |
| 15:34–15:43 | Enseñar cómo Claude y Codex continúan desde bases distintas pero encadenadas. Abrir un diff visual y una prueba de validación. | Ramas/PRs preparados con bases verificadas. No arrancar un agente sobre una base incompleta ni esperar tres ejecuciones en serie. |
| 15:43–15:50 | Demostrar viajar, volver y un control accesible; distinguir test ejecutado, simulación y respaldo. | Abrir resultado de ensayo o clip rotulado. Mantener el diff y las pruebas como evidencia; quitar espectáculo antes que quitar revisión. |

**Antes de la charla:** dos móviles y un portátil; verificar acceso real a agentes y rama base, probar ambos QR con dos dispositivos, ensayar el modo presentador y la pantalla compartida, guardar capturas/respaldo local y comprobar manualmente el estado de Issue → validación → Worker/D1 → Three.js. No enviar ni mezclar cambios de demo en producción sin la autorización correspondiente.

**Antes de implementar:** contrastar el relato Issue/cambio y los pasos de demo en las revisiones visuales y en el ensayo. El reparto y los minutos son propuestas para ensayar con David, no compromisos del programa.

Fuentes del repositorio: [deck actual](slides.md), [guion de escena](guion-escena.md), [guion de David y Sergio](../docs/guion-demo.md) y [prompts de los agentes](../docs/prompts-agentes.md). El desarrollo visual por escena está en [plan visual](plan-visual.md).
