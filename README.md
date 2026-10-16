# Acampada Sol

Tower defense 2D para navegador ambientado en una Puerta del Sol imaginaria y satírica. Usa módulos nativos y no necesita instalar dependencias.

La campaña tiene tres niveles y veinte rondas: Dani cierra el primero en la ronda 5, Santi el segundo en la 12 y Pedro el tercero en la 20. Mantienes el campamento y sus mejoras. Los tipos de atacante se introducen progresivamente; una ficha pausa la partida al ver cada tipo por primera vez. Admin permite probarlos sin interrupciones.

## Jugar

Para publicar usa `npm.cmd run build` y sube **solo `dist`**. `npm.cmd run preview` comprueba esa salida localmente. Se incluye configuración para Netlify y cabeceras de protección; consulta [secure-deployment.md](docs/secure-deployment.md). El servidor local ya no publica documentos ni archivos arbitrarios del proyecto. Reinicia cualquier servidor anterior para activar los cambios.

Botón de apoyo voluntario en portada y resultados: `src/data/support.js` contiene el enlace público de Stripe autorizado. Solo se admiten enlaces HTTPS del host exacto `buy.stripe.com`; otros proveedores requieren revisar expresamente esa restricción. Si está vacío o es inválido, el botón permanece desactivado. El pago se abre en otra pestaña; el juego no recoge tarjetas, no confirma pagos ni concede ventajas. No introduzcas claves secretas en ese archivo.

Abre `index.html` mediante un servidor local. Con Node instalado:

```
npm start
```

Visita http://localhost:3000. Para detener el servidor, pulsa Ctrl+C en la terminal.

## Modos

- **Defensa:** tienda central, 110 provisiones y modo historia de veinte rondas. Construye y mejora también durante el combate. Cada baja paga provisiones: básicos 5, rápidos 6, pesados 12, perfumados 8, blindados 10, Ultrasprint 6 y jefes 55. Tiendas y base tienen cuatro niveles; otras construcciones, tres. Las cocinas producen ingresos y las construcciones recuperan 25 de resistencia entre rondas.
- **Ataque:** recluta unidades por accesos contra un campamento que recibe una nueva defensa entre rondas. Dispones de ocho rondas para destruir la tienda central. Los daños persisten entre rondas; los supervivientes del campamento reparan 25 puntos.
- **Duelo local:** dos personas comparten navegador. El defensor construye y pasa el turno al atacante, que recluta y despliega. El defensor gana si resiste ocho rondas; el atacante gana al destruir la base.

Los atacantes siguen caminos completos hasta la tienda central. Las barricadas se colocan sobre el camino: detienen a los atacantes, que deben destruirlas antes de continuar. Las barricadas no causan daño. Las demás construcciones se colocan libremente fuera de los caminos. No hay decisiones estratégicas de IA. Las casetas empiezan pequeñas y remendadas y crecen visualmente con los niveles, sin cambiar las reglas de colocación. Solo algunas tienen defensor visible.

La historia se guarda automáticamente durante la preparación y al terminar cada ronda, en este navegador. «Continuar historia» recupera el campamento; si cierras durante combate, vuelves al último punto de preparación. Admin, sala de eventos y ataque no sobrescriben la campaña. Si el almacenamiento está bloqueado, se puede jugar pero no guardar.

Radio ralentiza en área; Eau causa 2/3/4 de daño continuo por segundo según nivel, sin ralentizar ni acumular nubes. Los perfumados son inmunes a Eau. Los jefes muestran su fase; Dani potencia más a la escolta y Santi acelera al bajar de media vida, mientras Pedro alterna escudo y carrera.

Las bajas forman rachas visuales con una ventana de 2 segundos, sin multiplicar recompensas. El diario incluye resumen de oleada, caseta destacada y cuatro medallas opcionales. «Coro de diez» desbloquea el marco dorado del diario; las medallas se conservan localmente. El resultado se puede compartir o guardar como tarjeta PNG por acción del jugador.

«Imagen y mezcla» controla destellos, movimiento reducido, efectos ligeros y volúmenes de efectos/ambiente. Los sonidos son síntesis propia, sin grabaciones externas. No hay pagos ni recogida remota de métricas.

Abre [performance.html](performance.html) para comparar 100/300/600 atacantes en marcha, bajas simultáneas, lluvia o fuego. Mide FPS y tiempos P50/P95; donde el navegador lo permite, muestra memoria JS (no memoria GPU). Mantén visible la pestaña y repite el mismo escenario para comparar.

## Estructura y siguiente fase

`src/engine.js` contiene el estado, los comandos validados y la simulación, sin dependencias del navegador. `src/main.js` dibuja y recoge las acciones. Esta separación permite conectar los comandos a un servidor autoritativo en una siguiente fase.

**El multijugador online aún no está implementado.** Requiere un servidor de salas, asignación de bandos, validación de turnos y presupuestos en servidor, sincronización del estado y reconexión. El duelo local sirve para probar las reglas entre dos jugadores antes de esa fase.

Ejecuta `npm.cmd run check` en Windows para comprobar sintaxis y reglas. `npm.cmd run benchmark` realiza una prueba finita del motor con grupos de 100, 300 y 600 atacantes; mide simulación, no FPS del navegador. `npm.cmd run simulate` compara compradores y ejércitos programados para diagnosticar equilibrio; no sustituye las partidas con personas.

Durante el combate puedes pausar con el botón o la barra espaciadora, y alternar entre 1×, 2× y 3×. La opción «Ver rutas de entrada» muestra los recorridos y resalta las calles seleccionadas. Pulsa una construcción para inspeccionar su alcance y estadísticas. En defensa puedes construir y mejorar durante las oleadas; ataque y duelo conservan sus turnos de preparación.

Al colocar una caseta se selecciona para inspeccionarla, evitando compras accidentales con el siguiente clic. Las mejoras, especializaciones y retirada aparecen en un panel flotante sobre el tablero, junto a la caseta seleccionada. Mantén Mayús al colocar para construir varias seguidas. Esc, clic derecho o «Cancelar selección» salen de colocación. Atajos fuera de formularios: 1 caseta, 2 área, 3 megafonía, 4 olor, 5 cocina, 6 barricada; Q activa Asamblea y Enter inicia la ronda. Los mensajes de colocación permanecen 3,5 segundos aunque se actualicen los contadores.

`npm.cmd run check` comprueba la sintaxis de los módulos y ejecuta las pruebas. Las prioridades de próximas iteraciones están en `docs/roadmap.md`.

Las tiendas defensoras y la tienda central tienen cuatro niveles de arma: piedras (7 de daño), piedras grandes (12), botellas (18) y molotov (23). Las mejoras cuestan 30, 60 y 90 provisiones. Selecciona la tienda para mejorarla durante preparación o combate en defensa. El molotov deja al impactar un charco de radio 45 que inflige 4 de daño por segundo durante 4 segundos; los charcos superpuestos no multiplican el daño. El fuego se limpia al terminar la ronda. Las demás construcciones conservan sus tres niveles. Estos valores son los iniciales, antes de especializaciones y protección enemiga.

## Componentes

El proyecto usa módulos ES nativos, sin framework ni compilación:

- `src/main.js`: ciclo de la partida y coordinación de acciones.
- `src/engine.js`: simulación y validación de comandos.
- `src/data/catalog.js`: construcciones, unidades, parcelas y accesos.
- `src/data/map.js`: calles y conversión entre coordenadas de juego y pantalla.
- `src/ui/`: panel, tienda, selección de construcciones y diálogo de resultado.
- `src/render/board.js`: composición del tablero y caché del fondo estático.
- `src/render/sprites.js`: construcciones y elementos de combate.
- `src/render/architecture.js`: fachadas y etiquetas reutilizables.
- `src/render/landmarks.js`: monumentos y accesos de transporte ilustrados.
- `src/plaza.js`: composición del entorno urbano, pavimento y calles.

La vista es una caricatura 2D con personajes propios, contornos gruesos, colores vivos y construcciones pequeñas. Conserva fachadas en perspectiva y la geometría adaptada de Sol. Las posiciones del campamento se expresan en coordenadas de juego; la proyección visual se comparte con la conversión de clics.

### Referencias del mapa

- [Ayuntamiento: distribución de calles, bancos y monumentos](https://diario.madrid.es/blog/notas-de-prensa/el-ayuntamiento-da-luz-verde-a-la-nueva-puerta-del-sol-un-espacio-mas-ordenado-equilibrado-y-definitivamente-peatonal/).
- [Turismo de Madrid: elementos actuales de Sol y fuente de Carlos III](https://www.esmadrid.com/informacion-turistica/puerta-del-sol).
- [Plano municipal del proyecto de reforma](https://diario.madrid.es/wp-content/uploads/2022/02/Planta-proyecto-Sol.pdf).

La geometría está dibujada a mano y adaptada al tablero: no es una reproducción georreferenciada ni a escala. Las fachadas están estilizadas y no reproducen cada edificio o comercio. El documento de proyecto es una referencia de diseño, no una garantía de lo finalmente construido; se conserva una representación de la cubierta acristalada reconocible de Cercanías. Las tiendas de campaña pertenecen al juego.

Los once accesos están disponibles. Victoria enlaza con Carrera de San Jerónimo mediante una ruta con giro. Los caminos visibles y la simulación comparten geometría, rodean la plaza y confluyen en un corredor final hasta la base. Los atacantes pueden superponerse; solo las barricadas bloquean el paso.

## Combate y especializaciones

### Laboratorio y corrección de colocaciones

Abre [admin.html](http://localhost:3000/admin.html) con el servidor arrancado, o entra desde el enlace de la portada. El laboratorio tiene dinero ilimitado y permite construir defensas, enviar cualquier atacante o jefe por cualquier calle, cargar oleadas, limpiar el combate, reparar, alternar la invulnerabilidad de la base, recargar la habilidad y restablecer especializaciones. Pausa y velocidad funcionan igual que en el juego. El laboratorio permanece en la prueba actual hasta que vuelves a preparación o cargas otra oleada.

En defensa normal, usa **Deshacer última colocación** o selecciona la nueva tienda y pulsa **Retirar y recuperar…**. Se devuelve todo lo invertido en ella, incluidas mejoras, hasta que comienza la ronda. Las construcciones que ya participaron en rondas anteriores y la base no se pueden retirar.

Selecciona una caseta para subir su nivel o elegir una de dos especializaciones permanentes. Las mejoras de arma se conservan: piedras, piedras grandes, botellas y molotov. Las ramas ofrecen cadencia o potencia, radio de pintura o bombardeo, megafonía de grupo o mayor alcance, olor amplio o concentrado, ingresos o catering, resistencia o reparación. Las barricadas siguen sin atacar; la autorreparación exige dos segundos sin recibir golpes.

En defensa, el botón Asamblea detiene a los atacantes 3 segundos y recarga en 25 segundos de simulación. Pausa y velocidad respetan estos tiempos. Los efectos sonoros se habilitan al empezar a jugar: construcción, mejoras, reclutamiento, armas, bajas, habilidad, rondas y resultado. El botón Sonido silencia inmediatamente y el deslizador ajusta el volumen (35 % inicial). Son efectos sintetizados originales, sin archivos ni descargas. Se limitan las voces simultáneas y repeticiones para que los grupos grandes no saturen el audio.

Dani acelera escoltas cercanos, Pedro alterna protección y carrera cada 4 segundos, y Santi tiene armadura. Área, fuego y Contundencia contrarrestan la armadura; la protección de Pedro sigue reduciendo daño.

En ataque y duelo, reclutar a Dani cuesta 210 provisiones y a Pedro o Santi, 200. El presupuesto inicial exige ahorrar para ellos. Admin conserva su dinero ilimitado y permite enviar jefes directamente.

«Eau de Asamblea» cuesta 50 y ralentiza por olor en su radio (35/40/45 % según nivel, antes de especializar). «Cayetano Premium» cuesta 30 y es inmune solo al olor. Los agitadores digitales aceleran un 15 % a aliados de otros tipos dentro de radio 65. Las copias de una misma aura no se acumulan. Al combinar olor y megafonía se aplica la ralentización más fuerte.

Modo historia: Dani en ronda 5, Pedro en 10, Santi en 15 y los tres en 20. Cada ronda avanza el relato de la plaza. Nuevos atacantes: Socorrista (ronda 8, regenera 5 de vida/s) e Indignado (ronda 12, bajo media vida gana 60 % de velocidad y 50 % de golpe). El laboratorio permite probar las veinte rondas.

En ataque llegan refuerzos al campamento antes de cada ronda 2 a 8, con animaci?n de montaje. El presupuesto entre asaltos es 100 + 35 por n?mero de ronda. Al terminar cualquier ronda se limpian las selecciones de caseta, colocaci?n y calles.

Historia actual: tres niveles con casetas y mejoras persistentes. Nivel 1: rondas 1-5, Dani. Nivel 2: rondas 6-12, Santi. Nivel 3: rondas 13-20, Pedro. Sustituye el calendario previo de cuatro rondas de jefe y final con los tres juntos.

## Sala de eventos

Abre `http://localhost:3000/events.html` para probar directamente lluvia, tienda ocupada, 12-O y entradas de los tres jefes. Incluye campamento preparado, dinero infinito, base invulnerable, escenas con decisiones, repetici?n, pausa, velocidad y avance de cinco segundos. La prueba no cambia de ronda autom?ticamente ni afecta partidas normales. Tambi?n hay enlaces desde la portada y admin.
