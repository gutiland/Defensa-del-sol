# Pruebas de equilibrio

## Campaña completa

`node scripts/campaign-strategies.js` prueba 18 combinaciones con provisiones reales, compras validadas y pasos de simulación de 1/60 s. Todas parten de una partida nueva; no se concede dinero, no se repara la base artificialmente y no se cambian estadísticas. Se construye durante el combate, se usa Asamblea y se aceptan las opciones gratuitas de los eventos.

Cuatro combinaciones completan las veinte rondas:

| Apertura | Primeras mejoras | Cocinas | Vida final de base | Casetas finales | Casetas con nivel superior a 1 |
| --- | --- | --- | --- | --- | --- |
| 2 tiradores | Nivel 2 antes de invertir en economía | 2 | 608 | 55 | 40 |
| 2 tiradores | Nivel 3 antes de invertir en economía | 2 | 608 | 48 | 37 |
| 3 tiradores | Nivel 2 antes de invertir en economía | 2 | 582 | 59 | 43 |
| 3 tiradores | Nivel 3 antes de invertir en economía | 2 | 483 | 50 | 37 |

Después de la apertura se introducen radios, dos cocinas desde la ronda 3, mejoras de cocina y Comedor. La expansión incorpora aproximadamente una radio y una caseta de área por cada cuatro tiradores, y mejora y especializa los puestos de daño con Contundencia o Gran salpicadura. Las posiciones priorizan cobertura del recorrido; las radios intentan cubrir zonas distintas. Asamblea se activa cuando hay al menos cuatro enemigos a menos de 220 unidades de la base.

Las variantes sin cocina pierden entre las rondas 15 y 20. Invertir en cuatro cocinas tan pronto pierde entre las rondas 4 y 7. Las pruebas simples de `scripts/simulate.js`, sin estas combinaciones de radio, especializaciones y habilidad, tampoco completan la campaña.

## Ejemplo reproducible

`node scripts/campaign-strategies.js --example` imprime la configuración, los estados al comienzo de cada ronda y las órdenes de apertura.

La variante de dos tiradores y mejoras iniciales hasta nivel 2 comienza con casetas en coordenadas de juego (440, 366) y (408, 334). Usa Asamblea a los 15,62 s y compra la primera radio en (312, 398) a los 16,25 s. Después emplea únicamente las provisiones que va obteniendo.

| Comienzo de ronda | Vida de base | Casetas |
| --- | --- | --- |
| 5 | 660 | 5 |
| 7 | 660 | 8 |
| 10 | 660 | 17 |
| 12 | 660 | 25 |
| 15 | 660 | 35 |
| 17 | 660 | 45 |
| 20 | 660 | 52 |

Termina con 608 de vida, 55 casetas y 47 usos de Asamblea. El test `campaign-victory.test.js` comprueba que esta estrategia sigue siendo capaz de ganar con recursos legales y al menos veinte casetas mejoradas.

## Ronda final aislada

`node scripts/camp-balance.js` prueba campamentos preparados al máximo. No evalúa la compra durante la campaña.

| Casetas | Resultado | Vida final de base |
| --- | --- | --- |
| 12 | Derrota | 0 |
| 19 | Derrota | 0 |
| 20 | Derrota | 0 |
| 24 | Victoria | 508 |
| 32 | Victoria | 788 |

## Límites

Son estrategias automáticas concretas, no una búsqueda exhaustiva ni una prueba de dificultad humana. Comprar cada cuarto de segundo y activar la habilidad con precisión puede resultar exigente, aunque el jugador puede pausar para construir. Las victorias no demuestran que cualquier colocación funcione, ni las derrotas que otras estrategias sean imposibles. No se ha realizado una partida visual de usuario durante estas comprobaciones.
