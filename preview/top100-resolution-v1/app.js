(() => {
  'use strict';

  const NS='http://www.w3.org/2000/svg';
  const cx=350, cy=350;
  const radii=[88,158,228,298];
  const letters=['a','b','c','d','e','f'];

  const semes=[
    ['NEGATION','WITH','QUALITY','CHANGE','EXIST','THING'],
    ['IN','MANY','ORDER','TIME','DO','ONE'],
    ['PLACE','SIZE','POWER','CAUSE','NECESSITY','POSSIBILITY'],
    ['ALIVE','PERCEIVE','KNOW','SIGN','VALUE','WANT']
  ];

  const examples={
    on:{
      title:'ON — semantic relation vs physical route',
      problem:'WITH—PLACE is semantically natural but was marked impossible because R1 and R3 are separated by R2.',
      reading:'Keep the semantic bond WITH—PLACE. Route it across legal adjacent segments. Any inactive seme positions the line crosses remain visually inactive and contribute no meaning.',
      mechanisms:['ROUTED BOND'],
      active:['1b','3a'],
      semantic:[['1b','3a']],
      routes:[['1b','1a','2a','3a']],
      operators:[],
      notation:'semantic: R1b—R3a   ·   physical path: R1b→R1a→R2a→R3a   ·   active: R1b, R3a'
    },
    say:{
      title:'SAY — routed DO—SIGN',
      problem:'DO—SIGN was blocked because the semes are separated by an intervening ring.',
      reading:'The meaning remains DO—SIGN. The line can pass through TIME and CAUSE while both nodes remain completely unmarked and inactive.',
      mechanisms:['ROUTED BOND'],
      active:['2e','4d'],
      semantic:[['2e','4d']],
      routes:[['2e','2d','3d','4d']],
      operators:[],
      notation:'semantic: R2e—R4d   ·   physical path: R2e→R2d→R3d→R4d   ·   active: R2e, R4d'
    },
    truth:{
      title:'TRUTH — KNOW—EXIST survives intact',
      problem:'The earlier semantic analysis KNOW + EXIST was correct, but the current coordinates made the pair impossible to connect directly.',
      reading:'Do not change the ontology to fit the drawing. Keep KNOW—EXIST and route the bond.',
      mechanisms:['ROUTED BOND'],
      active:['4c','1e'],
      semantic:[['4c','1e']],
      routes:[['4c','4d','3d','2d','1d','1e']],
      operators:[],
      notation:'semantic: R4c—R1e   ·   physical path: R4c→R4d→R3d→R2d→R1d→R1e   ·   active: R4c, R1e'
    },
    what:{
      title:'WHAT — query a semantic slot',
      problem:'The corpus pass tried to manufacture interrogativity from NEGATION + KNOW + SIGN.',
      reading:'THING keeps its ordinary meaning. The query halo says the value occupying this semantic slot is requested.',
      mechanisms:['QUERY'],
      active:['1f'],
      semantic:[],
      routes:[],
      operators:[{type:'query',node:'1f'}],
      notation:'?R1f   =   ?THING'
    },
    you:{
      title:'YOU — discourse reference is structural',
      problem:'The 24 semes do not contain a dedicated addressee primitive.',
      reading:'ALIVE supplies the semantic category. The index pin anchors the referent to the addressee. No English-specific YOU seme is needed.',
      mechanisms:['INDEX'],
      active:['4a'],
      semantic:[],
      routes:[],
      operators:[{type:'index',node:'4a',label:'@A'}],
      notation:'R4a@A   =   ALIVE@ADDRESSEE'
    },
    from:{
      title:'FROM — ORDER gets polarity',
      problem:'TO and FROM collapsed because ORDER + PLACE supplied a dimension but not which direction along it.',
      reading:'ORDER− marks the negative/source direction along the PLACE dimension. The opposite polarity gives the corresponding goal/toward relation.',
      mechanisms:['ORDER POLARITY','ROUTED BOND'],
      active:['2c','3a'],
      semantic:[['2c','3a']],
      routes:[['2c','2b','2a','3a']],
      operators:[{type:'polarity',node:'2c',label:'−'}],
      notation:'R2c−—R3a   =   ORDER−—PLACE'
    },
    when:{
      title:'WHEN — query TIME directly',
      problem:'WHEN previously needed TIME + NEGATION + KNOW + SIGN and was both semantically awkward and geometrically blocked.',
      reading:'A query halo on TIME is sufficient. Questionhood is an utterance operation, not another semantic atom.',
      mechanisms:['QUERY'],
      active:['2d'],
      semantic:[],
      routes:[],
      operators:[{type:'query',node:'2d'}],
      notation:'?R2d   =   ?TIME'
    },
    day:{
      title:'DAY / YEAR — measured TIME',
      problem:'DAY and YEAR shared the same TIME + SIZE skeleton, leaving no native way to distinguish exact conventional durations.',
      reading:'Attach a quantitative payload to TIME. The semantic primitive stays TIME; the exact scalar belongs to the notation layer.',
      mechanisms:['MEASURE'],
      active:['2d'],
      semantic:[],
      routes:[],
      operators:[{type:'measure',node:'2d',label:'#'}],
      notation:'R2d #(duration)   =   TIME with a measure payload'
    },
    right:{
      title:'RIGHT — split the English senses',
      problem:'The English dictionary entry mixes truth, acceptability, and directional senses.',
      reading:'Do not force one spelling into one concept. TRUE is KNOW—EXIST; acceptable/good can be VALUE; spatial right is an oriented PLACE/ORDER construction.',
      mechanisms:['POLYSEMY SPLIT','ROUTED BOND'],
      active:['4c','1e'],
      semantic:[['4c','1e']],
      routes:[['4c','4d','3d','2d','1d','1e']],
      operators:[],
      notation:'sense 1: KNOW—EXIST   ·   sense 2: VALUE   ·   sense 3: oriented ORDER—PLACE'
    },
    people:{
      title:'PEOPLE — do not grammaticalize “human” into the primitive set',
      problem:'The English gloss “human beings” pressured the inventory to distinguish humans from every other living thing.',
      reading:'For this corpus probe, MANY—ALIVE captures the relevant semantic core. A later PERSON concept may be conventionalized compositionally if the language needs a narrower category.',
      mechanisms:['NORMALIZATION','ROUTED BOND'],
      active:['2b','4a'],
      semantic:[['2b','4a']],
      routes:[['2b','3b','4b','4a']],
      operators:[],
      notation:'semantic: R2b—R4a   =   MANY—ALIVE'
    }
  };

  const svg=document.getElementById('previewSvg');
  const base=document.getElementById('baseLayer');
  const route=document.getElementById('routeLayer');
  const nodes=document.getElementById('nodeLayer');
  const ops=document.getElementById('operatorLayer');
  const select=document.getElementById('exampleSelect');
  const notation=document.getElementById('notation');
  const title=document.getElementById('exampleTitle');
  const problem=document.getElementById('exampleProblem');
  const reading=document.getElementById('exampleReading');
  const mechanisms=document.getElementById('mechanisms');
  const toggleButtons=[...document.querySelectorAll('[data-view]')];
  let view='physical';

  function make(tag,attrs={}){
    const el=document.createElementNS(NS,tag);
    for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
    return el;
  }

  function angle(i){return (-90+i*60)*Math.PI/180}
  function point(r,i){
    const a=angle(i);
    return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};
  }
  function parse(id){
    return{r:Number(id[0])-1,i:letters.indexOf(id[1])};
  }
  function pos(id){
    const p=parse(id);return point(radii[p.r],p.i);
  }

  function drawBase(){
    base.replaceChildren();
    for(let i=0;i<6;i++){
      const p=point(radii[3]+22,i);
      base.appendChild(make('line',{x1:cx,y1:cy,x2:p.x,y2:p.y,class:'spoke'}));
    }
    for(const r of radii)base.appendChild(make('circle',{cx,cy,r,class:'ring'}));
  }

  function allNodeIds(){
    const out=[];
    for(let r=0;r<4;r++)for(let i=0;i<6;i++)out.push(String(r+1)+letters[i]);
    return out;
  }

  function render(){
    const ex=examples[select.value];
    title.textContent=ex.title;
    problem.textContent=ex.problem;
    reading.textContent=ex.reading;
    notation.textContent=ex.notation;
    mechanisms.replaceChildren();
    for(const m of ex.mechanisms){
      const s=document.createElement('span');s.textContent=m;mechanisms.appendChild(s);
    }

    const active=new Set(ex.active);
    nodes.replaceChildren();
    route.replaceChildren();
    ops.replaceChildren();

    if(view==='physical'){
      for(const path of ex.routes){
        const pts=path.map(pos);
        const d=pts.map((p,i)=>(i?'L':'M')+' '+p.x+' '+p.y).join(' ');
        route.appendChild(make('path',{d,class:'route'}));
      }
    }else{
      for(const [a,b] of ex.semantic){
        const A=pos(a),B=pos(b);
        route.appendChild(make('line',{x1:A.x,y1:A.y,x2:B.x,y2:B.y,class:'semantic-edge'}));
      }
    }

    for(const id of allNodeIds()){
      const p=parse(id), xy=pos(id);
      const g=make('g',{class:'node'+(active.has(id)?' active':'')});
      g.setAttribute('transform','translate('+xy.x+' '+xy.y+')');
      g.appendChild(make('circle',{r:25}));
      const addr=make('text',{x:0,y:-7,class:'addr'});addr.textContent='R'+id;
      const label=make('text',{x:0,y:7});
      const word=semes[p.r][p.i];
      label.textContent=word.length>9?word.slice(0,8)+'…':word;
      g.append(addr,label);
      nodes.appendChild(g);
    }

    for(const op of ex.operators){
      const p=pos(op.node);
      if(op.type==='query'){
        ops.appendChild(make('circle',{cx:p.x,cy:p.y,r:34,class:'operator-halo'}));
        const t=make('text',{x:p.x+27,y:p.y-25,class:'operator-text'});t.textContent='?';ops.appendChild(t);
      }else{
        const x=p.x+28,y=p.y-26;
        ops.appendChild(make('circle',{cx:x,cy:y,r:15,class:'operator-badge'}));
        const t=make('text',{x,y:y+1,class:'operator-text'});t.textContent=op.label;ops.appendChild(t);
      }
    }
  }

  for(const [key,ex] of Object.entries(examples)){
    const o=document.createElement('option');o.value=key;o.textContent=ex.title.split(' — ')[0];select.appendChild(o);
  }
  select.value='on';
  select.addEventListener('change',render);
  toggleButtons.forEach(btn=>btn.addEventListener('click',()=>{
    view=btn.dataset.view;
    toggleButtons.forEach(b=>b.classList.toggle('active',b===btn));
    render();
  }));

  drawBase();
  render();
})();