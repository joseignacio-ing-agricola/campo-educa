/* Edita aquí los enlaces de tus redes cuando estén disponibles. No uses claves ni contraseñas. */
window.CAMPO_CONTACTO = {
 telefono: '+56977884978',
 telefonoVisible: '+56 9 7788 4978',
 correo: '',
 redes: [
  {nombre:'Instagram · @campoeducacursos',enlace:'https://www.instagram.com/campoeducacursos/'},
  {nombre:'Facebook',enlace:''},
  {nombre:'YouTube',enlace:''}
 ]
};
(function(){
 const data=window.CAMPO_CONTACTO;
 const make=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;el.textContent=text;return el;};
 document.querySelectorAll('.contact-links').forEach(container=>{
  if(/^\+[0-9]{8,15}$/.test(data.telefono)){const link=make('a','phone-contact',data.telefonoVisible);link.href='tel:'+data.telefono;link.setAttribute('aria-label','Llamar a Campo Educa al '+data.telefonoVisible);container.append(make('span','contact-caption','Teléfono de contacto'),link);}
  if(data.correo&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)){const link=make('a','email-contact',data.correo);link.href='mailto:'+data.correo;container.append(link);}
 });
 document.querySelectorAll('.social-area').forEach(el=>el.hidden=false);
 document.querySelectorAll('.social-links').forEach(container=>data.redes.forEach(red=>{
  let url=null;try{const parsed=new URL(red.enlace);if(parsed.protocol==='https:')url=parsed.href;}catch(_){}
  if(url){const a=make('a','social-link',red.nombre+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';container.append(a);}
  else{const holder=make('span','social-placeholder',red.nombre);holder.append(make('small','','Próximamente'));holder.setAttribute('aria-label',red.nombre+': enlace aún no disponible');container.append(holder);}
 }));
})();
