const { setup, start, jump, stable, assert, fs } = require('./browser.cjs');

(async () => {
  const { browser, page, errors } = await setup();
  const frame = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const next = async () => { await page.locator('#next').click(); await stable(page); await frame(); };
  try {
    fs.mkdirSync('checks/v0140/output/message-alignment', { recursive: true });
    await start(page);
    const rows = [];
    for (const [width, height, font] of [[1440,900,18], [390,844,18], [320,667,24], [800,450,18]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(f => document.documentElement.style.setProperty('--read-size', f + 'px'), font);
      await jump(page, 'E05Last');
      for (let i = 0; i < 3; i++) await next();
      const bubbles = await page.locator('#phone-body .chat-bubble').evaluateAll(nodes => nodes.map(node => {
        const rect = node.getBoundingClientRect(), parent = node.parentElement, box = parent.getBoundingClientRect(), css = getComputedStyle(parent);
        return { sent: node.classList.contains('sent'), sender: node.dataset.sender,
          left: rect.left, right: rect.right, start: box.left + parseFloat(css.paddingLeft),
          end: box.left + parent.clientWidth - parseFloat(css.paddingRight) };
      }));
      assert(bubbles.some(b => b.sent) && bubbles.some(b => !b.sent));
      for (const bubble of bubbles) {
        assert.equal(bubble.sender, bubble.sent ? '나' : '서안');
        assert(Math.abs(bubble.sent ? bubble.right - bubble.end : bubble.left - bubble.start) < 1, JSON.stringify(bubble));
      }
      await page.screenshot({ path: `checks/v0140/output/message-alignment/after-${width}x${height}.png` });
      await jump(page, 'CardLesson'); await frame();
      for (let i = 0; i < 12 && !await page.locator('choice-container').count(); i++) await next();
      assert(await page.locator('choice-container').count());
      const final = await page.locator('#phone-body .chat-bubble.sent').last().evaluate(node => {
        const rect = node.getBoundingClientRect(), parent = node.parentElement, box = parent.getBoundingClientRect();
        return { right: rect.right, end: box.left + parent.clientWidth - parseFloat(getComputedStyle(parent).paddingRight) };
      });
      assert(Math.abs(final.right - final.end) < 1, 'Reply choice keeps sent messages on the right');
      rows.push({ width, height, font, bubbles, replyChoice: final });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await jump(page, 'E05'); await frame();
    for (let i = 0; i < 35 && await page.evaluate(() => document.body.dataset.messenger !== 'kakao'); i++) await next();
    const sticker = await page.locator('.chat-sticker').evaluate(node => ({
      width: node.getBoundingClientRect().width,
      offset: node.getBoundingClientRect().left - node.parentElement.getBoundingClientRect().left,
      direction: node.parentElement.dataset.direction
    }));
    assert.equal(sticker.width, 128); assert.equal(sticker.offset, 0); assert.equal(sticker.direction, 'incoming');
    await next();
    await page.screenshot({ path: 'checks/v0140/output/message-alignment/after-sticker.png' });
    assert.deepEqual(errors, []);
    fs.writeFileSync('checks/v0140/output/message-alignment/result.json', JSON.stringify({ passed: true, rows, sticker }, null, 2));
    console.log('PASS message alignment: four sizes, reply choices and incoming sticker');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
