# Plan de experiencia y apoyo al desarrollo

Propuesta del 16 de octubre de 2026. Análisis del código y documentación; no sustituye una sesión de juego ni un perfil de FPS o escucha real. No implementa las propuestas ni activa pagos.

Actualización posterior: autorizadas e implementadas las mejoras de experiencia sin monetización. Incluye prueba de rendimiento en navegador, caídas en caché y detalle limitado, impactos por material, rachas y recompensas agrupadas, mezcla/avisos prioritarios, fases de jefes, diferenciación Eau/radio, anticipación de oleadas, guardado de preparación, medallas y marco cosmético, y resultados compartibles. No se han conectado pagos, donaciones, clasificaciones online ni analítica remota. Falta la validación visual, de escucha y de FPS en una sesión real: la herramienta de control se detuvo al no poder verificar la URL de Chrome.

## Diagnóstico

- Base existente: campaña de 20 rondas en tres niveles, tres jefes, especializaciones, eventos, efectos por material, celebraciones, murmullos y caché para multitudes.
- Las bajas usan caída y polvo genéricos. El historial de bajas no contiene arma ni dirección del impacto; hace falta propagar esos datos para reacciones específicas.
- El audio detecta aumento del contador de bajas, pero no distingue una baja aislada de varias entre actualizaciones. El sintetizador limita voces a 16 sin reservar prioridad para avisos importantes.
- Las caídas vuelven a dibujar personajes completos y polvo durante 0,8 s. La caché de marcha no resuelve ese pico. Medirlo antes de incrementar efectos.
- Eau y radio comparten ralentización: falta una decisión estratégica claramente distinta. Cualquier cambio requiere pruebas y rebalanceo.
- No se ha encontrado persistencia de campaña con localStorage. La pantalla de resultado carece de resumen de rendimiento y opciones de apoyo.

## Orden propuesto y criterios de aceptación

1. **Perfil y presupuesto visual.** Escenarios repetibles de 100/300/600 unidades, bajas simultáneas, fuego y lluvia; medir simulación y dibujo por separado, p50/p95 y memoria. Objetivo inicial: 60 FPS en equipo de referencia; calidad reducida estable donde no llegue. No son resultados medidos.
2. **Impacto y derrota.** Destello local de 60–90 ms, deformación breve, reacción orientada; piedra, cristal, pintura y fuego con identidad propia. Caché de poses de caída, límite a caídas detalladas y representación simplificada del resto sin perder recompensas. Jefe: pausa audiovisual de 120–180 ms solo al resolver la victoria, remate y celebración. Evitar pausas frecuentes que rompan la estrategia.
3. **Audio.** Recursos propios o con licencia: golpe, rotura, fuego, baja, grupo y jefe. Variación moderada de tono, mezcla con limitador, reserva de voces para avisos, atenuar ambiente cuando suena un momento importante. Un acento para bajas agrupadas en vez de una voz por enemigo. Volúmenes separados y controles de destellos/movimiento.
4. **Grandes jugadas.** Contador visual de racha de bajas con ventana inicial de 2 s; sin multiplicar dinero al principio. Un solo distintivo para la jugada colectiva, contadores de recursos agrupados. Resumen de ronda con salud conservada, bajas y defensa destacada. Ejemplo: radio retiene, pintura golpea al grupo, se oyen impactos y un remate conjunto; las recompensas llegan en un único contador.
5. **Decisiones y ritmo.** Diferenciar radio como control de grupos y Eau como daño persistente o debilitamiento, previa decisión de balance. Anticipar composición de oleada, alternar presión y recuperación, dar fases reconocibles a jefes. Guardar al terminar cada ronda con versión de esquema. Objetivos opcionales de habilidad y cosméticos ganados jugando.
6. **Compartir y apoyar.** Tarjeta de resultado compartible a petición, reto reproducible antes de clasificaciones online. Apoyo voluntario desde menú, pausa y final de nivel; sin interrumpir combate ni insistir tras cada derrota. Medir abandono, repetición, rendimiento y uso del apoyo con recogida mínima de datos y consentimiento cuando corresponda.

## Dirección de color

Piedra: crema/ámbar; pintura: violeta/cian; fuego: naranja; radio: azul; olor: verde; recompensas: dorado. Reservar brillo fuerte para momentos relevantes, mantener texto y rutas legibles. Usar pequeñas superposiciones aditivas y texturas compartidas, sin desenfoque individual masivo. Las familias visuales no bastan por sí solas: conservar formas y sonido diferenciados.

## Monetización propuesta

Juego completo gratis con apoyo puntual de 0,50 €, 1 €, 3 € y otro importe; 1 € como sugerencia. Mensaje: «¿Te has echado unas risas? Invita a un hummus al desarrollo». Continuar siempre igual de accesible. Agradecimiento opcional; sin ventajas de combate ni recompensas aleatorias de pago.

Stripe publica para tarjetas estándar del EEE 1,5 % + 0,25 € por operación en España. Neto aproximado de procesamiento: 0,50 → 0,24 €; 1 → 0,74 €; 3 → 2,71 €, con posibles diferencias de redondeo. Excluye impuestos, otras tarifas, divisas, devoluciones y tarjetas de otras categorías. Stripe documenta mínimo de cargo de 0,50 EUR; comprobar condiciones del método y cuenta.

- [Tarifas Stripe España](https://stripe.com/es/pricing)
- [Mínimos por divisa](https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts)
- [Ko-fi: comisiones](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee): alternativa para empezar con enlace externo; propinas puntuales con 0 % de plataforma en modalidad Free, manteniendo comisiones del procesador. Revisar Contributor y configuración.

Recomendación: Stripe Payment Links para importes pequeños exactos; Ko-fi si prima reducir integración inicial y su configuración admite los importes deseados. El pago se realiza en página alojada. Sin secretos en JavaScript. Si se conceden reconocimientos persistentes de pago, verificar pago en servidor mediante webhook firmado e idempotente; nunca fiarse de la URL de vuelta. No crear pagos reales hasta tener cuenta, destino e importes configurados.

No presupuestar ingresos sin usuarios reales. Escenario puramente ilustrativo: 10.000 jugadores únicos × 1 % de aportantes × 1 € = 100 € brutos, unos 73,50 € tras la tarifa indicada, antes de otras deducciones. Validar primero que la gente termina un nivel y vuelve.

## Primera entrega recomendada

Perfil reproducible + bajas eficientes + respuesta visual de impactos + audio de bajas individuales y agrupadas + celebración de jefe. Comparar con versión anterior mediante prueba de juego y medición. Después, progresión/guardado y apoyo voluntario. No ampliar personajes ni mapas en esta primera entrega.
