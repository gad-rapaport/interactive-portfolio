const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = { projects: [], capabilities: [], filter: 'All', history: [], historyIndex: 0, repos: [] };

async function loadJSON(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(`Failed to load ${path}`);
  return r.json();
}

function bootSequence(){
  const root=$('#boot-screen'), log=$('#boot-log'), bar=$('#boot-progress');
  if(!root) return Promise.resolve();
  const lines=['loading product profile…','indexing capabilities…','connecting project graph…','warming visual engine…','portfolio ready.'];
  return new Promise(resolve=>{
    let i=0;
    const tick=()=>{
      if(i<lines.length){
        const d=document.createElement('div'); d.textContent=`> ${lines[i]}`; log.appendChild(d);
        bar.style.width=`${((i+1)/lines.length)*100}%`; i++; setTimeout(tick,120);
      }else{
        setTimeout(()=>{root.classList.add('done');resolve();},180);
      }
    };
    tick();
  });
}

async function init(){
  await bootSequence();
  try{
    [state.capabilities, state.projects] = await Promise.all([
      loadJSON('data/capabilities.json'), loadJSON('data/projects.json')
    ]);
  }catch(e){ console.error(e); }
  renderCapabilities();
  renderProjects();
  setupFilters();
  setupTerminal();
  setupModal();
  setupPalette();
  setupAssistant();
  setupInteractions();
  setupGalaxy();
  loadGitHub();
  setupGSAP();
}

function renderCapabilities(){
  $('#capability-grid').innerHTML = state.capabilities.map(c => `
    <article class="cap-card reveal">
      <div class="icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </article>`).join('');
}

function categories(){ return ['All', ...new Set(state.projects.map(p=>p.category))]; }

function setupFilters(){
  const wrap = $('#project-filters');
  wrap.innerHTML = categories().map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-filter="${c}">${c}</button>`).join('');
  wrap.addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    state.filter=b.dataset.filter;
    $$('.filter-btn').forEach(x=>x.classList.toggle('active',x===b));
    renderProjects();
  });
}

function visualMock(p){
  return `<div class="project-visual ${p.accent||'cyan'}">
    <div class="mock-browser"><div class="mock-lines"><i></i><i></i><i></i><i></i></div></div>
  </div>`;
}

function renderProjects(){
  const items=state.projects.filter(p=>state.filter==='All'||p.category===state.filter);
  $('#project-grid').innerHTML=items.map((p,i)=>`
    <article class="project-card ${p.featured?'featured':''} reveal" data-slug="${p.slug}" tabindex="0">
      ${visualMock(p)}
      <div class="project-content">
        <span class="project-index">0${i+1} / ${p.category.toUpperCase()}</span>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="project-meta"><span>${p.stack.join(' · ')}</span><span class="project-arrow">↗</span></div>
      </div>
    </article>`).join('');
  $$('.project-card').forEach(card=>{
    const open=()=>openProject(card.dataset.slug);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter')open()});
  });
}

function setupModal(){
  $('#modal-close').addEventListener('click',()=>$('#project-modal').close());
  $('#project-modal').addEventListener('click',e=>{if(e.target===$('#project-modal'))$('#project-modal').close()});
}

function openProject(slug){
  const p=state.projects.find(x=>x.slug===slug); if(!p)return;
  $('#modal-content').innerHTML=`
    <div class="modal-visual"></div>
    <div class="modal-inner">
      <div class="modal-kicker">${p.category.toUpperCase()} / CASE STUDY</div>
      <h2>${p.title}</h2>
      <p>${p.summary}</p>
      <div class="tags">${p.stack.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="modal-columns">
        <div class="modal-block"><h4>The problem</h4><p>${p.problem}</p></div>
        <div class="modal-block"><h4>What I built</h4><p>${p.build}</p></div>
      </div>
      ${p.highlights?.length?`<div class="modal-highlights">${p.highlights.map(x=>`<div>✦ ${x}</div>`).join('')}</div>`:''}
      ${p.link?`<a class="modal-link" href="${p.link}" target="_blank" rel="noreferrer">View project on GitHub ↗</a>`:''}
    </div>`;
  $('#project-modal').showModal();
}

async function loadGitHub(){
  try{
    const [user,repos] = await Promise.all([
      fetch('https://api.github.com/users/gad-rapaport').then(r=>r.ok?r.json():Promise.reject(r.status)),
      fetch('https://api.github.com/users/gad-rapaport/repos?sort=updated&per_page=6').then(r=>r.ok?r.json():Promise.reject(r.status))
    ]);
    state.repos=repos;
    const stats=$$('#github-stats strong');
    stats[0].textContent=user.public_repos ?? '—';
    stats[1].textContent=user.followers ?? '—';
    stats[2].textContent=user.following ?? '—';
    $('#repo-feed').innerHTML=repos.slice(0,4).map(r=>`<a class="repo-item" href="${r.html_url}" target="_blank" rel="noreferrer"><strong>${r.name}</strong><p>${r.description||'Public repository'}</p><span>${r.language||'Code'} ↗</span></a>`).join('');
  }catch(e){
    console.warn('GitHub live data unavailable',e);
    $('#repo-feed').innerHTML='<div class="repo-item"><strong>GitHub API unavailable</strong><p>The rest of the portfolio still works normally.</p><span>offline</span></div>';
  }
}

function setupTerminal(){
  const out=$('#terminal-output'), form=$('#terminal-form'), input=$('#terminal-input');
  writeTerm('Portfolio shell v3.1 — type "help" to explore.', 'success');
  form.addEventListener('submit',e=>{e.preventDefault();const cmd=input.value.trim();if(!cmd)return;writeTerm(`gadi@portfolio:~$ ${cmd}`);state.history.push(cmd);state.historyIndex=state.history.length;runCommand(cmd);input.value=''});
  input.addEventListener('keydown',e=>{
    if(e.key==='ArrowUp'){e.preventDefault();state.historyIndex=Math.max(0,state.historyIndex-1);input.value=state.history[state.historyIndex]||''}
    if(e.key==='ArrowDown'){e.preventDefault();state.historyIndex=Math.min(state.history.length,state.historyIndex+1);input.value=state.history[state.historyIndex]||''}
  });
  $('#terminal-clear').addEventListener('click',()=>out.innerHTML='');
  function writeTerm(text,type='output'){const d=document.createElement('div');d.className=`terminal-line ${type}`;d.textContent=text;out.appendChild(d);out.scrollTop=out.scrollHeight}
  window.writeTerm=writeTerm;
}

function runCommand(raw){
  const cmd=raw.toLowerCase().trim();
  const write=window.writeTerm;
  if(cmd==='help') return write('COMMANDS\n  whoami\n  skills\n  skills <android|python|ai|devops>\n  projects\n  projects --android\n  project <slug>\n  stack\n  repos\n  github\n  linkedin\n  contact\n  assistant\n  clear\n  matrix', 'success');
  if(cmd==='whoami'||cmd==='about') return write('Gadi Rapaport — Software Developer building Android products, Python automation, API integrations, AI features and DevOps workflows.','success');
  if(cmd==='stack') return write('Android · Kotlin · Jetpack Compose · Python · REST APIs · Telegram Bot API · AI workflows · Docker · GitHub Actions · Linux · Git','success');
  if(cmd==='skills') return write(state.capabilities.map(c=>`• ${c.title}: ${c.tags.join(', ')}`).join('\n'));
  if(cmd.startsWith('skills ')){
    const q=cmd.slice(7); const list=state.capabilities.filter(c=>(c.title+' '+c.tags.join(' ')).toLowerCase().includes(q));
    return write(list.length?list.map(c=>`${c.title}\n${c.description}\n${c.tags.join(' · ')}`).join('\n\n'):`No skill group found for "${q}"`,list.length?'success':'error');
  }
  if(cmd==='projects') return write(state.projects.map(p=>`${p.slug.padEnd(18)} ${p.title} [${p.category}]`).join('\n'),'success');
  if(cmd.startsWith('projects --')){
    const q=cmd.split('--')[1]; const list=state.projects.filter(p=>p.category.toLowerCase().includes(q));
    return write(list.length?list.map(p=>`${p.slug} — ${p.title}`).join('\n'):`No projects in ${q}`,list.length?'success':'error');
  }
  if(cmd.startsWith('project ')){
    const slug=cmd.slice(8).trim(); const p=state.projects.find(p=>p.slug===slug);
    if(!p)return write(`Project "${slug}" not found. Try: projects`,'error');
    write(`${p.title}\n${p.summary}\nStack: ${p.stack.join(' · ')}`,'success'); openProject(slug); return;
  }
  if(cmd==='repos') return write(state.repos.length?state.repos.slice(0,6).map(r=>`${r.name} — ${r.language||'Code'}`).join('\n'):'Live repository data is not loaded yet.','success');
  if(cmd==='assistant'){write('Scrolling to Portfolio AI…','success');return $('#assistant').scrollIntoView({behavior:'smooth'})}
  if(cmd==='github'){write('Opening GitHub…','success');return window.open('https://github.com/gad-rapaport','_blank')}
  if(cmd==='linkedin'){write('Opening LinkedIn…','success');return window.open('https://www.linkedin.com/in/gad-rapaport-a12988345','_blank')}
  if(cmd==='contact') return write('Email: dshrppury@gmail.com\nGitHub: github.com/gad-rapaport\nLinkedIn: /in/gad-rapaport-a12988345','success');
  if(cmd==='clear'){return $('#terminal-output').innerHTML=''}
  if(cmd==='matrix'){document.body.classList.toggle('matrix-mode');return write('Visual mode toggled. There is no spoon.','success')}
  write(`command not found: ${raw}\nType "help" for available commands.`,'error');
}

function setupAssistant(){
  const messages=$('#assistant-messages'), form=$('#assistant-form'), input=$('#assistant-input');
  addMessage('ai','Ask me about Gadi’s projects, Android work, Python, automation, AI or DevOps. I answer from this portfolio — no external AI API is required.');
  function addMessage(type,text){const d=document.createElement('div');d.className=`message ${type}`;d.innerHTML=`<small>${type==='ai'?'PORTFOLIO AI':'YOU'}</small>${escapeHTML(text).replace(/\n/g,'<br>')}`;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
  function answer(q){
    const s=q.toLowerCase();
    if(/tiptrip|travel|trip/.test(s)){const p=state.projects.find(p=>p.slug==='tiptrip');return `${p.title}: ${p.summary}\n\nBuilt around: ${p.highlights.join(', ')}.`}
    if(/android|kotlin|compose|mobile/.test(s)){const ps=state.projects.filter(p=>p.stack.some(x=>/android|kotlin|compose/i.test(x)));return `Android is one of Gadi’s main product areas. Core tools include Kotlin, Jetpack Compose, Android Studio and product/UI thinking.\n\nRelevant project: ${ps.map(p=>p.title).join(', ')||'TipTrip'}.`}
    if(/python|automation|bot|telegram|api/.test(s)){const c=state.capabilities.filter(c=>/Python|API|Telegram/i.test(c.title)).map(c=>c.title);const ps=state.projects.filter(p=>p.stack.some(x=>/python|automation/i.test(x)));return `Strong areas: ${c.join(', ')}.\n\nRelated projects: ${ps.map(p=>p.title).join(', ')}.`}
    if(/devops|docker|linux|ci|cd|deploy/.test(s)){return 'DevOps capabilities include Docker, GitHub Actions, Linux, CI/CD workflows and delivery thinking. The DevOps Final Project is the clearest portfolio example.'}
    if(/ai|llm|artificial/.test(s)){return 'AI is treated as a product capability rather than a buzzword: assistants, workflow automation, intelligent features and media/content pipelines. TipTrip is an example of AI embedded into a real product experience.'}
    if(/project|work|portfolio/.test(s)){return `Selected work includes:\n${state.projects.map(p=>`• ${p.title} — ${p.category}`).join('\n')}`}
    if(/skill|stack|technology|technologies/.test(s)){return `Core stack:\n${state.capabilities.map(c=>`• ${c.title}: ${c.tags.join(', ')}`).join('\n')}`}
    if(/contact|email|hire/.test(s)){return 'You can reach Gadi by email at dshrppury@gmail.com, or use the GitHub and LinkedIn links in the Contact section.'}
    return 'I can answer about projects, Android, Python, automation, APIs, AI, DevOps, the tech stack or contact information. Try asking “Tell me about TipTrip” or “Which projects use Python?”';
  }
  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;addMessage('user',q);input.value='';setTimeout(()=>addMessage('ai',answer(q)),160)});
  $('#assistant-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const q=b.dataset.q;addMessage('user',q);setTimeout(()=>addMessage('ai',answer(q)),120)});
  window.openAssistant=()=>{$('#assistant').scrollIntoView({behavior:'smooth'});setTimeout(()=>input.focus(),550)};
}

function escapeHTML(str){return str.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function setupPalette(){
  const root=$('#command-palette'), input=$('#palette-input'), results=$('#palette-results');
  let items=[],active=0;
  const base=()=>[
    {label:'About',hint:'Section',action:()=>go('#about')},{label:'Capabilities',hint:'Section',action:()=>go('#capabilities')},{label:'Projects',hint:'Section',action:()=>go('#projects')},{label:'Live GitHub',hint:'Section',action:()=>go('#github')},{label:'Portfolio AI',hint:'Section',action:()=>go('#assistant')},{label:'Terminal',hint:'Section',action:()=>go('#terminal')},{label:'Contact',hint:'Section',action:()=>go('#contact')},
    ...state.projects.map(p=>({label:p.title,hint:p.category,action:()=>openProject(p.slug)}))
  ];
  function go(id){close();document.querySelector(id).scrollIntoView({behavior:'smooth'})}
  function render(){const q=input.value.toLowerCase();items=base().filter(x=>(x.label+' '+x.hint).toLowerCase().includes(q));active=Math.min(active,Math.max(0,items.length-1));results.innerHTML=items.map((x,i)=>`<div class="palette-item ${i===active?'active':''}" data-i="${i}"><span>${x.label}</span><small>${x.hint}</small></div>`).join('')}
  function open(){root.hidden=false;input.value='';render();setTimeout(()=>input.focus(),0)}
  function close(){root.hidden=true}
  $('#open-command').addEventListener('click',open);
  $('.palette-backdrop').addEventListener('click',close);
  input.addEventListener('input',()=>{active=0;render()});
  input.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(items.length-1,active+1);render()}if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(0,active-1);render()}if(e.key==='Enter'&&items[active])items[active].action()});
  results.addEventListener('click',e=>{const row=e.target.closest('.palette-item');if(row)items[+row.dataset.i].action()});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();root.hidden?open():close()}if(e.key==='Escape'&&!root.hidden)close()});
}

function setupInteractions(){
  document.addEventListener('pointermove',e=>{const g=$('.cursor-glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
  $('#hero-terminal').addEventListener('click',()=>{$('#terminal').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#terminal-input').focus(),500)});
  $('#hero-assistant').addEventListener('click',()=>window.openAssistant());
}

function setupGSAP(){
  if(!window.gsap)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-badge,.hero-kicker',{opacity:0,y:12,duration:.7,stagger:.08});
  gsap.from('.hero h1',{opacity:0,y:35,duration:1,delay:.1,ease:'power3.out'});
  gsap.from('.hero-copy,.hero-actions,.stack-strip',{opacity:0,y:18,duration:.8,stagger:.1,delay:.25});
  gsap.from('.hero-console',{opacity:0,x:35,rotateY:-12,duration:1.1,delay:.25,ease:'power3.out'});
  gsap.utils.toArray('.section').forEach(sec=>gsap.from(sec.children,{scrollTrigger:{trigger:sec,start:'top 84%'},opacity:0,y:24,duration:.72,stagger:.07,ease:'power2.out'}));
}

function setupGalaxy(){
  if(!window.THREE)return;
  const canvas=$('#galaxy');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,100);camera.position.z=9;
  const count=innerWidth<700?900:1900;const geo=new THREE.BufferGeometry();const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){const r=2.5+Math.random()*8,a=Math.random()*Math.PI*2,z=(Math.random()-.5)*8;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r*.55;pos[i*3+2]=z}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({size:.026,color:0x83dfff,transparent:true,opacity:.72,depthWrite:false});
  const pts=new THREE.Points(geo,mat);scene.add(pts);
  let mx=0,my=0;document.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)});
  function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)}window.addEventListener('resize',resize);resize();
  function loop(t){pts.rotation.z=t*.000035;pts.rotation.y+=(mx*.18-pts.rotation.y)*.02;pts.rotation.x+=(-my*.08-pts.rotation.x)*.02;renderer.render(scene,camera);requestAnimationFrame(loop)}requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded',init);
