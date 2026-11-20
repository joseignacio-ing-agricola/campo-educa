import {json,configured,db,isAdmin} from '../../_lib/ads.js';
export async function onRequestGet({env}){
 if(!configured(env))return json({plans:[{slug:'basico',title:'Básico',price_30d_clp:19990},{slug:'profesional',title:'Profesional',price_30d_clp:39990},{slug:'premium',title:'Premium',price_30d_clp:79990}],demo:true});
 try{const plans=await db(env,'ads_plans?select=slug,title,price_30d_clp,active&order=price_30d_clp.asc');return json({plans,demo:false});}catch{return json({error:'No se pudieron obtener tarifas.'},502);}
}
export async function onRequestPatch({request,env}){
 if(!configured(env)||!await isAdmin(env,request))return json({error:'No autorizado.'},401);
 let d;try{d=await request.json();}catch{return json({error:'JSON inválido.'},400);}
 if(!d||!['basico','profesional','premium'].includes(d.slug)||!Number.isSafeInteger(d.price_30d_clp)||d.price_30d_clp<1000||d.price_30d_clp>10000000)return json({error:'Precio inválido.'},400);
 try{await db(env,'ads_plans?slug=eq.'+d.slug,{method:'PATCH',body:{price_30d_clp:d.price_30d_clp,updated_at:new Date().toISOString()},prefer:'return=minimal'});return json({ok:true});}catch{return json({error:'No se pudo actualizar el precio.'},502);}
}
