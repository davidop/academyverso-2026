# Guion de ponentes — 55 minutos (AcademyVerso 2026)

**15:00–15:55** · Sala «Trabaja con IA» · David Oliva + Sergio Valverde. Título oficial: **Programa con IA desde tu móvil: GitHub Copilot, Claude y Codex**. Demo con concepto paródico **GTA VII: Grand Terraforming Agents**.

| Hora | Quién abre | Acción en escenario | Mensaje clave |
|---|---|---|---|
| 15:00–15:04 | David + Sergio | Hook: «¿Y si el próximo mundo abierto no se jugara, sino que lo construyéramos con agentes desde el móvil?» | Parodia independiente; no un GTA real |
| 15:04–15:08 | Sergio | GitHub Mobile: repositorio, Issues, Agents, PRs | El móvil dirige trabajo real |
| 15:08–15:13 | David | Diferenciar selector de modelos de agentes de programación | Claude como modelo ≠ Claude Code |
| 15:13–15:17 | Sergio | Abrir `#grand-terraforming-agents` y mostrar Vice Nebula / Colonia Centinela | El público decide el escenario |
| 15:17–15:24 | Ambos | QR + formularios; participantes crean objetos con etiqueta de misión | GitHub Issues → Worker → D1 → Three.js |
| 15:24–15:32 | David | Solicitar a Copilot un viaje a un planeta de GTA mediante PR | Prompt → código → revisión |
| 15:32–15:40 | Sergio | Claude propone ambiente visual de un escenario sobre rama actualizada | Agentes encadenados, no tres chats aislados |
| 15:40–15:48 | Ambos | Codex comprueba escenarios, accesibilidad, tests y CI | El resultado necesita verificación |
| 15:48–15:52 | Sergio | Mostrar contadores reales, Issues cerradas y universo 3D | Demo de colaboración medible |
| 15:52–15:55 | David | Repo, aprendizajes, reto comunitario y preguntas | La comunidad continúa el proyecto |

## Qué funciona ya (no presentarlo como promesa)

- La app **Three.js** representa objetos cósmicos recibidos desde **Cloudflare D1**.
- Una Issue creada en la web o GitHub Mobile entra en el circuito Worker/Actions; la Issue se cierra tras confirmar ingesta.
- Las tarjetas Vice Nebula y Colonia Centinela precargan un marcador en la descripción y los contadores muestran **número de objetos**, no votos de personas únicas.
- La tematización visual y el 3D actual **no contienen ciudades visitables, vehículos voladores, persecuciones ni sistema jugable de cinco estrellas**. Son propuestas de mejora para los agentes, sujetas a PR, pruebas y revisión.
- Workers AI opcional no implica que Copilot/Claude/Codex hayan generado cada planeta: esos agentes **modifican el código**; las aportaciones llegan como datos validados.

## Preparación previa

1. Dos móviles y pantalla duplicada. Verificar agentes y permisos en sus cuentas; nunca dar por hecho el acceso a Claude Code/Codex.
2. Abrir la web en `https://davidop.github.io/academyverso-2026/#grand-terraforming-agents`, la presentación en `/presentation/` y GitHub Actions de ingesta.
3. Crear una Issue de prueba con marcador `[GTA:VICE-NEBULA]`; comprobar objeto en `/api/objects` y que cierre la Issue. No afirmar latencia fija: GitHub Actions es asíncrono.
4. Ensayar un prompt por agente. Guardar PRs preparados y marcarlos como respaldo; jamás atribuir cambios hechos manualmente a una ejecución de agente.
5. QRs GitHub Mobile y web verificados en Android/iOS. Para usuarios sin GitHub, el formulario web anónimo usa el Worker seguro.

## Plan B y criterios de éxito

| Incidencia | Respuesta |
|---|---|
| Agente no disponible o demora | Mostrar PR de respaldo identificado como tal y explicar limitación |
| GitHub Actions tarda | Ver Issues existentes y contadores de la última sincronización, sin fingir resultados nuevos |
| Backend caído | Enseñar código y objetos de ejemplo claramente identificados |
| No hay suficientes objetos etiquetados | Demostrar con uno real y pedir al público que aporte ideas; nunca inventar votos |
| Viaje a mundos GTA no integrado | Mostrar ficha y etiqueta 3D, no afirmar que el viaje existe |

**Métricas verificables:** al menos una Issue con marcador, un objeto en D1 con enlace a esa Issue, recuentos actualizados y un PR real de programación revisado por humanos.
