
(() => {
  const menuBtn=document.querySelector('.menu-toggle'), nav=document.querySelector('.main-nav');
  if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});}
  const panel=document.querySelector('[data-search-panel]'), openBtn=document.querySelector('[data-search-open]'), closeBtn=document.querySelector('[data-search-close]'), input=document.getElementById('site-search'), results=document.getElementById('search-results');
  const close=()=>{if(panel){panel.hidden=true;document.body.style.overflow='';}};
  if(openBtn&&panel){openBtn.addEventListener('click',()=>{panel.hidden=false;document.body.style.overflow='hidden';setTimeout(()=>input&&input.focus(),10);});}
  if(closeBtn) closeBtn.addEventListener('click',close);
  if(panel) panel.addEventListener('click',e=>{if(e.target===panel)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  if(input&&results){input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase(); if(q.length<2){results.innerHTML='<div class="search-result"><span>Saisissez au moins 2 caractères.</span></div>';return;} const items=(window.SEARCH_INDEX||[]).filter(x=>(x.title+' '+x.text+' '+x.category).toLowerCase().includes(q)).slice(0,8); results.innerHTML=items.length?items.map(x=>`<a class="search-result" href="${x.url}"><strong>${x.title}</strong><span>${x.category} · ${x.text}</span></a>`).join(''):'<div class="search-result"><span>Aucun résultat. Essayez un terme plus large.</span></div>';});}
  const prog=document.querySelector('.progress'); if(prog){const update=()=>{const d=document.documentElement; const max=d.scrollHeight-d.clientHeight; prog.style.width=(max?d.scrollTop/max*100:0)+'%';}; document.addEventListener('scroll',update,{passive:true});update();}
  document.querySelectorAll('.prose h2').forEach((h,i)=>{if(!h.id)h.id='section-'+(i+1);});
  const banner=document.querySelector('[data-cookie-banner]'); const ok=document.querySelector('[data-cookie-ok]'); if(banner&&!localStorage.getItem('fpm_cookie_notice'))banner.hidden=false; if(ok)ok.addEventListener('click',()=>{localStorage.setItem('fpm_cookie_notice','1');banner.hidden=true;});
})();
