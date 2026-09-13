const assert = require('node:assert/strict')
const fs = require('node:fs')
const { chromium } = require('playwright-core')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  let browser
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, architecture: process.arch, checks: [] }
  try {
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
        break
      } catch {
        await delay(500)
      }
    }
    assert.ok(browser, 'Installed app debugging endpoint did not become ready')
    const pageNamed = async (name) => {
      for (let attempt = 0; attempt < 60; attempt++) {
        const page = browser.contexts().flatMap((context) => context.pages()).find((page) => page.url().includes(`${name}.html`))
        if (page) {
          await page.waitForLoadState('domcontentloaded')
          return page
        }
        await delay(250)
      }
      throw new Error(`${name} window missing`)
    }
    const guide = await pageNamed('onboarding')
    assert.match(await guide.locator('h1').innerText(), /One word at a time/)
    await guide.screenshot({ path: 'evidence/onboarding.png' })
    await guide.getByTestId('next').click()
    assert.match(await guide.locator('h1').innerText(), /Try it now/)
    await guide.getByRole('button', { name: 'Or watch a short demo' }).click()
    report.checks.push('installed app launched; onboarding and demo opened')
    const overlay = await pageNamed('overlay')
    await overlay.locator('.overlay[data-status="playing"]').waitFor()
    await overlay.keyboard.press('Space')
    await overlay.locator('.overlay[data-status="paused"]').waitFor()
    await overlay.locator('.overlay-context').waitFor({ state: 'visible' })
    await overlay.screenshot({ path: 'evidence/reader-paused.png' })
    const before = Number(await overlay.locator('.ctx-word.is-current').getAttribute('data-index'))
    await overlay.keyboard.press('Shift+ArrowRight')
    await overlay.locator(`.ctx-word.is-current[data-index="${before + 1}"]`).waitFor()
    const after = Number(await overlay.locator('.ctx-word.is-current').getAttribute('data-index'))
    assert.equal(after, before + 1)
    report.checks.push('reader played, paused, showed context, stepped one word')
    await overlay.getByRole('button', { name: 'Settings', exact: true }).click()
    const settings = await pageNamed('settings')
    await settings.getByRole('radio', { name: 'Light', exact: true }).click()
    await overlay.locator('html[data-theme="light"]').waitFor()
    assert.equal(Number(await overlay.locator('.ctx-word.is-current').getAttribute('data-index')), after)
    await settings.screenshot({ path: 'evidence/settings-light.png' })
    await overlay.screenshot({ path: 'evidence/reader-light.png' })
    await settings.getByRole('radio', { name: 'Dark', exact: true }).click()
    await overlay.locator('html[data-theme="dark"]').waitFor()
    report.checks.push('settings changed reader theme without losing position')
    report.passed = true
    report.limits = 'Hosted Windows x64 installer and UI check; no native capture, global shortcut, ARM64, signing-trust, or everyday desktop acceptance claim.'
  } catch (error) {
    report.passed = false
    report.error = error.stack || String(error)
    throw error
  } finally {
    fs.writeFileSync('evidence/reader-ui.json', JSON.stringify(report, null, 2))
    await browser?.close()
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
