(()=>{'use strict';
 const openAccess=()=>{if(['#acceso','#login-form'].includes(location.hash)){const d=document.getElementById('acceso');if(d)d.open=true;}};openAccess();addEventListener('hashchange',openAccess);
 const q=new URLSearchParams(location.search),tags={};for(const k of ['utm_source','utm_campaign']){const v=q.get(k);if(v&&/^[a-zA-Z0-9_-]{1,60}$/.test(v))tags[k]=v;}
 if(!Object.keys(tags).length)return;
 for(const a of document.querySelectorAll('a[href]')){try{const u=new URL(a.href,location.href);if(u.hostname==='wa.me'){let t=u.searchParams.get('text')||'';t+=' Referencia de campaña: '+Object.entries(tags).map(([k,v])=>k+'='+v).join(', ')+'.';u.searchParams.set('text',t);a.href=u.href;}else if(u.origin===location.origin&&/\.html$/.test(u.pathname)){for(const[k,v]of Object.entries(tags))u.searchParams.set(k,v);a.href=u.href;}}catch{}}
})();
