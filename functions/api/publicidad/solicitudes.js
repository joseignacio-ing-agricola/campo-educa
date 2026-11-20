import {json,configured,db,safeUrl,price,turnstile} from '../../_lib/ads.js';
const placements=new Set(['superior','lateral','contenido','articulo','directorio','curso']);
const types={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
function validImage(bytes,type){
 if(type==='image/png')return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 if(type==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(type==='image/webp')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 return false;
}
export async function onRequestPost({request,env}){
 if(!configured(env)||!env.TURNSTILE_SECRET)return json({error:'Recepción temporalmente no configurada. Contacta a CampoEduca.'},503);
 if(Number(request.headers.get('content-length')||0)>3000000)return json({error:'Solicitud demasiado grande.'},413);
 let d;try{d=await request.json();}catch{return json({error:'JSON inválido.'},400);}
 if(!d||typeof d!=='object')return json({error:'Datos inválidos.'},400);
 if(d.website)return json({error:'Solicitud no aceptada.'},400);
 const required=['empresa','contacto','correo','plan','ubicacion','url'];
 if(required.some(k=>typeof d[k]!=='string'))return json({error:'Completa todos los campos.'},400);
 const company=d.empresa.trim(),name=d.contacto.trim(),email=d.correo.trim().toLowerCase(),phone=typeof d.telefono==='string'?d.telefono.trim():'',message=typeof d.mensaje==='string'?d.mensaje.trim():'';
 const url=safeUrl(d.url),days=Number(d.duracion),quote=price(d.plan,days);
 if(company.length<2||company.length>100||name.length<2||name.length>100||email.length>180||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>25||message.length>1500||!url||!quote||!placements.has(d.ubicacion)||d.consentimiento!==true)return json({error:'Revisa los datos ingresados.'},400);
 const ip=request.headers.get('CF-Connecting-IP')||'';
 if(!await turnstile(env,d.turnstileToken,ip))return json({error:'Completa la verificación de seguridad e inténtalo nuevamente.'},403);
 let finalQuote=quote;
 try{const plans=await db(env,'ads_plans?slug=eq.'+encodeURIComponent(d.plan)+'&select=price_30d_clp,active');if(!plans.length||!plans[0].active)return json({error:'Plan no disponible.'},400);const factors={7:.4,15:.65,30:1,90:2.7};finalQuote=Math.round(plans[0].price_30d_clp*factors[days]/10)*10;}catch{return json({error:'No se pudo confirmar la tarifa.'},502);}
 let creative_path=null;
 if(d.imagen){
  if(typeof d.imagen!=='object'||!types[d.imagen.tipo]||typeof d.imagen.base64!=='string'||d.imagen.base64.length>2800000)return json({error:'Imagen no admitida (máximo 2 MB).'},400);
  let bytes;try{bytes=Uint8Array.from(atob(d.imagen.base64),c=>c.charCodeAt(0));}catch{return json({error:'Imagen inválida.'},400);}
  if(bytes.length>2097152||bytes.length<100||!validImage(bytes,d.imagen.tipo))return json({error:'El archivo no es una imagen admitida.'},400);
  creative_path=crypto.randomUUID()+'.'+types[d.imagen.tipo];
  const endpoint=new URL('/storage/v1/object/ads-creatives/'+creative_path,env.SUPABASE_URL);
  const upload=await fetch(endpoint,{method:'POST',headers:{'apikey':env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':d.imagen.tipo,'x-upsert':'false'},body:bytes});
  if(!upload.ok)return json({error:'No se pudo guardar la imagen. Inténtalo nuevamente.'},502);
 }
 try{
  const rows=await db(env,'ads_requests?select=id',{method:'POST',prefer:'return=representation',body:{company,contact_name:name,email,phone,plan_slug:d.plan,duration_days:days,placement:d.ubicacion,destination_url:url,message,creative_path,quoted_price_clp:finalQuote}});
  if(!Array.isArray(rows)||!rows[0]?.id)throw Error('INSERT_EMPTY');
  return json({id:rows[0].id,status:'pendiente'},201);
 }catch(e){return json({error:'No fue posible registrar la solicitud. Inténtalo más tarde.'},502);}
}
