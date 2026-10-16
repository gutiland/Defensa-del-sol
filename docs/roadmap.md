# Hoja de ruta

## Estado actual

La X del panel de mejoras limpia también la selección y la previsualización, igual que cancelar; el panel permanece cerrado al actualizar contadores.

Al superar una ronda con ingreso, el Ministerio del Táper anuncia el reparto con una frase satírica y muestra provisiones de ronda y cocina, más monedas hacia el marcador. El efecto usa el importe abonado por el motor, dura cuatro segundos de reloj visual en preparación y se cancela al iniciar combate; no repite cobros ni se reproduce al cargar. Sin monedas en movimiento reducido. La última ronda mantiene su economía existente (sin ingreso entre rondas).

La pantalla de derrota ya no muestra «Guardar tarjeta»; conserva compartir resultado y apoyo al desarrollo. La descarga de tarjeta sigue disponible tras una victoria.

Las escenas de evento y jefe abren desde arriba: foco inicial en el título sin desplazar la página y reinicio del scroll del modal, decisiones y referencias después de abrir y al pasar de diálogo. Evita heredar la posición de la escena anterior o saltar directamente al botón inferior.

Reverso de cartas con función resumida y una segunda explicación breve: progresión de proyectiles, ralentización, inmunidad al olor, ingresos o bloqueo. El coste sigue visible y el detalle se desplaza dentro de la tarjeta si falta altura.

Tablero y selector ocupan sus áreas completas: eliminados los topes de anchura del mapa basados en altura. Canvas ajustado al ancho y alto disponibles, tanto con lateral como con catálogo inferior; las coordenadas de interacción siguen escalándose por eje. Se mantiene la partida dentro de una ventana y el desplazamiento interno del catálogo.

Selector de defensas con un recordatorio mínimo de función (daño individual, área, ralentización, daño continuo, ingresos o bloqueo). La explicación completa sigue en el tutorial de colocación y en las etiquetas accesibles. Las tarjetas se voltean al seleccionarlas en todos los tamaños de pantalla.

Eau de Asamblea muestra ondas y neblina en todo su radio efectivo, incluidas mejoras y especialidad; no dibuja aura si está destruida o bloqueada por el evento. Efectos acotados y versión ligera. La mitad de atacantes, elegida por identificador par, muestra ojo morado, tirita y ropa marcada según vida restante, con un pequeño gesto al recibir impactos. Las marcas van sobre los sprites compartidos sin multiplicar variantes de caché ni modificar estadísticas; desaparecen si recuperan toda la vida. Animaciones respetan pausa y movimiento reducido.

Las tarjetas del catálogo se voltean al seleccionar una defensa: cara inicial con caseta, nombre y coste; reverso con función y coste. Solo la tarjeta seleccionada muestra su función. Se reutilizan los botones al cambiar de selección para conservar foco y transición; sin animación con movimiento reducido.

Panel de mejoras con etiquetas breves: icono y cifra (intervalo −35 %, daño +55 %, vida +240, curación +12/s, etc.), coste en una línea separada y nombre corto de caseta. El detalle completo se conserva en ⓘ, tooltip y etiquetas accesibles; las cifras de las mejoras también se muestran en móvil.

Servidor local: al recargar CSS también se renueva el manifiesto de recursos, incluidas fuentes locales. La petición automática de Chrome DevTools se admite solo en desarrollo local y responde 204 sin exponer rutas del equipo; la CSP permite únicamente esa URL. La distribución pública conserva `connect-src 'none'`.

Progresión visible de equipamiento: área pasa por bolas de pintura, botes, petardos y granadas (cuatro niveles, daño 6/10/14/16, mismo radio 65 y cadencia 1,8 s). Proyectil, reservas, pose, impacto y sonido acompañan el arma real. Radio escala de megáfono a torre de sonido; olor de ropa a difusor y ventilador; cocina de hornillo a cocina de campaña; barricadas de palés a doble parapeto. Los tres niveles de estas últimas conservan sus estadísticas; animaciones de ondas, humo, vapor y refuerzos se diferencian por nivel. Se mantienen casetas y caché de estructuras por nivel; partículas acotadas y movimiento reducido respetado.

Tutorial sustituido por ventanas modales breves con flecha y recuadro sobre el elemento explicado. Hay que cerrar cada explicación para continuar; pausa y restaura el combate, se muestra una sola vez por lección y puede omitirse. No se superpone con fichas de enemigos o escenas. Marcador compacto de ronda, provisiones y base dentro del tablero. Partida ajustada al viewport con catálogo de desplazamiento interno (horizontal en móvil); portada y laboratorios conservan su distribución.

Retirado el menú de destellos, movimiento reducido, efectos ligeros y mezcla de efectos/ambiente de partida y laboratorios. Se conservan sonido y volumen general, así como el respeto de las preferencias de movimiento del sistema.

Catálogo de casetas con explicación visible y breve de su función (daño individual, área, ralentización, nube, provisiones o bloqueo), sin depender del hover. El diario muestra únicamente el episodio de la ronda actual; retirado el selector de capítulos y conservado el minimizado.

En móvil, mejoras en panel fijo inferior sobre el diario, con altura limitada al viewport, desplazamiento interno, zonas táctiles de 44 px y especialidades resumidas en icono y coste (efectos disponibles en ⓘ).

El nivel 1 (rondas 1–5) enseña objetivo y caja, primera caseta, deshacer, Asamblea y pausa, especialidades, radio y área, barricadas y eventos, preparación del jefe y persistencia. Se puede omitir para la partida actual; no aparece en laboratorios, duelo ni niveles posteriores.

Ajuste de legibilidad: fuente cartoon reservada a marca y títulos grandes; botones, controles, descripciones y títulos pequeños usan Arial/Helvetica. Desactivada la síntesis de negrita y retirado el escalado de controles al interactuar; se conserva la respuesta de color y el foco visible. Las sombras de texto siguen desactivadas. Pendiente revisión visual en el equipo del usuario.

Icono de pestaña propio: caseta dorada y sol sobre fondo verde, en SVG local incluido en la distribución y en los laboratorios de desarrollo.

Tipografía Lilita One local para títulos y botones, con licencia SIL OFL incluida; cuerpo de texto con fuentes del sistema para facilitar la lectura. Eliminada la importación externa de Google Fonts. El servidor y la distribución conservan los bytes de la fuente y la sirven con su tipo MIME, sin ampliar la política de seguridad.

El panel de mejoras de casetas se superpone al diario y al botón de ronda. Cabecera compacta con icono y nivel, mejora con arma y coste, acciones secundarias con símbolos y estadísticas desplegables; las etiquetas accesibles conservan la explicación completa.

Controles de partida compactos con iconos, explicaciones accesibles y respuesta animada al pasar el cursor, enfocar o pulsar; respetan el movimiento reducido del sistema. Catálogo alineado con el inicio de ronda mediante una barra de controles común sobre mapa y lateral. La prueba de jefes queda fuera de la partida normal y se conserva en el laboratorio. Pendiente comprobar visualmente en navegador: no había superficies disponibles en esta sesión.

Campaña de veinte rondas dividida en tres niveles, con campamento persistente y jefes en las rondas 5, 12 y 20. Ataque y duelo local duran ocho rondas. La construcción es libre fuera de caminos y monumentos; las barricadas bloquean los caminos sin atacar.

El modo atacante individual queda oculto en la portada del MVP. Su código, reglas y pruebas se conservan para retomarlo más adelante. Defensa y duelo local siguen disponibles.

El apoyo económico se presenta como «Apoyar el desarrollo», destinado a continuar este juego y crear otros juegos, productos y proyectos de mayor alcance. Se explica el carácter voluntario y la apertura de Stripe antes de pagar. El juego sigue siendo gratuito; no se anuncia un importe que dependa de la configuración externa del enlace.

El combate incluye mejoras de armas, especializaciones, control de área, eventos de historia, rachas, medallas y guardado local. Los laboratorios de unidades, eventos y rendimiento están disponibles en desarrollo.

Laboratorio: «Preparar ronda con presupuesto» deja la base sin mejorar y el tablero vacío para construir antes de iniciar. Asigna caja inicial más todas las bajas e ingresos fijos anteriores, incluidos jefes y refuerzos de eventos gratuitos; excluye gastos previos, cocinas y decisiones de pago. Activa resistencia real de campaña, eventos y daño a la base. «Reiniciar con dinero ilimitado» restaura el laboratorio libre. No sobrescribe el guardado de campaña.

Inspector de Cremalleras desde la ronda 7: uno inicialmente y uno adicional cada cuatro rondas. Se detiene en el camino para atacar la caseta más cercana a menos de 85 unidades, con aviso de 0,85 s y 6 de daño base cada 2,8 s. No abandona su ruta; las barricadas tienen prioridad. Identidad propia con gorra amarilla y carpeta, ficha de primer encuentro y marcador sobre la caseta objetivo. Le afectan la escala de campaña, control de radio y Asamblea.

Las presentaciones de enemigos se recuerdan por campaña, incluso si se pierde o se cierra durante el combate. Cargar conserva el punto de preparación y las fichas ya mostradas; los tipos nuevos siguen presentándose. Las partidas antiguas recuperan los tipos de las rondas anteriores. Empezar otra campaña reinicia sus descubrimientos.

Durante toda la ronda de lluvia, olor causa un 50 % menos de daño y molotov un 40 % menos, tanto en impacto como en fuego del suelo. Las cubiertas solo evitan la penalización inicial de cadencia. El daño habitual se recupera al terminar el evento.

El diario se abre con el capítulo 1 al crear la partida. Cada nueva ronda muestra su capítulo desde la preparación y lo abre al comenzar el combate; las actualizaciones ordinarias respetan el minimizado manual. Los resultados de rondas terminadas se consultan seleccionándolas en el archivo.

La ronda 17 incluye el cierre temporal de Metro de Sol: escena, referencia de RTVE del 16 de octubre, señal de prohibición sobre la boca de Metro y vallas animadas. Toda la oleada entra por Preciados; regular el acceso cuesta 180 provisiones y retrasa las salidas 12 segundos sin cambiar de calle. No afecta a Cercanías. Disponible en la sala de eventos; el guardado admite las cuatro decisiones de historia.

Costes de eventos crecientes con la campaña: mediación 80, cubiertas 100, organización del 12-O 150 y regulación del acceso 180 provisiones. Se mantienen las alternativas gratuitas y el cobro único; equilibrio con jugadores pendiente.

Comprobadas conservación de la oleada, separación de salidas, coste único, limpieza al terminar y restauración de las cuatro decisiones. Pendiente revisión visual del nuevo evento en navegador.

La distribución pública se genera en `dist`, sin laboratorios ni documentación. El apoyo voluntario se abre en Stripe desde portada y resultados. Consulta [la guía de publicación](secure-deployment.md).

En desarrollo, recargar la portada actualiza el manifiesto de módulos para admitir nuevos imports sin reiniciar el servidor. La distribución pública mantiene su manifiesto fijo; los archivos ajenos al juego siguen bloqueados.

Corrección de arranque comprobada con peticiones HTTP a los recursos públicos en el servidor local. La revisión visual en navegador sigue pendiente.

Los personajes conservan guiños políticos con nombres ficticios y diálogos originales. Se han retirado las citas reales del combate y las citas no cotejadas del diario; noticias y ficción se distinguen en la interfaz. Criterios y revisión editorial pendiente en [satire.md](satire.md).

## Prioridades

La dificultad de defensa escala desde la ronda 6 sin cambiar el nivel 1. Nivel 2: vida normal ×1,5–3, velocidad +4–10 % y daño +10–35 %. Nivel 3: vida ×3,6–6,5, velocidad +12–22 % y daño +40–75 %. Grupos separados 2,6 s y 2,1 s respectivamente; se mantiene el mínimo de salida por calle. Jefes de niveles 2/3 con vida ×4/14. Esta escala no modifica ataque, duelo ni laboratorio.

Economía: 140 provisiones iniciales en defensa y 150 en ataque; ingreso fijo de defensa/duelo 45 por ronda, cocina 15 por nivel y Comedor +15. Recompensas ordinarias entre 3 y 8, jefes 35. Ataque recibe 80 + 25 por ronda. Vida base de unidades, jefes, casetas y base aumentada aproximadamente un 20 %, antes de aplicar la escala de campaña. Las mejoras y habilidades conservan sus incrementos.

Objetivo de equilibrio: exigir al menos unas veinte casetas mejoradas para ganar, mediante la presión del combate. `node scripts/camp-balance.js` prueba campamentos preparados al máximo con tiradores, radio y área contra la ronda 20: 12, 19 y 20 casetas pierden; 24 y 32 ganan. Antes del ajuste ganaba el campamento de 12 sin daños. La prueba aísla potencia defensiva, sin simular la financiación de esas construcciones. No garantiza un mínimo universal frente a todas las posiciones y estrategias; validar con jugadores y campañas completas. `scripts/simulate.js` conserva las pruebas de compras y economía.

Referencias periodísticas con fondo sólido, texto oscuro sin transparencia y tamaño de lectura uniforme. Corregidos colores secundarios en escenas claras, diario, estado de guardado y apoyo en portada. El evento, la escena y el cartel identifican expresamente el cierre de Metro de Sol, separado de Cercanías. Revisión visual en navegador pendiente.

1. Medir FPS, tiempos de dibujo y memoria con 100, 300 y 600 unidades en navegadores de escritorio y móvil.
2. Ajustar economía y oleadas con partidas reales: comparar campamentos pequeños, grandes y especializados, y revisar la dificultad del modo ataque.
3. Revisar contraste, controles táctiles, paneles y escenas en pantallas estrechas.
4. Comprobar la mezcla de sonido con multitudes y la legibilidad del combate con efectos reducidos.
5. Validar HTTPS, cabeceras y navegación en el alojamiento definitivo, y comprobar el destinatario y el cobro de Stripe.

El multijugador online queda para una fase posterior: requiere validación de comandos en servidor, salas y reconexión.

## Comprobaciones

Despliegue Vercel revisado por HTTP el 16 de octubre: HTTPS y cabeceras presentes, 16 rutas internas bloqueadas y 101 módulos sin imports ausentes ni patrones de secretos detectados. Informe y límites en [public-security-audit-2026-10-16.md](public-security-audit-2026-10-16.md). Quedan revisión de cuentas, comprobación en navegador y limpieza del import de fuentes externas bloqueado por CSP.

La compilación pública elimina los imports de desarrollo del punto de entrada y comprueba que cada import local, también dinámico, exista en la distribución antes de sustituir `dist`. Evita referencias al laboratorio ausente que los empaquetadores de despliegue intentaban resolver.

Configuración de Vercel en `vercel.json`: compilación con pruebas, publicación exclusiva de `dist` y cabeceras HTTP de seguridad. Instrucciones en [secure-deployment.md](secure-deployment.md). Pendiente desplegar y comprobar el dominio real.

Campaña completa comprobada con compras e ingresos reales: 4 de 18 estrategias mixtas ganan, con 37–43 casetas mejoradas y 483–608 de vida final. Dos cocinas, radios, especializaciones y Asamblea permiten superar las veinte rondas; las compras simples y la inversión prematura en cuatro cocinas pierden. Resultados, configuración y límites en [balance-tests.md](balance-tests.md). Las reglas no se han cambiado durante estas pruebas.

`npm.cmd run check` valida sintaxis y pruebas de comportamiento. `npm.cmd run benchmark` mide la simulación; `performance.html` permite medir el dibujo en navegador. `npm.cmd run simulate` compara estrategias programadas como diagnóstico de equilibrio.

Última comprobación: `npm.cmd run check`, 160 pruebas correctas, incluida una victoria completa con ingresos reales, presupuesto del laboratorio, gasto/reembolso y fuerza de campaña. Pendiente revisión visual del laboratorio y del Inspector en navegador.

La documentación conserva las reglas vigentes y las tareas pendientes, sin diarios de sesiones. Las pruebas automáticas no sustituyen la revisión visual, la escucha ni las partidas con personas.
