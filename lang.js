(()=>{
 const root=new URL('./',document.currentScript.src);
 const en=document.documentElement.lang==='en';
 const file=location.pathname.split('/').pop()||'index.html';
 function control(){
  const nav=document.createElement('nav');nav.className='langsw';nav.setAttribute('aria-label',en?'Language':'Язык');
  for(const [label,url,active] of [['RU',new URL(file,root),!en],['EN',new URL('en/'+file,root),en]]){
   const a=document.createElement('a');a.textContent=label;a.href=url.href;
   if(active)a.setAttribute('aria-current','page');
   a.addEventListener('click',()=>{try{localStorage.setItem('portfolio-language',label.toLowerCase())}catch{}});
   nav.appendChild(a);
  }
  return nav;
 }
 const top=document.querySelector('.wrap>.edge');
 if(top){top.classList.add('case-header');top.appendChild(control())}
 const footer=document.createElement('footer');footer.className='case-language-footer';footer.appendChild(control());document.body.appendChild(footer);
})();
