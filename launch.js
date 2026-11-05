/* Only the public application URL is used. No storage, tokens, forms or API calls. */
(() => {
  'use strict';
  const link = document.getElementById('open-app');
  const note = document.getElementById('launch-note');
  const status = document.getElementById('launch-status');
  const standalone = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  const candidate = document.body.dataset.launchMode === 'bookmark-url';

  // A standalone web app cannot be made into an ordinary Safari tab reliably
  // by a cross-origin JavaScript redirect. Keep an explicit user-activated link.
  if (standalone) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    note.textContent = 'Значок открыт как веб-приложение. Нажмите «Открыть VA Office». Для обычного Safari добавьте значок заново с выключенным «Открыть как веб-приложение».';
    return;
  }
  if (!candidate) return;

  // Experimental candidate: Safari must bookmark the visible current URL.
  // There is no external manifest start_url and no cross-origin iframe.
  // Acceptance of the saved URL and icon is a physical-iPhone test gate.
  const current = new URL(window.location.href);
  if (current.searchParams.get('launch') === '1') {
    note.textContent = 'Открываем VA Office…';
    try {
      window.location.replace(link.href);
    } catch (_) {
      status.hidden = false;
      status.textContent = 'Автоматический переход недоступен. Нажмите «Открыть VA Office».';
    }
    return;
  }
  note.textContent = 'После добавления проверьте запуск значка. Если VA Office не открылся автоматически, нажмите кнопку ниже.';
  if (current.searchParams.get('install') === '1') return;
  current.searchParams.set('launch', '1');
  try {
    window.history.replaceState(null, '', current.href);
  } catch (_) {
    // The ordinary button remains usable if History API is unavailable.
  }
})();
