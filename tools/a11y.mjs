import { chromium } from 'playwright';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const BASE = process.env.BASE || 'http://localhost:8777';
const b = await chromium.launch();
let total = 0;
for (const url of ['/', '/contact.html', '/terms.html', '/portfolio.html']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.addScriptTag({ path: axePath });
  const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] } }));
  console.log(`=== ${url} === ${r.violations.length} violations, ${r.passes.length} passed`);
  r.violations.forEach(v => { total++; console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`); });
  await p.close();
}
console.log('\n' + (total ? `${total} violation types` : 'NO ACCESSIBILITY VIOLATIONS'));
await b.close();
