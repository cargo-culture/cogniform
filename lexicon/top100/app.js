(() => {
  'use strict';

  const NS='http://www.w3.org/2000/svg';
  const CX=380,CY=380;
  const RADII=[104,184,264,344];
  const LETTERS=['a','b','c','d','e','f'];
  const SEMES=[
    ['NEGATION','WITH','QUALITY','CHANGE','EXIST','THING'],
    ['IN','MANY','ORDER','TIME','DO','ONE'],
    ['PLACE','SIZE','POWER','CAUSE','NECESSITY','POSSIBILITY'],
    ['ALIVE','PERCEIVE','KNOW','SIGN','VALUE','WANT']
  ];

  const search=document.getElementById('search');
  const filter=document.getElementById('filter');
  const wordButtons=document.getElementById('wordButtons');
  const count=document.getElementById('count');
  const wordEl=document.getElementById('word');
  const rankEl=document.getElementById('rank');
  const definitionEl=document.getElementById('definition');
  const typeBadge=document.getElementById('typeBadge');
  const readingEl=document.getElementById('reading');
  const notationEl=document.getElementById('notation');
  const semesEl=document.getElementById('semes');
  const operatorsEl=document.getElementById('operators');
  const notesEl=document.getElementById('notes');
  const senseTabs=document.getElementById('senseTabs');
  const svg=document.getElementById('formSvg');
  const baseLayer=document.getElementById('baseLayer');
  const routeLayer=document.getElementById('routeLayer');
  const nodeLayer=document.getElementById('nodeLayer');
  const operatorLayer=document.getElementById('operatorLayer');

  let data=null;
  let selectedRank=1;
  let selectedSense=0;

  const bySeme=new Map();
  SEMES.forEach((ring,r)=>ring.forEach((s,i)=>bySeme.set(s,{r,i,id:(r+1)+LETTERS[i]})));

  function el(tag,attrs={}){
    const n=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));
    return n;
  }
  function point(ring,index){
    const a=(-90+index*60)*Math.PI/180;
    return {x:CX+RADII[ring]*Math.cos(a),y:CY+RADII[ring]*Math.sin(a)};
  }
  function nodeInfo(id){
    const r=Number(id[0])-1,i=LETTERS.indexOf(id[1]);
    return {r,i,seme:SEMES[r][i]};
  }
  function neighbors(id){
    const {r,i}=nodeInfo(id);
    const out=[(r+1)+LETTERS[(i+1)%6],(r+1)+LETTERS[(i+5)%6]];
    if(r>0) out.push(r+LETTERS[i]);
    if(r<3) out.push((r+2)+LETTERS[i]);
    return out;
  }
  function shortestPath(a,b){
    const start=bySeme.get(a).id,end=bySeme.get(b).id;
    const q=[[start]],seen=new Set([start]);
    while(q.length){
      const path=q.shift(),last=path[path.length-1];
      if(last===end)return path;
      for(const n of neighbors(last)){
        if(!seen.has(n)){seen.add(n);q.push([...path,n]);}
      }
    }
    return [start,end];
  }
  function drawBase(){
    baseLayer.replaceChildren();
    for(let i=0;i<6;i++){
      const p=point(3,i);
      const a=Math.atan2(p.y-CY,p.x-CX),x=CX+(RADII[3]+20)*Math.cos(a),y=CY+(RADII[3]+20)*Math.sin(a);
      baseLayer.appendChild(el('line',{x1:CX,y1:CY,x2:x,y2:y,class:'spoke'}));
    }
    RADII.forEach(r=>baseLayer.appendChild(el('circle',{cx:CX,cy:CY,r,class:'ring'})));
    baseLayer.appendChild(el('circle',{cx:CX,cy:CY,r:4,class:'center'}));
  }
  function operatorLabel(op){
    if(op.type==='query')return '?'+op.target;
    if(op.type==='index')return op.label||'@index';
    if(op.type==='order-polarity')return (op.target||'ORDER')+(op.value||'')+'['+(op.axis||'')+']';
    if(op.type==='measure')return op.target+'#('+op.value+')';
    return op.label||op.type;
  }
  function resolvedForm(entry){
    if(entry.form_type!=='polysemous')return entry;
    return entry.senses[selectedSense]||entry.senses[0];
  }
  function renderSvg(entry){
    const form=resolvedForm(entry);
    const active=new Set(form.semes||[]);
    routeLayer.replaceChildren();nodeLayer.replaceChildren();operatorLayer.replaceChildren();

    for(const [a,b] of (form.bonds||[])){
      const path=shortestPath(a,b);
      const pts=path.map(id=>{const n=nodeInfo(id);return point(n.r,n.i);});
      const d=pts.map((p,i)=>(i?'L':'M')+' '+p.x+' '+p.y).join(' ');
      routeLayer.appendChild(el('path',{d,class:'route'}));
    }

    for(let r=0;r<4;r++){
      for(let i=0;i<6;i++){
        const seme=SEMES[r][i],p=point(r,i),g=el('g',{class:'node'+(active.has(seme)?' active':'')});
        g.setAttribute('transform','translate('+p.x+' '+p.y+')');
        g.appendChild(el('circle',{r:27}));
        const addr=el('text',{x:0,y:-8,class:'addr'});addr.textContent='R'+(r+1)+LETTERS[i];
        const name=el('text',{x:0,y:7});name.textContent=seme.length>9?seme.slice(0,8)+'…':seme;
        g.append(addr,name);nodeLayer.appendChild(g);
      }
    }

    for(const op of (form.operators||[])){
      const target=op.target && bySeme.has(op.target)?bySeme.get(op.target):null;
      if(!target)continue;
      const p=point(target.r,target.i);
      if(op.type==='query'){
        operatorLayer.appendChild(el('circle',{cx:p.x,cy:p.y,r:36,class:'operator-halo'}));
        const t=el('text',{x:p.x+30,y:p.y-28,class:'operator-text'});t.textContent='?';operatorLayer.appendChild(t);
      }else{
        const x=p.x+31,y=p.y-29;
        operatorLayer.appendChild(el('circle',{cx:x,cy:y,r:17,class:'operator-badge'}));
        const t=el('text',{x,y:y+1,class:'operator-text'});
        t.textContent=op.type==='order-polarity'?op.value:(op.type==='measure'?'#':(op.label||'@'));
        operatorLayer.appendChild(t);
      }
    }
  }
  function chips(container,items,cls=''){
    container.replaceChildren();
    if(!items.length){const s=document.createElement('span');s.className='chip';s.textContent='none';container.appendChild(s);return;}
    items.forEach(item=>{const s=document.createElement('span');s.className='chip '+cls;s.textContent=item;container.appendChild(s);});
  }
  function selectEntry(rank){
    selectedRank=rank;selectedSense=0;renderDetail();
    [...document.querySelectorAll('.word-button')].forEach(b=>b.classList.toggle('active',Number(b.dataset.rank)===rank));
  }
  function renderDetail(){
    const e=data.entries.find(x=>x.rank===selectedRank)||data.entries[0];
    wordEl.textContent=e.word;rankEl.textContent='#'+e.rank+' of 100';
    definitionEl.textContent=e.source_definition;
    typeBadge.textContent=e.form_type;
    senseTabs.replaceChildren();
    if(e.form_type==='polysemous'){
      senseTabs.hidden=false;
      e.senses.forEach((s,i)=>{
        const b=document.createElement('button');b.type='button';b.textContent='Sense '+(i+1);
        b.classList.toggle('active',i===selectedSense);
        b.addEventListener('click',()=>{selectedSense=i;renderDetail();});
        senseTabs.appendChild(b);
      });
    } else senseTabs.hidden=true;

    const f=resolvedForm(e);
    readingEl.textContent=f.reading||e.reading||'—';
    notationEl.textContent=f.canonical_form||e.canonical_form||'—';
    chips(semesEl,f.semes||[]);
    chips(operatorsEl,(f.operators||[]).map(operatorLabel),'operator');
    notesEl.textContent=f.notes||e.notes||'—';
    renderSvg(e);
  }
  function renderList(){
    const q=search.value.trim().toLowerCase(),kind=filter.value;
    const matches=data.entries.filter(e=>{
      if(kind!=='all'&&e.form_type!==kind)return false;
      const hay=[e.word,e.source_definition,e.canonical_form,e.reading,e.notes,JSON.stringify(e.senses||[]),...(e.semes||[])].join(' ').toLowerCase();
      return !q||hay.includes(q);
    });
    count.textContent=matches.length+' shown';
    wordButtons.replaceChildren();
    matches.forEach(e=>{
      const b=document.createElement('button');b.type='button';b.className='word-button';b.dataset.rank=e.rank;
      b.classList.toggle('active',e.rank===selectedRank);
      const n=document.createElement('span');n.className='n';n.textContent=e.rank;
      const w=document.createElement('span');w.className='w';w.textContent=e.word;
      b.append(n,w);b.addEventListener('click',()=>selectEntry(e.rank));wordButtons.appendChild(b);
    });
    if(matches.length&&!matches.some(e=>e.rank===selectedRank))selectEntry(matches[0].rank);
  }

  fetch('../../data/top100-cogniforms-approved.json')
    .then(r=>{if(!r.ok)throw new Error('Failed to load lexicon');return r.json();})
    .then(json=>{data=json;drawBase();renderList();renderDetail();})
    .catch(err=>{document.body.innerHTML='<pre style="padding:20px;color:white">'+err.message+'</pre>';});

  search.addEventListener('input',renderList);
  filter.addEventListener('change',renderList);
})();