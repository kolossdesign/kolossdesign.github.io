(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const ease=x=>x*x*(3-2*x);
 document.querySelectorAll('.crypto-motion').forEach(scene=>{
   const welcome=scene.querySelector('.crypto-welcome');
   const app=scene.querySelector('.crypto-app');
   const scroll=scene.querySelector('.crypto-app-scroll');
   const nav=scene.querySelector('.crypto-nav');
   const tap=scene.querySelector('.crypto-tap');
   const statusBlack=scene.querySelector('.crypto-status-black');
   const status=scene.querySelector('.crypto-status');
   const feedback=scene.querySelector('.crypto-press-feedback');
   const tabs=[...scene.querySelectorAll('.crypto-tabs span')];
   const columns=[...scene.querySelectorAll('.crypto-chart-column')];
   const sets=[[95,16,80,27,58,92],[18,90,24,98,33,14],[72,28,97,12,88,46]];
   let frame=0,start=null,visible=false,previousTab=-1;
   function tick(now){
     if(!visible||document.hidden||reduced.matches){frame=0;return;}
     if(start===null)start=now;
     const t=((now-start)/1000)%19;
     const opened=t>=3.05&&t<18;
     welcome.style.opacity=opened?'0':'1';
     app.style.opacity=opened?'1':'0';
     status.style.opacity=opened?'1':'0';
     const pressing=t>=1.55&&t<3.05;
     const press=t<2.2?Math.max(0,(t-1.55)/.65):Math.max(0,1-(t-2.2)/.85);
     tap.style.opacity=pressing?String(Math.min(1,press*2)):'0';
     const scale=t<2.2?1.1-Math.min(1,(t-1.55)/.65)*.45:.65+Math.max(0,(t-2.2)/.85)*1.2;
     tap.style.transform=`translate(-50%,-50%) scale(${scale})`;
     feedback.style.opacity=t>=2&&t<2.65?'1':'0';
     const range=Math.max(0,scroll.scrollHeight-scroll.clientHeight-nav.clientHeight);
     let progress=0;
     if(t>4.5&&t<8.7308)progress=ease((t-4.5)/4.2308);
     else if(t>=8.7308&&t<11.2308)progress=1;
     else if(t>=11.2308&&t<14.3077)progress=1-ease((t-11.2308)/3.0769);
     scroll.scrollTop=range*progress;
     statusBlack.style.opacity=(opened && progress>.002)?'1':'0';
     const tab=Math.floor(t/3)%3;
     if(tab!==previousTab){
       tabs.forEach((e,i)=>e.classList.toggle('is-active',i===tab));
       columns.forEach((e,i)=>{e.querySelector('i').style.height=(sets[tab][i]*.65)+'%';e.querySelector('.crypto-chart-number').textContent=(sets[tab][i]*2.1).toFixed(1);});
       scene.querySelector('.crypto-income span').textContent=tab===0?'420.8':tab===1?'286.2':'134.6';
       scene.querySelector('.crypto-caption').textContent=['All activity for month','Spending for month','Income for month'][tab];
       previousTab=tab;
     }
     frame=requestAnimationFrame(tick);
   }
   function resume(){if(reduced.matches){welcome.style.opacity='0';app.style.opacity='1';status.style.opacity='1';tap.style.opacity='0';return;}if(visible&&!document.hidden&&!frame){start=null;frame=requestAnimationFrame(tick);}}
   new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();}).observe(scene);
   reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;resume();});
   document.addEventListener('visibilitychange',resume);
 });
})();
