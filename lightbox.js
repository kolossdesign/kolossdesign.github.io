/* Увеличение картинок по клику в блоках .shots.zoomable.
   WHY: страницы статические, без сборки — один самодостаточный файл без зависимостей. */
(function () {
  var imgs = [].slice.call(document.querySelectorAll('.shots.zoomable img'));
  if (!imgs.length) return;

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML =
    '<img alt="">' +
    '<button class="lb__btn lb__prev" aria-label="Предыдущая">‹</button>' +
    '<button class="lb__btn lb__next" aria-label="Следующая">›</button>' +
    '<button class="lb__btn lb__close" aria-label="Закрыть">✕</button>' +
    '<div class="lb__count"></div>';
  document.body.appendChild(lb);

  var big = lb.querySelector('img');
  var count = lb.querySelector('.lb__count');
  var i = 0;

  function show(n) {
    i = (n + imgs.length) % imgs.length;
    big.src = imgs[i].currentSrc || imgs[i].src;
    count.textContent = (i + 1) + ' / ' + imgs.length;
  }
  function open(n) {
    show(n);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    big.removeAttribute('src');
  }

  imgs.forEach(function (im, n) {
    im.addEventListener('click', function () { open(n); });
  });
  lb.querySelector('.lb__prev').addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
  lb.querySelector('.lb__next').addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });
  lb.querySelector('.lb__close').addEventListener('click', close);
  // клик по фону закрывает, клик по самой картинке — нет
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

/* Мокап браузера: свой ползунок на pointer-событиях + внутренняя прокрутка.
   WHY: input[type=range] в вертикальной ориентации работает не во всех браузерах – был неподвижен. */
(function () {
  [].slice.call(document.querySelectorAll('.macbox')).forEach(function (box) {
    var sc = box.querySelector('.mac__scroll');
    var rail = box.querySelector('.macslider');
    var thumb = box.querySelector('.macslider__thumb');
    if (!sc || !rail || !thumb) return;

    function vertical() { return rail.clientHeight > rail.clientWidth; }
    function maxScroll() { return Math.max(1, sc.scrollHeight - sc.clientHeight); }
    function freeRail() {
      return vertical() ? Math.max(1, rail.clientHeight - thumb.offsetHeight)
                        : Math.max(1, rail.clientWidth - thumb.offsetWidth);
    }
    function paint() {
      var k = sc.scrollTop / maxScroll();
      if (vertical()) { thumb.style.top = (k * freeRail()) + 'px'; thumb.style.left = '-3px'; }
      else { thumb.style.left = (k * freeRail()) + 'px'; thumb.style.top = '-3px'; }
    }
    function setFromPoint(e) {
      var r = rail.getBoundingClientRect();
      var k = vertical()
        ? (e.clientY - r.top - thumb.offsetHeight / 2) / freeRail()
        : (e.clientX - r.left - thumb.offsetWidth / 2) / freeRail();
      k = Math.min(1, Math.max(0, k));
      sc.scrollTop = k * maxScroll();
      paint();
    }

    var dragging = false;
    thumb.addEventListener('pointerdown', function (e) {
      dragging = true; thumb.setPointerCapture(e.pointerId); e.preventDefault();
    });
    thumb.addEventListener('pointermove', function (e) { if (dragging) setFromPoint(e); });
    thumb.addEventListener('pointerup', function () { dragging = false; });
    thumb.addEventListener('pointercancel', function () { dragging = false; });
    // клик по дорожке — прыжок в эту точку
    rail.addEventListener('pointerdown', function (e) { if (e.target !== thumb) setFromPoint(e); });

    sc.addEventListener('scroll', function () { if (!dragging) paint(); }, { passive: true });
    window.addEventListener('resize', paint);
    if (sc.querySelector('img') && !sc.querySelector('img').complete) {
      sc.querySelector('img').addEventListener('load', paint);
    }
    paint();
  });
})();
