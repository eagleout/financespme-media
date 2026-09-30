const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const clip=(v,n)=>String(v??'').trim().slice(0,n);

module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Méthode non autorisée.'});}
  const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(body.website) return res.status(200).json({message:'Merci.'});

  const nom=clip(body.nom,120), email=clip(body.email,254), sujet=clip(body.sujet,160), message=clip(body.message,5000);
  const entreprise=clip(body.entreprise,160), telephone=clip(body.telephone,80), ca=clip(body.ca,100), kind=clip(body.form_kind,40)||'contact';
  if(!nom||!EMAIL_RE.test(email)||!message) return res.status(400).json({error:'Merci de vérifier les champs obligatoires.'});

  const apiKey=process.env.RESEND_API_KEY;
  const to=process.env.CONTACT_TO_EMAIL;
  const from=process.env.CONTACT_FROM_EMAIL;
  if(!apiKey||!to||!from) return res.status(503).json({error:'Service de contact en cours de configuration.'});

  const rows=[
    ['Type',kind],['Nom',nom],['Entreprise',entreprise],['E-mail',email],['Téléphone',telephone],['CA',ca],['Sujet',sujet]
  ].filter(([,v])=>v).map(([k,v])=>`<tr><td style="padding:8px 12px;font-weight:700">${esc(k)}</td><td style="padding:8px 12px">${esc(v)}</td></tr>`).join('');
  const html=`<div style="font-family:Arial,sans-serif;color:#18222d"><h2>Nouvelle demande FinancesPME</h2><table style="border-collapse:collapse">${rows}</table><h3>Message</h3><p style="white-space:pre-wrap">${esc(message)}</p></div>`;

  try{
    const rr=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({from,to:[to],reply_to:email,subject:`[FinancesPME] ${sujet||kind}`,html})
    });
    if(!rr.ok){console.error('Resend contact error',rr.status);return res.status(502).json({error:'Envoi momentanément indisponible.'});}
    return res.status(200).json({message:'Merci, votre demande a bien été envoyée.'});
  }catch(e){console.error('Contact transport error');return res.status(502).json({error:'Envoi momentanément indisponible.'});}
};