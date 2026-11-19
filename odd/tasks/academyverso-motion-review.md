# AcademyVerso · Revisión de portada, trazabilidad y cierre

## Alcance y ruta

Consolidar maqueta archivada, base de movimiento y S01/S11/S17 en la rama de la PR #1, sin tocar main. Una PR por solicitud expresa; el total acumulado supera 400 líneas, pero las unidades se mantienen en commits revisables. Ruta delegada: tres componentes tienen superficies independientes. Coordinador prepara el astronauta, compara capturas, integra y publica.

Sin TDD configurado; comprobación ordinaria con build Slidev, lint DESIGN.md y Chromium Playwright. RDD global desactivado. No cambiar CI, Worker, tráfico ni despliegue.

## Tareas

- [x] R01 S01: astronauta flotante aislado de la referencia S01, titular/subtítulo más visibles, horizonte mayor con el mismo planeta. Mantener logo 144 px, sin recortes en móvil o en 1280 × 720.
- [x] R02 S11: mantener la composición aceptada, añadir un movimiento del planeta y un gesto de seguimiento del recorrido. Estados reversibles, sin falsear la integración.
- [x] R03 S17: QR real fijo en superficie blanca compacta; texto de enlace fuera, grande y contrastado. Foco y decodificación.
- [x] R05 S08: integrar el piloto existente con planeta y marca compartidos; añadir destellos entre anillos, mantener QR y vínculo durante el movimiento.
- [ ] R04 Verificar visualmente contra las referencias, probar movimiento reducido y reposo, publicar la síntesis en #1 y comprobar el estado remoto.

Fuente local: rama codex/academyverso-scenes-preview 139feb0. PR #1 b8f5407; base de la PR #2 c3cb52e. Pendiente para otro corte: pareja de viaje S13–S14.

- R01: 6275ab0. Captura comparada con image-to-slide, logo 144 px, titular 96 px sin saltos extra y planeta 1200 px.
- R02: b619917. Chromium observó planeta animado, pulso sobre la ruta, navegación reversible y recarga.
- R03: e52a4e6. QR decodificado, 4 módulos de margen, etiqueta 28 px fuera, foco y posición fija.
- R05: d23768a. Iris reversible, tres SVG decorativos y QR de Issue decodificado e inmóvil.
- R04 local: build de producción, lint DESIGN.md limpio, comparación de S01 y S17 y pruebas en Chromium. Riesgo: cambio de presentación; ambos callsites del componente QR compartido verificados. Proyector y mando reales pendientes.
