(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
 document.querySelectorAll('.stenn-calculator').forEach(calc => {
   const parts = Object.fromEntries([...calc.querySelectorAll('[data-calc]')].map(e=>[e.dataset.calc,e]));
   let start = null, frame = 0, visible = false, lastUpdate = 0;
   function tick(now) {
     if (!visible || reduced.matches || document.hidden) {frame=0;return;}
     if (start === null) start=now;
     const t=(now-start)/1000;
     const ease = x => x*x*(3-2*x);
     function gesture(time, steps) {
       const length = steps.reduce((sum, s) => sum+s[1]+s[2],0);
       let at = time % length;
       for(let i=0;i<steps.length;i++) {
         const [value, hold, duration] = steps[i];
         const next = steps[(i+1)%steps.length][0];
         if(at < hold) return value;
         at -= hold;
         if(at < duration) return value+(next-value)*ease(at/duration);
         at -= duration;
       }
       return steps[0][0];
     }
     const amountPhase=gesture(t,[[.35,.65,.55],[.78,.45,.38],[.62,.6,.7],[.18,.5,.5],[.48,.55,.42]]);
     const dayPhase=gesture(t,[[.6,1.2,.5],[.28,.7,.42],[.75,.8,.6],[.45,1,.45]]);
     parts['amount-thumb'].style.left=`${15+amountPhase*70}%`;
     parts['days-thumb'].style.left=`${15+dayPhase*70}%`;
     if(now-lastUpdate>70){
       const amount=Math.round((200000+amountPhase*550000)/100)*100;
       const days=Math.round(30+dayPhase*150);
       const fee=amount*(.012+days*.0001527667);
       parts.amount.textContent=money.format(amount);
       parts.days.textContent=`${days} days`;
       parts.receive.textContent=money.format(amount-fee)+'*';
       parts.fee.textContent='('+money.format(fee)+')*';
       lastUpdate=now;
     }
     frame=requestAnimationFrame(tick);
   }
   function resume(){if(visible&&!reduced.matches&&!document.hidden&&!frame){start=null;frame=requestAnimationFrame(tick);}}
   new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();}).observe(calc.closest('.stenn-calc-shell'));
   document.addEventListener('visibilitychange',resume);
   reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;}else resume();});
 });
})();
