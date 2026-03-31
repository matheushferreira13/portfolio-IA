function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function sanitizeLine(value = '') {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

async function sendContactEmail({ name, email, message, language, env }) {
  const resendApiKey = env.RESEND_API_KEY;
  const toEmail = env.CONTACT_TO_EMAIL;
  const fromEmail = env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

  if (!resendApiKey || !toEmail) {
    const error = new Error('EMAIL_NOT_CONFIGURED');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const subject = language === 'en'
    ? `New portfolio message from ${sanitizeLine(name)}`
    : `Nova mensagem do portfolio de ${sanitizeLine(name)}`;

  const text = [
    `Nome: ${sanitizeLine(name)}`,
    `Email: ${sanitizeLine(email)}`,
    '',
    'Mensagem:',
    String(message || '').trim()
  ].join('\n');

  const html = `
    <h2>${language === 'en' ? 'New message from the portfolio' : 'Nova mensagem do portfolio'}</h2>
    <p><strong>Nome:</strong> ${sanitizeLine(name)}</p>
    <p><strong>Email:</strong> ${sanitizeLine(email)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${String(message || '').trim().replace(/\n/g, '<br>')}</p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    const error = new Error(`EMAIL_SEND_FAILED: ${details || response.status}`);
    error.code = 'EMAIL_SEND_FAILED';
    throw error;
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const message = String(body?.message || '').trim();
    const language = String(body?.language || 'pt').toLowerCase() === 'en' ? 'en' : 'pt';

    if (!name || !isValidEmail(email) || message.length < 10) {
      return jsonResponse({ error: 'Dados invalidos no formulario.' }, 400);
    }

    await sendContactEmail({ name, email, message, language, env: context.env });
    return jsonResponse({ ok: true });
  } catch (error) {
    const code = String(error?.code || '');
    if (code === 'EMAIL_NOT_CONFIGURED') {
      return jsonResponse({
        error: 'Canal de email ainda nao configurado no servidor.',
        fallbackEmail: context.env.CONTACT_TO_EMAIL || ''
      }, 503);
    }

    return jsonResponse({
      error: 'Falha ao enviar mensagem de contato.',
      fallbackEmail: context.env.CONTACT_TO_EMAIL || ''
    }, 500);
  }
}
