import {json,configured,db,isAdmin,safeUrl} from '../../_lib/ads.js';
async function guard(request,env){return configured(env)&&await isAdmin(env,request);}
export async function onRequestGet({request,env}){
 if(!await guard(request,env))return json({error:'No autorizado.'},401);
 try{
  const [requests,campaigns]=await Promise.all([
   db(env,'ads_requests?select=id,company,contact_name,email,phone,plan_slug,duration_days,placement,destination_url,message,creative_path,quoted_price_clp,status,created_at,reviewer_notes&order=created_at.desc&limit=150'),
   db(env,'ads_campaigns?select=*&order=created_at.desc&limit=150')
  ]);
  return json({requests,campaigns});
 }catch{return json({error:'No se pudo consultar el panel.'},502);}
}
export async function onRequestPatch({request,env}){
 if(!await guard(request,env))return json({error:'No autorizado.'},401);
 let d;try{d=await request.json();}catch{return json({error:'JSON inválido.'},400);}
 if(!d||! /^[0-9a-f-]{36}$/i.test(d.id||''))return json({error:'ID inválido.'},400);
 if(!['pendiente','aprobada','rechazada','pagada','cancelada'].includes(d.status))return json({error:'Estado inválido.'},400);
 if(typeof d.notes!=='string'||d.notes.length>1000)return json({error:'Notas inválidas.'},400);
 try{
  const rows=await db(env,'ads_requests?id=eq.'+encodeURIComponent(d.id)+'&select=id,status',{method:'PATCH',prefer:'return=representation',body:{status:d.status,reviewer_notes:d.notes,reviewed_at:new Date().toISOString()}});
  return Array.isArray(rows)&&rows.length?json({ok:true}):json({error:'Solicitud no encontrada.'},404);
 }catch{return json({error:'No se pudo guardar.'},502);}
}
export async function onRequestPost({request,env}){
 if(!await guard(request,env))return json({error:'No autorizado.'},401);
 let d;try{d=await request.json();}catch{return json({error:'JSON inválido.'},400);}
 if(!d||! /^[0-9a-f-]{36}$/i.test(d.requestId||''))return json({error:'ID inválido.'},400);
 const start=new Date(d.startsAt),end=new Date(d.endsAt);
 if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start||end-start>92*86400000)return json({error:'Fechas inválidas.'},400);
 try{
  const rr=await db(env,'ads_requests?id=eq.'+encodeURIComponent(d.requestId)+'&select=*');
  if(!rr.length||rr[0].status!=='pagada')return json({error:'Solo se activan campañas con pago verificado manualmente.'},409);
  const r=rr[0];if(!safeUrl(r.destination_url))return json({error:'URL no permitida.'},400);
  const rows=await db(env,'ads_campaigns?select=id',{method:'POST',prefer:'return=representation',body:{request_id:r.id,title:r.company,placement:r.placement,destination_url:r.destination_url,creative_path:r.creative_path,starts_at:start.toISOString(),ends_at:end.toISOString(),status:'activa'}});
  return json({ok:true,id:rows[0].id},201);
 }catch{return json({error:'No se pudo activar (¿ya existe una campaña?).'},502);}
}
