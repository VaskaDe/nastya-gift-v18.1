function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function buildMessage(store) {
  const createdAt = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (store.category?.wishlist) {
    const w = store.wishlist;
    return [
      '🎁 <b>GiftOS · новый выбор от Насти</b>',
      '',
      '<b>Категория:</b> Уже знаю, что хочу',
      w.title ? `<b>Название:</b> ${escapeHtml(w.title)}` : null,
      w.link ? `<b>Ссылка:</b> ${escapeHtml(w.link)}` : null,
      w.size ? `<b>Размер:</b> ${escapeHtml(w.size)}` : null,
      w.color ? `<b>Цвет:</b> ${escapeHtml(w.color)}` : null,
      w.comment ? `<b>Комментарий:</b> ${escapeHtml(w.comment)}` : null,
      '',
      `<b>Дата:</b> ${createdAt}`
    ].filter(Boolean).join('\n');
  }

  return [
    '🎁 <b>GiftOS · новый выбор от Насти</b>',
    '',
    `<b>Категория:</b> ${escapeHtml(store.category?.title || '—')}`,
    `<b>Вариант:</b> ${escapeHtml(store.gift?.title || '—')}`,
    store.selectedChips?.size ? `<b>Отметки:</b> ${escapeHtml([...store.selectedChips].join(', '))}` : null,
    store.note ? `<b>Комментарий:</b> ${escapeHtml(store.note)}` : null,
    '',
    `<b>Дата:</b> ${createdAt}`
  ].filter(Boolean).join('\n');
}

export async function submitSelection(store) {
  const message = buildMessage(store);

  const response = await fetch('/api/send-telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Не удалось отправить выбор');
  }

  return message;
}
