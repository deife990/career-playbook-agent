const { setup, start, jump, stable, assert, fs } = require('./browser.cjs');

(async () => {
  const { browser, page } = await setup();
  const frame = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  try {
    const rows = [];
    fs.mkdirSync('checks/v0140/output/alert-anchor', { recursive: true });
    await start(page);
    for (const [width, height] of [[1920,960], [1440,900], [390,844], [320,667], [800,450]]) {
      await page.setViewportSize({ width, height });
      await jump(page, 'Start');
      await frame();
      const positions = [];
      for (let beat = 0; beat < 3; beat++) {
        positions.push(await page.locator('#message-arrival').boundingBox());
        await page.screenshot({ path: `checks/v0140/output/alert-anchor/after-${width}x${height}-${beat}.png` });
        if (beat < 2) { await page.locator('#next').click(); await stable(page); await frame(); }
      }
      assert(positions.every(rect => Math.abs(rect.y - positions[0].y) < 1));
      const stress = await page.evaluate(async () => {
        const box = document.querySelector('text-box'), text = box.querySelector('[data-content=text]');
        const original = text.innerHTML;
        text.textContent = '긴 대사도 알림 위치를 바꾸지 않고 읽을 수 있어야 한다. '.repeat(40);
        const root = document.documentElement, reserve = root.style.getPropertyValue('--dialog-reserve');
        root.style.setProperty('--dialog-reserve', '500px');
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const caption = box.getBoundingClientRect(), card = document.getElementById('message-arrival').getBoundingClientRect();
        for (const node of [box, text]) node.scrollTop = node.scrollHeight;
        const result = { top: card.y, bottom: card.bottom, captionTop: caption.y, scroll: box.scrollTop + text.scrollTop };
        text.innerHTML = original;
        root.style.setProperty('--dialog-reserve', reserve);
        for (const node of [box, text]) node.scrollTop = 0;
        return result;
      });
      assert(Math.abs(stress.top - positions[0].y) < 1);
      assert(stress.bottom <= stress.captionTop);
      assert(stress.scroll > 0, 'Long caption remains scrollable within the reading reserve');
      rows.push({ width, height, positions, stress });
    }
    fs.writeFileSync('checks/v0140/output/alert-anchor/positions.json', JSON.stringify({ passed: true, rows }, null, 2));
    console.log('PASS alert-anchor positions: five sizes, three captions and long-caption scroll');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
