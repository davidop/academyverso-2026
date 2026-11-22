---
name: academyverso-worldgen
description: Crea y revisa mundos procedurales Three.js con WorldSpecV1 de AcademyVerso; útil para geometría, materiales, LOD, raycasting y controles.
---
# WorldGen AcademyVerso

Lee web/worlds/spec.mjs, web/travel.mjs y docs/worldgen-design.md.
- La IA genera únicamente datos declarativos validados, nunca JavaScript ejecutable.
- Construye diferencias geométricas reales (no solo colores).
- Conserva raycasting, navegación, zoom táctil y preferencias de movimiento reducido.
- Reutiliza geometrías, controla el rendimiento y libera recursos con dispose.
- No introduzcas React Three Fiber ni dependencias grandes sin medir el beneficio.
- Ejecuta pruebas de Node y CI antes de fusionar.
- Entrega ejemplos, capturas auténticas cuando haya navegador y limitaciones verificadas.
