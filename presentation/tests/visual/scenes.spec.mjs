import { test, expect } from '@playwright/test'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'

const repo = 'https://github.com/davidop/academyverso-2026'
const issueUrl = repo + '/issues/new?template=crear-objeto.yml'
const galaxyUrl = 'https://davidop.github.io/academyverso-2026/'
const sessionHub = 'https://davidop.github.io/academyverso-2026/sesion.html'
const embedUrl = galaxyUrl + '?embed=1#universe'

async function slide(page, number, selector) {
  await page.goto('/#/' + number, { waitUntil: 'domcontentloaded' })
  await expect(page.locator(selector).first()).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  return page.locator(selector).first()
}

async function screenshot(page, testInfo, name) {
  await page.screenshot({ path: testInfo.outputPath(name), animations: 'disabled', fullPage: false })
}

async function qrValue(qrSvg) {
  const bytes = await qrSvg.screenshot({ animations: 'disabled' })
  const png = PNG.sync.read(bytes)
  const rgba = new Uint8ClampedArray(png.data)
  return jsQR(rgba, png.width, png.height, { inversionAttempts: 'dontInvert' })?.data ?? null
}

test('S01 · portada de la plantilla con astronauta oficial y titular', async ({ page }, testInfo) => {
  const cover = await slide(page, 1, '.av-cover')
  await expect(cover.getByRole('heading', { level: 1 })).toContainText('móvil')
  await expect(cover.getByRole('img', { name: 'Astronauta AcademyVerso' })).toBeVisible()
  await expect(cover.getByText('DAVID OLIVA + SERGIO VALVERDE · 26 NOVIEMBRE · 15:00')).toBeVisible()
  await screenshot(page, testInfo, 'S01-portada-1280x720.png')
})

test('S03 · QR de Issue decodificable y apertura reversible', async ({ page }, testInfo) => {
  const portal = await slide(page, 3, '.portal-scene')
  await expect(portal.getByText('Escribe nombre, alias y descripción')).toBeVisible()
  const link = portal.getByRole('link', { name: /CREAR OBJETO EN GITHUB/i })
  await expect(link).toHaveAttribute('href', issueUrl)
  expect(await qrValue(link.locator('svg').first())).toBe(issueUrl)
  await expect(portal).toHaveAttribute('data-open', 'false')
  await screenshot(page, testInfo, 'S03-portal-inicial-1280x720.png')
  await page.keyboard.press('ArrowRight')
  await expect(portal).toHaveAttribute('data-open', 'true')
  await screenshot(page, testInfo, 'S03-portal-abierto-1280x720.png')
  await page.keyboard.press('ArrowLeft')
  await expect(portal).toHaveAttribute('data-open', 'false')
})

test('S05 · elección de dos mundos con enlace real', async ({ page }, testInfo) => {
  const vote = await slide(page, 5, '.gta-vote')
  await expect(vote.getByText('VICE NEBULA')).toBeVisible()
  await expect(vote.getByText('COLONIA CENTINELA')).toBeVisible()
  const link = page.getByRole('link', { name: /ABRIR MISIÓN EN DIRECTO/i })
  await expect(link).toHaveAttribute('href', galaxyUrl + '#grand-terraforming-agents')
  await screenshot(page, testInfo, 'S05-eleccion-1280x720.png')
})

test('S06 · galaxia integrada, enlace alternativo y aviso de datos', async ({ page }, testInfo) => {
  const frame = await slide(page, 6, '.live-frame')
  // El iframe carga el modo embed; el enlace, siempre visible aunque GitHub Pages
  // no haya cargado, abre el sitio completo con el control del portal.
  await expect(frame.locator('iframe')).toHaveAttribute('src', embedUrl)
  const link = frame.getByRole('link', { name: /ABRIR EN PANTALLA COMPLETA/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', galaxyUrl + '#universe')
  await expect(page.getByText(/cola de GitHub Actions/i)).toBeVisible()
  await screenshot(page, testInfo, 'S06-iframe-con-fallback-1280x720.png')
})

test('S09 · ambos ponentes con retratos locales y handle', async ({ page }, testInfo) => {
  const speakers = await slide(page, 9, '.speaker-grid')
  await expect(speakers.getByText('DAVID OLIVA')).toBeVisible()
  await expect(speakers.getByText('SERGIO VALVERDE')).toBeVisible()
  for (const name of ['David Oliva', 'Sergio Valverde']) {
    const portrait = speakers.getByRole('img', { name })
    await expect(portrait).toBeVisible()
    await expect.poll(() => portrait.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    expect(await portrait.getAttribute('src')).not.toContain('github.com')
    expect(await portrait.getAttribute('src')).not.toContain('avatars.githubusercontent.com')
  }
  await expect(speakers.getByText('davidop')).toBeVisible()
  await expect(speakers.getByText('svg153')).toBeVisible()
  await screenshot(page, testInfo, 'S09-dos-ponentes-1280x720.png')
})

test('S13 · cinco pasos Issue → Actions → D1 → Three.js, avance reversible', async ({ page }, testInfo) => {
  const trace = await slide(page, 13, '.mission-trace')
  for (const name of ['GitHub Mobile', 'GitHub Issues', 'GitHub Actions', 'Worker + D1', 'Three.js']) {
    await expect(trace.getByText(name, { exact: true }).first()).toBeVisible()
  }
  await expect(trace.getByText('Triage con IA y firma')).toBeVisible()
  await expect(trace.getByText('recorrido conceptual, no estado en vivo')).toBeVisible()
  await expect(trace).toHaveAttribute('data-step', '0')
  for (const expected of ['1', '2', '3', '4']) {
    await page.keyboard.press('ArrowRight')
    await expect(trace).toHaveAttribute('data-step', expected)
  }
  await page.keyboard.press('ArrowLeft')
  await expect(trace).toHaveAttribute('data-step', '3')
  await screenshot(page, testInfo, 'S13-trazabilidad-1280x720.png')
})

test('S15 · centro de control manual, nunca telemetría simulada', async ({ page }, testInfo) => {
  const board = await slide(page, 15, '.mission-board')
  await expect(board.getByText('ESTADO MANUAL DEL PRESENTADOR', { exact: false })).toBeVisible()
  await expect(board.getByRole('button', { name: /Cambiar estado de COPILOT/i })).toBeVisible()
  await expect(board.getByRole('link', { name: /VER EVIDENCIA/i }).first()).toBeVisible()
  await screenshot(page, testInfo, 'S15-centro-de-control-1280x720.png')
})

test('S20 · patrocinadores con logos locales visibles', async ({ page }, testInfo) => {
  const sponsors = await slide(page, 20, '.sponsors')
  for (const name of ['V-Valley', 'Tajamar', 'Tech Riders']) {
    const logo = sponsors.getByRole('img', { name })
    await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
  }
  await screenshot(page, testInfo, 'S20-patrocinadores-1280x720.png')
})

test('S22 · cierre con QR del hub y enlaces de contexto', async ({ page }, testInfo) => {
  const closing = await slide(page, 22, '.final-layout')
  const hubLink = closing.getByRole('link', { name: /ENLACES DE LA SESIÓN/i })
  await expect(hubLink).toHaveAttribute('href', sessionHub)
  await expect(closing.getByRole('link', { name: /universo 3D/i })).toHaveAttribute('href', galaxyUrl)
  await expect(closing.getByRole('link', { name: /Código y documentación/i })).toHaveAttribute('href', repo)
  const qrLink = closing.getByRole('link', { name: /ENLACES Y CÓDIGO/i })
  expect(await qrValue(qrLink.locator('svg').first())).toBe(sessionHub)
  await screenshot(page, testInfo, 'S22-cierre-1280x720.png')
})

test('Capturas de escenas tras completar sus revelados por clic', async ({ page }, testInfo) => {
  const clickCounts = { 3: 1, 5: 2, 7: 1, 10: 4, 11: 3, 12: 3, 13: 4, 14: 3, 19: 3 }
  for (const [no, clicks] of Object.entries(clickCounts)) {
    await page.goto('/#/' + no, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.slidev-layout:visible').first()).toBeVisible()
    for (let i = 0; i < clicks; i++) await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(220)
    await screenshot(page, testInfo, 'S' + String(no).padStart(2, '0') + '-completa-1280x720.png')
  }
})

test('Recorrido completo · 22 escenas 16:9 renderizadas en Chrome', async ({ page }, testInfo) => {
  for (let number = 1; number <= 22; number++) {
    await page.goto('/#/' + number, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.slidev-layout:visible').first()).toBeVisible()
    await page.waitForTimeout(180)
    await screenshot(page, testInfo, 'S' + String(number).padStart(2, '0') + '-1280x720.png')
  }
})

test('Accesibilidad · movimiento reducido y pantalla móvil', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const cover = await slide(page, 1, '.av-cover')
  const astronaut = cover.getByRole('img', { name: 'Astronauta AcademyVerso' })
  expect(await astronaut.evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  await page.setViewportSize({ width: 390, height: 844 })
  const portal = await slide(page, 3, '.portal-scene')
  await expect(portal.getByRole('link', { name: /CREAR OBJETO EN GITHUB/i })).toBeVisible()
  await screenshot(page, testInfo, 'S03-movil-390x844.png')
})