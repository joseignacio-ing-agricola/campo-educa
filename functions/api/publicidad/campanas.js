import {json,configured,db,safeUrl} from '../../_lib/ads.js';
export async function onRequestGet({env}){
 if(!configured(env))return json({campaigns:[]});
 try{
  const now=new Date().toISOString();
  const path='ads_campaigns?select=id,title,placement,destination_url,creative_path,starts_at,ends_at&status=eq.activa&starts_at=lte.'+encodeURIComponent(now)+'&ends_at=gt.'+encodeURIComponent(now)+'&limit=20';
  const rows=await db(env,path);
  const base=new URL(env.SUPABASE_URL).origin;
  return json({campaigns:rows.filter(r=>safeUrl(r.destination_url)&&r.creative_path).map(r=>({id:r.id,title:r.title,placement:r.placement,image:base+'/storage/v1/object/public/ads-creatives/'+encodeURIComponent(r.creative_path)}))});
 }catch{return json({campaigns:[]});}
}
