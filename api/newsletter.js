const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Méthode non autorisée.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (clean(body.website, 200)) return json(res, 200, { message: 'Merci.' });

  const email = clean(body.email, 254).toLowerCase();
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

  if (!validEmail(email) || !consent) {
    return json(res, 400, { error: 'Adresse e-mail ou consentement invalide.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return json(res, 503, { error: 'Service newsletter non configuré.' });
  }

  const to = process.env.CONTACT_TO || 'contact@financementspme.fr';
  const from = process.env.CONTACT_FROM || 'FinancesPME <contact@financementspme.fr>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: '[FinancesPME] Nouvelle inscription au Brief',
        text: `Nouvelle inscription au Brief FinancesPME : ${email}\nConsentement newsletter : oui`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#0B1F33"><h2>Nouvelle inscription — Le Brief FinancesPME</h2><p><strong>E-mail :</strong> ${email.replace(/[<>&"']/g, '')}</p><p><strong>Consentement :</strong> oui</p></div>`,
        tags: [
          { name: 'source', value: 'financespme' },
          { name: 'form', value: 'newsletter' }
        ]
      })
    });

    if (!response.ok) {
      console.error('Resend newsletter error', response.status, await response.text());
      return json(res, 502, { error: 'Inscription momentanément indisponible.' });
    }

    return json(res, 200, { message: 'Inscription enregistrée. Bienvenue dans Le Brief FinancesPME.' });
  } catch (error) {
    console.error('Newsletter API error', error);
    return json(res, 500, { error: 'Inscription momentanément indisponible.' });
  }
}
