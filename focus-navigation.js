(()=>{
 const root=document.documentElement;
 document.addEventListener('keydown',event=>{if(event.key==='Tab')root.classList.add('keyboard-navigation')});
 document.addEventListener('pointerdown',()=>root.classList.remove('keyboard-navigation'),{passive:true});
})();
