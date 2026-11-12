# CampoEduca — auditoría inicial y plan de cambios (borrador)

Fecha: 2026-11-12. Rama: `auditoria-campoeduca-20261112`. **No desplegar ni fusionar sin revisión.**

## Alcance inspeccionado
- `index.html`: portada, catálogo, muestras, testimonios, acceso, dashboard, administración, captación y visor de cursos.
- `app.js`: inicialización de Supabase, autenticación y consulta de perfiles/administradores (inspección inicial).
- `config.js`: configuración pública de Supabase; no contiene una clave `service_role` en la versión revisada.
- `mercado.js`: menú móvil, navegación al aula y filtros (inspección inicial).
- `aula.css` y `marketing.css`: estilos principales (inspección inicial).

## Hallazgos preliminares
1. **Promociones (prioridad alta):** la franja anuncia «Hasta 50 % de descuento», pero el pack destacado indica $9.995 CLP frente a $12.490 CLP por separado: ahorro $2.495 CLP (~19,98 %). Verificar que el 50 % se aplique a productos específicos y que se muestren las condiciones correspondientes. No cambiar precios sin validación.
2. **Arquitectura (media):** `index.html` reúne portada, panel de alumnos, administración y visor en un solo documento de ~66 KB. Considerar separación por rutas y carga diferida de módulos.
3. **Imágenes (media):** portada con `srcset` y variantes WebP; revisar peso real, coherencia del preload con imagen visible y métricas LCP/CLS antes de optimizar.
4. **Acceso y permisos (crítica para verificar):** `app.js` usa Supabase Auth y consulta `course_admins`. Auditar políticas RLS, funciones RPC, control de matrícula y permisos de administración en backend; el control visual del frontend no basta.
5. **Aula y progreso (alta para verificar):** probar persistencia del avance, vencimiento de acceso, renovación, evaluaciones y recuperación de sesiones con usuarios de prueba.
6. **Ventas (alta para verificar):** la portada dirige consultas a WhatsApp. Verificar precios, cupones, conciliación de pagos y activación de matrículas; no se ha confirmado un checkout automático.
7. **Analítica (media):** revisar eventos de conversión, consentimiento cuando corresponda y ausencia de datos personales en registros públicos.

## Plan de implementación propuesto
- **Fase 1 — Portada:** inventario de imágenes y tamaños; corregir mensajes promocionales solo con precios aprobados; mejorar accesibilidad y carga.
- **Fase 2 — Cursos:** inventariar páginas, lecciones y evaluaciones; validar enlaces, preguntas y persistencia de resultados.
- **Fase 3 — Aula:** pruebas con cuentas ficticias, autorización y caducidad; revisar RLS de Supabase antes de cualquier cambio sensible.
- **Fase 4 — Ventas:** documentar catálogo de precios, descuentos, pagos y proceso de matrícula; añadir pruebas de punta a punta.
- **Fase 5 — Calidad:** pruebas de escritorio/móvil, auditoría de seguridad, métricas de rendimiento y regresiones.

## Criterios de seguridad
No modificar datos reales de alumnos, pagos, contraseñas ni permisos sin una revisión específica. No colocar secretos en archivos públicos. Mantener `main` intacta y solicitar aprobación antes de fusionar o desplegar.

## Estado
Auditoría estática parcial; no se ejecutaron pruebas de navegador, tests automatizados ni consultas de base de datos. Hallazgos sujetos a verificación.
