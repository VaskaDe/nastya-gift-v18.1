export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({
      ok: false,
      error: 'Telegram environment variables are not configured'
    });
  }

  try {
    const body = request.body || {};
    const text = typeof body.text === 'string' ? body.text : '';

    if (!text.trim()) {
      return response.status(400).json({ ok: false, error: 'Empty message' });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      return response.status(502).json({
        ok: false,
        error: 'Telegram request failed',
        details: result
      });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error?.message || 'Unexpected server error'
    });
  }
}
