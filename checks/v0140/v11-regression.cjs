const{execFileSync}=require('node:child_process'),fs=require('node:fs');const rows=[];
for(const name of ['content-state','handoff','save-compat','tutorial-flow','practice','interaction','chatgpt','ui-v1','followup','layout-a11y','qc-regressions']){
 try{const out=execFileSync(process.execPath,['checks/v0140/'+name+'.cjs'],{timeout:180000,encoding:'utf8'});rows.push({name,passed:true,output:out.trim()});console.log('PASS',name)}catch(e){rows.push({name,passed:false,output:(e.stdout||'')+(e.stderr||'')});console.log('FAIL',name,String(e.stderr||e.message).slice(0,180))}
 fs.writeFileSync('checks/v0140/output/v11-regressions.json',JSON.stringify(rows,null,2));
}if(rows.some(x=>!x.passed))process.exitCode=1;
