/* Увеличение картинок по клику в блоках .shots.zoomable.
   WHY: страницы статические, без сборки — один самодостаточный файл без зависимостей. */
(function () {
  var groups = [].slice.call(document.querySelectorAll('.shots.zoomable'));
  if (!groups.length) return;

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
  var imgs = [];      // текущая галерея — только картинки одного блока
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

  function mobile() { return window.matchMedia('(max-width: 640px)').matches; }
  groups.forEach(function (g) {
    var list = [].slice.call(g.querySelectorAll('img'));
    var single = g.classList.contains('one-img');
    list.forEach(function (im, n) {
      im.addEventListener('click', function () {
        // одиночная картинка на десктопе уже показана во всю ширину — не увеличиваем
        if (single && !mobile()) return;
        imgs = list; open(n);
      });
    });
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

/* Мокап браузера: свой ползунок на pointer-событиях, макет крутится только им.
   WHY: input[type=range] в вертикальной ориентации работает не во всех браузерах,
   а перехват колеса мыши мешал листать саму страницу. */
(function () {
  [].slice.call(document.querySelectorAll('.macbox')).forEach(function (box) {
    var rail = box.querySelector('.macslider');
    var thumb = box.querySelector('.macslider__thumb');
    if (!rail || !thumb) return;

    function sc() {
      return box.querySelector('.macpane:not([hidden]) .mac__scroll') || box.querySelector('.mac__scroll');
    }
    function vertical() { return rail.clientHeight > rail.clientWidth; }
    function maxScroll() { var s = sc(); return Math.max(1, s.scrollHeight - s.clientHeight); }
    function freeRail() {
      return vertical() ? Math.max(1, rail.clientHeight - thumb.offsetHeight)
                        : Math.max(1, rail.clientWidth - thumb.offsetWidth);
    }
    function paint() {
      var k = sc().scrollTop / maxScroll();
      if (vertical()) { thumb.style.top = (k * freeRail()) + 'px'; thumb.style.left = '-4px'; }
      else { thumb.style.left = (k * freeRail()) + 'px'; thumb.style.top = '-4px'; }
    }
    function setFromPoint(e) {
      var r = rail.getBoundingClientRect();
      var k = vertical()
        ? (e.clientY - r.top - thumb.offsetHeight / 2) / freeRail()
        : (e.clientX - r.left - thumb.offsetWidth / 2) / freeRail();
      k = Math.min(1, Math.max(0, k));
      sc().scrollTop = k * maxScroll();
      paint();
    }

    var dragging = false;
    thumb.addEventListener('pointerdown', function (e) {
      dragging = true; thumb.classList.add('is-touched');
      thumb.setPointerCapture(e.pointerId); e.preventDefault();
    });
    thumb.addEventListener('pointermove', function (e) { if (dragging) setFromPoint(e); });
    thumb.addEventListener('pointerup', function () { dragging = false; });
    thumb.addEventListener('pointercancel', function () { dragging = false; });
    rail.addEventListener('pointerdown', function (e) {
      thumb.classList.add('is-touched');
      if (e.target !== thumb) setFromPoint(e);
    });

    // макет двигается только ползунком — и на десктопе, и на тач-устройствах
    [].slice.call(box.querySelectorAll('.mac__scroll')).forEach(function (s) {
      s.addEventListener('scroll', function () { if (!dragging) paint(); }, { passive: true });
      var im = s.querySelector('img');
      if (im && !im.complete) im.addEventListener('load', paint);
    });
    window.addEventListener('resize', paint);

    /* Подсказка: когда блок появляется в кадре, макет сам проматывается вниз
       и возвращается назад — вместе с бегунком. Один раз на мокап. */
    var hinted = false;
    function preview() {
      if (hinted) return;
      hinted = true;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var s = sc();
      var to = Math.min(maxScroll(), Math.max(120, s.clientHeight * 0.45));
      var t0 = null, dur = 1500;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var t = Math.min(1, (ts - t0) / dur);
        // вниз до середины анимации, потом обратно; плавно на концах
        var k = t < 0.5 ? t / 0.5 : (1 - t) / 0.5;
        k = k * k * (3 - 2 * k);
        s.scrollTop = to * k;
        paint();
        if (t < 1) requestAnimationFrame(step);
        else { s.scrollTop = 0; paint(); }
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { preview(); io.disconnect(); }
        });
      }, { threshold: 0.5 });
      io.observe(box);
    }

    paint();
  });
})();

/* «Открыть целиком» — попап поверх страницы вместо новой вкладки.
   WHY: увести человека из кейса на голый файл — потеря контекста. */
(function () {
  var links = [].slice.call(document.querySelectorAll('.mac__hint a[href]'));
  if (!links.length) return;

  var lb = document.createElement('div');
  lb.className = 'lb lb--long';
  lb.innerHTML = '<img alt=""><button class="lb__btn lb__close" aria-label="Закрыть">✕</button>';
  document.body.appendChild(lb);
  var big = lb.querySelector('img');

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    big.removeAttribute('src');
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      big.src = a.getAttribute('href');
      lb.scrollTop = 0;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  lb.querySelector('.lb__close').addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
})();

/* Табы над мокапом: переключают, какой макет лежит в окне браузера. */
(function () {
  [].slice.call(document.querySelectorAll('.mactabs')).forEach(function (tabs) {
    var box = tabs.closest('.macbox');
    if (!box) return;
    var panes = [].slice.call(box.querySelectorAll('.macpane'));
    var btns = [].slice.call(tabs.querySelectorAll('button'));
    btns.forEach(function (btn, n) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b, m) { b.setAttribute('aria-selected', m === n ? 'true' : 'false'); });
        panes.forEach(function (p, m) { p.hidden = m !== n; });
        var pane = panes[n];
        var url = box.querySelector('.mac__url');
        if (url && pane.dataset.url) url.textContent = pane.dataset.url;
        var link = box.querySelector('.mac__hint a');
        if (link && pane.dataset.full) link.setAttribute('href', pane.dataset.full);
        window.dispatchEvent(new Event('resize'));
      });
    });
  });
})();
