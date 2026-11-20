import {json} from '../../_lib/ads.js';
export async function onRequestGet({env}){return json({turnstileSiteKey:env.TURNSTILE_SITE_KEY||null,enabled:!!(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET&&env.SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY)});}
