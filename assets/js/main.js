
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

  // Representative editorial images across category, guide, tool and institutional pages.
  const editorialImages={
    financement:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&fm=webp&q=82&w=1600',
    tresorerie:'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&fm=webp&q=82&w=1600',
    strategie:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&fm=webp&q=82&w=1600',
    banques:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&fm=webp&q=82&w=1600',
    pme:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&fm=webp&q=82&w=1600',
    outils:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&fm=webp&q=82&w=1600',
    consulting:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&fm=webp&q=82&w=1600',
    editorial:'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&fm=webp&q=82&w=1600'
  };
  const pageVisual=()=>{
    const p=location.pathname;
    if(p.includes('tresorerie')||p.includes('bfr'))return ['tresorerie','Trésorerie et pilotage du besoin en fonds de roulement'];
    if(p.includes('strategie')||p.includes('croissance-externe'))return ['strategie','Réunion de direction autour d’une opération stratégique'];
    if(p.includes('banques'))return ['banques','Analyse financière et relation bancaire'];
    if(p.includes('/pme'))return ['pme','Équipe de PME réunie autour de décisions de gestion'];
    if(p.includes('outils')||p.includes('lexique')||p.includes('dscr'))return ['outils','Analyse de données et indicateurs financiers'];
    if(p.includes('consulting')||p.includes('contact'))return ['consulting','Échange de conseil financier entre professionnels'];
    if(p.includes('financement')||p.includes('preparer-dossier'))return ['financement','Réunion de financement et préparation d’un dossier bancaire'];
    return ['editorial','Environnement de travail professionnel et analyse financière'];
  };
  document.querySelectorAll('.story-visual').forEach(visual=>{
    if(visual.querySelector('img'))return;
    const label=(visual.querySelector('span')?.textContent||'').toLowerCase();
    let key='editorial';
    if(visual.classList.contains('visual-financement')||label.includes('financement'))key='financement';
    else if(visual.classList.contains('visual-tresorerie')||label.includes('trésorerie'))key='tresorerie';
    else if(visual.classList.contains('visual-strategie')||label.includes('stratégie')||label.includes('dossier'))key='strategie';
    const img=document.createElement('img');
    img.src=editorialImages[key];
    img.alt='Illustration éditoriale — '+(visual.querySelector('span')?.textContent||'finance des PME');
    img.loading='lazy';img.decoding='async';img.width=1200;img.height=675;
    visual.prepend(img);
  });
  const [visualKey,visualAlt]=pageVisual();
  const pageHero=document.querySelector('.page-hero');
  if(pageHero){
    const container=pageHero.querySelector('.container');
    if(container&&!container.querySelector('.page-hero-media')){
      const copy=document.createElement('div');copy.className='page-hero-copy';
      while(container.firstChild)copy.appendChild(container.firstChild);
      const figure=document.createElement('figure');figure.className='page-hero-media';
      const img=document.createElement('img');img.src=editorialImages[visualKey];img.alt=visualAlt;img.decoding='async';img.loading='eager';img.fetchPriority='high';img.width=1400;img.height=900;
      figure.appendChild(img);container.classList.add('page-hero-rich');container.append(copy,figure);
    }
  }
  const articleHero=document.querySelector('.article-hero .container');
  if(articleHero&&!articleHero.querySelector('.article-cover')){
    const figure=document.createElement('figure');figure.className='article-cover';
    const img=document.createElement('img');img.src=editorialImages[visualKey];img.alt=visualAlt;img.decoding='async';img.loading='eager';img.fetchPriority='high';img.width=1600;img.height=900;
    figure.appendChild(img);articleHero.appendChild(figure);
  }

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