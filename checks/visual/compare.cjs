// Pixel-compare two snap.cjs phases. Exit code 1 when any screen differs or is missing.
const fs=require('fs'),path=require('path');
const [a,b]=process.argv.slice(2),A=`checks/visual/output/${a}`,B=`checks/visual/output/${b}`;
const names=[...new Set([...fs.readdirSync(A),...fs.readdirSync(B)])].filter(n=>n.endsWith('.png')).sort();
(async()=>{const {chromium}=require(require.resolve('playwright',{paths:[process.env.PLAYWRIGHT_PATH||'/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules']}));
const browser=await chromium.launch(),page=await browser.newPage();const rows=[];
for(const name of names){const pa=path.join(A,name),pb=path.join(B,name);
 if(!fs.existsSync(pa)||!fs.existsSync(pb)){rows.push({name,missing:fs.existsSync(pa)?b:a});continue}
 const x=fs.readFileSync(pa),y=fs.readFileSync(pb);if(x.equals(y))continue;
 const diff=await page.evaluate(async([x,y])=>{const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s});const [i,j]=await Promise.all([load(x),load(y)]);
  if(i.width!==j.width||i.height!==j.height)return{size:true,ratio:1};const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');
  g.drawImage(i,0,0);const d1=g.getImageData(0,0,c.width,c.height).data;g.clearRect(0,0,c.width,c.height);g.drawImage(j,0,0);const d2=g.getImageData(0,0,c.width,c.height).data;
  let n=0;for(let k=0;k<d1.length;k+=4)if(Math.abs(d1[k]-d2[k])+Math.abs(d1[k+1]-d2[k+1])+Math.abs(d1[k+2]-d2[k+2])>12)n++;return{ratio:n/(c.width*c.height)}},[x.toString('base64'),y.toString('base64')]);
 if(diff.ratio>0)rows.push({name,...diff})}
await browser.close();fs.writeFileSync(`checks/visual/output/compare-${a}-${b}.json`,JSON.stringify({compared:names.length,different:rows},null,2));
console.log(`${names.length} screens compared, ${rows.length} different`);rows.slice(0,20).forEach(r=>console.log(' ',r.name,r.missing?'missing in '+r.missing:(r.ratio*100).toFixed(3)+'%'));if(rows.length)process.exitCode=1})().catch(e=>{console.error(e);process.exitCode=1});
