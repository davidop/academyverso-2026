---
name: academyverso-presentation
description: "Trigger: escena, motion, guion o revisión Slidev de AcademyVerso. Implementa y verifica cambios escena a escena."
license: MIT
metadata:
  author: "svg153"
  version: "1.0"
---

## Activation Contract

Úsala al proponer, implementar o revisar escenas de AcademyVerso. Lee AGENTS.md en la raíz y apóyate en el ID S01–S17 del plan, no en el número decorativo de la slide.

## Hard Rules

- Conserva rutas, notas, navegación por teclado, logo oficial y `prefers-reduced-motion`.
- Deja el QR inmóvil, con enlace real; distingue hechos de la demo, simulaciones y respaldos.
- No cambies la app, los permisos o el pipeline para resolver un cambio visual.

## Decision Gates

- Sin composición validada: entrega el fotograma comentado; no reemplaces la escena.
- Con composición validada: separa texto, arte y controles; empieza con CSS/SVG. Añade otra herramienta solo si la animación no se puede explicar o mantener con esos medios.

## Execution Steps

1. Lee guion, tokens y beat de la escena. Identifica qué debe entenderse antes y después del clic.
2. Reutiliza capas aprobadas. Implementa el beat usando el estado de Slidev, sin una segunda navegación.
3. Verifica build, captura 16:9, ida/vuelta, acceso por ruta y movimiento reducido. Para escenas de acción, prueba foco y QR. Si algo requiere sala, indícalo.

## Output Contract

Devuelve ID de escena, vista de revisión, comprobaciones observadas y pendientes.

## References

Desde la raíz: presentation/storytelling.md, presentation/DESIGN.md y presentation/plan-visual.md.
