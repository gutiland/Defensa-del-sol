# Revisión de seguridad · 16 de octubre de 2026

## Alcance y conclusión

Actualización posterior: se ha aplicado el endurecimiento descrito en [secure-deployment.md](secure-deployment.md). Los hallazgos siguientes documentan el estado inicial, no vulnerabilidades que sigan confirmadas en el nuevo servidor. Exposición de archivos, falta de cabeceras y restricciones de métodos se han corregido y probado. Destino Stripe acotado y guardado reforzado. La publicación real y las cuentas externas siguen fuera de verificación. 137 pruebas correctas y 102 recursos de distribución verificados por HTTP/hash.

Revisión del servidor HTTP, módulos del navegador, almacenamiento local, enlaces de apoyo, páginas de pruebas y dependencias declaradas. Sin cambios funcionales ni de configuración, sin pagos reales ni acceso a la cuenta de Stripe. No es una certificación ni una prueba del alojamiento público.

No se ha identificado una vulnerabilidad crítica explotable de forma remota en el alcance revisado. Hay una exposición comprobada de archivos del proyecto que debe corregirse antes de publicar este servidor. Actualmente escucha solo en 127.0.0.1:3000; no se ha encontrado un túnel o proxy en la configuración del proyecto revisada. Ese enlace local no demuestra que no exista uno configurado fuera del repositorio.

## Hallazgos priorizados

### S1 · Archivos internos accesibles por HTTP

- Prioridad alta antes de exposición pública; impacto actual limitado por escucha local.
- `server.js:4` usa todo el directorio de trabajo como raíz; `server.js:19` lee cualquier archivo cuya ruta permanezca dentro de ella. No hay lista de archivos publicables ni exclusión de archivos ocultos, configuración o documentación interna.
- En una instancia aislada, con el mismo código y un puerto local efímero, respondieron 200: `/server.js`, `/AGENTS.md`, `/package-lock.json` y un `package.json` dentro de la carpeta `%USERPROFILE%/AppData/Roaming/npm-cache/...` existente en el proyecto. Solo se registraron estado, tamaño y cabeceras; no se vuelcan posibles credenciales.
- No se ha demostrado lectura fuera del proyecto: `/..%5cpackage.json` respondió 403. Una ruta con byte nulo devolvió 404. No confundir exposición de raíz excesiva con una evasión demostrada de recorrido de directorios.
- Riesgo: si se añade un `.env`, copia de seguridad u otro archivo sensible dentro de la raíz, el mismo diseño podría publicarlo. La comprobación es léxica; no se ha probado un escenario con enlaces simbólicos hacia fuera.
- Recomendación: publicar una carpeta de distribución que solo contenga HTML/CSS/JS necesarios; excluir documentos, pruebas, caché, servidor y secretos. Si se conserva el servidor, usar lista explícita de recursos y resolver la ruta real antes de leer.

### S2 · Faltan cabeceras de protección del navegador

- Prioridad media para publicación. No es una explotación XSS demostrada.
- GET `/` no incluye `Content-Security-Policy`, `X-Content-Type-Options` ni una política anti-enmarcado. El código solo establece el tipo MIME.
- Recomendación: CSP con scripts propios y sin `eval`, `object-src 'none'`, restricciones de base y política de enmarcado acorde al destino. No aplicar `frame-ancestors 'none'` indiscriminadamente si se decide incrustar el juego en itch.io; hay que permitir los orígenes previstos. Comprobar posiciones dinámicas de paneles y exportación de imágenes al desplegar la política.
- HTTPS y HSTS corresponden al alojamiento público; la ausencia de HTTPS en el servidor local no es por sí sola un fallo de publicación demostrado.
- Referencias: [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

### S3 · Servidor de desarrollo sin límites de publicación

- Prioridad media si se expone a Internet; no se ha realizado una prueba de denegación de servicio.
- `POST /package.json` responde 200 con el archivo: no hay restricción GET/HEAD. Esto no permite escribir, ejecutar comandos ni hacer pagos.
- `readFile` carga cada archivo completo en memoria; no hay límite explícito de tamaño, caché de respuestas o control de frecuencia en la aplicación. La caché de herramientas amplía innecesariamente los archivos accesibles.
- Recomendación: alojamiento estático/CDN con recursos acotados o servidor endurecido; responder 405 a métodos no soportados, servir solo activos necesarios y definir límites de recursos en el alojamiento.

### S4 · Guardado y admin son controles del cliente

- Prioridad baja en el juego individual actual. No es un panel administrativo del servidor.
- `/admin.html` es accesible y habilita dinero ilimitado dentro de esa partida local. No hay endpoints con poderes sobre cuentas, pagos o archivos del servidor.
- `campaign-save.js` valida versión, tipos, números, límites e identidades; `localStorage` sigue siendo editable por el propio jugador. Permite trampas locales y no prueba logros ni pagos.
- Validación mejorable: límites de longitud del JSON antes de parsear, cantidad de medallas, valores de opciones de historia y coherencia geométrica del campamento restaurado. No se ha identificado un camino desde estos datos hasta ejecución de HTML.
- Recomendación: excluir admin y pruebas de la distribución pública si no son funciones públicas deseadas. Si se añaden clasificaciones, multijugador o ventajas de pago, validar esos estados en servidor; no confiar en partidas o parámetros del navegador.

### S5 · Destino de apoyo configurable acepta cualquier HTTPS

- Prioridad baja / defensa adicional. No hay redirección abierta controlada por un visitante en el flujo actual.
- `support.js` rechaza protocolos no HTTPS y credenciales en URL, pero no restringe el dominio. La configuración actual apunta a `buy.stripe.com` y solo procede de un archivo del proyecto.
- Recomendación: si se mantiene exclusivamente Stripe, permitir únicamente ese dominio (o dominios personalizados explícitos). La protección principal sigue siendo impedir modificaciones no autorizadas del repositorio y del alojamiento: quien puede cambiar el JavaScript también puede saltarse una lista del cliente.

## Controles favorables comprobados

- Sin dependencias de producción declaradas ni scripts de terceros en las páginas revisadas. Esto reduce superficie de suministro, pero no certifica Node, el editor, el sistema o el hosting.
- Búsqueda de patrones de claves privadas de Stripe y claves PEM sin coincidencias en los archivos propios, excluyendo caché y dependencias. No equivale a un escaneo exhaustivo del historial o del disco.
- El enlace público `buy.stripe.com` no es una clave secreta. El juego no captura números de tarjeta, CVV ni credenciales bancarias.
- Enlaces externos relevantes con `target="_blank"` y `rel="noopener noreferrer"`.
- Compartir y exportar resultados requieren clic del jugador; no se han encontrado envíos automáticos ni analítica remota en los módulos revisados.
- Los usos de `innerHTML` revisados contienen plantillas propias o datos de catálogo estático. No se ha demostrado entrada externa que llegue a esos puntos. Usar `textContent` si esos catálogos pasan a venir de usuarios o una API.
- No hay ventajas vinculadas al pago ni confirmación de pago basada en una URL de retorno. No hace falta inventar un webhook para este enlace de apoyo sin recompensas; si se añaden, habrá que verificar cobros en servidor. [Recomendaciones de Stripe](https://github.com/stripe/ai/blob/main/skills/stripe-best-practices/references/payments.md).

## Verificación y límites

- Pruebas HTTP locales no destructivas contra instancia efímera, cerrada al terminar. No se alteró el servidor existente ni se publicaron recursos.
- `npm.cmd run check`: sintaxis correcta y 132 pruebas superadas. Estas pruebas funcionales no son una auditoría completa de seguridad.
- No se verificaron cuenta de Stripe, importe, destinatario, 2FA, recibos, permisos de colaboradores, reglas del dominio, TLS, copias de seguridad o configuración de un hosting remoto.
- Orden recomendado: aislar recursos públicos; elegir despliegue HTTPS; añadir cabeceras compatibles; excluir laboratorios si procede; revisar seguridad de las cuentas de alojamiento y cobro.
