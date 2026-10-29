const { setup, assert, fs } = require('./browser.cjs');

(async () => {
  fs.mkdirSync('checks/v0140/output/title-scroll', { recursive: true });
  const { browser, page, errors } = await setup();
  try {
    const rows = [];
    for (const [width, height] of [[1920,960], [1440,900], [390,844], [320,667], [800,450]]) {
      await page.setViewportSize({ width, height });
      await page.locator('#welcome').waitFor({ state: 'visible' });
      await page.locator('.title-cast img').evaluate(img => img.decode());
      await page.locator('.title-scroll').evaluate(el => el.scrollTop = 0);
      await page.screenshot({ path: `checks/v0140/output/title-scroll/after-${width}x${height}-top.png` });
      const cast = await page.locator('.title-cast').boundingBox();
      await page.mouse.move(width / 2, height / 2);
      await page.mouse.wheel(0, 3000);
      await page.locator('.title-footer').scrollIntoViewIfNeeded();
      const state = await page.evaluate(() => {
        const welcome = document.querySelector('#welcome');
        const scroll = welcome.querySelector('.title-scroll');
        const shade = welcome.querySelector('.title-atmosphere').getBoundingClientRect();
        const footer = welcome.querySelector('.title-footer').getBoundingClientRect();
        return { outerScroll: welcome.scrollTop, innerScroll: scroll.scrollTop,
          contentHeight: scroll.scrollHeight, innerHeight: scroll.clientHeight,
          shadeTop: shade.top, shadeBottom: shade.bottom, footerBottom: footer.bottom,
          scrollWidth: scroll.scrollWidth, windowScroll: scrollY };
      });
      assert.equal(state.outerScroll, 0);
      assert.equal(state.shadeTop, 0);
      assert.equal(state.shadeBottom, height);
      assert.equal(state.windowScroll, 0);
      assert.ok(state.scrollWidth <= width);
      assert.ok(state.footerBottom <= height + 1);
      assert.deepEqual(cast, await page.locator('.title-cast').boundingBox());
      if (width === 1920) assert.equal(state.contentHeight, state.innerHeight);
      for (const id of ['start', 'title-download', 'title-tutorial', 'title-settings', 'title-gallery', 'title-characters']) {
        await page.locator('#' + id).focus();
        const box = await page.locator('#' + id).boundingBox();
        // Browser focus scrolling rounds the scroll offset to whole CSS pixels.
        assert.ok(box.y >= -1 && box.y + box.height <= height + 1,
          `${width}x${height}: ${id} is outside the viewport: ${JSON.stringify(box)}`);
      }
      await page.locator('.title-footer').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `checks/v0140/output/title-scroll/after-${width}x${height}-bottom.png` });
      rows.push({ width, height, ...state });
    }
    await page.locator('#title-settings').click();
    await page.waitForFunction(() => document.querySelector('dialog[open]'));
    await page.evaluate(() => document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close()));
    await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#welcome').hidden);
    assert.deepEqual(errors, []);
    fs.writeFileSync('checks/v0140/output/title-scroll/result.json', JSON.stringify({ passed: true, rows, settings: true, start: true }, null, 2));
    console.log('PASS title-scroll: five viewports, fixed artwork, keyboard menus, settings and start');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
