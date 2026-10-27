(()=>{
 const boxes=[...document.querySelectorAll('.macbox')];if(!boxes.length)return;
 let scheduled=false;
 function update(){
  scheduled=false;
  const viewport=Math.min(window.innerHeight,window.visualViewport?.height||window.innerHeight);
  for(const box of boxes){
   const screen=box.querySelector('.macpane:not([hidden]) .mac__screen')||box.querySelector('.mac__screen');if(!screen)continue;
   const chrome=box.getBoundingClientRect().height-screen.getBoundingClientRect().height;
   box.style.setProperty('--viewer-height',Math.max(80,Math.floor(viewport-chrome-48))+'px');
  }
 }
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
 const observer=new ResizeObserver(schedule);
 for(const box of boxes){observer.observe(box);box.addEventListener('click',schedule)}
 window.addEventListener('resize',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 document.fonts?.ready.then(schedule);schedule();
})();
