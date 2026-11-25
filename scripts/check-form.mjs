// Vérifie le formulaire de devis, avec ET sans JavaScript, sans rien envoyer réellement :
// l'appel à Web3Forms est intercepté et simulé.
import { chromium } from 'playwright';

async function fill(page) {
  await page.fill('#nom', 'Test Audit');
  await page.fill('#telephone', '06 12 34 56 78');
  await page.fill('#commune', 'Graveson');
  await page.selectOption('#travaux', { index: 1 });
  await page.fill('#message', 'Message de test automatique.');
  await page.check('#consentement');
}

export async function checkForm(BASE) {
  const browser = await chromium.launch();
  const errors = [];

  // 1. Sans JavaScript : envoi HTML classique, puis redirection vers /merci/
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    let posted = null;
    await page.route('https://api.web3forms.com/**', async (route) => {
      posted = new URLSearchParams(route.request().postData() || '');
      await route.fulfill({ status: 303, headers: { Location: `${BASE}/merci/` } });
    });
    await page.goto(`${BASE}/#contact`);
    await fill(page);
    await Promise.all([page.waitForURL('**/merci/'), page.click('button[type=submit]')]);
    for (const f of ['nom', 'telephone', 'commune', 'type_de_travaux', 'message', 'consentement_rgpd', 'access_key', 'redirect']) {
      if (!posted || !posted.has(f)) errors.push(`sans JS : champ « ${f} » non envoyé`);
    }
    if (posted?.has('botcheck')) errors.push('sans JS : le champ piège est coché');
    if (!(await page.textContent('h1'))?.includes('Demande envoyée')) errors.push('sans JS : page de confirmation absente');
    await ctx.close();
  }

  // 2. Champs obligatoires : un formulaire vide ne part pas
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    let sent = false;
    await page.route('https://api.web3forms.com/**', (route) => { sent = true; route.abort(); });
    await page.goto(`${BASE}/#contact`);
    await page.click('button[type=submit]');
    await page.waitForTimeout(300);
    if (sent) errors.push('un formulaire vide a été envoyé');
    await ctx.close();
  }

  // 3. Avec JavaScript : envoi en arrière-plan, message de confirmation dans la page
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.route('https://api.web3forms.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
    await page.goto(`${BASE}/#contact`);
    await fill(page);
    await page.click('button[type=submit]');
    const status = page.locator('[data-form-status]');
    await status.waitFor({ state: 'visible' });
    if ((await status.getAttribute('data-state')) !== 'success') errors.push('avec JS : pas de message de succès');
    if (page.url().includes('/merci/')) errors.push('avec JS : la page a été quittée');
    // Échec réseau : message d'erreur clair
    await page.unroute('https://api.web3forms.com/**');
    await page.route('https://api.web3forms.com/**', (route) => route.abort());
    await fill(page);
    await page.click('button[type=submit]');
    await page.locator('[data-form-status][data-state="error"]').waitFor();
    await ctx.close();
  }

  await browser.close();
  for (const e of errors) console.log(`  FORMULAIRE ${e}`);
  console.log(errors.length ? `✗ Formulaire : ${errors.length} problème(s)` : '✓ Formulaire : fonctionne avec et sans JavaScript');
  return errors.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit((await checkForm(process.env.BASE_URL || 'http://localhost:4321')) ? 1 : 0);
}
