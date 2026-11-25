# Maquetas de AcademyVerso 2026

Referencias de composición generadas con ImageGen a partir de la marca del evento y las primeras exploraciones. Las ocho se conservan en WebP de 1280 × 720 para revisión, no como fondos de las diapositivas ejecutables.

| Escena | Referencia |
| --- | --- |
| S01 | [Portada](s01-portada.webp) |
| S05 | [Órbita narrativa · A3](s05-orbita-a3.webp) |
| S08 | [Portal de contribución · A1](s08-portal-a1.webp) |
| S09 | [Titulares en frecuencia · A2](s09-senal-a2.webp) |
| S11 | [Trazabilidad](s11-trazabilidad.webp) |
| S12 | [Montaje de misión · A4](s12-montaje-a4.webp) |
| S14 | [Mejora del viaje](s14-mejora.webp) |
| S17 | [Cierre](s17-cierre.webp) |

Las maquetas conservan sus proporciones de logo, textos y recuadros originales como evidencia de diseño. En Slidev se usa el logo oficial reducido, sin fechas de producción, con los QR reales y texto seleccionable. S14 mantiene la misma trayectoria antes y después. El aspecto del planeta puede variar en las maquetas; el render final reutiliza un solo planeta en estos planos salvo que el guion describa otro cuerpo.

Los recursos gráficos originales de AcademyVerso mantienen su atribución y quedan fuera de la licencia MIT del repositorio. No extraer logos ni QR de estas imágenes.

## Comparar una maqueta con Slidev

Captura la escena a 1280 × 720 en su estado de reposo. Usa compare.py de [image-to-slide](https://github.com/svg153/skills/blob/20a1f7f58be5d298486c6d8af0de5a90f131d09d/plugins/image-to-slide/skills/image-to-slide/scripts/compare.py), con Python, OpenCV, NumPy y scikit-image, o su wrapper de Podman:

    python compare.py --src docs/design/academyverso-mockups/s01-portada.webp --render ruta/s01-slidev.png

Revisa el panel fuente/render/diferencias junto con escala y posición de los elementos. No uses el SSIM como criterio único: la tipografía DOM, la marca más pequeña y el planeta compartido deben diferir de la maqueta. Prueba el movimiento por separado, incluidos los estados de reposo y movimiento reducido.

El astronauta flotante de portada es una variante aislada con ImageGen a partir de S01, con fondo transparente. No sustituye el archivo oficial del logotipo ni reutiliza su recorte.
