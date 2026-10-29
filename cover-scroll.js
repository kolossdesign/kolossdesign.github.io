(() => {
 document.querySelectorAll('.bee .cover-browser-screen,.sw .cover-preview-viewport').forEach(screen => {
 const image = screen.querySelector('img');
 if (!image) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const sw = !!screen.closest('.sw');
 let distance = 0, start = null, frame = 0, visible = false;
 function measure() {
   distance = Math.min(Math.max(0,screen.scrollHeight-screen.clientHeight)*.5,screen.clientHeight*(sw?2.7:2.2));
 }
 function tick(now) {
   if (!visible || motion.matches || document.hidden) { frame = 0; return; }
   if (start === null) start = now;
   const duration=sw?25:22;
   const t=((now-start)/1000)%duration;
   // Short wheel-like movements, reading pauses, and an explicit return to the top.
   const stops=sw
     ? [[0,0],[2.8,0],[3.35,.13],[4.3,.13],[4.95,.32],[6.5,.32],[6.9,.43],[8.4,.43],[9.05,.64],[11.2,.64],[11.65,.76],[13.1,.76],[13.8,1],[16.8,1],[19.4,0],[25,0]]
     : [[0,0],[1.8,0],[2.25,.14],[3.3,.14],[3.85,.34],[5.4,.34],[5.8,.46],[6.8,.46],[7.25,.40],[8.8,.40],[9.4,.66],[10.5,.66],[10.95,.79],[12.3,.79],[12.85,1],[15.2,1],[17.3,0],[22,0]];
   let progress=0;
   for(let i=1;i<stops.length;i++){
     if(t<=stops[i][0]){
       const a=stops[i-1],b=stops[i];
       const x=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));
       const returning=b[1]===0&&a[1]===1;
       const eased=returning?x*x*(3-2*x):1-Math.pow(1-x,3);
       progress=a[1]+(b[1]-a[1])*eased;
       break;
     }
   }
   screen.scrollTop=distance*progress;
   image.style.opacity='1';
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
