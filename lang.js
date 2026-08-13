/* Переключатель языков и однократное автоопределение.
   RU живет в корне, EN — в /en/. Выбор пользователя запоминается и больше не переопределяется. */
(function () {
  var path = location.pathname.replace(/index\.html$/, '');
  var isEn = /^\/en\//.test(path) || path === '/en';
  var file = (path.replace(/^\/en/, '').replace(/^\//, '') || 'index.html');
  if (!/\.html$/.test(file)) file = 'index.html';
  var ruUrl = '/' + (file === 'index.html' ? '' : file);
  var enUrl = '/en/' + (file === 'index.html' ? '' : file);

  // 1) переключатель. Стили внутри файла: главная страница не подключает case.css
  var css = document.createElement('style');
  css.textContent =
    '.langsw{position:fixed;right:20px;bottom:20px;z-index:1000;display:flex;gap:2px;' +
    'background:#fff;border:1px solid #e3e4e8;border-radius:999px;padding:4px;' +
    'font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;' +
    'box-shadow:0 6px 20px rgba(0,0,0,.10)}' +
    '.langsw a{display:block;padding:7px 14px;border-radius:999px;font-size:15px;font-weight:600;' +
    'color:#6b7280;text-decoration:none;line-height:1}' +
    '.langsw a[aria-current]{background:#1d1d1f;color:#fff}' +
    '.langsw a:not([aria-current]):hover{color:#000}' +
    '@media (max-width:640px){.langsw{right:12px;bottom:12px}.langsw a{padding:6px 12px;font-size:14px}}';
  (document.head || document.documentElement).appendChild(css);

  var box = document.createElement('div');
  box.className = 'langsw';
  box.innerHTML = '<a href="' + ruUrl + '" data-lang="ru"' + (isEn ? '' : ' aria-current="true"') + '>RU</a>' +
                  '<a href="' + enUrl + '" data-lang="en"' + (isEn ? ' aria-current="true"' : '') + '>EN</a>';
  function mount() { document.body.appendChild(box); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  box.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (a) { try { localStorage.setItem('lang', a.dataset.lang); } catch (err) {} }
  });

  // 2) автоопределение — только если человек еще не выбирал сам
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (err) {}
  if (saved) {
    if (saved === 'en' && !isEn) location.replace(enUrl);
    if (saved === 'ru' && isEn) location.replace(ruUrl);
    return;
  }
  var wantsRu = (navigator.languages || [navigator.language || ''])
    .some(function (l) { return /^(ru|be|kk|uk|uz|ky|hy|az|tg)/i.test(l); });
  if (!wantsRu && !isEn) location.replace(enUrl);
  if (wantsRu && isEn) location.replace(ruUrl);
})();


/* Возврат с кейса на главную: доскроллили до блока — убираем якорь из адреса.
   WHY: #stenn в строке браузера выглядит как отдельная страница, хотя это блок главной. */
(function () {
  if (!location.hash) return;
  var id = location.hash.slice(1);
  if (!/^[a-z]+$/.test(id) || !document.getElementById(id)) return;
  function clean() {
    if (!location.hash) return;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  // ждем, пока браузер сам доскроллит до якоря, и только потом чистим адрес
  window.addEventListener('load', function () { setTimeout(clean, 400); });
  setTimeout(clean, 1500);
})();
