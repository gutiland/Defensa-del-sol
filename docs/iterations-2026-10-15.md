# Revisiones del 15 de octubre de 2026

Trabajo autorizado hasta las 22:30, Europe/Madrid (20:30 UTC). Prioridades: fallos reproducibles, claridad de los controles y equilibrio de los sistemas existentes. El usuario amplió expresamente el alcance a animaciones, estética y controles durante la sesión. Sin nuevas dependencias ni cambios de rutas, sátira o dirección artística acordada.

## Iteración 1 · 17:57–18:05 Madrid

- Reinicio del reloj de combate unificado entre partidas y laboratorio. Borra marcas de disparos e impactos y reinicia las recargas de las construcciones; evita arrastrar animaciones de la ronda anterior.
- El laboratorio limpia también las animaciones de muerte activas y admite identificadores reutilizados al reiniciar. Se limita el conjunto de identificadores visuales retenidos a los eventos todavía relevantes.
- Órdenes malformadas, nombres heredados como `constructor` e índices de calle que no son enteros se rechazan sin gastar ni alterar el presupuesto.
- Una base derrotada sigue requiriendo reparación explícita al volver a preparación; los controles de construcción e inicio reflejan ese estado.
- La resistencia de una caseta seleccionada se actualiza durante el combate sin reconstruir sus botones. Si la destruyen, desaparecen los controles obsoletos.
- La habilidad aparece deshabilitada durante la detención activa, incluso si se recarga desde admin.

Verificación: `npm.cmd run check`, 53 pruebas correctas. Pruebas nuevas de ciclo de combate, órdenes inválidas, limpieza visual y selección destruida. No se ha realizado revisión visual: tanto el acceso habitual al navegador como la inicialización de `computer-use` fallan con «trusted Node process exited unexpectedly; kernel reset». No se han instalado herramientas alternativas.

Pendientes para la siguiente revisión: medición del coste de simulación con grupos grandes; coherencia del laboratorio al cargar oleadas y limpiar combates; documentación y textos que aún describen reglas antiguas. La diversión y el equilibrio con personas siguen pendientes de prueba humana.

## Iteración 2 · 18:05–18:08 Madrid

Prueba de carga finita: 1.800 pasos a 60 Hz con 100, 300 y 600 atacantes básicos en el laboratorio. Se detectó que las comprobaciones de auras recorrían toda la población para cada atacante y cada consulta visual; el cálculo de daño también calculaba velocidad innecesariamente.

Se separó protección de velocidad y se preparan listas de emisores una vez por paso/dibujo. Las listas conservan referencias a las unidades, por lo que sus movimientos dentro del mismo paso siguen siendo observables. Las auras siguen sin acumularse, y los emisores muertos dejan de actuar.

Una ejecución local antes/después dio 148/746/32.097 ms frente a 84/138/230 ms para 100/300/600 unidades. Son medidas de simulación de esta máquina y ejecución, no FPS ni una garantía de rendimiento en otros equipos. Escenario reproducible con `npm.cmd run benchmark`.

Verificación: 54 pruebas correctas. Nueva prueba de equivalencia de auras filtradas frente al recorrido completo, incluyendo movimiento, muerte, superposición y contramedidas.

## Iteración 3 · 18:08–18:13 Madrid

- Cargar una oleada de admin es una orden única que valida la ronda antes de limpiar el combate. Una selección inválida conserva la prueba en curso.
- Los rótulos de jefes se activan al enviarlos manualmente y se limpian al vaciar el laboratorio.
- El alcance de Abucheo (+30) se comparte entre motor, panel y círculo táctico. Antes, el círculo seguía mostrando el alcance inicial.
- Coro conserva su disparo de grupo pero deja de recibir una bonificación de cadencia no anunciada. Cadencia y Bombardeo mantienen sus reducciones expresas del intervalo.
- El panel explica las estadísticas del fuego especializado. Se corrigieron caracteres rotos y se eliminaron frases ficticias de jefe que ya se sobrescribían con citas documentadas; las citas vigentes permanecen intactas.
- README y hoja de ruta distinguen las reglas actuales de sus decisiones históricas: cinco rondas de defensa, mejoras durante combate, caricatura 2D y laboratorio.

Verificación: 56 pruebas correctas, incluidas carga atómica del laboratorio y disparo real dentro del alcance especializado.

## Iteración 4 · 18:13–18:21 Madrid

Se añadió `npm.cmd run simulate`: simulaciones finitas de siete compradores defensivos y seis estrategias de ataque. El comprador coloca por cobertura geométrica y reinvierte automáticamente; no representa comportamiento humano ni comprueba legibilidad visual.

Defensa: no invertir pierde en ronda 2; mejorar solo la base pierde en ronda 5; casetas, área, combinación, cocina y olor completan las cinco rondas en este escenario. No se modificaron oleadas ni estadísticas defensoras basándose únicamente en esa facilidad automática.

Ataque: antes del ajuste, campañas de un solo tipo normal no ganaban por ninguna de las once calles. Básicos, rápidos y perfumados dejaban la base intacta; los pesados solo arañaban algo de vida en cuatro accesos. Pedro y Santi baratos ganaban por Arenal en dos rondas.

Se retiró una caseta del campamento fijo del modo ataque (queda caseta, megafonía, barricada y base). Se conservan rutas, intervalos de aparición y reglas de duelo local. Reclutar a Dani cuesta ahora 210 y a Pedro/Santi 200; el laboratorio sigue siendo ilimitado y las pruebas de jefe no cobran reclutamiento.

Después del ajuste, por Arenal los básicos ganan en ronda 8, los pesados en la 6 y ahorrar para Pedro gana en la 4. Rápidos, perfumados y una mezcla simple no ganan solos en este escenario; no se afirma que todas las composiciones sean equivalentes. Añadida regresión de campañas ganables con unidades normales. Verificación: 57 pruebas correctas. El equilibrio final continúa pendiente de jugar con personas.

## Iteración 5 · 18:23–18:30 Madrid; cierre a las 22:40

- Vista previa de la construcción real, con transparencia, huella válida/inválida y coste.
- Modo de colocación separado de inspección: tras comprar una caseta, el siguiente clic no compra otra por accidente. Mayús conserva colocación para repetir; Esc, clic derecho y botón cancelan.
- Atajos 1–6 para casetas, Q para Asamblea y Enter para iniciar ronda, respetando formularios y atajos del navegador. Estado accesible de selección en las tarjetas.
- Los mensajes de error de colocación duran 3,5 segundos y no desaparecen con los contadores; después se restaura el estado de la fase.
- Animaciones de aparición y mejora de construcciones, respiración de defensores y pasos desfasados por unidad. Vapor, banderas y olor se animan también en preparación; el reloj visual está separado de las reglas y respeta la pausa durante combate.
- Los detenidos y los bloqueados ya no levantan polvo de pasos. Casetas y atacantes se dibujan por profundidad, con indicadores de enemigos por encima de las figuras. Dibujo de unidades extraído a su propio componente.

Incidencia de ejecución: la llamada de herramientas iniciada alrededor de las 18:30 registró 14.935,5 segundos antes de devolver el control; el siguiente reloj confirmó las 22:39 de Madrid. No hubo iteración efectiva durante ese bloqueo. Se cerró la iteración pendiente con formato y pruebas, sin iniciar más mejoras tras la hora límite.

Verificación final: `npm.cmd run check`, 59 pruebas correctas. Se corrigió un fallo detectado en la comprobación del renderizador al seleccionar la variante visual de la base. Las pruebas incluyen cancelación, atajos, persistencia de avisos y prevención de compras accidentales. El navegador volvió a fallar con «trusted Node process exited unexpectedly; kernel reset» antes del bloqueo; estética, profundidad y animaciones siguen pendientes de inspección visual real. No se afirma haber revisado escritorio o móvil.

## Petición posterior: casetas por nivel y tipos reconocibles

Implementada una nueva progresión que sustituye la campaña de cinco rondas anterior: ocho rondas, seis tipos normales con aspecto fijo, fichas al primer encuentro y jefes introducidos en 7–8. Casetas pequeñas/remendadas que crecen por nivel, personal solo en algunas y mejoras flotantes sobre el tablero. Ver [camp-progression.md](camp-progression.md). 63 pruebas correctas; campaña completa simulada con varias estrategias. La inspección visual sigue pendiente por fallo al arrancar el navegador.
