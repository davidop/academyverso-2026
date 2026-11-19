# AcademyVerso — presentación interactiva con Slidev

Presentación oficial de la sesión «Programa con IA desde tu móvil: GitHub Copilot, Claude y Codex», con David Oliva y Sergio Valverde. Academyverso 2026 · 26 de noviembre · 15:00–15:55.

## Enlaces

- Presentación: https://davidop.github.io/academyverso-2026/presentation/
- Galaxia: https://davidop.github.io/academyverso-2026/
- Crear mundo: https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml
- Código: https://github.com/davidop/academyverso-2026

## Desarrollo local

Requiere Node.js 22.12+ y npm.

1. cd presentation
2. npm install
3. npm run dev
4. npm run build

17 diapositivas 16:9 · animaciones de clic · componentes Vue · QR SVG generados sin servicios externos · universo 3D embebido · logos oficiales por HTTPS · estilo basado en los gráficos del ZIP Academyverso. Las notas están dentro de slides.md (modo presentador).

La presentación se aloja en /presentation/ dentro del mismo GitHub Pages, sin reemplazar la app Three.js de la raíz. El pipeline despliega ambas superficies.

## Rediseño en revisión

- [Guion de la charla y demo](storytelling.md)
- [Sistema de diseño](DESIGN.md)
- [Plan visual y de movimiento por escena](plan-visual.md)

Son documentos de trabajo; por sí solos no cambian las diapositivas publicadas.

### Kit reutilizable

- [Archivo de maquetas](../docs/design/academyverso-mockups/README.md): referencias para revisión, nunca se importan al bundle.
- MissionBrand.vue: logo oficial local, 144 px en escenario 1280; reutilizar en portada, portal y cierre.
- MissionSky.vue: horizonte del planeta común y destellos SVG; el prop orbit activa una órbita decorativa. Para otro encuadre, importar assets/mission-planet.webp sin generar ni duplicar la textura.
- MissionCover.vue: ejemplo de escena a sangre completa. Usa layout default en S01: el layout cover de Slidev envuelve el componente en un contenedor sin altura si el contenido es solo absoluto. En presentación, activar la entrada solo en la escena activa y anularla con movimiento reducido y en impresión.

Para revisar S01: abre /#/1, avanza y vuelve con el mando, prueba a 1280 × 720 y en móvil, y activa movimiento reducido. S11 y S17 pueden avanzar en archivos de escena separados. S14 depende de fijar la geometría del viaje en S13.

## Riesgos y plan de respaldo

La galaxia mostrará objetos de ejemplo hasta que esté configurado el Worker y Cloudflare D1. No afirmar que las nuevas Issues aparecen en tiempo real antes de una prueba E2E. Los agentes Claude y Codex requieren acceso/políticas habilitados. Los resultados de consola de la diapositiva 14 son ilustrativos: el CI real debe consultarse. Tener abiertas las capturas/PR preparados y la web en una pestaña independiente si falla el iframe.

Guía de agentes: ../docs/activar-agentes.md  
Guion: ../docs/guion-demo.md

Branding original: materiales de Academyverso, fuera de la licencia MIT del repositorio.

## Pruebas visuales reproducibles

En el PR, el workflow CI instala Chromium y ejecuta `npm run test:visual`, comprobando las escenas S01, S08, S11 y S17 con Playwright. Comprueba los campos del formulario, navegación reversible por teclado, enlaces y decodificación real de ambos QR, movimiento reducido y una captura móvil. Las capturas se adjuntan al workflow como artifact `academyverso-visual-<run_id>` y pueden descargarse para inspección antes de fusionar.

Para ejecutarlo localmente:

```bash
cd presentation
npm install
npx playwright install chromium
npm run test:visual
```

**Importante:** el navegador automatizado no reemplaza una prueba con proyector, mando y dos móviles físicos. No mover este PR fuera de Draft antes del visto bueno de ambos ponentes.
