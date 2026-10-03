
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

  document.querySelectorAll('.js-api-form').forEach(form=>{
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const endpoint=form.dataset.apiForm;
      const status=form.querySelector('.form-status');
      const button=form.querySelector('button[type="submit"]');
      const data=Object.fromEntries(new FormData(form).entries());
      data.form_kind=form.dataset.formKind||'contact';
      if(status){status.className='form-status';status.textContent='Envoi en cours…';}
      if(button){button.disabled=true;button.setAttribute('aria-busy','true');}
      try{
        const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
        const body=await res.json().catch(()=>({}));
        if(!res.ok) throw new Error(body.error||'Envoi impossible');
        if(status){status.className='form-status is-success';status.textContent=body.message||'Merci, votre demande a bien été envoyée.';}
        form.reset();
      }catch(err){
        if(status){
          status.className='form-status is-error';
          const fallback=form.dataset.fallbackEmail;
          if(fallback){status.innerHTML=`L’envoi automatique est momentanément indisponible. <a href="mailto:${fallback}">Écrire directement par e-mail</a>.`;}
          else{status.textContent='Inscription momentanément indisponible. Réessayez dans quelques instants.';}
        }
      }finally{
        if(button){button.disabled=false;button.removeAttribute('aria-busy');}
      }
    });
  });
  const banner=document.querySelector('[data-cookie-banner]'), ok=document.querySelector('[data-cookie-ok]'), cookieKey='fpm_cookie_notice';
  if(banner){
    let accepted=false;
    try{accepted=localStorage.getItem(cookieKey)==='1';}catch(_){}
    banner.hidden=accepted;
    if(!accepted) banner.hidden=false;
  }
  if(ok&&banner){
    ok.addEventListener('click',()=>{
      try{localStorage.setItem(cookieKey,'1');}catch(_){}
      banner.classList.add('is-hiding');
      window.setTimeout(()=>{banner.hidden=true;banner.classList.remove('is-hiding');},210);
    });
  }
})();