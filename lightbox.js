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

/* Мокап макбука: ползунок и внутренняя прокрутка синхронизированы.
   WHY: макет высотой ~5000px иначе занимает пол-страницы и мешает читать кейс. */
(function () {
  [].slice.call(document.querySelectorAll('.macbox')).forEach(function (box) {
    var sc = box.querySelector('.mac__scroll');
    var range = box.querySelector('.macslider input');
    if (!sc || !range) return;
    var lock = false;
    function max() { return Math.max(1, sc.scrollHeight - sc.clientHeight); }
    range.addEventListener('input', function () {
      lock = true;
      sc.scrollTop = max() * (range.value / 1000);
      lock = false;
    });
    sc.addEventListener('scroll', function () {
      if (lock) return;
      range.value = Math.round((sc.scrollTop / max()) * 1000);
    }, { passive: true });
    // колесо мыши над экраном прокручивает макет, но не «залипает» на краях
    sc.addEventListener('wheel', function (e) {
      var atTop = sc.scrollTop <= 0 && e.deltaY < 0;
      var atEnd = sc.scrollTop >= max() - 1 && e.deltaY > 0;
      if (!atTop && !atEnd) e.stopPropagation();
    }, { passive: true });
  });
})();
