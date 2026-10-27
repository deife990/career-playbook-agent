async (only=null) => {
  // Replaces this beta's story slot. Run only in a test browser context.
  const results=[];
  const wait=async predicate=>{for(let i=0;i<1000;i++){if(predicate())return;await new Promise(r=>setTimeout(r,4));}throw new Error('Scene did not settle');};
  if(document.getElementById('preparation').open)await closePanel();
  let number=0;
  for(const c1 of (only?.c1||'ABC'))for(const c2 of (only?.c2||'ABC'))for(const c3 of (only?.c3||'ABC')){
    await document.getElementById('start').onclick();
    await new Promise(r=>setTimeout(r,600));
    await wait(()=>settled&&monogatari.state('label')==='Opening'&&monogatari.state('step')===1&&monogatari.element().find('[data-screen=game]').isVisible());
    const labels=[],variant=only?.variant??number++%3,flow=['skip','example','actual'][variant],platform=['ChatGPT','Claude','ready'][variant];
    for(let i=0;i<400;i++){
      await wait(()=>settled&&!transitioning&&Date.now()>=beatUntil);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const label=monogatari.state('label');if(!labels.includes(label))labels.push(label);
      if(label==='Finish')break;
      const choice=document.querySelector('choice-container');
      if(choice){
        const bounds=choice.getBoundingClientRect(),dialog=document.querySelector('text-box').getBoundingClientRect(),toolbar=document.querySelector('header').getBoundingClientRect();
        if(bounds.bottom>dialog.top||bounds.top<toolbar.bottom||document.documentElement.scrollWidth>innerWidth)throw new Error('Choice overlaps dialogue or toolbar: '+label);
        const key=label==='Start'?c1:label==='E01Talk'?c2:label==='Promise'?c3:label==='E03'?flow:label==='TutorInstallPick'?platform:'back';
        const button=choice.querySelector(`[data-choice="${key}"]`);if(!button)throw new Error('Choice missing '+label+' '+key);
        const r=button.getBoundingClientRect();if(!button.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)))throw new Error('Choice is obscured: '+label+' '+key);
        const before=label+':'+monogatari.state('step');button.click();
        await wait(()=>settled&&(monogatari.state('label')+':'+monogatari.state('step'))!==before);
      }else if(document.getElementById('preparation').open){
        if(label!=='E03Actual')throw new Error('Unexpected panel');
        if(document.getElementById('request').value!==CP_CARDS[0].requests[0])throw new Error('First request differs');
        await closePanel();
      }else{await advance();}
    }
    const required=['Opening','WalkHome','RecallDesk','RecallPeople','RecallHold','WalkQuestion','Start','C1_'+c1,'P02','E01','C1_CALL_'+c1,'E01Talk','C2_'+c2,'E02','TutorialStart','TutorInstallPick',...(platform==='ChatGPT'?['TutorChatGPTUpload','TutorChatGPTEnable']:platform==='Claude'?['TutorInstallUpload','TutorInstallEnable']:[]),(platform==='Claude'?'TutorClaudeChat':'TutorChatGPTChat'),'TutorRequest','TutorConditions','TutorNext','E03','E04','C2_CALL_'+c2,'Promise','C3_'+c3,'E05','E05Messages','C3_CALL_'+c3,'E05Last','CardLesson','Finish'];
    const inOrder=required.every((label,i)=>labels.includes(label)&&(i===0||labels.indexOf(label)>labels.indexOf(required[i-1])));
    const choices=['c1','c2','c3'].map(key=>monogatari.storage(key));
    const passed=inOrder&&choices.join('')===c1+c2+c3&&monogatari.state('label')==='Finish';
    if(!passed)throw new Error(JSON.stringify({c1,c2,c3,flow,labels,choices}));
    if(flow==='example'&&!labels.includes('E03Example'))throw new Error('Missing fictional example');
    if(flow==='actual'&&!labels.includes('E03Actual'))throw new Error('Missing actual preparation');
    if(flow==='skip'&&(labels.includes('E03Example')||labels.includes('E03Actual')))throw new Error('Skipped path was forced into preparation');
    await checkpoint();
    const saved=await monogatari.Storage.get('CPEpisode_1');
    if(!validSave(saved)||saved.game.state.label!=='Finish')throw new Error('End position not saved');
    results.push({choices:c1+c2+c3,preparation:flow,platform,passed,logCount:monogatari.storage('log').length});
  }
  const cards=[];
  for(const c of CP_CARDS.filter(c=>c.id!=='first')){
    await changePanel('request',c.id);
    for(let i=0;i<c.requests.length;i++){
      const el=document.getElementById('request-choice');el.value=String(i);await el.onchange();
      if(document.getElementById('request').value!==c.requests[i])throw new Error('Request mismatch '+c.id+' '+i);
    }
    const position=monogatari.state('label');await closePanel();
    if(position!==monogatari.state('label'))throw new Error('Card changed story '+c.id);
    cards.push({id:c.id,requests:c.requests.length,returnedTo:'Finish',passed:true});
  }
  await changePanel('request','first');
  const original=Storage.prototype.setItem;
  try{
    Storage.prototype.setItem=function(key,value){if(key.includes('careerpilot-office-romance-beta'))throw new DOMException('Test quota limit','QuotaExceededError');return original.call(this,key,value);};
    await document.getElementById('save-external').onclick();
    if(!document.getElementById('external').hidden||!document.getElementById('panel-status').innerText.includes('저장하지 못해'))throw new Error('External move allowed after failed save');
  }finally{Storage.prototype.setItem=original;}
  await document.getElementById('save-external').onclick();
  if(document.getElementById('external').hidden)throw new Error('Save failed after storage recovered');
  return {routes:results,cards,choiceLayout:true,viewport:[innerWidth,innerHeight],fontSize:document.getElementById('font-size').value,storageFailureBlocksExternal:true,storageRecovery:true};
}
