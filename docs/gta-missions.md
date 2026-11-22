# Misiones GTA VII — mecánica de exploración local

Esta función es una **parodia conceptual independiente** y un pequeño reto local, no un sistema de valoración real de personas, ni un videojuego GTA. No se almacena progreso en Cloudflare D1 ni se recopilan identidades.

Cinco estrellas ilustrativas: una por visitar Vice Nebula, otra por visitar Colonia Centinela y hasta tres más por descubrir tipos de POI realmente presentes (volcán, ciudad flotante o cúpula) después de haber alcanzado un destino válido. Los eventos repetidos no puntúan de nuevo; sólo las acciones completadas actualizan el panel.

Para probar: viajar desde ficha de mundo GTA, esperar el aterrizaje, tocar un POI, revisar estrellas, reiniciar, visitar de nuevo, verificar que un mundo no GTA no suma estrellas. Pruebas automáticas en `web/test/missions.test.mjs` y en `scripts/worldgen-visual.mjs`; en la sala aún se requiere ensayo físico con Android y proyector.

La mecánica es opcional: si no supera QA visual y accesibilidad, se deshabilita antes del evento sin bloquear la galaxia.
