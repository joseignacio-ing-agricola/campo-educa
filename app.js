const el=id=>document.getElementById(id),status=message=>{el('status').textContent=message;};
const config=window.AULA_CONFIG||{};let sb=null,user=null,courses=[],profiles=[],activeCourse=null,opening=false;
function node(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;}
function closeCourse(){el('course-frame').srcdoc='';el('viewer').hidden=true;activeCourse=null;}
async function initialize(){
 if(!config.url||!config.publishableKey){status('Plataforma pendiente de conectar a Supabase. El encargado debe completar web/config.js y activar la configuración del servidor.');el('login-form').querySelector('button').disabled=true;return;}
 if(!/^https:\/\//.test(config.url)||config.publishableKey.startsWith('sb_secret_'))throw Error('Revisa la configuración pública.');
 const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
 sb=createClient(config.url,config.publishableKey);
 sb.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){user=null;closeCourse();el('dashboard').hidden=true;el('admin').hidden=true;el('login').hidden=false;el('logout').hidden=true;}});
 const {data}=await sb.auth.getSession();if(data.session)await loadDashboard();
}
async function loadDashboard(){
 const {data,error}=await sb.auth.getUser();if(error||!data.user)throw Error('Inicia sesión para entrar.');user=data.user;
 const [{data:profile,error:pError},{data:admin,error:aError},{data:list,error:cError}]=await Promise.all([sb.from('learner_profiles').select('full_name').eq('user_id',user.id).maybeSingle(),sb.from('course_admins').select('user_id').eq('user_id',user.id).maybeSingle(),sb.from('courses').select('*').order('title')]);
 if(pError||aError||cError)throw Error('No se pudieron consultar los accesos. Revisa las reglas de Supabase.');
 courses=list||[];el('greeting').textContent='Hola, '+(profile?.full_name||user.email);el('login').hidden=true;el('dashboard').hidden=false;el('logout').hidden=false;el('admin').hidden=!admin;
 el('courses').replaceChildren();courses.filter(c=>c.active).forEach(c=>{const card=node('article');card.className='course';card.append(node('h2',c.title),node('p',c.description));const button=node('button','Entrar al curso →');button.type='button';button.addEventListener('click',()=>openCourse(c.id));card.append(button);el('courses').append(card);});
 if(!courses.some(c=>c.active))el('courses').append(node('p','Todavía no tienes cursos habilitados. Contacta al encargado para registrar tu compra.'));
 if(admin)await loadAdmin();status('');
}
async function loadAdmin(){
 const [{data:learners,error:lError},{data:entries,error:eError}]=await Promise.all([sb.from('learner_profiles').select('*').order('full_name'),sb.from('enrollments').select('*').order('created_at',{ascending:false})]);if(lError||eError)throw Error('No se pudo cargar la administración.');profiles=learners||[];
 el('learner-select').replaceChildren();profiles.forEach(p=>{const option=node('option',p.full_name+' · '+p.email);option.value=p.user_id;el('learner-select').append(option);});
 el('course-select').replaceChildren();el('course-options').replaceChildren();courses.forEach(c=>{const option=node('option',c.title+(c.active?'':' (inactivo)'));option.value=c.id;el('course-select').append(option);if(c.active){const label=node('label');const check=node('input');check.type='checkbox';check.name='courses';check.value=c.id;label.append(check,document.createTextNode(c.title));el('course-options').append(label);}});
 const table=node('table'),head=node('tr');['Alumno','Curso','Acceso'].forEach(t=>head.append(node('th',t)));table.append(head);(entries||[]).forEach(e=>{const tr=node('tr');[profiles.find(p=>p.user_id===e.user_id)?.full_name||e.user_id,courses.find(c=>c.id===e.course_id)?.title||e.course_id,e.active?'Habilitado':'Retirado'].forEach(t=>tr.append(node('td',t)));table.append(tr);});const wrapper=node('div');wrapper.className='table-wrap';wrapper.append(table);el('enrollments').replaceChildren(wrapper);
}
async function adminAction(body){const {data,error}=await sb.functions.invoke('course-admin',{body});if(error){let message='No se completó la operación administrativa.';try{const detail=await error.context.json();if(detail.error)message=detail.error;}catch(_){}throw Error(message);}if(data?.error)throw Error(data.error);return data;}
el('login-form').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter;button.disabled=true;try{if(!sb)throw Error('Falta conectar Supabase.');const {error}=await sb.auth.signInWithPassword({email:el('email').value.trim(),password:el('password').value});if(error)throw Error('No se pudo entrar. Revisa el correo y la contraseña o consulta al encargado.');el('password').value='';await loadDashboard();}catch(e){status(e.message);}finally{button.disabled=false;}});
el('logout').addEventListener('click',async()=>{closeCourse();const {error}=await sb.auth.signOut();if(error)status('No se pudo cerrar la sesión. Intenta nuevamente.');});
el('create-user').addEventListener('submit',async event=>{event.preventDefault();event.submitter.disabled=true;try{const ids=Array.from(el('course-options').querySelectorAll('input:checked')).map(i=>i.value);await adminAction({action:'create_user',name:el('learner-name').value,email:el('learner-email').value,password:el('learner-password').value,courses:ids});el('create-user').reset();await loadAdmin();status('Alumno registrado y cursos habilitados. Entrega sus credenciales por un medio personal.');}catch(e){status(e.message);}finally{event.submitter.disabled=false;}});
el('access-form').addEventListener('submit',async event=>{event.preventDefault();event.submitter.disabled=true;try{await adminAction({action:'set_access',user_id:el('learner-select').value,course_id:el('course-select').value,active:el('access-active').value==='true'});await loadAdmin();status('Acceso actualizado. Los enlaces ya emitidos caducan en un máximo de 10 minutos.');}catch(e){status(e.message);}finally{event.submitter.disabled=false;}});
el('password-form').addEventListener('submit',async event=>{event.preventDefault();event.submitter.disabled=true;try{if(el('new-password').value!==el('confirm-password').value)throw Error('Las contraseñas no coinciden.');const {error}=await sb.auth.updateUser({password:el('new-password').value});if(error)throw Error('No se cambió la contraseña. Revisa la política de contraseñas o vuelve a iniciar sesión.');el('password-form').reset();status('Contraseña actualizada.');}catch(e){status(e.message);}finally{event.submitter.disabled=false;}});
async function openCourse(id){
 if(opening)return;opening=true;status('Consultando tu acceso y preparando el aula…');
 try{
  const {data:course,error}=await sb.from('courses').select('*').eq('id',id).eq('active',true).single();if(error||!course)throw Error('No tienes acceso activo a este curso.');
  const paths=course.files;if(!Array.isArray(paths)||!paths.includes('aula.html')||paths.some(p=>typeof p!=='string'||p.includes('..')||p.startsWith('/')))throw Error('El encargado todavía no cargó el material de este curso.');
  const {data:signed,error:sError}=await sb.storage.from('course-materials').createSignedUrls(paths.map(p=>id+'/'+p),600);if(sError||!signed||signed.some(s=>s.error||!s.signedUrl))throw Error('No se pudo acceder al material. Puede que tu permiso haya sido retirado.');
  const map=Object.fromEntries(signed.map(s=>[s.path.slice(id.length+1),s.signedUrl]));
  const response=await fetch(map['aula.html'],{cache:'no-store'});if(!response.ok)throw Error('No se pudo cargar el aula.');let html=await response.text();
  const safeJSON=value=>JSON.stringify(value).replace(/</g,'\\u003c');
  const navigationBoot=`
document.addEventListener('click',function(event){
 const anchor=event.target.closest('a[href^="#"]');
 if(anchor){
  event.preventDefault();
  const hash=anchor.getAttribute('href');
  if(location.hash!==hash)location.hash=hash;
  else window.dispatchEvent(new Event('hashchange'));
  return;
 }
 if(event.target.closest('button.lesson')){
  queueMicrotask(function(){if(location.hash!=='#lecciones')location.hash='#lecciones';});
 }
});`;
  html=html.replace('/*AULA_PRIVATE_BOOT*/',()=> 'window.PRIVATE_FILES='+safeJSON(map)+';window.PRIVATE_PROFILE='+safeJSON({user:user.id,name:el('greeting').textContent.replace(/^Hola, /,''),course:id})+';'+navigationBoot);
  for(const [relative,url] of Object.entries(map)){html=html.replaceAll('href="'+relative+'"','href="'+url+'"').replaceAll('src="'+relative+'"','src="'+url+'"');}
  el('course-frame').srcdoc=html;el('viewer-title').textContent=course.title;el('viewer').hidden=false;activeCourse=id;status('');
 }catch(e){closeCourse();status(e.message);}finally{opening=false;}
}
el('close-course').addEventListener('click',closeCourse);el('renew-course').addEventListener('click',()=>{if(activeCourse)openCourse(activeCourse);});
window.addEventListener('message',event=>{if(event.source===el('course-frame').contentWindow&&event.data?.type==='aula-close')closeCourse();});
initialize().catch(()=>status('No se pudo iniciar la plataforma. Revisa tu conexión y la configuración de Supabase.'));
