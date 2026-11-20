# CampoEduca — Módulo comercial de publicidad (BORRADOR)

**Estado:** implementado en rama de desarrollo. **NO DESPLEGADO**, **NO COBRA** y **NO MODIFICA LA BASE DE DATOS** hasta completar los pasos de instalación.

## Entregado
- \`anuncia.html\`: landing responsive con seis formatos, tres planes y cotizador (7/15/30/90 días), vista previa de imágenes y formulario.
- \`publicidad-admin.html\`: panel administrativo con login de Supabase, revisión de solicitudes, cambios de estado, edición de precios y activación manual.
- \`publicidad/proyecciones.html\`: simulador de escenarios de ingresos con temporada, promociones, precios de competidores y capacidad. Los números son **supuestos**, no predicciones calibradas.
- \`publicidad-widget.js\` / \`publicidad-widget.css\`: espacio discreto para campaña aprobada en portada.
- \`functions/api/publicidad/*\`: endpoints de Cloudflare Pages Functions para solicitudes, tarifas, campañas, revisión y conteo bruto de impresiones/clics.
- \`publicidad/schema.sql\`: tablas independientes con RLS y bucket de creatividades.

## Dependencias para activar el servicio

1. Revisar \`publicidad/schema.sql\` en un entorno de pruebas de Supabase. Aplicar solo después de hacer respaldo. No se ejecutó en producción.
2. En Cloudflare Pages > Settings > Variables and Secrets configurar:
   - \`SUPABASE_URL\`: URL HTTPS del proyecto.
   - \`SUPABASE_SERVICE_ROLE_KEY\`: clave secreta de servicio, **solo en Cloudflare**.
   - \`SUPABASE_PUBLISHABLE_KEY\`: clave pública para validar tokens del panel.
   - \`TURNSTILE_SITE_KEY\`: clave pública Turnstile para el dominio.
   - \`TURNSTILE_SECRET\`: clave secreta Turnstile, **solo en Cloudflare**.
3. Revisar la configuración de Cloudflare Pages para asegurar que despliega \`functions/\` como Pages Functions junto al sitio estático. No es compatible con una configuración que solo sube archivos estáticos y descarta las Functions.
4. En Supabase Auth, marcar únicamente a la cuenta administradora autorizada con \`app_metadata.ads_admin = true\` usando una herramienta de administración segura. **No usar user_metadata** para permisos. No se modificaron usuarios.
5. Probar un envío con Turnstile, subida de imagen, lectura en el panel, aprobación, confirmación manual de pago, activación y vencimiento. Probar rechazos y permisos con una cuenta no administradora.
6. Recién después de revisar seguridad, políticas de datos, tributación y condiciones comerciales, autorizar despliegue de la rama.

## Importante sobre pagos y automatizaciones

- **No existe integración real con Mercado Pago/Webpay** en esta versión. El panel permite marcar un pago como verificado **manualmente**; nunca debe hacerse sin revisar el comprobante en la entidad financiera.
- No se realizan cargos automáticos, facturación electrónica ni envíos de correo. La confirmación al anunciante se hace manualmente.
- Las campañas se muestran solo con \`status=activa\` y dentro de \`starts_at/ends_at\`; el vencimiento opera automáticamente por consulta aunque el estado permanezca en la tabla.
- El sistema registra eventos brutos de impresión/clic; **no** garantiza visitantes únicos, atribución ni detección antifraude. Para cobrar por CPM/CPC se requiere auditoría y medición más robusta.
- El simulador no contiene precios reales verificados de competidores; se introducen manualmente.
- La disponibilidad de espacios, la tarifa y los impuestos se confirman antes de contratar.

## API
- \`GET /api/publicidad/config\` — claves públicas de Turnstile y disponibilidad del formulario.
- \`GET /api/publicidad/planes\` — planes y tarifas vigentes.
- \`PATCH /api/publicidad/planes\` — editar tarifas, requiere token admin.
- \`POST /api/publicidad/solicitudes\` — recibe formulario + Turnstile + creatividad (2 MB máximo).
- \`GET /api/publicidad/admin\` — solicitudes/campañas, solo admin.
- \`PATCH /api/publicidad/admin\` — revisión y estado de pago manual, solo admin.
- \`POST /api/publicidad/admin\` — activa campaña solo con solicitud pagada, solo admin.
- \`GET /api/publicidad/campanas\` — solo anuncios activos y vigentes.
- \`POST /api/publicidad/eventos\` — evento bruto de impresión.
- \`GET /api/publicidad/click?id=<uuid>\` — cuenta clic y redirige a destino HTTPS aprobado.

## Checklist de seguridad pendiente antes de publicar
- Test de RLS: ningún usuario anónimo puede consultar solicitudes, correos o campañas desde la Data API.
- Test de autenticación: un usuario autenticado sin \`ads_admin\` recibe 401 en API administrativa.
- Test de Turnstile: sin token o con token falso la solicitud debe rechazarse.
- Test de carga: archivos inválidos y >2 MB deben rechazarse.
- Test de URL: solo HTTPS sin credenciales; revisar manualmente destinos.
- Test de publicidad: no insertar HTML arbitrario ni ejecutar scripts de anunciantes.
- Revisar aviso de privacidad, retención de leads y consentimiento.
- Revisar limitación de solicitudes, deduplicación de eventos y controles antiabuso antes de volumen alto.
- Revisar que la clave secreta de Supabase no aparezca en ningún archivo estático.

## Siguiente etapa sugerida
Integrar pagos de prueba con un proveedor chileno, verificación server-to-server y webhook firmado; implementar emails transaccionales, facturación, alertas de vencimiento y reportes descargables, antes de habilitar cobros reales.

**La rama main y el sitio publicado no se alteraron.**
