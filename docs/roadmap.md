# Hoja de ruta

## Estado actual

Campaña de veinte rondas dividida en tres niveles, con campamento persistente y jefes en las rondas 5, 12 y 20. Ataque y duelo local duran ocho rondas. La construcción es libre fuera de caminos y monumentos; las barricadas bloquean los caminos sin atacar.

El combate incluye mejoras de armas, especializaciones, control de área, eventos de historia, rachas, medallas y guardado local. Los laboratorios de unidades, eventos y rendimiento están disponibles en desarrollo.

La distribución pública se genera en `dist`, sin laboratorios ni documentación. El apoyo voluntario se abre en Stripe desde portada y resultados. Consulta [la guía de publicación](secure-deployment.md).

## Prioridades

1. Medir FPS, tiempos de dibujo y memoria con 100, 300 y 600 unidades en navegadores de escritorio y móvil.
2. Ajustar economía y oleadas con partidas reales: comparar campamentos pequeños, grandes y especializados, y revisar la dificultad del modo ataque.
3. Revisar contraste, controles táctiles, paneles y escenas en pantallas estrechas.
4. Comprobar la mezcla de sonido con multitudes y la legibilidad del combate con efectos reducidos.
5. Validar HTTPS, cabeceras y navegación en el alojamiento definitivo, y comprobar el destinatario y el cobro de Stripe.

El multijugador online queda para una fase posterior: requiere validación de comandos en servidor, salas y reconexión.

## Comprobaciones

`npm.cmd run check` valida sintaxis y pruebas de comportamiento. `npm.cmd run benchmark` mide la simulación; `performance.html` permite medir el dibujo en navegador. `npm.cmd run simulate` compara estrategias programadas como diagnóstico de equilibrio.

La documentación conserva las reglas vigentes y las tareas pendientes, sin diarios de sesiones. Las pruebas automáticas no sustituyen la revisión visual, la escucha ni las partidas con personas.
