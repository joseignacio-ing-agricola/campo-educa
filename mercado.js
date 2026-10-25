(()=>{'use strict';
 document.body.classList.add('market-js');
 const toggle=document.getElementById('market-menu'),nav=document.getElementById('market-navigation');
 if(toggle&&nav){const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});}
 const dashboard=document.getElementById('dashboard');
 const showDashboard=()=>{if(!dashboard||dashboard.hidden)return false;history.replaceState(null,'','#dashboard');dashboard.scrollIntoView({block:'start'});return true;};
 document.querySelectorAll('a[href="#acceso"],a[href="#login-form"]').forEach(a=>a.addEventListener('click',e=>{if(dashboard&&!dashboard.hidden){e.preventDefault();showDashboard();}}));
 if(dashboard){const route=()=>{if(['#acceso','#login-form'].includes(location.hash))showDashboard();};new MutationObserver(route).observe(dashboard,{attributes:true,attributeFilter:['hidden']});addEventListener('hashchange',route);route();}
 const cards=[...document.querySelectorAll('[data-course-category]')],filters=[...document.querySelectorAll('[data-filter]')],input=document.getElementById('course-search'),status=document.getElementById('course-results'),empty=document.getElementById('course-empty');if(!cards.length||!input)return;
 let active='all';const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function render(){const words=normalize(input.value).split(/\s+/).filter(Boolean);let count=0;for(const card of cards){const matchesCategory=active==='all'||card.dataset.courseCategory.split(' ').includes(active);const text=normalize(card.dataset.courseSearch);const show=matchesCategory&&words.every(word=>text.includes(word));card.hidden=!show;if(show)count++;}for(const button of filters)button.setAttribute('aria-pressed',String(button.dataset.filter===active));status.textContent=count===cards.length?cards.length+' cursos disponibles':count===1?'1 curso encontrado':count+' cursos encontrados';empty.hidden=count!==0;}
 for(const button of filters)button.addEventListener('click',()=>{active=button.dataset.filter;render();});input.addEventListener('input',render);
 for(const link of document.querySelectorAll('[data-set-category]'))link.addEventListener('click',()=>{active=link.dataset.setCategory;input.value='';render();});
 document.getElementById('course-reset')?.addEventListener('click',()=>{active='all';input.value='';render();input.focus();});render();
})();
