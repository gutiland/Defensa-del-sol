# Acampada Sol: instrucciones para futuras iteraciones

## Publicación y seguridad

- Servir únicamente el manifiesto de activos permitido; no volver a publicar el directorio completo ni basar la raíz en process.cwd().
- Distribución pública con `npm run build`: solo `dist`, sin laboratorios, cachés, documentos ni secretos. Mantener las pruebas de acceso HTTP y de generación.
- Scripts y estilos propios con CSP estricta. No usar eval, scripts inline o HTML interpolado con entradas externas; posicionar paneles con propiedades CSS individuales.
- Botón de apoyo limitado a la URL pública de Stripe autorizada y host exacto permitido. No introducir claves secretas ni confiar en estados del cliente para acreditar pagos.
- No prometer riesgo cero. Verificar despliegue HTTPS/cabeceras en el proveedor real antes de afirmar que está protegido. Véase docs/secure-deployment.md.

## Objetivo

Mejorar un tower defense satírico que sea legible, divertido y estratégico, con ataque y defensa individuales y duelo local. Las salas online son una fase posterior, todavía no implementada. No prometer éxito comercial ni automatización en segundo plano.

## Forma de trabajar

1. Leer la petición y el estado actual antes de modificar. Consultar `docs/roadmap.md` para las prioridades, sin sustituir la petición del usuario por trabajo ajeno a ella.
2. Avanzar en cambios concretos y revisables. Mantener módulos separados de datos, simulación, interfaz y dibujo. No añadir dependencias sin necesidad.
3. Mantener determinista la simulación: los diseños y diálogos no cambian estadísticas ni rutas. Costes y reglas se validan en el motor.
4. Corregir regresiones encontradas dentro del trabajo autorizado. Añadir pruebas de comportamiento cuando haya cambios de reglas o fallos reproducibles; no crear pruebas que solo repitan textos o detalles del dibujo.
5. Ejecutar `npm.cmd run check` en Windows. Para cambios visuales, revisar tablero, portada y pantallas estrechas en navegador cuando esté disponible. Si no se ha conseguido revisar visualmente, decirlo; las pruebas con Canvas simulado no sustituyen esa revisión.
6. Actualizar la hoja de ruta con resultados y pendientes comprobados. Explicar qué cambió y qué se verificó. No iniciar un bucle indefinido ni afirmar haber probado algo sin evidencia.

## Preferencias confirmadas del usuario

- Referencia de evolución: Plants vs. Zombies. Consultar `docs/design-direction.md`; priorizar claridad de roles, animación y estrategia conservando Sol, sus accesos y la colocación libre.
- Dirección artística actual, que sustituye al realismo anterior: caricatura 2D inspirada en Plants vs. Zombies, con personajes propios, cabezas grandes, ojos expresivos, contornos gruesos, colores vivos y movimiento elástico. No añadir nuevas funcionalidades en una pasada visual.
- El usuario ha retomado expresamente las mejoras de armas: tiendas y base con cuatro niveles (piedras, piedras grandes, botellas y molotov con fuego temporal). Esto está autorizado; no extenderlo a otras mecánicas sin petición.
- Construcción libre dentro de la plaza, sin solapar construcciones ni monumentos.
- Excepción: las barricadas van sobre los caminos y bloquean hasta ser destruidas por los atacantes. No atacan ni causan daño. Las demás construcciones van fuera de los caminos.
- Todos los accesos jugables: caminos completos, no bloqueables, que confluyen hasta la caseta central. Los atacantes atacan la base y no persiguen defensas laterales. Tamaño de construcciones por nivel según la última preferencia; colocación libre fuera de caminos y monumentos.
- Selección múltiple de calles y resumen de reclutas por acceso.
- Tablero y tiendas ilustrados, formas redondeadas y paleta coherente; banderas de estilo cartoon.
- Banderas solo en algunos personajes: España para atacantes; Palestina y Segunda República para defensores. Nunca Israel en estos diseños.
- Pancartas anchas y bajas, a la altura de los pies, sin ocultar las caras.
- Sátira repartida entre ambos bandos. Frases originales y personajes identificados como parodias; no inventar citas reales. Consultar `docs/satire.md` para fuentes y contexto.
- Excepción editorial solicitada: los jefes usan citas reales breves documentadas en `src/data/quotes.js`; conservar autor, fuente y contexto, y no mezclarles remates inventados. Los demás diálogos siguen siendo parodia original.
- No reconstruir botones periódicamente: preservar hover y foco mientras se actualizan contadores.
- Los atacantes pueden superponerse y atacar juntos; no aplicar separación entre unidades ni retrasar reclutas por ocupación. Solo las barricadas bloquean. Comité de Lanzamiento es la tienda de daño en área para contrarrestar grupos.
- Preferencia más reciente: casetas de nivel 1 pequeñas y cutres que crecen y mejoran sus acabados con los niveles. No hay muñeco en todas. Las mejoras se compran en el panel flotante de la caseta dentro del tablero, no en el lateral.
- Cada tipo de atacante tiene un aspecto fijo, sin variantes aleatorias de caras dentro del tipo. Campaña de ocho rondas: raso, agitador, pancartista, perfumado, blindado y Ultrasprint se introducen uno por ronda (1–6), luego Dani (7) y los tres jefes (8). Presentación con ficha descriptiva al primer encuentro de cada tipo en defensa; admin no interrumpe pruebas con fichas.

- Preferencia actual: historia de defensa de 20 rondas. Jefes Dani 5, Pedro 10, Santi 15, los tres 20. Blindado 6, Ultrasprint 7, Socorrista regenerador 8, Indignado con furia 12. Ataque y duelo siguen en 8 rondas.

Historia actual: tres niveles con casetas y mejoras persistentes. Nivel 1: rondas 1-5, Dani. Nivel 2: rondas 6-12, Santi. Nivel 3: rondas 13-20, Pedro. Sustituye el calendario previo de cuatro rondas de jefe y final con los tres juntos.

Actualización de experiencia: radio mantiene ralentización en área; Eau hace daño continuo 2/3/4 por segundo, sin ralentizar ni acumular nubes (perfumados inmunes). Preferencias visuales/audio y guardado de campaña entre rondas son locales. Rachas y medallas no alteran recompensas. Pagos y donaciones excluidos expresamente del alcance actual.

Actualización posterior: autorizado botón de apoyo voluntario en portada y resultados. El usuario ha facilitado un enlace público de Stripe, configurado en src/data/support.js; el botón está activo. No crear cuentas ni cambiar condiciones de cobro sin autorización. Esta autorización sustituye la exclusión anterior solo para el botón de apoyo.
