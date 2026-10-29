const { setup, start, jump, stable, assert, fs } = require('./browser.cjs');

(async () => {
  const rows = [];
  fs.mkdirSync('checks/v0140/output/three-review', { recursive: true });
  for (const [width, height, font] of [[1440,900,18], [390,844,18], [320,667,24], [800,450,24]]) {
    const { browser, context, page, errors } = await setup({ viewport: { width, height } });
    const frame = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const next = async () => { await page.locator('#next').click(); await stable(page); await frame(); };
    try {
      await page.locator('#welcome').waitFor({ state: 'visible' });
      const cast = await page.locator('.title-cast').boundingBox();
      await page.mouse.move(width / 2, height / 2); await page.mouse.wheel(0, 3000);
      await page.locator('.title-footer').scrollIntoViewIfNeeded(); await frame();
      const title = await page.evaluate(() => {
        const welcome = document.getElementById('welcome'), shade = welcome.querySelector('.title-atmosphere').getBoundingClientRect();
        return { overflow: getComputedStyle(welcome).overflowY, outerScroll: welcome.scrollTop, shadeTop: shade.top, shadeBottom: shade.bottom, documentScroll: scrollY };
      });
      assert.equal(title.overflow, 'hidden'); assert.equal(title.outerScroll, 0);
      assert.equal(title.shadeTop, 0); assert.equal(title.shadeBottom, height); assert.equal(title.documentScroll, 0);
      assert.deepEqual(await page.locator('.title-cast').boundingBox(), cast);
      await page.screenshot({ path: `checks/v0140/output/three-review/title-${width}x${height}.png` });
      await page.evaluate(f => { document.documentElement.style.setProperty('--read-size', f + 'px'); localStorage.setItem('CPEpisodeFont', String(f)); }, font);
      await start(page); await jump(page, 'Start'); await frame();
      const beats = [];
      for (let i = 0; i < 3; i++) {
        const state = await page.evaluate(() => {
          const box = document.querySelector('text-box').getBoundingClientRect(), card = document.getElementById('message-arrival').getBoundingClientRect();
          return { height: box.height, top: box.top, cardTop: card.top, cardBottom: card.bottom };
        });
        assert(Math.abs(state.height - Math.max(200, Math.min(height * .26, 280))) < 1, JSON.stringify(state));
        assert(state.cardBottom < state.top);
        beats.push(state);
        if (i < 2) await next();
      }
      assert(beats.every(beat => Math.abs(beat.height - beats[0].height) < 1 && Math.abs(beat.cardTop - beats[0].cardTop) < 1));
      await page.screenshot({ path: `checks/v0140/output/three-review/salary-${width}x${height}.png` });
      await next();
      const mail = await page.evaluate(() => {
        const box = document.querySelector('text-box').getBoundingClientRect(), card = document.getElementById('message-arrival').getBoundingClientRect();
        return { captionHeight: box.height, captionTop: box.top, left: card.left, right: card.right, top: card.top, bottom: card.bottom, center: card.left + card.width / 2 };
      });
      assert.equal(mail.captionHeight, beats[0].height); assert(Math.abs(mail.center - width / 2) < 1);
      assert(mail.top >= 0 && mail.bottom <= mail.captionTop);
      await jump(page, 'E01'); await frame();
      const regular = [];
      for (let i = 0; i < 3; i++) {
        regular.push((await page.locator('text-box').boundingBox()).height);
        if (i < 2) await next();
      }
      assert(regular.every(value => Math.abs(value - beats[0].height) < 1));
      assert(await page.evaluate(() => checkpoint())); await page.reload(); await page.waitForFunction(() => ready);
      await page.locator('#resume').click(); await stable(page); await frame();
      assert(Math.abs((await page.locator('text-box').boundingBox()).height - beats[0].height) < 1);
      await jump(page, 'P02'); await page.locator('#narrative-image').evaluate(img => img.decode());
      await page.screenshot({ path: `checks/v0140/output/three-review/gate-${width}x${height}.png` });
      assert.deepEqual(errors, []);
      rows.push({ width, height, font, title, beats, mail, regular, restore: true });
      console.log('PASS three-review', width, height, font);
    } finally { await context.close(); await browser.close(); }
  }
  fs.writeFileSync('checks/v0140/output/three-review/result.json', JSON.stringify({ passed: true, rows, artworkQuality: 'Face detail remains below reference; one candidate preserved for comparison, not applied.' }, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
