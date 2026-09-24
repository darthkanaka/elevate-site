import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:8777';
const b = await chromium.launch();
const problems = [];
async function page(opts = {}) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
  p.on('pageerror', e => problems.push('JS ERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') problems.push('CONSOLE: ' + m.text()); });
  p.on('requestfailed', r => problems.push('REQ FAIL: ' + r.url().split('/').pop()));
  return p;
}
for (const url of ['/', '/contact.html', '/terms.html', '/portfolio.html']) {
  const p = await page();
  await p.goto(BASE + url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    noAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
    bare: document.querySelectorAll('a[href="#"]').length,
    unlabeled: [...document.querySelectorAll('input,textarea')].filter(i => !document.querySelector(`label[for="${i.id}"]`)).length,
    noindex: document.querySelectorAll('meta[name="robots"][content*="noindex"]').length,
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  console.log(`${url.padEnd(17)} h1=${r.h1} no-alt=${r.noAlt} bare#=${r.bare} unlabeled=${r.unlabeled} noindex=${r.noindex} overflow=${r.over}px`);
  if (r.h1 !== 1) problems.push(`${url}: ${r.h1} h1`);
  if (r.noAlt) problems.push(`${url}: ${r.noAlt} images missing alt`);
  if (r.bare) problems.push(`${url}: bare # link`);
  if (r.unlabeled) problems.push(`${url}: unlabeled field`);
  if (r.noindex) problems.push(`${url}: STILL NOINDEX`);
  if (r.over > 0) problems.push(`${url}: ${r.over}px overflow`);
  const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('#') && !/^(https?:|mailto:|tel:)/.test(h)));
  for (const h of [...new Set(hrefs)]) {
    const res = await p.request.get(new URL(h, BASE + url).href);
    if (!res.ok()) problems.push(`${url}: link ${h} -> ${res.status()}`);
  }
  await p.close();
}
{
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    hidden: [...document.querySelectorAll('h1,h2,h3,p,img,.card,.hs-card')].filter(el => { const c = getComputedStyle(el); return c.opacity === '0' || c.visibility === 'hidden'; }).length,
    text: document.body.innerText.replace(/\s+/g, ' ').trim().length }));
  console.log(`no-JS: ${r.text} chars visible, ${r.hidden} stuck invisible`);
  if (r.hidden) problems.push(`no-JS: ${r.hidden} invisible`);
  await ctx.close();
}
{
  const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    canvas: !!document.querySelector('#hero-canvas'),
    mq: getComputedStyle(document.querySelector('.mq-track')).animationName,
    hidden: [...document.querySelectorAll('[data-reveal]')].filter(el => getComputedStyle(el).opacity === '0').length }));
  console.log(`reduced-motion: canvas removed=${!r.canvas} marquee=${r.mq} hidden=${r.hidden}`);
  if (r.canvas || r.mq !== 'none' || r.hidden) problems.push('reduced-motion regression');
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const burger = await p.isVisible('.burger');
  await p.click('.burger'); await p.waitForTimeout(400);
  const open = await p.isVisible('.nav-menu');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const closed = !(await p.isVisible('.nav-menu'));
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`mobile: burger=${burger} opens=${open} escape-closes=${closed} overflow=${over}px`);
  if (!burger || !open || !closed || over > 0) problems.push('mobile regression');
  await ctx.close();
}
console.log('\n' + (problems.length ? 'PROBLEMS:\n- ' + [...new Set(problems)].join('\n- ') : 'ALL CHECKS PASSED'));
await b.close();
