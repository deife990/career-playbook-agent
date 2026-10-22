// Checks the executable episode against its editorial source, without browser data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),sourceRoot=path.resolve(root,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const story=vm.runInNewContext(read('story.js')+';CP_STORY').script;
const cards=vm.runInNewContext(read('cards.js')+';CP_CARDS');
const pilot=fs.readFileSync(path.join(sourceRoot,'PILOT_SCRIPT.md'),'utf8');
const side=fs.readFileSync(path.join(sourceRoot,'SIDE_STORIES.md'),'utf8');
const originalLines=[...pilot.matchAll(/\*\*나:\*\* “([^”]+)”/g)].map(m=>m[1]);
const originalChoices=[...pilot.matchAll(/\*\*[ABC]\. “([^”]+)”\*\*/g)].map(m=>m[1]);
const actualLines=Object.values(story).flat().filter(s=>typeof s==='string'&&s.startsWith('me ')).map(s=>s.slice(3));
const actualChoices=['Start','E01Talk','Promise'].flatMap(label=>Object.values(story[label].find(s=>s.Choice).Choice).filter(s=>s&&typeof s==='object').map(s=>s.Text));
// User-approved V04: explain fictional parent funding before this response.
const approvedPubTerms=text=>text.replaceAll('커피가 참가비야?','한 잔이 참가비야?').replaceAll('그래도 월급은 계속 주잖아. 본사에서 자금 보태준다는 얘기도 있던데.','그래도 월급은 계속 주잖아. 본사에서 자금을 보태주는 동안은 괜찮지 않을까?').replaceAll('우리가 확실히 아는 건 입금된 것뿐이네.','오늘 월급은 들어왔는데, 앞으로도 괜찮을지는 모르겠네.');
for(const line of originalLines)assert.ok(actualLines.includes(approvedPubTerms(line)),'Original protagonist line lost: '+line);
assert.ok(actualLines.length>=originalLines.length);
assert.deepEqual([...actualChoices].sort(),originalChoices.sort());
assert.equal(originalLines.length+originalChoices.length,34);
for(const list of Object.values(story))for(const statement of list){
  const commands=typeof statement==='string'?[statement]:statement.Choice?Object.values(statement.Choice).filter(x=>typeof x==='object').map(x=>x.Do):Object.values(statement.Conditional||{}).filter(x=>typeof x==='string');
  for(const command of commands)if(command.startsWith('jump '))assert.ok(story[command.slice(5)],'Missing label: '+command);
}
const firstRequests=[...pilot.matchAll(/^> (CareerPilot[^\n]+)/gm)].map(m=>m[1]);
assert.deepEqual([...cards[0].requests],firstRequests);
const sideRequests=cards.slice(1).flatMap(c=>[...c.requests]);
for(const request of sideRequests)assert.ok(side.includes('“'+request+'”'),'Request differs from source: '+request);
assert.equal(cards.slice(1).map(c=>c.id).join(','),Array.from({length:12},(_,i)=>'S'+String(i+1).padStart(2,'0')).join(','));
assert.equal(sideRequests.length,21);
const provenance=JSON.parse(read('downloads/provenance.json'));
const downloads=provenance.files.map(file=>{
  const data=fs.readFileSync(path.join(root,'downloads',file.name));
  const hash=crypto.createHash('sha256').update(data).digest('hex');
  assert.equal(hash,file.sha256);assert.equal(data.length,file.bytes);
  return {name:file.name,bytes:data.length,sha256:hash,passed:true};
});
console.log(JSON.stringify({protectedLines:originalLines.length,protagonistLines:actualLines.length,protectedChoices:originalChoices.length,firstRequests:firstRequests.length,sideRequests:sideRequests.length,labels:Object.keys(story).length,downloads,passed:true},null,2));
