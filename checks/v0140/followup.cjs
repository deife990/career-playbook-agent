const {assert,setup,start,jump,stable,action}=require('./browser.cjs');
(async()=>{const {browser,page:p,errors}=await setup({viewport:{width:390,height:844}});try{
 await p.locator('#title-tutorial').click();await p.evaluate(()=>CP_GUIDE.navigate('example','S05'));await action(p,'타이틀로 돌아가기');await p.waitForFunction(()=>!CP_GUIDE.isOpen());assert(await p.locator('#welcome').isVisible());
 await start(p);
 // Menu stays keyboard reachable and closing a nested view returns focus to the visible trigger.
 await p.locator('.game-more summary').focus();await p.keyboard.press('Enter');await p.locator('#prep').click();await p.waitForFunction(()=>$('preparation').open);await p.keyboard.press('Escape');await p.waitForFunction(()=>$('preparation').open===false);
 assert(await p.evaluate(()=>document.activeElement.matches('.game-more summary')),'focus returns to visible menu');
 // Manual copy failure and external navigation failure expose actionable recovery near request.
 await p.evaluate(()=>changePanel('request','first'));assert.equal(await p.locator('#request').inputValue(),await p.evaluate(()=>FIRST_REQUEST));assert(await p.locator('#copy').isVisible());
 assert(!(await p.locator('[data-panel=request]').innerText()).split('\n').includes('null'));await p.evaluate(()=>CP_GUIDE.open({flow:'example',stepId:'S05',owner:'preparation',returnTarget:'preparation'}));await action(p,'내 준비로 돌아가기');await p.waitForFunction(()=>$('preparation').open);assert.equal(await p.evaluate(()=>bridge.view),'request');
 await p.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('denied'));window.open=()=>null});
 await p.locator('#copy').click();assert(await p.locator('#request').evaluate(n=>document.activeElement===n&&n.selectionEnd>n.selectionStart));
 await p.locator('#save-external').click();await p.waitForFunction(()=>$('external').hidden===false);assert(await p.locator('#external').isVisible());
 await p.evaluate(()=>closePanel());
 // Corrected conversation and result are shown in separate pages; they share the same authored text.
 await jump(p,'E03Actual');await action(p,'설치해뒀어요 · 첫 요청 보기');await p.evaluate(()=>CP_PRACTICE.state('returned'));
 assert((await p.locator('.guide-body').innerText()).startsWith('대화는 어땠나요?'));assert(await p.getByText('요청 다시 보기',{exact:true}).isVisible());assert(!(await p.locator('.guide-body').innerText()).includes(await p.evaluate(()=>FIRST_REQUEST)));
 await action(p,'설치·실행에서 막혔어요');await action(p,'나중에 하기');assert.equal(await p.evaluate(()=>bridge.practice.status),'returned');await action(p,'지금은 넘어갈게요');await stable(p);
 await p.evaluate(()=>CP_GUIDE.open({flow:'example',stepId:'S04',owner:'preparation',returnTarget:'preparation'}));assert(!await p.locator('.tutorial-answer').count());await action(p,'조건을 나눠 말하기');
 assert((await p.locator('.tutorial-conversation').innerText()).includes('사는 곳은 온호시에 두고 싶어'));await p.getByRole('button',{name:'고친 조건',exact:true}).click();assert((await p.locator('.tutorial-observation').innerText()).includes('근무 가능 지역은 미정'));
 await p.keyboard.press('Escape');await p.waitForFunction(()=>!CP_GUIDE.isOpen());if(await p.locator('#preparation').evaluate(n=>n.open))await p.evaluate(()=>closePanel());
 // Contrast for multiple independently rendered messages. No later messages are revealed early.
 await jump(p,'Start');for(let i=0;i<100&&!(await p.evaluate(()=>document.body.dataset.messenger==='teams'&&document.body.dataset.messageOnly==='true'));i++){await p.evaluate(()=>advance());await stable(p)}
 let count=await p.locator('#phone-body .chat-bubble').count();assert.equal(count,1);
 const contrast=await p.evaluate(()=>{const toRGB=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);const lum=s=>toRGB(s).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>{let x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};const bg=getComputedStyle(document.querySelector('.phone-screen')).backgroundColor;return{header:ratio(getComputedStyle($('phone-app')).color,bg),button:ratio(getComputedStyle($('phone-next')).color,bg),time:ratio(getComputedStyle(document.querySelector('.phone-date')).color,bg)}});
 for(const [name,value]of Object.entries(contrast))assert(value>=4.5,name+' contrast '+value);
 assert.equal(await p.locator('#remote-person').isVisible(),false);
 await p.evaluate(()=>advance());await stable(p);assert.equal(await p.locator('#phone-body .chat-bubble').count(),2);
 // A short viewport must retain the question alongside its responses.
 await p.setViewportSize({width:800,height:450});await jump(p,'E01Talk');for(let i=0;i<100&&!await p.locator('choice-container').count();i++){await p.evaluate(()=>advance());await stable(p)}assert((await p.locator('.choice-context').innerText()).includes('너는 뭐 때문에 멈춰 있어?'));assert(await p.locator('.choice-context').isVisible());
 // Auto has a visible stop affordance, without exposing the idle toolbar.
 await jump(p,'E01Talk');assert.equal(await p.locator('#vn-auto').isVisible(),false);await p.locator('.game-more summary').click();await p.locator('[data-read-control=vn-auto]').click();assert(await p.locator('#vn-auto').isVisible());assert((await p.locator('#vn-auto').innerText()).includes('정지'));await p.locator('#vn-auto').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#vn-auto').isVisible(),false);assert(await p.evaluate(()=>document.activeElement.matches('.game-more summary')),'stopping auto restores visible focus');if(!await p.locator('.game-more').evaluate(n=>n.open))await p.locator('.game-more summary').click();await p.getByRole('button',{name:'그림만 보기',exact:true}).click();assert(await p.evaluate(()=>document.activeElement.matches('.restore-ui')),'artwork view focuses return button');await p.keyboard.press('Escape');assert(await p.evaluate(()=>document.activeElement.matches('.game-more summary')),'restoring artwork view returns visible focus');
 assert.deepEqual(errors,[]);console.log('PASS followup',JSON.stringify(contrast));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
