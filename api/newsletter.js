const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip=(v,n)=>String(v??'').trim().slice(0,n);

module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Méthode non autorisée.'});}
  const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(body.website) return res.status(200).json({message:'Inscription enregistrée.'});
  const email=clip(body.email,254);
  const consent=['on','true','1',true].includes(body.consent);
  if(!EMAIL_RE.test(email)||!consent) return res.status(400).json({error:'Merci de saisir un e-mail valide et de confirmer votre consentement.'});

  const apiKey=process.env.RESEND_API_KEY;
  const audience=process.env.RESEND_AUDIENCE_ID;
  if(!apiKey||!audience) return res.status(503).json({error:'Newsletter en cours de configuration.'});

  try{
    const rr=await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audience)}/contacts`,{
      method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({email,unsubscribed:false})
    });
    if(!rr.ok&&rr.status!==409){console.error('Resend audience error',rr.status);return res.status(502).json({error:'Inscription momentanément indisponible.'});}
    return res.status(200).json({message:'Merci, votre inscription au Brief FinancesPME est enregistrée.'});
  }catch(e){console.error('Newsletter transport error');return res.status(502).json({error:'Inscription momentanément indisponible.'});}
};