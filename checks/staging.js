async (target, fresh=false) => {
  // Isolated browser context only. Uses real story progression, not direct jumps.
  const wait=async predicate=>{for(let n=0;n<1000;n++){if(predicate())return;await new Promise(r=>setTimeout(r,4));}throw Error('Scene did not settle');};
  if(document.getElementById('preparation').open)await closePanel();
  if(fresh){await document.getElementById('start').onclick();await new Promise(r=>setTimeout(r,600));await wait(()=>settled&&monogatari.state('step')===1&&monogatari.element().find('[data-screen=game]').isVisible());}
  const matches=()=>{
    const label=monogatari.state('label'),line=monogatari.label()?.[monogatari.state('step')];
    return target==='phone'?label==='Start'&&line==='phone 급여가 입금되었습니다.'
      :target==='tap'?label==='Start'&&typeof line==='string'&&line.includes('똑, 똑, 똑')
      :target==='turn'?label==='Start'&&typeof line==='string'&&line.startsWith('휴대폰을 내리고 돌아본다')
      :target==='thread'?label==='E02'&&typeof line==='string'&&line.startsWith('out 매일')
      :target==='claude'?label==='TutorInstallUpload'
      :target==='contact'?label==='Start'&&typeof line==='string'&&line.startsWith('s 저기…')
      :target==='front'?label==='Start'&&typeof line==='string'&&line.startsWith('s 나도 읽었어.')
      :target==='nari'?label==='Start'&&typeof line==='string'&&line.startsWith('n 둘 다 아직')
      :target==='cg'?label==='TutorialStart'&&typeof line==='string'&&line.startsWith('휴대폰을 두 사람 사이에')
      :target==='picker'?label==='TutorInstallPick'&&!!document.querySelector('choice-container')
      :target==='badge'?label==='E01'&&typeof line==='string'&&line.startsWith('목에 걸린 출입증')
      :target==='cup'?label==='E04'&&typeof line==='string'&&line.startsWith('휴대폰을 내려놓는다.')
      :target==='install'?label==='TutorChatGPTEnable'
      :target==='home'?label==='E05Messages'&&typeof line==='string'&&line.startsWith('msg 집에 잘')
      :target==='pub'?label==='E01'&&typeof line==='string'&&line.startsWith('호숫가 펍.')
      :target==='burst'?label==='C1_CALL_C'&&typeof line==='string'&&line.startsWith('s 응. 환불은')
      :target==='request'?label==='TutorRequest'&&typeof line==='string'&&line.startsWith('s 지원할 회사')
      :false;
  };
  for(let i=0;i<400&&!matches();i++){
    await wait(()=>settled&&!transitioning&&Date.now()>=beatUntil);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(matches())break;
    const choice=document.querySelector('choice-container');
    if(choice){const button=(target==='burst'&&monogatari.state('label')==='Start'?choice.querySelector('[data-choice="C"]'):null)||(target==='claude'&&monogatari.state('label')==='TutorInstallPick'?choice.querySelector('[data-choice="Claude"]'):null)||choice.querySelector('[data-choice="A"]')||choice.querySelector('button');const before=monogatari.state('label')+monogatari.state('step');button.click();await wait(()=>settled&&monogatari.state('label')+monogatari.state('step')!==before);}
    else if(document.getElementById('preparation').open)await closePanel();
    else await advance();
  }
  await wait(()=>settled&&matches());
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  await Promise.all([...document.querySelectorAll('#story-phone img,#scene-cg img,#story-install img,game-screen img[data-character]')].filter(x=>x.src).map(x=>x.decode().catch(()=>{throw Error('Image not loaded: '+x.src);})));
  if(document.documentElement.scrollWidth>innerWidth)throw Error('Horizontal overflow');
  const phone=!document.getElementById('story-phone').hidden,cg=!document.getElementById('scene-cg').hidden,install=!document.getElementById('story-install').hidden;
  if(target==='phone'&&!phone||target==='cg'&&!cg||target==='install'&&!install||['contact','front','nari'].includes(target)&&phone)throw Error('Wrong stage visibility: '+target);
  const sprite=document.querySelector('game-screen [data-character="s"]');
  if(target==='front'&&sprite?.dataset.sprite!=='neutral')throw Error('Front baseline not used');
  if(target==='install'&&!document.getElementById('story-install-image').src.endsWith('reference-ui/careerpilot-chatgpt-installed-20261005.jpg'))throw Error('Wrong installation illustration');
  const saved=await checkpoint();if(!saved)throw Error('Checkpoint failed');
  const characters=[...document.querySelectorAll('game-screen img[data-character]')].map(x=>{const r=x.getBoundingClientRect();return {name:x.dataset.character,x:r.x,right:r.right,y:r.y,bottom:r.bottom};});
  const state={scene:monogatari.state('scene'),use:!document.getElementById('story-use').hidden,duo:!document.getElementById('duo-stage').hidden,characters,tap:!document.getElementById('tap-cue').hidden,thread:document.getElementById('phone-body').childElementCount,cgAsset:document.querySelector('#scene-cg img').getAttribute('src'),label:monogatari.state('label'),step:monogatari.state('step'),text:document.querySelector('text-box').innerText,logCount:monogatari.storage('log').length,phone,cg,install,sprite:sprite?.dataset.sprite||null};
  return {target,state,viewport:[innerWidth,innerHeight],fontSize:document.getElementById('font-size').value,passed:true};
}
