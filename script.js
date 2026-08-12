const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const calendarType = document.getElementById('calendarType');
const leapMonthLabel = document.getElementById('leapMonthLabel');

function syncLeapMonth() {
  if (!calendarType || !leapMonthLabel) return;
  const lunar = calendarType.value === 'lunar';
  leapMonthLabel.style.display = lunar ? 'flex' : 'none';
  if (!lunar) {
    const checkbox = document.getElementById('isLeapMonth');
    if (checkbox) checkbox.checked = false;
  }
}
if (calendarType) {
  calendarType.addEventListener('change', syncLeapMonth);
  syncLeapMonth();
}

function normalizeLang(value) {
  const v = (value || '').toLowerCase();
  if (v.startsWith('zh')) return 'zh';
  if (v.startsWith('ja')) return 'ja';
  if (v.startsWith('ko')) return 'ko';
  if (v.startsWith('vi')) return 'vi';
  if (v.startsWith('tl') || v.startsWith('fil')) return 'tl';
  if (v.startsWith('en')) return 'en';
  return 'ko';
}

function currentUiLang() {
  return normalizeLang(window.__LUMEN_LANG__ || localStorage.getItem('lumen-lang') || document.documentElement.lang || 'ko');
}

function guardianLabel(lang) {
  return ({ko:'가디언',en:'Guardian',ja:'ガーディアン',tl:'Guardian',vi:'Guardian',zh:'Guardian'})[normalizeLang(lang)] || 'Guardian';
}

function ensureGuardianNav() {
  const nav = document.querySelector('.main-fortune-nav');
  if (!nav || nav.querySelector('a[href="/guardian"],a[href="/guardian.html"]')) return;
  const link = document.createElement('a');
  link.href = '/guardian';
  link.className = 'guardian-nav-link';
  link.textContent = guardianLabel(currentUiLang());
  nav.appendChild(link);
}
ensureGuardianNav();

function dateLabel(value, type, lang) {
  if (lang === 'ko') return value + ({ year: '년', month: '월', day: '일' })[type];
  if (lang === 'ja') return value + ({ year: '年', month: '月', day: '日' })[type];
  if (lang === 'vi') {
    if (type === 'year') return `Năm ${value}`;
    if (type === 'month') return `Tháng ${Number(value)}`;
    return `Ngày ${Number(value)}`;
  }
  if (lang === 'zh') {
    if (type === 'year') return `${value}年`;
    if (type === 'month') return `${Number(value)}月`;
    return `${Number(value)}日`;
  }
  return value;
}

function fillSelect(id, start, end, type, pad = false, selected = null) {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = el.value;
  const lang = currentUiLang();
  el.innerHTML = '';
  for (let n = start; n <= end; n++) {
    const value = pad ? String(n).padStart(2, '0') : String(n);
    const option = document.createElement('option');
    option.value = value;
    option.textContent = dateLabel(value, type, lang);
    if ((prev && value === prev) || (selected !== null && Number(value) === Number(selected))) option.selected = true;
    el.appendChild(option);
  }
}

const birthYear = document.getElementById('birthYear');
const birthMonth = document.getElementById('birthMonth');
const birthDay = document.getElementById('birthDay');

fillSelect('birthYear', 1900, 2050, 'year', false, 1980);
fillSelect('birthMonth', 1, 12, 'month', true, 1);
fillSelect('birthDay', 1, 31, 'day', true, 1);

function daysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function syncBirthDays() {
  if (!birthYear || !birthMonth || !birthDay) return;
  const selectedDay = Number(birthDay.value || 1);
  const maxDay = daysInMonth(birthYear.value, birthMonth.value);
  fillSelect('birthDay', 1, maxDay, 'day', true, Math.min(selectedDay, maxDay));
}

birthYear?.addEventListener('change', syncBirthDays);
birthMonth?.addEventListener('change', syncBirthDays);

function refreshBirthDateLabels(langOverride = null) {
  const lang = normalizeLang(langOverride || currentUiLang());
  [['birthYear', 'year'], ['birthMonth', 'month'], ['birthDay', 'day']].forEach(([id, type]) => {
    const el = document.getElementById(id);
    if (!el) return;
    [...el.options].forEach(option => {
      option.textContent = dateLabel(option.value, type, lang);
    });
  });
}

const time = document.getElementById('birthTime');
if (time) {
  time.innerHTML = '';
  const unknown = document.createElement('option');
  unknown.value = '';
  unknown.textContent = '모름 (태어난 시간)';
  time.appendChild(unknown);
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      time.appendChild(option);
    }
  }
}

document.addEventListener('click', event => {
  const el = event.target.closest('.lang-choice');
  if (!el) return;
  const lang = normalizeLang(el.dataset.lang);
  window.__LUMEN_LANG__ = lang;
  localStorage.setItem('lumen-lang', lang);
  setTimeout(() => {
    refreshBirthDateLabels(lang);
    const guardian = document.querySelector('.guardian-nav-link');
    if (guardian) guardian.textContent = guardianLabel(lang);
  }, 0);
});

window.addEventListener('lumen-language-change', event => {
  refreshBirthDateLabels(event.detail?.lang);
  const guardian = document.querySelector('.guardian-nav-link');
  if (guardian) guardian.textContent = guardianLabel(event.detail?.lang);
});

setTimeout(() => {
  syncBirthDays();
  refreshBirthDateLabels();
  ensureGuardianNav();
}, 80);

const sajuForm = document.getElementById('sajuForm');
if (sajuForm) {
  let langInput = sajuForm.querySelector('input[name="lang"]');
  if (!langInput) {
    langInput = document.createElement('input');
    langInput.type = 'hidden';
    langInput.name = 'lang';
    sajuForm.appendChild(langInput);
  }

  sajuForm.addEventListener('submit', event => {
    const nameInput = document.getElementById('userName');
    if (nameInput) nameInput.value = nameInput.value.trim();

    const year = Number(birthYear?.value);
    const month = Number(birthMonth?.value);
    const day = Number(birthDay?.value);
    const validDate = Number.isInteger(year) && year >= 1900 && year <= 2050 && Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(day) && day >= 1 && day <= daysInMonth(year, month);

    if (!validDate) {
      event.preventDefault();
      alert(currentUiLang() === 'ko' ? '생년월일을 다시 확인해주세요.' : 'Please check the birth date.');
      return;
    }

    langInput.value = currentUiLang();
  });
}

const fortuneNav = document.querySelector('.main-fortune-nav');
const fortuneLinks = fortuneNav ? [...fortuneNav.querySelectorAll('a[href^="#"]')] : [];
const fortuneServices = document.querySelector('.fortune-services');
const serviceCards = fortuneServices ? [...fortuneServices.querySelectorAll('.fortune-service-card')] : [];

function navHeaderHeight() {
  const header = document.querySelector('.fortune-header') || document.querySelector('.site-header');
  return Math.ceil(header?.getBoundingClientRect().height || 0);
}

function setActiveFortune(hash) {
  fortuneLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === hash));
}

function setFocusedCard(hash) {
  serviceCards.forEach(card => card.classList.toggle('focused', `#${card.id}` === hash));
}

function scrollElementBelowHeader(target, gap = 14) {
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.pageYOffset - navHeaderHeight() - gap;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

function goToFortune(hash, updateHash = true) {
  setActiveFortune(hash);
  if (hash === '#analysis') {
    setFocusedCard('');
    const target = document.querySelector('#analysis .analysis-shell') || document.querySelector('#analysis');
    scrollElementBelowHeader(target, 10);
  } else {
    setFocusedCard(hash);
    if (fortuneServices) scrollElementBelowHeader(fortuneServices, 8);
  }
  if (updateHash) history.replaceState(null, '', hash);
}

fortuneLinks.forEach(link => link.addEventListener('click', event => {
  const hash = link.getAttribute('href');
  if (!hash) return;
  event.preventDefault();
  goToFortune(hash, true);
}));

if (location.hash && fortuneLinks.some(link => link.getAttribute('href') === location.hash)) {
  window.addEventListener('load', () => setTimeout(() => goToFortune(location.hash, false), 60), { once: true });
}
