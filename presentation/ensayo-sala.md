# AcademyVerso · Ensayo en sala y proyección

**Fecha:** 26/11/2026 · 15:00–15:55 · **Ponentes:** David Oliva y Sergio Valverde.
**Estado:** pendiente de ejecución física. Las comprobaciones Chrome/CI no reemplazan el ensayo presencial.

## Preparación

- [ ] Conectar portátil al proyector 1920×1080 y revisar escala y legibilidad desde la última fila.
- [ ] Conectar mando/pasador y confirmar flechas derecha/izquierda o PageDown/PageUp.
- [ ] Abrir la rama del PR #1 en el portátil: ejecutar desde presentation/ los comandos npm install y npm run dev; abrir http://localhost:3030/.
- [ ] Usar F para pantalla completa y cerrar notificaciones.
- [ ] Preparar dos móviles con GitHub Mobile, pestañas de Issues y galaxia 3D, sin mostrar credenciales.
- [ ] Disponer de PowerPoint y capturas de respaldo identificadas como material de ensayo.

## Pruebas obligatorias

| Escena | Comprobación | Resultado |
| --- | --- | --- |
| S01 | Marca, astronauta, título y ponentes legibles desde el fondo | [ ] |
| S01–S04 | Mando avanza y retrocede sin saltarse los pasos de animación | [ ] |
| S03 | Escanear QR con dos móviles distintos, comprobar login y URL Issue | [ ] |
| S03 | Portal se abre en un clic, cierra con retroceso y QR permanece quieto | [ ] |
| S06–S13 | Galaxia real abre fuera del iframe; distinguir modo demo y datos reales | [ ] |
| S13 | Issues → Actions → Worker+D1 → Three.js legibles y bien encadenados | [ ] |
| S15–S19 | Cambiar entre demo y diapositivas sin perder proyección; mostrar PR/CI reales | [ ] |
| S20 | QR del repositorio y enlace a galaxia funcionan | [ ] |
| Accesibilidad | Movimiento reducido estable y navegación con teclado | [ ] |
| Plan B | Simular pérdida de Wi-Fi y recuperar la sesión con respaldo etiquetado | [ ] |

## Criterios de aceptación

El PR podrá pasar de Draft tras comprobar físicamente el proyector, el mando, la legibilidad y los dos QR, con revisión de ambos ponentes. No interpretar una CI correcta como prueba en sala.

**Nota:** la presentación Slidev es un lienzo 16:9 y en móviles se muestra reducida con bandas negras. Para el público es preferible abrir la galaxia y el formulario/Issue en el navegador móvil.
