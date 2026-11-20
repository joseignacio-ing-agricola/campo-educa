import {json,configured,db} from '../../_lib/ads.js';
export async function onRequestPost({request,env}){
 if(!configured(env))return json({ok:false},503);
 const origin=request.headers.get('origin');if(origin&&new URL(origin).origin!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403);
 let d;try{d=await request.json();}catch{return json({error:'JSON inválido.'},400);}
 if(!d||! /^[0-9a-f-]{36}$/i.test(d.id||'')||d.type!=='impresion')return json({error:'Evento inválido.'},400);
 try{
  const now=new Date().toISOString(),rows=await db(env,'ads_campaigns?id=eq.'+encodeURIComponent(d.id)+'&status=eq.activa&starts_at=lte.'+encodeURIComponent(now)+'&ends_at=gt.'+encodeURIComponent(now)+'&select=id');
  if(!rows.length)return json({error:'Campaña no activa.'},404);
  await db(env,'ads_events',{method:'POST',body:{campaign_id:d.id,event_type:'impresion'},prefer:'return=minimal'});
  return json({ok:true});
 }catch{return json({error:'Error de registro.'},502);}
}
