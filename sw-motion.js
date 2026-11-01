(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.sw-phone-scroll').forEach(viewport => {
  const image = viewport.querySelector('img');
  let visible = false, frame = 0, start = null, distance = 0;
  const stops = [[0,0],[3.6,0],[4.25,.10],[5.7,.10],[6.4,.25],[8.2,.25],[8.9,.43],[10.6,.43],[11.25,.61],[13.2,.61],[13.95,.79],[16,.79],[16.8,1],[20,1],[22.5,0],[27,0]];
  function measure(){distance = Math.min(viewport.scrollHeight-viewport.clientHeight,viewport.clientHeight*3.8);}
  function tick(now){
   if(!visible || reduced.matches || document.hidden){frame=0;return;}
   if(start===null)start=now;
   const t=((now-start)/1000)%27;
   let p=0;
   for(let i=1;i<stops.length;i++){
    if(t<=stops[i][0]){
     const [ta,a]=stops[i-1],[tb,b]=stops[i];
     const x=Math.max(0,Math.min(1,(t-ta)/(tb-ta)));
     const ease=b<a?x*x*(3-2*x):1-Math.pow(1-x,3);
     p=a+(b-a)*ease;break;
    }
   }
   viewport.scrollTop=Math.max(0,distance)*p;
   frame=requestAnimationFrame(tick);
  }
  function resume(){if(visible&&!reduced.matches&&!document.hidden&&!frame){measure();start=null;frame=requestAnimationFrame(tick);}}
  image.addEventListener('load',()=>{measure();resume();});
  new ResizeObserver(measure).observe(viewport);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}}).observe(viewport);
  document.addEventListener('visibilitychange',resume);
  reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;viewport.scrollTop=0;}else resume();});
  measure();
 });
})();
