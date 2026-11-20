import {json,configured,db,safeUrl} from '../../_lib/ads.js';
export async function onRequestGet({request,env}){
 if(!configured(env))return json({error:'No disponible.'},503);
 const id=new URL(request.url).searchParams.get('id');
 if(!/^[0-9a-f-]{36}$/i.test(id||''))return json({error:'ID inválido.'},400);
 try{
  const now=new Date().toISOString();
  const rows=await db(env,'ads_campaigns?id=eq.'+encodeURIComponent(id)+'&status=eq.activa&starts_at=lte.'+encodeURIComponent(now)+'&ends_at=gt.'+encodeURIComponent(now)+'&select=id,destination_url');
  if(!rows.length)return json({error:'Anuncio no disponible.'},404);
  const url=safeUrl(rows[0].destination_url);if(!url)return json({error:'URL no permitida.'},400);
  try{await db(env,'ads_events',{method:'POST',body:{campaign_id:id,event_type:'clic'},prefer:'return=minimal'});}catch{}
  return Response.redirect(url,302);
 }catch{return json({error:'No disponible.'},502);}
}
