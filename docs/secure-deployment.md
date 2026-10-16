# Publicación y mantenimiento seguros

Endurecimiento del 16 de octubre de 2026. Reduce los riesgos detectados; no garantiza ausencia de fallos, fraude o interrupciones.

## Desarrollo local

`npm start` sirve únicamente activos incluidos en el grafo de módulos del juego y las páginas de laboratorio previstas. La raíz se calcula desde el archivo del servidor, no desde el directorio de la terminal. Escucha siempre en 127.0.0.1 por defecto. Reiniciar un servidor anterior es necesario para aplicar cambios del servidor.

Documentación, pruebas, servidor, secretos, cachés y archivos añadidos arbitrariamente no se sirven. Las rutas codificadas, separadores Windows, dotfiles y escapes de carpeta se rechazan. Se verifica la ruta real también en cada petición para impedir salidas mediante enlaces de carpetas.

Solo GET/HEAD; sin cuerpos de petición, directorios ni recursos mayores de 2 MiB. Cabeceras limitadas a 16 KiB, tiempos de petición y conexiones acotados, hasta 128 conexiones, 100 solicitudes por socket y 600 solicitudes por dirección de conexión/minuto. No se confía en X-Forwarded-For. Estos límites no sustituyen protección DDoS del proveedor. Tras un proxy, el límite se comparte entre las conexiones que lleguen desde la misma IP: aplicar también controles adecuados en el borde.

## Generar la versión pública

```powershell
npm.cmd run build
npm.cmd run preview
```

`build` ejecuta las comprobaciones y genera `dist`. Solo se copian portada, estilos y módulos necesarios. No se incluyen admin, sala de eventos, pruebas de rendimiento, herramientas Node, documentos, caché ni archivos `.env`. Los laboratorios siguen disponibles en desarrollo local. Los imports de admin son diferidos y no se ejecutan en la portada pública.

El generador comprueba patrones de claves secretas y emite hashes en `dist/integrity.json`. Los hashes sirven para comparar archivos, no son una firma ni protegen si un atacante modifica a la vez archivos y manifiesto. La detección de secretos usa patrones y no es exhaustiva: nunca añadir credenciales al cliente.

El generador solo reemplaza una carpeta `dist` identificada por su marcador. Rechaza enlaces de carpeta y carpetas ajenas, verifica primero los recursos y después limpia su propia salida. Si se interrumpe una generación, repetirla antes de publicar.

`preview` sirve únicamente `dist` en localhost:3000. Un `NODE_ENV=production` también obliga al servidor a usar `dist`; falla si no se ha construido. No subir el directorio entero del proyecto al hosting.

## Alojamiento preparado: Netlify

Se incluye `netlify.toml`: comando `npm run build`, directorio publicable `dist`, Node 24. Se genera `dist/_headers` con las cabeceras de seguridad. No se ha creado una cuenta ni realizado un despliegue: esas configuraciones deben verificarse sobre el dominio final.

En Netlify, comprobar HTTPS, el dominio correcto y que el contenido de `_headers` aparece realmente en las respuestas. Otro proveedor puede ignorar ese archivo: configurar las cabeceras con su mecanismo propio. No basta con que el archivo esté subido. [Documentación oficial de cabeceras](https://docs.netlify.com/manage/routing/headers/).

La página generada contiene además CSP en metadatos como protección parcial si el proveedor ignora las cabeceras. Algunas directivas, especialmente las de enmarcado, requieren respuesta HTTP.

Política actual: scripts y estilos propios, sin scripts inline ni eval, sin conexiones de datos externas desde el juego, sin formularios locales y sin incrustación por otros sitios. Se han sustituido los estilos de texto dinámicos por propiedades CSS individuales para mantener el panel de mejoras sin habilitar estilos inline generales. Los enlaces de noticias y Stripe siguen siendo navegación a otra pestaña; no se embebe el checkout.

Si se publica dentro de un iframe de itch.io, revisar expresamente `frame-ancestors` y `X-Frame-Options`: la configuración actual deniega incrustación y no debe relajarse globalmente por comodidad. [CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

## Servidor propio detrás de un proxy HTTPS

Preferir alojamiento estático gestionado para esta versión, sin cuentas ni API propias. Si se utiliza Node:

```powershell
$env:PUBLIC_ORIGIN = 'https://juego.tudominio.example'
npm.cmd run preview
```

Mantener Node en loopback y poner el proxy TLS delante, conservando un Host permitido. El servidor comprueba el Host para reducir riesgo de DNS rebinding. `PUBLIC_ORIGIN` debe ser un origen HTTPS sin ruta ni credenciales; habilita HSTS para esa publicación. No activa TLS por sí mismo: lo termina el proxy.

Solo si una plataforma de contenedores lo requiere, configurar `HOST=0.0.0.0` junto con `PUBLIC_ORIGIN`. El programa exige origen HTTPS para esa escucha, pero no puede comprobar que el cortafuegos o proxy realmente bloqueen el acceso HTTP directo. No exponer el puerto de Node directamente al público. Variables `HOST` y `PORT` son configuración del operador, no entradas de visitantes.

## Pago y guardado

El apoyo solo admite enlaces HTTPS del host exacto `buy.stripe.com`, sin credenciales, puerto adicional, query ni fragmento. Sigue siendo el enlace autorizado por el usuario. Nuevos proveedores o dominios personalizados requieren una revisión explícita de esa lista. No se procesan tarjetas ni se almacenan claves de Stripe; no hay ventajas de pago ni confirmaciones simuladas. Cualquier futura recompensa de pago requerirá verificación de servidor.

Se limita el tamaño del JSON local antes de parsearlo y se valida estructura, medallas conocidas, opciones de historia, base y geometría del campamento. Son medidas de robustez del cliente: el dueño del navegador todavía puede hacer trampas; no deben usarse como prueba de identidad, pago o resultados de una clasificación online.

## Comprobaciones al publicar y responsabilidades externas

1. Desplegar únicamente la salida nueva de `dist`. Verificar portada, mejora de casetas, audio, guardado y resultado en escritorio y móvil con la política real aplicada.
2. Desde el dominio público, comprobar que `/server.js`, `/.env`, `/AGENTS.md`, `/admin.html` y `/src/admin-game.js` no devuelven su contenido, y que las respuestas incluyen CSP/nosniff y HTTPS correcto. Repetir en cada cambio de proveedor.
3. Verificar manualmente el destinatario e importe del enlace de Stripe en modo apropiado. No compartir claves secretas; usar autenticación multifactor y acceso mínimo en Stripe, hosting y repositorio. Estas cuentas no se han auditado ni modificado desde esta sesión.
4. Mantener Node y las herramientas en versiones soportadas con actualizaciones de seguridad. Los scripts de copia, build y pruebas son propios y no añaden dependencias de producción.
5. Conservar copia del código en un repositorio privado o con una política de acceso revisada. `.gitignore` ayuda a evitar archivos sensibles futuros, pero no elimina secretos previamente publicados ni sustituye una revisión del historial.

Pendiente externo: desplegar y comprobar el hosting real. La validación de código y HTTP local no certifica DNS, TLS, cuentas, configuración del proveedor o seguridad del equipo.
