'use strict';

function toggleMobileMenu(force) {
  const menu = document.getElementById('mobile-menu-dropdown');
  const button = document.getElementById('mobile-menu-btn');
  const open = typeof force === 'boolean' ? force : menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !document.getElementById('mobile-menu-dropdown').classList.contains('hidden')) {
    toggleMobileMenu(false);
    document.getElementById('mobile-menu-btn').focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('header')) toggleMobileMenu(false);
});

function checkLiveStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Almaty', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now);
  const part = name => parts.find(value => value.type === name).value;
  const weekday = !['Sat', 'Sun'].includes(part('weekday'));
  const minutes = Number(part('hour')) * 60 + Number(part('minute'));
  const lunch = weekday && minutes >= 840 && minutes < 900;
  const open = weekday && minutes >= 600 && minutes < 1140 && !lunch;
  const text = open ? `Открыто · до ${minutes < 840 ? '14:00' : '19:00'}` : lunch ? 'Обед · откроемся в 15:00' : part('weekday') === 'Sat' ? 'Суббота · приём по договорённости' : 'Сейчас закрыто · можно написать в WhatsApp';
  const badge = document.getElementById('live-status-badge');
  badge.textContent = text;
  badge.className = 'shop-status ' + (open ? 'is-open' : 'is-closed');
}
checkLiveStatus();
setInterval(checkLiveStatus, 60000);

function filterServices(category, button) {
  document.querySelectorAll('.service-tab-btn').forEach(tab => {
    const selected = tab === button;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('.service-card').forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  });
}

const quickProblems = {
  'Телевизор': ['Нет изображения', 'Не включается', 'Перезагружается'],
  'Смартфон': ['Разбит экран', 'Не заряжается', 'Быстро садится'],
  'Ноутбук / ПК': ['Перегревается', 'Не включается', 'Медленно работает'],
  'Аудиотехника': ['Нет звука', 'Хрипит', 'Не включается'],
  'Принтер / МФУ': ['Не берёт бумагу', 'Пачкает листы', 'Не печатает'],
  'Другая техника': ['Не включается', 'Работает нестабильно']
};
function pickQuickIssue(button) {
  document.getElementById('quick-issue-desc').value = button.textContent;
  clearQuickError();
  document.getElementById('quick-issue-desc').focus();
}
function clearQuickError() {
  const error = document.getElementById('quick-error');
  error.hidden = true;
  document.getElementById('quick-issue-desc').setAttribute('aria-invalid', 'false');
}
document.getElementById('quick-issue-desc').addEventListener('input', clearQuickError);
function updateQuickChips() {
  const list = document.getElementById('quick-issue-chips');
  list.replaceChildren();
  quickProblems[document.getElementById('quick-device-type').value].forEach(text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.onclick = () => pickQuickIssue(button);
    list.appendChild(button);
  });
  document.getElementById('quick-issue-desc').value = '';
  clearQuickError();
}
function submitQuickConsultation(event) {
  event.preventDefault();
  const device = document.getElementById('quick-device-type').value;
  const issue = document.getElementById('quick-issue-desc').value.trim();
  const model = document.getElementById('quick-model').value.trim();
  if (!issue) {
    const error = document.getElementById('quick-error');
    error.textContent = 'Коротко опишите проблему или выберите её из списка.';
    error.hidden = false;
    document.getElementById('quick-issue-desc').setAttribute('aria-invalid', 'true');
    document.getElementById('quick-issue-desc').focus();
    return;
  }
  clearQuickError();
  const message = `Здравствуйте! Нужна консультация по ремонту.\nТехника: ${device}${model ? `\nМодель: ${model}` : ''}\nПроблема: ${issue}\nПодскажите, когда можно привезти технику на диагностику?`;
  window.open(`https://wa.me/77053304436?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

// Record contact intent, without collecting form text, models or phone numbers.
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || location.hostname !== 'lemonramis.github.io') return;
  const channel = link.href.startsWith('tel:') ? 'phone' : link.href.startsWith('https://wa.me/') ? 'whatsapp' : null;
  if (!channel) return;
  if (typeof gtag === 'function') gtag('event', 'contact_click', { contact_channel: channel });
  if (typeof ym === 'function') ym(99598032, 'reachGoal', 'contact_' + channel);
});
