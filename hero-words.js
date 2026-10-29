(() => {
  const word = document.querySelector('.hero-word');
  if (!word) return;
  const words = JSON.parse(word.dataset.words);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let timer, index = 0, count = words[0].length, deleting = true;
  const schedule = delay => { timer = setTimeout(tick, delay); };
  function tick() {
    if (motion.matches || document.hidden) return;
    const current = words[index];
    count += deleting ? -1 : 1;
    word.textContent = current.slice(0, count);
    if (deleting && count === 0) {
      index = (index + 1) % words.length;
      deleting = false;
      schedule(350);
    } else if (!deleting && count === current.length) {
      deleting = true;
      schedule(2700);
    } else schedule(deleting ? 55 : 105);
  }
  function reset() {
    clearTimeout(timer);
    index = 0; count = words[0].length; deleting = true;
    word.textContent = words[0];
    if (!motion.matches && !document.hidden) schedule(2900);
  }
  motion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  reset();
})();
