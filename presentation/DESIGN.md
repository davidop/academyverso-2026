---
version: alpha
name: AcademyVerso · Escenas de misión
description: Identidad del deck de AcademyVerso 2026; combina la marca de la charla original con el piloto del portal.
colors:
  background: "#182039"
  stageDeep: "#121B30"
  surface: "#2C2D50"
  text: "#F5F7FF"
  primary: "#78E6DC"
  secondary: "#DEDBFF"
  accent: "#FFB26F"
  qrPaper: "#FFFFFF"
  qrInk: "#000000"
typography:
  hero:
    fontFamily: Arial
    fontSize: 96px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -4px
  headline:
    fontFamily: Arial
    fontSize: 64px
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: -3px
  body:
    fontFamily: Arial
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.35
  telemetry:
    fontFamily: Consolas
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 2px
spacing:
  stageInsetX: 58px
  stageInsetY: 44px
  clusterGap: 24px
  qrQuietZone: 20px
rounded:
  small: 4px
components:
  stage:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  stageDeep:
    backgroundColor: "{colors.stageDeep}"
    textColor: "{colors.text}"
  headlineAccent:
    backgroundColor: "{colors.background}"
    textColor: "{colors.accent}"
  qr:
    backgroundColor: "{colors.qrPaper}"
    textColor: "{colors.qrInk}"
    rounded: "{rounded.small}"
    padding: "{spacing.qrQuietZone}"
---

# AcademyVerso · Escenas de misión

## Overview

Guía para la revisión visual del rediseño. Un escenario 16:9 oscuro, con aire editorial y humor espacial. Cada escena tiene un foco: una pregunta, una acción, un objeto o una comprobación. El movimiento dirige la mirada sin reemplazar la explicación.

Fuentes: paleta y tipografía del deck en [style.css](style.css); encuadre, planetas y ritmo del piloto A1 (todavía separado de esta PR); logotipo y mascota oficiales en [recursos de la web](../web/assets/). Este archivo rige la carpeta de la presentación, no propone rediseñar la app Three.js.

## Colors

Azul noche y blanco roto sostienen la lectura. Menta guía el recorrido y señala acciones; lavanda da profundidad y sirve para anotaciones; naranja destaca una frase o un evento, sin ser la única forma de distinguir estados. Los cinco colores del deck original se conservan. Azul profundo y violeta de superficie salen del piloto. QR negro puro sobre blanco puro; no aplicar el degradado de marca al código.

## Typography

Titulares en Arial/Helvetica/sans-serif con peso fuerte. Consolas/monospace para rótulos técnicos, no para párrafos. Valores en coordenadas del lienzo: 64 px como titular habitual; 96 px en una frase corta heroica. Texto necesario para actuar, preferiblemente 22–24 px; el margen mínimo lo decide la prueba de proyección. No convertir texto, código, URL o QR en parte de una ilustración.

## Layout

Lienzo Slidev de 1280 × 720. Mantener los márgenes para información y permitir recortes en planetas/órbitas decorativos. Alternar plano editorial (texto a la izquierda), escenario amplio (galaxia), primer plano (un objeto o dato) y espacio sin animación para leer o escanear. No cambiar el orden de lectura para móvil; comprobar encuadre y QR en la escala real.

## Elevation & Depth

Profundidad por recorte, escala, solapamiento y contraste. Tres planos como máximo en una composición normal. Evitar repetir tarjetas translúcidas, brillos detrás de texto o ruido que compita con un enlace. Solo las escenas de acción necesitan una superficie blanca para el QR.

## Shapes

Órbitas elípticas, círculos y esquinas de registro de película. Para el portal, dos o tres destellos pequeños de cuatro puntas en naranja/lavanda, entre anillos; uno puede acentuar la apertura una vez. Dibujarlos como SVG decorativo, con tamaños independientes; sin parpadeo ni destellos cerca del QR. No imitar el logo con texto generado.

## Motion & Micro-interaction

Una pulsación cambia un hecho o el foco, nunca solo agrega ornamento. Las transiciones entre escenas son cortes o continuidad visual de un mismo objeto. CSS/SVG primero; Web Animations API o GSAP solo si la prueba de una escena necesita coordinación que CSS no resuelva claramente. Sin autoplay de la charla. Volver, saltar o recargar permite recuperar el fotograma; un cambio de escena no deja animaciones corriendo. Con movimiento reducido se conserva el mismo contenido con cambios instantáneos; impresión/exportación usa un fotograma legible por escena.

**Duraciones de referencia:** corte con fundido opcional, 220 ms; revelado, 440 ms; iris, 950 ms; movimiento reducido, 0 ms. Para revelado e iris, probar una salida rápida y frenada suave con cubic-bezier(.22, 1, .36, 1). El CLI fijado no exporta tokens de movimiento; aquí se declaran en prosa.

## Voice & Content Strategy

Español claro, técnico cuando hace falta: «abre una Issue», «revisa la PR», «prueba el viaje». No inventar cifras, trazas, logos, accesos ni estados de CI. Identificar explícitamente muestra, ejecución real o respaldo. Solo fecha del evento si tiene una función en portada o cierre.

## Components

- **Marca:** usar los archivos oficiales existentes sin redibujar ni cambiar proporción; priorizar portada, portal y cierre. Mantener la atribución de marca del repositorio.
- **Portal/QR:** volver a usar el componente de QR y su enlace accesible. Mantener margen blanco de al menos cuatro módulos, verificado sobre el QR real; 20 px es un punto de partida, no sustituto de la prueba. Sin desplazamiento, escala u opacidad durante la escena.
- **Órbita:** una trayectoria que conserva el objeto; etiquetas DOM y estado activo también visible mediante posición o texto, no solo color.
- **Cinta de misión:** mismo encuadre y objeto entre cortes; rótulo de agente y PR superpuesto en HTML, no generado dentro de la ilustración.

## Do's and Don'ts

**Sí:** conservar marca, anotar el origen de los recursos, reutilizar el planeta y generar solo lo que no se pueda separar o dibujar bien.

**No:** componer desde una captura de pantalla como única capa; cambiar la app, sus permisos o el pipeline por razones estéticas; publicar avances o maquetas sin validación.

Formato de referencia: [especificación DESIGN.md de Google Labs](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). La guía por escena vive en [plan-visual.md](plan-visual.md).
