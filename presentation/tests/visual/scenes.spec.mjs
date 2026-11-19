import { test, expect } from '@playwright/test'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'

const repo = 'https://github.com/davidop/academyverso-2026'
const issueUrl = repo + '/issues/new?template=crear-objeto.yml'
const galaxyUrl = 'https://davidop.github.io/academyverso-2026/'

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

test('S01 · portada visible, logo oficial y título legible', async ({ page }, testInfo) => {
  const cover = await slide(page, 1, '.mission-cover')
  await expect(cover.getByRole('heading', { level: 1 })).toContainText('desde el móvil')
  await expect(cover.getByRole('img', { name: 'AcademyVerso' })).toBeVisible()
  await screenshot(page, testInfo, 'S01-portada-1280x720.png')
})

test('S08 · portal, campos, QR decodificable y clic reversible', async ({ page }, testInfo) => {
  const portal = await slide(page, 8, '.portal-scene')
  await expect(portal.getByText('nombre, alias y descripción')).toBeVisible()
  const link = portal.getByRole('link', { name: /CREAR OBJETO EN GITHUB/i })
  await expect(link).toHaveAttribute('href', issueUrl)
  expect(await qrValue(link.locator('svg').first())).toBe(issueUrl)
  await expect(portal).toHaveAttribute('data-open', 'false')
  await screenshot(page, testInfo, 'S08-portal-inicial-1280x720.png')
  await page.keyboard.press('ArrowRight')
  await expect(portal).toHaveAttribute('data-open', 'true')
  await screenshot(page, testInfo, 'S08-portal-abierto-1280x720.png')
  await page.keyboard.press('ArrowLeft')
  await expect(portal).toHaveAttribute('data-open', 'false')
})

test('S11 · Issues → Actions → Worker/D1 → Three.js, avance reversible', async ({ page }, testInfo) => {
  const trace = await slide(page, 11, '.mission-trace')
  for (const name of ['GitHub Issues', 'GitHub Actions', 'Worker + D1', 'Three.js']) {
    await expect(trace.getByText(name, { exact: true }).first()).toBeVisible()
  }
  await expect(trace.getByText('Validación y firma')).toBeVisible()
  await expect(trace.getByText('recorrido conceptual, no estado en vivo')).toBeVisible()
  await expect(trace).toHaveAttribute('data-step', '0')
  await page.keyboard.press('ArrowRight')
  await expect(trace).toHaveAttribute('data-step', '1')
  await page.keyboard.press('ArrowRight')
  await expect(trace).toHaveAttribute('data-step', '2')
  await page.keyboard.press('ArrowLeft')
  await expect(trace).toHaveAttribute('data-step', '1')
  await screenshot(page, testInfo, 'S11-trazabilidad-1280x720.png')
})

test('S17 · cierre, enlace galaxia y QR repositorio decodificable', async ({ page }, testInfo) => {
  const closing = await slide(page, 17, '.mission-closing')
  const galaxyLink = closing.getByRole('link', { name: /Explorar el universo 3D/i })
  await expect(galaxyLink).toHaveAttribute('href', galaxyUrl)
  const repoLink = closing.getByRole('link', { name: /Código y documentación/i })
  await expect(repoLink).toHaveAttribute('href', repo)
  expect(await qrValue(repoLink.locator('svg').first())).toBe(repo)
  await screenshot(page, testInfo, 'S17-cierre-1280x720.png')
})

test('Recorrido completo · 17 escenas 16:9 renderizadas en Chrome', async ({ page }, testInfo) => {
  for (let number = 1; number <= 17; number++) {
    await page.goto('/#/' + number, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.slidev-layout:visible').first()).toBeVisible()
    await page.waitForTimeout(180)
    await screenshot(page, testInfo, 'S' + String(number).padStart(2, '0') + '-1280x720.png')
  }
})

test('Accesibilidad · movimiento reducido y pantalla móvil', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const cover = await slide(page, 1, '.mission-cover')
  const astronaut = cover.locator('.mission-astronaut')
  await expect(astronaut).toBeVisible()
  expect(await astronaut.evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  await page.setViewportSize({ width: 390, height: 844 })
  const portal = await slide(page, 8, '.portal-scene')
  await expect(portal.getByRole('link', { name: /CREAR OBJETO EN GITHUB/i })).toBeVisible()
  await screenshot(page, testInfo, 'S08-movil-390x844.png')
})
