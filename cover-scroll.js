(() => {
 document.querySelectorAll('.bee .cover-browser-screen,.sw .cover-preview-viewport').forEach(screen => {
 const image = screen.querySelector('img');
 if (!image) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let distance = 0, start = null, frame = 0, visible = false;
 function measure() {
   distance = Math.max(0, screen.scrollHeight - screen.clientHeight) * (screen.closest('.sw') ? .64 : .5);
 }
 function tick(now) {
   if (!visible || motion.matches || document.hidden) { frame = 0; return; }
   if (start === null) start = now;
   const sw = !!screen.closest('.sw');
   const duration=sw?27:21;
   const t=((now-start)/1000)%duration;
   const stops=sw
     ? [[0,0],[2.8,0],[3.6,.10],[5.2,.10],[6.2,.34],[8,.34],[8.55,.43],[10,.43],[11.1,.65],[13.6,.65],[14.1,.72],[16,.72],[17.3,1],[26,1],[27,1]]
     : [[0,0],[1.2,0],[1.65,.18],[2.7,.18],[3.15,.37],[4.3,.37],[4.65,.30],[6.1,.30],[6.65,.57],[8,.57],[8.4,.75],[10.1,.75],[10.8,1],[20,1],[21,1]];
   let progress=0;
   for(let i=1;i<stops.length;i++){
     if(t<=stops[i][0]){
       const a=stops[i-1],b=stops[i];
       const x=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));
       const eased=1-Math.pow(1-x,3);
       progress=a[1]+(b[1]-a[1])*eased;
       break;
     }
   }
   screen.scrollTop=distance*progress;
   image.style.opacity=String(Math.min(1,t/.35,(duration-t)/.45));
   frame = requestAnimationFrame(tick);
 }
 function resume() {
   if (visible && !motion.matches && !document.hidden && !frame) {
     start = null;
     measure();
     frame = requestAnimationFrame(tick);
   }
 }
 image.addEventListener('load', () => { measure(); resume(); });
 new ResizeObserver(measure).observe(screen);
 new IntersectionObserver(entries => {
   visible = entries[0].isIntersecting;
   if (!visible) { cancelAnimationFrame(frame); frame = 0; }
   else resume();
 }).observe(screen);
 motion.addEventListener('change', () => {
   if (motion.matches) { cancelAnimationFrame(frame); frame = 0; screen.scrollTop = 0; }
   else resume();
 });
 document.addEventListener('visibilitychange', resume);
 measure();
 });
})();
