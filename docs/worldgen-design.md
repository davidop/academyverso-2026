# AcademyVerso — diseño WorldGen

Objetivo: interpretación declarativa de mundos 3D mediante Microsoft Foundry y render procedural Three.js. El cliente usa Three.js vanilla desde CDN, sin React.

WorldSpecV1 contiene schemaVersion, seed, archetype, palette, features, atmosphere y animation. web/worlds/spec.mjs implementa el contrato, la validación estricta y un fallback determinista para objetos de D1 sin especificación persistida.

Reglas:
- Mantener Issues → Actions/HMAC → Worker/D1 → /api/objects → Three.js.
- No ejecutar scripts, shaders o URLs proporcionados por IA.
- Implementar detalles tridimensionales visibles, no simples variaciones de color.
- Conservar el control de cámara, fichas, móvil y prefers-reduced-motion.
- Mantener el circuito anterior y feature flags hasta el ensayo físico del 25 de noviembre.
- Instalar skills externas de manera selectiva y con revisión de licencias/permisos.

Prueba: node --test web/test/world-spec.test.mjs.
