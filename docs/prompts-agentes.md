# Prompts para GitHub Mobile: desarrollo encadenado

> **La funcionalidad de viajes interplanetarios no está implementada en `main`**. Cada agente parte de lo integrado por el anterior. No iniciar Claude o Codex sobre una rama que todavía no tenga el trabajo necesario.

## 1 · GitHub Copilot — construir

```text
Trabaja en davidop/academyverso-2026. Implementa viajes interplanetarios en el AcadeVerso actual, sin cambiar su estilo visual ni romper la creación de objetos.
Requisitos: al abrir la ficha de un objeto 3D, añadir botón "Viajar aquí". Animar la cámara durante ~2 segundos hasta una vista cercana del objeto, con botón para regresar. Respetar prefers-reduced-motion, accesibilidad teclado y pantallas móviles. No añadir dependencias nuevas; usar Three.js existente. Crear PR con resumen y riesgos.
```

**Verificar:** botón, navegación en móvil, funcionamiento con 50 planetas, archivo del diff, PR creado.

## 2 · Claude — mejorar

```text
Sobre main después del merge del PR de viajes de Copilot: mejora únicamente la experiencia visual del viaje. Añade estela de una nave espacial estilizada, transición vistosa pero ligera, feedback textual accesible al iniciar y finalizar el viaje y manejo de viajes repetidos. Mantén el diseño original de Academyverso y soporte prefers-reduced-motion. No reescribas toda la escena. Crear PR claro.
```

**Verificar:** no rompe creación de objetos ni escenas con pocos elementos, rendimiento Android, no introduce recursos remotos inseguros.

## 3 · Codex — validar

```text
Sobre main después del merge del PR visual de Claude: añade tests y controles de calidad para la navegación interplanetaria. Separa las funciones de cálculo de posiciones/easing para que puedan probarse con node --test. Añade casos de cancelación, objeto inexistente, repetición de viaje, reduced-motion y límite de distancia. Corrige los defectos observados, conserva las animaciones existentes y no amplíes el alcance. Crea PR con pruebas ejecutadas y resultados verificables.
```

**Verificar:** pruebas reales ejecutadas por CI, código revisable, no atribuir cobertura a tests inexistentes.

## Cómo mostrarlo

1. Iniciar nueva sesión desde GitHub Mobile en `academyverso-2026`.
2. Seleccionar el **agente de programación** (no el selector de *modelo* de Copilot) cuando esté disponible.
3. Enviar prompt y mostrar sesión; supervisar cambios y abrir PR.
4. Revisar el diff y pasar CI, integrar con supervisión humana.
5. Usar un agente distinto con `main` ya actualizado.

**Importante:** no asumir que Claude y Codex están habilitados porque aparecen modelos Claude/GPT en el selector «Modelos». Los agentes de terceros requieren acceso y permisos específicos.
