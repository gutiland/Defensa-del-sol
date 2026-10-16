# Dirección de diseño: claridad de Plants vs. Zombies en Acampada Sol

Guía visual y de legibilidad del juego.

## Referencias

- [Manual original de PopCap alojado por EA](https://akamai.cdn.ea.com/eadownloads/u/f/manuals/GAME-PVZ/en_US_readme.html): tablero por filas y columnas, recursos, familias de unidades, recarga, progresión y grandes oleadas.
- [EA: recursos de accesibilidad de Replanted, con capturas del tablero](https://www.ea.com/able/resources/plants-vs-zombies-replanted).
- [Captura del original consultada como referencia visual](https://www.nintsoft.ro/cdn/shop/files/plants_vs_zombies_screenshot_1.jpg?v=1720952862&width=1946).

## Qué tomar como inspiración

Interpretación para nuestro proyecto: importa que una unidad se reconozca por su forma, que el ataque se entienda y que gastar en economía compita con gastar en defensa. La personalidad nace de postura, movimiento y reacción, además de la cara y el diálogo.

No trasladar automáticamente las filas o casillas de PvZ. Mantener la forma reconocible de Sol, once accesos, construcción libre y ataque y defensa. Los diseños, nombres, interfaz y sonidos deben ser propios.

## Traducción de roles

| Función            | Acampada Sol           | Lectura visual que buscamos                                        |
| ------------------ | ---------------------- | ------------------------------------------------------------------ |
| Ataque básico      | Tienda de piedras      | Defensor junto a una reserva de piedras; gesto de recoger y lanzar |
| Economía           | Cocina comunitaria     | Toldo, olla y vapor; reconocible sin leer el nombre                |
| Resistencia        | Barricada de pancartas | Ancha, baja y con deterioro visible                                |
| Ralentización      | Megafonía              | Altavoz grande y ondas reconocibles                                |
| Daño de zona       | Tienda con molotov     | Botella encendida, impacto y charco con duración visible           |
| Enemigo básico     | Marchante              | Paso regular, silueta sencilla                                     |
| Enemigo rápido     | Agitador digital       | Cuerpo inclinado y paso corto rápido                               |
| Enemigo resistente | Pancartista            | Silueta ancha y pancarta alargada a los pies                       |

Estos papeles ya existen en el prototipo. La prioridad es hacerlos visibles, sin sumar más tipos.

## Dirección artística

Caricatura 2D con personajes cabezones, ojos grandes y asimétricos, contornos fuertes, colores vivos, tiendas redondeadas y movimientos elásticos. Los diseños son propios y conservan la geografía jugable de Sol.

- Entorno de granito y edificios madrileños con luz coherente y colores contenidos.
- Personajes estilizados, con volumen y accesorios claros. Mejorar reconocimiento y expresividad sin perseguir fotorrealismo a escala diminuta.
- Una silueta dominante por rol: olla, altavoz, pancarta, móvil o proyectiles. Reducir accesorios que compiten entre sí.
- Banderas cartoon solo en algunos personajes.
- Proyectiles distintos por tamaño, color y trayectoria. Las cuatro mejoras deben reconocerse también en la propia tienda, no solo en el panel.
- Ataques con anticipación breve, lanzamiento, impacto y recuperación. El momento visual del golpe debe coincidir con el daño del motor.
- Respuesta de daño breve y localizada; evitar parpadeo continuo o efectos que oculten rutas y caras.
- Reservar textos largos para el panel y la galería; el tablero debe leerse principalmente por forma y movimiento.

## Orden de evolución

1. **Ahora: acabado visual de los roles actuales.** Redibujar siluetas, poses de ataque y estado de las cuatro armas; revisar un tablero lleno, no solo retratos aislados.
2. **Después: ritmo y equilibrio.** Probar economía frente a defensa, composición de oleadas y variedad de estrategias. Requiere partidas y resultados registrados antes de ajustar valores.
3. **Claridad de las oleadas:** revisar las fichas de nuevos enemigos y la anticipación de amenazas para enseñar un concepto por vez.

## Cómo evaluar el resultado

- Identificar cocina, tirador, megafonía y barricada sin leer textos.
- Distinguir unidad rápida y resistente por su silueta y movimiento.
- Reconocer piedras, piedras grandes, botellas y molotov durante el combate.
- Entender dónde ha impactado un ataque y qué superficie está ardiendo.
- Mantener visibles accesos, barras de resistencia y selección en partidas con muchas unidades.
- Validar capturas reales de escritorio y móvil; las pruebas automáticas de lógica no demuestran calidad visual ni diversión.

## Animación y dibujo compartido

- Las cuatro armas comparten dibujo entre proyectil, mano del defensor y reserva junto a la tienda (`weapon-art.js`).
- La pose se calcula a partir del disparo y la cadencia reales: carga, lanzamiento y recuperación (`poses.js`). El primer tiro al adquirir un objetivo es inmediato, sin introducir un nuevo retraso de daño.
- Los defensores dejan de caminar en el sitio. Los rápidos tienen inclinación y zancada más rápida; los resistentes son más anchos y caminan más despacio visualmente.
- Cocinas con vapor, construcciones con marcas de desgaste y personajes con una señal breve al recibir impactos.
- El fuego muestra humo suave y un arco de duración. Los efectos se congelan con el tiempo de la simulación al pausar.
- Se conservan Sol, las once calles, la colocación libre, estadísticas y costes existentes.
