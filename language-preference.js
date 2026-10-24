(()=>{
 const script=document.currentScript;
 const root=new URL('./',script.src);
 const relative=location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):'';
 const en=relative.startsWith('en/');
 const file=(en?relative.slice(3):relative)||'index.html';
 const key='portfolio-language';
 const read=()=>{try{return localStorage.getItem(key)}catch{return null}};
 const save=value=>{try{localStorage.setItem(key,value)}catch{}};
 document.addEventListener('click',event=>{
  const link=event.target.closest('.lang a,.langsw a');if(!link)return;
  const language=link.textContent.trim().toLowerCase();
  if(language==='ru'||language==='en')save(language);
 });
 // Explicit English links keep their language; automatic selection applies to the root entry only.
 if(en||file!=='index.html')return;
 const saved=read();
 const languages=navigator.languages?.length?navigator.languages:[navigator.language||'en'];
 const preferred=/^ru(?:-|$)/i.test(languages[0])?'ru':'en';
 if((saved==='ru'||saved==='en'?saved:preferred)==='en'){
  const url=new URL('en/index.html',root);url.search=location.search;url.hash=location.hash;location.replace(url.href);
 }
})();
