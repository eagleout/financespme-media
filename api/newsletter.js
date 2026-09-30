const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
const NEWSLETTER_SEGMENT_ID = process.env.RESEND_NEWSLETTER_SEGMENT_ID || 'f5b9c72d-0120-447b-ab1f-a898cd048dc7';

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

  const headers = {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const createContact = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, unsubscribed: false })
    });

    // Un contact peut déjà exister : on tente quand même son rattachement au segment.
    if (!createContact.ok && createContact.status !== 409 && createContact.status !== 422) {
      console.error('Resend contact error', createContact.status, await createContact.text());
      return json(res, 502, { error: 'Inscription momentanément indisponible.' });
    }

    const addToSegment = await fetch(
      `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${NEWSLETTER_SEGMENT_ID}`,
      { method: 'POST', headers }
    );

    if (!addToSegment.ok && addToSegment.status !== 409) {
      console.error('Resend segment error', addToSegment.status, await addToSegment.text());
      return json(res, 502, { error: 'Inscription momentanément indisponible.' });
    }

    return json(res, 200, { message: 'Inscription enregistrée. Bienvenue dans Le Brief FinancesPME.' });
  } catch (error) {
    console.error('Newsletter API error', error);
    return json(res, 500, { error: 'Inscription momentanément indisponible.' });
  }
}
