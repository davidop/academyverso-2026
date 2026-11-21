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

18 diapositivas 16:9 · animaciones de clic · componentes Vue · QR SVG generados sin servicios externos · universo 3D embebido · logos oficiales por HTTPS · estilo basado en los gráficos del ZIP Academyverso. Las notas están dentro de slides.md (modo presentador).

La presentación se aloja en /presentation/ dentro del mismo GitHub Pages, sin reemplazar la app Three.js de la raíz. El pipeline despliega ambas superficies.

## Riesgos y plan de respaldo

La galaxia mostrará objetos de ejemplo hasta que esté configurado el Worker y Cloudflare D1. No afirmar que las nuevas Issues aparecen en tiempo real antes de una prueba E2E. Los agentes Claude y Codex requieren acceso/políticas habilitados. Los resultados de consola de la diapositiva 14 son ilustrativos: el CI real debe consultarse. Tener abiertas las capturas/PR preparados y la web en una pestaña independiente si falla el iframe.

Guía de agentes: ../docs/activar-agentes.md  
Guion: ../docs/guion-demo.md

Branding original: materiales de Academyverso, fuera de la licencia MIT del repositorio.

## GTA VII: Grand Terraforming Agents

La presentación mantiene el título oficial. Se añaden dos diapositivas originales (hook paródico y elección de escenarios) y se adapta la secuencia de agentes. No se utilizan imágenes, marcas gráficas ni personajes de Rockstar Games. La dinámica real consiste en crear objetos etiquetados y mostrar contadores calculados desde D1; los escenarios jugables complejos son ideas para futuras PRs, no funciones existentes.
