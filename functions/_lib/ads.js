// Backend-only. No importar desde código del navegador.
export function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});}
export function configured(env){return !!(env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY);}
export async function db(env,path,{method='GET',body,prefer}={}){
 if(!configured(env))throw new Error('BACKEND_NOT_CONFIGURED');
 const url=new URL('/rest/v1/'+path,env.SUPABASE_URL);
 const headers={'apikey':env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Accept':'application/json'};
 if(body!==undefined)headers['Content-Type']='application/json';
 if(prefer)headers['Prefer']=prefer;
 const res=await fetch(url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
 if(!res.ok)throw new Error('DB_'+res.status);
 return res.status===204?null:res.json();
}
export async function isAdmin(env,request){
 if(!env.SUPABASE_URL||!env.SUPABASE_PUBLISHABLE_KEY)return false;
 const h=request.headers.get('authorization')||'';
 if(!/^Bearer [A-Za-z0-9._-]+$/.test(h))return false;
 const r=await fetch(new URL('/auth/v1/user',env.SUPABASE_URL),{headers:{'apikey':env.SUPABASE_PUBLISHABLE_KEY,'authorization':h}});
 if(!r.ok)return false;
 const u=await r.json();
 return u&&u.app_metadata&&u.app_metadata.ads_admin===true;
}
export function safeUrl(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.')&&u.hostname.length<=253?u.href:null;}catch{return null;}
}
export function price(plan,days){const r={basico:19990,profesional:39990,premium:79990},f={7:.4,15:.65,30:1,90:2.7};return r[plan]&&f[days]?Math.round(r[plan]*f[days]/10)*10:null;}
export async function turnstile(env,token,ip){
 if(!env.TURNSTILE_SECRET)return false;
 if(typeof token!=='string'||token.length<10)return false;
 const form=new FormData();form.set('secret',env.TURNSTILE_SECRET);form.set('response',token);if(ip)form.set('remoteip',ip);
 const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
 if(!r.ok)return false;const j=await r.json();return j.success===true;
}
