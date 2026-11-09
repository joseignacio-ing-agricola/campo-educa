# CampoEduca GiftBot — 20% por Instagram (BORRADOR NO PUBLICADO)

Cuenta: @campoeducacursos
Código: CAMPOREGALO
Descuento: 20% sobre el precio publicado del curso individual
Duración: 168 horas desde la primera entrega confirmada por DM
Ámbito: todos los cursos individuales del catálogo
No acumulable con otros cupones. El 50% de oferta general que ya está reflejado en precios.json es el precio publicado, no un segundo cupón.
Un uso por usuario, sin reiniciar la vigencia al repetir REGALO.

## Mensajes de ManyChat

### Comentario REGALO
🌱 ¡Tenemos un regalo para ti! 🎁💚 Revisa tus mensajes privados para recibir tu descuento especial de CampoEduca.

### Primer DM después del comentario
🌱 ¡Hola! Gracias por participar con CampoEduca. 💚 ¿Quieres recibir un 20% de descuento en nuestros cursos? Pulsa «QUIERO MI REGALO» para recibir tu cupón.

### Entrega por DM (botón QUIERO MI REGALO o palabra REGALO por DM)
🎉 ¡Tu regalo CampoEduca está aquí! 🎁
🏷️ Código: CAMPOREGALO
🎓 20% de descuento en todos los cursos individuales.
⏳ Válido durante 7 días desde esta entrega.
🌐 https://campo-educa.pages.dev
Responde CURSOS para ver nuestra oferta o AYUDA para recibir asistencia.

### CURSOS
🌱 ¡Gracias por aprender con CampoEduca! Explora los cursos en https://campo-educa.pages.dev. Usa CAMPOREGALO antes de que venza tu plazo. Responde AYUDA si necesitas orientación.

### AYUDA
💚 Cuéntanos qué curso te interesa o qué problema tienes con tu inscripción. Nuestro equipo te responderá.

## Flujos
1. Instagram comment trigger: palabra REGALO en publicaciones/Reels seleccionados → comentario público → DM con botón QUIERO MI REGALO → webhook de emisión → mensaje de entrega.
2. Instagram DM keyword trigger: REGALO → webhook de emisión → mensaje de entrega.
3. DM keyword CURSOS → etiqueta CE_Interes_Cursos → respuesta CURSOS.
4. DM keyword AYUDA → etiqueta CE_Ayuda_Humana → asignación a agente humano.
5. Deduplicar por instagram_scoped_user_id; registrar delivered_at solo una vez.
6. No enviar mensajes promocionales fuera de las ventanas y permisos de Meta.

## Contrato de backend requerido (pendiente de implementar)
POST /giftbot/issue: recibe identificador de usuario de Instagram autenticado mediante webhook verificado, crea o recupera cupón, devuelve issued_at y expires_at.
POST /giftbot/validate: operación privada autenticada del servidor de checkout, comprueba cupón, usuario, curso y vencimiento; calcula descuento en servidor.
POST /giftbot/redeem: operación privada transaccional posterior a confirmación de pago, marca un uso, idempotente por payment_id.
Nunca confiar en precio, usuario o fecha proporcionados por el navegador. No publicar service_role ni secretos en JS del cliente.
En checkout aplicar 20% al precio actual publicado de cada curso; no al regular_price, ni a paquetes, salvo decisión comercial explícita.
La emisión por DM y el canje requieren asociar de forma verificable la identidad Instagram con la compra. No se debe considerar el texto CAMPOREGALO como prueba de elegibilidad.
Guardar datos mínimos, aplicar RLS y retención definida. Evitar registrar tokens de Meta.

## Variables ManyChat
coupon_code = CAMPOREGALO
coupon_issued_at = UTC timestamp
coupon_expires_at = coupon_issued_at + 168 hours
coupon_status = active | expired | redeemed
Tags: CE_Cupon_Entregado, CE_Interes_Cursos, CE_Ayuda_Humana

## Pendiente antes de producción
- Autorizar ManyChat con Instagram @campoeducacursos.
- Configurar token de webhook y endpoint HTTPS privado.
- Implementar tablas y funciones en Supabase con control de acceso.
- Integrar el descuento en el flujo de inscripción/pago real.
- Validar el vínculo Instagram ↔ comprador.
- Probar emisión, duplicados, vencimiento, canje y reintentos.
- Revisar términos comerciales, protección de datos y publicar.
