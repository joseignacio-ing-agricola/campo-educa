/* CampoEduca: muestra únicamente campañas activas y pagadas aprobadas. */
(()=>{'use strict';
 const anchor=document.querySelector('.store-hero')||document.querySelector('#home-content');if(!anchor)return;
 fetch('/api/publicidad/campanas',{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():{campaigns:[]}).then(data=>{
  const campaign=Array.isArray(data.campaigns)?data.campaigns.find(c=>c.placement==='superior'&&/^[0-9a-f-]{36}$/i.test(c.id)&&typeof c.image==='string'):null;
  if(!campaign)return;
  const section=document.createElement('section');section.className='campo-sponsor';section.setAttribute('aria-label','Publicidad');
  const label=document.createElement('span');label.className='campo-sponsor-label';label.textContent='Publicidad · Contenido patrocinado';
  const link=document.createElement('a');link.href='/api/publicidad/click?id='+encodeURIComponent(campaign.id);link.target='_blank';link.rel='noopener sponsored noreferrer';link.setAttribute('aria-label','Anuncio de '+campaign.title);
  const img=document.createElement('img');img.src=campaign.image;img.alt='Anuncio de '+campaign.title;img.loading='lazy';img.decoding='async';img.width=1200;img.height=300;link.append(img);section.append(label,link);
  const more=document.createElement('a');more.href='anuncia.html';more.className='campo-sponsor-more';more.textContent='Anuncia tu empresa en CampoEduca →';section.append(more);
  anchor.after(section);
  if('IntersectionObserver'in window){
   let sent=false;const observer=new IntersectionObserver(entries=>{if(sent||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.5))return;sent=true;observer.disconnect();
    fetch('/api/publicidad/eventos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:campaign.id,type:'impresion'}),keepalive:true}).catch(()=>{});
   },{threshold:[.5]});observer.observe(section);
  }
 }).catch(()=>{});
})();
