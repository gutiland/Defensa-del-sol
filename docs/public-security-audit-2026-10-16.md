# Revisión del despliegue público

Fecha: 16 de octubre de 2026. Sitio autorizado: https://defensa-del-sol-six.vercel.app/.

## Alcance

135 peticiones secuenciales de bajo impacto al mismo dominio, incluidos 101 módulos JavaScript. Comprobaciones de HTTPS, cabeceras, archivos internos, rutas codificadas, métodos, reflexión de una consulta y coherencia de módulos. Sin pruebas de carga, escaneo de otros dominios, pagos, cambios remotos ni explotación de cuentas.

Evidencia en [public-security-audit-2026-10-16.json](public-security-audit-2026-10-16.json). Repetición: `node scripts/audit-public-site.js`; el script está limitado a este dominio y sobrescribe ese informe de resultados.

## Resultados

| Comprobación | Resultado observado |
| --- | --- |
| HTTPS | Certificado aceptado por Node con validación normal; conexión negociada TLS 1.3 |
| HTTP | Redirección 308 al mismo dominio HTTPS |
| Cabeceras de portada | CSP estricta, HSTS, nosniff, DENY, no-referrer, Permissions-Policy, COOP y CORP presentes |
| Archivos privados y laboratorios | Las 16 rutas comprobadas devuelven 404, sin devolver la portada como sustituto |
| Rutas codificadas y byte nulo | 400 o 404, sin exposición del servidor |
| Métodos | HEAD 200 sin cuerpo; OPTIONS 204; TRACE y POST 405 |
| Consulta con etiqueta HTML | La respuesta no incluye literalmente la carga enviada; esto no descarta todas las variantes de XSS |
| Recursos JavaScript | Los 101 módulos responden 200, sus hashes coinciden con el manifiesto publicado y sus imports locales están incluidos |
| Patrones de secretos | No aparecen los patrones de claves Stripe privadas o claves PEM comprobados en esos módulos |
| Laboratorio | No aparece en la navegación pública; sus módulos no se sirven y el punto de entrada público no los importa |
| Apoyo económico | El recurso de configuración contiene el enlace público de Stripe previsto; no se ha seguido ni probado el cobro |
| Cookies | La respuesta inicial de portada no incluye Set-Cookie; no equivale a comprobar todos los servicios o contextos |

Entre las rutas rechazadas están `/.env`, `/.env.local`, `/.git/HEAD`, `/.git/config`, `/AGENTS.md`, `/server.js`, los manifiestos del proyecto, `/admin.html`, `/events.html`, `/performance.html` y los módulos administrativos.

No se ha demostrado una vulnerabilidad explotable en estas comprobaciones. No se asigna una garantía de seguridad ni se interpreta la ausencia de patrones como ausencia de todo secreto posible.

## Observaciones menores

- Vercel devuelve `Access-Control-Allow-Origin: *`, sin autorización de credenciales. En estos recursos estáticos públicos no se ha identificado información privada que permita extraer; no constituye por sí solo un fallo de autenticación. Revisarlo si se añaden cuentas o API con datos privados.
- `style.css` conserva un import de Google Fonts incompatible con la CSP que permite estilos y fuentes solo del mismo origen. La política bloquea esa carga; puede generar mensajes de consola y utilizar fuentes de reserva. Conviene retirar el import o alojar fuentes con licencia en el propio sitio, sin relajar la CSP únicamente para ocultar el aviso.
- Los hashes del manifiesto prueban coherencia con el manifiesto servido, no autenticidad independiente. Quien controle el despliegue podría sustituir ambos.
- El código y las partidas locales son manipulables por quien controla su navegador. No deben servir como validación de pagos ni resultados de una futura clasificación online.

## Fuera del alcance

No se han auditado los permisos ni sesiones de GitHub, Vercel o Stripe, MFA, configuración de la cuenta de cobro, facturación, historial completo de Git, límites de abuso/DDoS, todas las versiones TLS ni la ejecución real en navegador. La comprobación de una consulta no sustituye una auditoría de XSS en todas las entradas y estados. Tampoco se certifica cumplimiento jurídico.

Mantener MFA en las cuentas, revisar quién puede publicar y repetir la comprobación tras cambios de configuración o incorporación de servicios con datos privados.
