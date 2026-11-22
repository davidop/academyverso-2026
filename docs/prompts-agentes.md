# Prompts para GitHub Mobile — GTA VII: Grand Terraforming Agents

> **El núcleo de creación de mundos funciona ya**: Issues → Worker/D1 → objetos en Three.js. Los escenarios son un concepto de diseño y un marcador en las descripciones, **no un videojuego completo**. Cada tarea siguiente se debe abrir en un agente sobre una rama actualizada, revisar como PR y fusionar tras CI.

## 1. Copilot — construir o mejorar navegación hacia un escenario

```text
Trabaja sobre davidop/academyverso-2026. Verifica si la navegación de cámara «Viajar a este mundo» ya existe en main o en el PR de Fase 1. Si ya existe, mejora la **selección del destino por teclado** y el feedback de viaje sin duplicar la lógica; si todavía no se ha integrado, implementa el viaje a objetos marcados [GTA:VICE-NEBULA] o [GTA:COLONIA-CENTINELA] aprovechando los cálculos de web/travel.mjs y conservando «Regresar». No alteres Worker, D1 ni la creación de Issues. Soporta teclado, touch, prefers-reduced-motion y un universo vacío. Añade pruebas de funciones puras cuando sea posible. Abre PR con capturas y riesgos; no hagas merge automáticamente.
```

**Aceptar si:** el viaje existe de verdad, el usuario puede volver, la escena con cero objetos no falla y el PR detalla sus pruebas. El código preparado como respaldo en la rama de Fase 1 es una implementación de referencia de ChatGPT; **no debe atribuirse a una ejecución de GitHub Copilot**.

## 2. Claude Code — dar vida visual al escenario

```text
Sobre main tras integrar el PR de Copilot, añade un ambiente de ciencia ficción independiente a los dos escenarios de Grand Terraforming Agents: luces neón para Vice Nebula, tonalidades turquesa para Colonia Centinela, efectos ligeros sin assets ajenos y sin reutilizar material de GTA/Rockstar. Optimiza móvil, accesibilidad, contraste y prefers-reduced-motion. No inventes un sistema de juego que no exista, ni reescribas el backend. Presenta cambios en un PR separable.
```

**Aceptar si:** FPS, uso de memoria, lectura de textos y versión móvil son razonables; nunca bloquear el render por animaciones adicionales.

## 3. Codex — evaluar, proteger y documentar

```text
Sobre main una vez integrado el PR visual, revisa Grand Terraforming Agents: validación del marcador, URL de GitHub Mobile, recuento de objetos reales, escenarios desconocidos, objetos sin misión, viaje y soporte reduced-motion. Añade tests automatizados deterministas con node --test, ejecuta CI y comprueba regresión de la creación desde formulario. No afirmes que una prueba ha pasado sin logs reales; abre un PR con checklist de validación y hallazgos.
```

**Aceptar si:** CI verde y PR con evidencia; las métricas no se confunden con votos únicos.

## Cómo presentarlo

1. Sergio muestra un planeta enviado desde el móvil y explica cómo llega a D1.
2. David abre una sesión del agente de programación en GitHub (no solo un selector de modelo) y delega la tarea 1.
3. Tras revisar el resultado, Sergio mejora el aspecto con Claude Code, **si la integración está habilitada**.
4. Codex añade pruebas y observaciones en PR separado. Los tiempos de ejecución no se garantizan.
5. Enseñar el resultado **solo si el código se integró**; si no, usar PRs de respaldo etiquetados como tales.

Misión comunitaria y requisitos funcionales: [grand-terraforming-agents.md](grand-terraforming-agents.md).
