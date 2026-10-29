const{assert,setup,start,jump,stable,report}=require('./browser.cjs');
(async()=>{const{browser,page:p,errors}=await setup({viewport:{width:1440,height:900},reducedMotion:'no-preference'});p.setDefaultTimeout(20000);try{
 await p.evaluate(()=>{window.mediaEvidence={tones:[],taps:0,motions:[]};const ac=AudioContext.prototype,osc=ac.createOscillator,buffer=ac.createBufferSource,animate=Element.prototype.animate;
 ac.createOscillator=function(){const n=osc.call(this),row={frequency:null,start:null,stop:null},start=n.start.bind(n),stop=n.stop.bind(n);mediaEvidence.tones.push(row);n.start=(t=0)=>{row.frequency=n.frequency.value;row.start=t;return start(t)};n.stop=(t=0)=>{row.stop=t;return stop(t)};return n};
 ac.createBufferSource=function(){mediaEvidence.taps++;return buffer.call(this)};
 Element.prototype.animate=function(frames,options){mediaEvidence.motions.push({target:this.id||this.getAttribute('data-character')||this.tagName,frames,options});return animate.call(this,frames,options)};
 });await start(p);await p.evaluate(()=>syncAmbience());await jump(p,'E01Talk');await p.evaluate(()=>syncAmbience());await jump(p,'E05Last');await p.evaluate(()=>syncAmbience());assert.equal(await p.evaluate(()=>mediaEvidence.tones.length),0,'no continuous background oscillators');
 await p.evaluate(async()=>{await playTapSound();await playNotificationSound()});const sounds=await p.evaluate(()=>({tones:mediaEvidence.tones,taps:mediaEvidence.taps}));assert.equal(sounds.taps,3);assert.equal(sounds.tones.length,2);assert(sounds.tones.every(r=>r.frequency>=880&&r.stop!==null&&r.stop-r.start<=.33));
 await jump(p,'E02');await p.evaluate(()=>advance());await stable(p);await p.waitForTimeout(700);await p.evaluate(()=>advance());await stable(p);await p.waitForTimeout(700);await p.evaluate(()=>advance());await stable(p);await p.waitForTimeout(700);
 const before=await p.evaluate(()=>mediaEvidence.motions.length);await p.evaluate(()=>{syncStoryUI();syncStoryUI()});await p.setViewportSize({width:800,height:450});await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>mediaEvidence.motions.length),before,'sync/resize does not replay entrances');
 const motions=await p.evaluate(()=>mediaEvidence.motions.filter(x=>['story-phone','FIGURE','s','n','recall-yoon','narrative-image','iseo-expression'].includes(x.target)));
 assert(motions.some(x=>x.target==='story-phone'));for(const r of motions)assert(!JSON.stringify(r.frames).includes('scale('),JSON.stringify(r));
 // Saving/restoring a conversation should not replay the remote character entrance.
 assert(await p.evaluate(()=>checkpoint()));await p.reload();await p.waitForFunction(()=>ready);await p.locator('#resume').click();await stable(p);assert.equal(await p.locator('#message-cast').isVisible(),true);
 await p.emulateMedia({reducedMotion:'reduce'});await jump(p,'E02');await p.evaluate(()=>advance());await stable(p);await p.waitForTimeout(50);assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 assert.deepEqual(errors,[]);report('v11-media',{passed:true,sounds,motions,motionReference:'https://sueun-dev.github.io/motion-effects/#c7',reducedMotion:true,actualSpeakerListening:'NOT VERIFIED'});
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
