(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 document.querySelectorAll('.booking-shell').forEach(shell=>{
   const demo=shell.querySelector('.booking-demo'),viewport=demo.querySelector('.booking-window'),track=demo.querySelector('.booking-track');
   const range=track.querySelector('.booking-range'),label=range.querySelector('b'),pointer=range.querySelector('.booking-drag-pointer');
   const frame=shell.closest('.cover-scene')||shell;
   let stop=0,max=0,start=null,raf=0,visible=false,lastLabel='';
   function measure(){
     const right=Math.min(frame.getBoundingClientRect().right,demo.getBoundingClientRect().right);
     const width=Math.max(1,right-viewport.getBoundingClientRect().left);
     viewport.style.width=`${width}px`;
     max=Math.max(0,track.scrollWidth-width);
     stop=Math.max(0,Math.min(max,track.scrollWidth*(.38333333+1/28)-width/2));
   }
   function tick(now){
     if(!visible||document.hidden||reduced.matches){raf=0;return;}
     if(start===null)start=now;
     const t=((now-start)/1000)%23;
     let left=0;
     if(t>=1&&t<4)left=stop*ease((t-1)/3);
     else if(t>=4&&t<7.4)left=stop;
     else if(t>=7.4&&t<11.4)left=stop+(max-stop)*ease((t-7.4)/4);
     else if(t>=11.4&&t<13)left=max;
     else if(t>=13&&t<19)left=max*(1-ease((t-13)/6));
     viewport.scrollLeft=left;
     const drag=t>=5.3&&t<6.8?ease((t-5.3)/1.5):t>=6.8?1:0;
     range.style.width=`${(1+2*drag)/14*100}%`;
     const minutes=15*60+22+Math.round(120*drag);
     const text=`14:22 – ${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
     if(text!==lastLabel){label.textContent=text;lastLabel=text;}
     pointer.style.opacity=t>=4.8&&t<7.2?String(Math.min(1,(t-4.8)/.3,(7.2-t)/.3)):'0';
     raf=requestAnimationFrame(tick);
   }
   function resume(){if(visible&&!document.hidden&&!reduced.matches&&!raf){start=null;measure();raf=requestAnimationFrame(tick);}}
   new ResizeObserver(measure).observe(shell);
   shell.querySelector('img').addEventListener('load',()=>{measure();resume();});
   new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else resume();}).observe(shell);
   document.addEventListener('visibilitychange',resume);
   reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(raf);raf=0;viewport.scrollLeft=0;pointer.style.opacity='0';}else resume();});
   measure();
 });
})();
