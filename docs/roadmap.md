# Hoja de ruta

## Estado actual

Endurecimiento aplicado tras la auditoría: servidor con raíz fija y manifiesto de recursos, comprobación de rutas reales, bloqueo de archivos privados, métodos GET/HEAD, límite de tamaño/cabeceras/peticiones/conexiones, validación de Host y cabeceras CSP/nosniff/anti-enmarcado. No hay permisos de escritura ni API de cobro en el servidor. Servidor local anterior detenido y reiniciado con estas protecciones; GET /server.js y /AGENTS.md ya devuelve 404 en el puerto 3000.

Distribución pública generada con `npm run build`: carpeta dist con 102 recursos del juego, sin admin, páginas de pruebas, caché o documentación. Admin se carga de forma diferida únicamente en desarrollo. Se incluyen netlify.toml y _headers, CSP adicional en HTML, detección de patrones de secretos y hashes de integridad. El generador solo limpia su propia carpeta marcada y rechaza enlaces fuera de la raíz. Guardado con límite previo de JSON, medallas/opciones conocidas y geometría validada; tienda sin interpolación HTML y destino de apoyo restringido al host exacto buy.stripe.com. Guía en [secure-deployment.md](secure-deployment.md).

Verificación: 137 pruebas correctas, incluidas pruebas HTTP de recursos privados, traversal codificado, Host, métodos, caché, límites, cabeceras, distribución y escape mediante junction Windows (sin omitir esa prueba). Comprobados por HTTP y SHA-256 los 102 recursos de dist. No se ha publicado en Internet ni cambiado Stripe, DNS o cuentas; quedan revisión visual/CSP real, TLS/cabeceras del hosting y seguridad de cuentas. No se promete riesgo cero.

Revisión de seguridad documentada en [security-review-2026-10-16.md](security-review-2026-10-16.md), sin cambios funcionales. Confirmada exposición de archivos internos y caché por el servidor de desarrollo; limitada actualmente por escucha en 127.0.0.1. Pruebas de ruta fuera de raíz rechazadas. Faltan cabeceras de protección y límites para publicación. Admin es un laboratorio del cliente, no un acceso administrativo al servidor. No se encontraron patrones de claves privadas en los archivos propios revisados; el pago se realiza fuera del juego. Antes de publicar: raíz pública acotada y alojamiento HTTPS endurecido. 132 pruebas funcionales correctas; no se auditó la cuenta de Stripe ni un hosting remoto.

Apoyo en cualquier resultado: el enlace «Invita a un hummus» se monta explícitamente al abrir el resultado, tanto en derrota como al completar las veinte rondas. También se comprueba la derrota en ataque. El botón para volver a jugar permanece disponible. Revisión visual pendiente.

Botón de apoyo activo en portada y resultados, fuera del combate. El usuario ha facilitado su enlace público de Stripe, configurado en src/data/support.js, con texto «Invita a un hummus». Se abre en otra pestaña sin manejar tarjetas ni fingir confirmaciones o recompensas de pago. El importe se muestra en Stripe; no se ha verificado ni realizado un pago real. Revisión visual pendiente.

Sonidos cómicos por baja: alternan boing de muelle, graznido sintético y pitido descendente, con pequeñas variaciones de tono. Las bajas simultáneas se escalonan 25 ms, sin la espera por tipo que antes eliminaba repeticiones. Máximo ocho acentos por actualización y límite global de voces para evitar saturación con multitudes; se conserva el remate de grupo/jefe. Se cancelan acentos pendientes al pausar, silenciar o cambiar de partida, sin reproducir bajas antiguas al reanudar. Comprobación automatizada con audio simulado; escucha real pendiente.

Saludo al construir: cada colocación válida de caseta con residente muestra inmediatamente una frase del personaje junto a ella y anima su boca, incluso durante preparación. No se aplican el muestreo ni la espera de los diálogos de combate al saludo. Se conserva un solo bocadillo: una nueva construcción con residente sustituye el anterior. Casetas alternas vacías y colocaciones fallidas no hablan. El saludo desaparece a los 4 s de tiempo visual, al retirar la caseta o al comenzar combate; no depende de que avance la simulación durante preparación. `npm.cmd run check`: 129 pruebas correctas. Revisión visual pendiente.

Mejoras de experiencia del 16 de octubre: impactos con color por material, rachas de 2 s sin multiplicar dinero, recompensas simultáneas agrupadas, caídas con retratos compartidos (máximo 24 detalladas u 8 en modo ligero), remate de jefe y cámara breve desactivable. Fuego y olor continuos no fuerzan la animación vectorial de impacto en cada paso. Cacheadas también las poses quietas de atacantes ordinarios.

Sonido propio con variación moderada, capas de fuego suave, acordes para grupos y jefes, cuatro voces reservadas para avisos relevantes, atenuación del ambiente y limitador donde AudioContext lo admite. Mezcla separada de ambiente/efectos. Preferencias locales para destellos, movimiento reducido y efectos ligeros.

Radio conserva ralentización; Eau pasa a daño continuo de 2/3/4 por segundo según nivel, sin ralentizar ni acumular nubes. Concentrado suma 2 DPS; Difusión conserva +45 de radio. Perfumados inmunes. Dani acelera a su escolta un 45 % al bajar de media vida; Santi acelera un 20 %; Pedro conserva ciclo escudo/carrera. Fase visible y textos actualizados.

Resumen de cada ronda en diario con bajas, provisiones, daño a base y caseta destacada por daño efectivo; anticipación de composición de oleada. Cuatro medallas opcionales y marco dorado del diario por Coro de diez, sin estadísticas de combate extra. Guardado versionado y validado de preparación de defensa; «Continuar historia» recupera casetas, mejoras, dinero y avance. Los eventos ya pagados no vuelven a cobrar al restaurar. Admin, vistas de pruebas y otros modos no sobrescriben el guardado; almacenamiento bloqueado no impide jugar.

Resultados con compartir a petición y tarjeta PNG descargable; no se envían resultados automáticamente. Nueva [prueba de rendimiento](../performance.html) con 100/300/600 unidades y escenarios de marcha, bajas, lluvia y fuego. Muestra FPS, P50/P95 de dibujo, P95 de simulación y memoria JS si está disponible. Sin pagos, donaciones ni analítica remota.

Revisión visual intentada con la habilidad computer-use: el servicio detuvo el control al no poder verificar la URL de Chrome. No se han validado visualmente escritorio/móvil ni escuchado la mezcla real; las pruebas de Canvas simulado y audio simulado no sustituyen esas comprobaciones. Objetivos de FPS y satisfacción siguen pendientes de medición con personas.

Verificación final: `npm.cmd run check` correcto, 126 pruebas. Incluye persistencia y datos corruptos, no volver a cobrar decisiones restauradas, fases de jefes, inmunidad y daño no acumulable de Eau, rachas sin dinero extra, prioridad de audio con saturación, caídas compartidas, cámara accesible y arranque/pausa/cambio de escenarios en la pantalla de rendimiento con Canvas simulado. `npm.cmd run simulate` completado: sin construir cae en ronda 1; solo base, en 4; compradores de casetas/área/mixto/cocina/olor completan la campaña con hasta 105 construcciones. En ataque, pesados ganan en ronda 1 y ahorro para Pedro en 3; otras estrategias ensayadas pierden. Esa asimetría requiere una futura revisión de equilibrio; no es evidencia de dificultad validada con jugadores.

Episodio 4 endurecido: resolver la ocupación cuesta 40 provisiones (antes 15). Debatir deja una tienda del proletariado sin disparar toda la ronda, sin temporizador; se libera al terminar y conserva mejoras y salud. Texto de opciones, estado, marcador del mapa y sala de eventos coherentes con la duración completa. Se mantiene coste cero si no existe tienda afectada. 107 pruebas correctas, incluida recuperación en la ronda siguiente.

Nueva [sala de eventos](../events.html), accesible desde portada: selección directa de tienda ocupada, lluvia, 12-O y tres jefes. Permite abrir escenas/decisiones o probar una opción directamente, repetir, pausar, cambiar velocidad y avanzar cinco segundos. Campamento preparado con colocaciones legales, presupuesto infinito y base invulnerable. Instancia separada con avance de campaña desactivado, conservando reglas reales de clima, resbalones y refuerzos. Arranca mostrando lluvia. Enlace a laboratorio completo y vuelta al juego. Verificación de catálogo, preparación, eventos y reinicio; revisión visual pendiente.

Ronda de lluvia con precipitación continua hasta terminar, pavimento azulado, charcos, reflejos y ondas de gotas; las cubiertas solo evitan la penalización inicial de cadencia. Dos rasos adicionales compensan los resbalones: un tercio de los atacantes puede caer una vez, perder 6 de vida y permanecer 1,6 s sin avanzar ni atacar, con animación de caída y recuperación. Calendario determinista, pausa y Asamblea respetadas. Estado meteorológico se limpia al terminar; revisión visual y equilibrio humano pendientes.

Eventos jugables de historia con decisiones previas: ronda 4, disputa de una tienda del proletariado (10 s sin disparar o mediación de 15 provisiones); ronda 9, lluvia (20 s de disparos 20 % más lentos o cubiertas por 20); ronda 15, tensión del 12-O (25 % de refuerzos normales extra por varios accesos, con opción de retrasarlos 10 s por 25). Las elecciones se validan y cobran una sola vez en el motor, se registran en diario y muestran su efecto antes de aceptar. Saltar usa la alternativa gratuita; no afectan ataque, duelo ni admin. Etiqueta temporal sobre caseta en debate y lluvia visual. Fuentes enlazadas para el relato de la tienda y la crónica del 12-O; escenas y penalizaciones son adaptaciones. 102 pruebas correctas; revisión visual y equilibrio humano pendientes.

Todas las defensas salvo la barricada vuelven a ser casetas de lona: área es taller morado con techo inclinado y suministros de pintura, Eau tienda verde abovedada con ropa tendida, radio caseta azul de techo alto con altavoces junto a la entrada y cocina mantiene toldo naranja. Eliminadas catapulta y bidón como estructuras principales. Diferenciación mediante tejados, colores y accesorios; remiendos iniciales y acabados por nivel. Dibujo compartido en tablero, compra y previsualización. Revisión visual pendiente.

Barras de vida de construcciones visibles solo en base y barricadas. Rótulos de arma y «CARGO» retirados del tablero; las casetas con residente muestran su nombre en una placa de alto contraste y las alternas sin personaje no muestran nombre. El propietario coincide con el residente aleatorio y se conserva al mejorar. La salud del resto sigue disponible al seleccionarlo. Sin cambios de reglas; inspección visual pendiente.

Personal alterno en todas las construcciones por orden de creación: primera con personaje, segunda sin él, y así sucesivamente. Base mantiene portavoz. La presencia no cambia con las mejoras ni al retirar otra caseta; los residentes aleatorios de proletariado conservan identidad cuando les corresponde aparecer. Sin diálogos de defensor procedentes de casetas vacías; proyectiles mantienen origen coherente. Sustituye la regla anterior de personaje en cada caseta. Revisión visual pendiente.

Siluetas de defensas diferenciadas: proletariado conserva tienda triangular, área es batería abierta de pintura con brazo lanzador morado, Eau es bidón verde con tuberías y ropa tendida, radio lleva dos bocinas azules y antena, cocina conserva toldo naranja con olla/cucharón y barricada añade franja de seguridad roja. La base incorpora estandarte propio. Nuevos accesorios por nivel sin cambiar escala ni reglas. Un único dibujante se usa en tablero, vista previa y miniatura de compra para mantener coherencia. 97 pruebas correctas; inspección visual pendiente.

Más espacio de construcción: separación entre centros 34×24 frente a 42×30, margen adicional a caminos 14 frente a 24 y márgenes exteriores/monumentales algo menores. Base conserva su separación. Huella de previsualización actualizada; selección durante colocación usa radio 18 para no interceptar huecos adyacentes válidos. Muestreo de cuadrícula fija con campamento vacío: 391 posiciones válidas frente a 216 anteriores, sin representar capacidad simultánea. Caminos, monumentos y superposiciones siguen protegidos. Pruebas de nueva franja junto a caminos y clic cercano añadidas; revisión visual pendiente.

Chalet del proletariado elige al azar entre dos defensores clásicos sin puesto propio (Gabriel Réplica y Eco de Asamblea), excluyendo al personal de base, radio, cocina, área, olor y barricada. Elección cosmética guardada por objeto en WeakMap, estable al mejorar y cambiar de nivel; dibujo y diálogo usan el mismo residente. Sin estadísticas aleatorias ni campos aleatorios en el estado del motor. Ambos perfiles regresan a la galería compacta. Prueba de exclusión y persistencia añadida; revisión visual pendiente.

Personaje visible junto a cada construcción desde nivel 1: tiendas, área, olor, radio, cocina y barricada, además de la base. Sustituye la regla de una de cada dos tiendas; retirada la asignación alterna. Todos usan su rol, animación de discusión y celebración correspondientes. Origen visual de proyectiles ajustado automáticamente al personaje; sin cambios de daño, costes ni prioridad. Inspección visual pendiente.

Prioridad de disparo por distancia restante del recorrido hasta la caseta central, dentro del alcance de cada defensa. Sustituye la selección por orden de aparición; contempla curvas, distintos ramales y unidades al final del camino. Distancias acumuladas de rutas almacenadas en caché y progreso calculado una vez por paso, sin reordenar unidades. Radio sigue afectando a todos y área centra su disparo en el atacante más avanzado. Pruebas de geometría, alcance, bajas y disparo real añadidas.

Pancartas con cinco lemas breves por bando y remate de meme: «MI PAPI PAGA», «ERA IRONÍA», «FUENTE: MI CUÑAO» frente a «MUCHO TEXTO», «HUMMUS O CAOS» o «LO VOTAMOS?». Cada personaje conserva su texto estable. Sin cambios de mecánicas.

Reparto depurado: 18 personajes visibles (ocho clases normales, tres jefes y siete defensores), con solo Vera Turnos y Hummus Maximus entre las incorporaciones recientes. Se retiran del reparto activo los demás cameos nuevos y se recupera el peso de los diseños originales. Vera lleva lista de intervenciones y Hummus delantal/cuenco para reforzar sus siluetas. Galería reducida a retrato, nombre y función; cameos del diario a nombre y una frase, sin personalidad y habilidad redundantes. Se mantienen clases y reglas de combate. 93 pruebas correctas; revisión visual pendiente.

Integrados 32 perfiles de la propuesta con guiños más sutiles: nombres propios de la plaza, rasgos, entrada y gag de habilidad. Cameos con retrato en los veinte capítulos, fichas en galería y más personal variado en tiendas, radios y cocinas. Renombrados los jefes y personajes existentes conservando sus clases y fuentes de citas; eliminadas explicaciones de inspiración real en títulos del catálogo. Poderes absurdos adaptados como acciones narrativas, sin alterar economía, colisiones ni poderes de combate. Alcance y correspondencias en [plaza-cast.md](plaza-cast.md). Revisión visual pendiente.

Una de cada dos tiendas construidas incorpora un acampado visible desde nivel 1, sin contar cocinas, radios ni otras construcciones. La asignación queda fija aunque se retire otra tienda y continúa al cambiar de nivel; las tiendas de nivel 3–4 conservan personal como antes. Se aplica también al campamento de ataque y sus refuerzos. Usa los personajes, animaciones de discusión y celebración existentes sin añadir daño ni unidades de combate. Revisión visual pendiente.

Pancartas rediseñadas como lonas alargadas a los pies, con caída ondulada, pliegues, dobladillo, ojales, cuerdas y postes de madera. Texto oscuro en una línea con seis lemas cortos por bando (doce en total), elegidos de forma estable por personaje, sin cambiar durante la animación. Movimiento suave del tejido y balanceo al caminar. Módulos separados para dibujo y lemas. 91 pruebas correctas; inspección visual pendiente.

Historia reorganizada en tres niveles sin reiniciar el campamento: nivel 1 rondas 1–5, Dani; nivel 2 rondas 6–12, Santi; nivel 3 rondas 13–20, Pedro. Contador muestra nivel y ronda interna; se mantienen posiciones, niveles, especialidades, tesorería y daño persistente, con reparación habitual entre rondas. Escoltas +15 % en nivel 2 y +30 % en nivel 3; jefes con vida 520/644/780 respectivamente. Escenas y fichas actualizadas; ficha muestra resistencia efectiva del jefe. La prueba temporal sigue permitiendo los tres, y admin conserva estadísticas base. Pruebas de transición sin pérdida de progreso y calendario añadidas; revisión visual y equilibrio humano pendientes.

Recorridos redondeados con geometría compartida por dibujo, movimiento y colocación. Ramal oriental recorre más zona derecha y sur; Carretas tiene arco inferior propio y el tramo final común se reduce al acceso central. Se mantienen rodeos largos (al menos 1.100 unidades de recorrido), barricadas y acceso por todas las calles. Oleadas reparten cada clase entre varios accesos con cantidades equilibradas, empezando por dos y ampliando hasta once. Colores de camino más claros. Pruebas de reparto determinista, recorrido, monumentos/rótulos y balance ejecutadas; revisión visual y de dificultad humana pendientes.

Radio con ralentización en área desde nivel 1: cada pulso daña y frena a todos los enemigos vivos dentro del alcance real, incluidos perfumados. Ondas circulares muestran el radio. Coro prolonga el efecto de 1,5 a 3 s en lugar de desbloquear multiblanco; Abucheo conserva daño y alcance extra. Pulsos de radios básicas no acortan una ralentización de mayor duración. Pruebas de área, límite y duración añadidas; revisión visual pendiente.

Inicio sin construcción preseleccionada, incluido reinicio y laboratorio; clic en terreno vacío no gasta dinero hasta elegir herramienta. Selección de casetas juntas corregida para escoger la más cercana. Prueba de estrés reparada para medir 100/300/600 unidades simultáneas tras el cambio de cadencia. 87 pruebas correctas. Revisión y prioridades concretas en [review-2026-10-16.md](review-2026-10-16.md): balance con campamentos limitados, evitar ficha duplicada tras escena, lectura en móvil, carga visual y explicación táctil de compras.

Rótulos de las once calles redistribuidos según sus dimensiones para evitar caminos y otros rótulos, dentro de los bordes; Carrera de San Jerónimo en dos líneas. Placas claras con tinta oscura y orden de dibujo corregido: caminos debajo de monumentos y nombres. Mejoradas siluetas del caballo/jinete de Carlos III, brazos del oso y frutos del madroño, pedestal y túnica de Mariblanca, cristal y entrada del pabellón de Cercanías y detalles del reloj de Correos. Rutas y coordenadas de juego conservadas. Verificación geométrica de rótulos y pruebas del juego; inspección visual pendiente.

Daño reducido para favorecer campamentos grandes: tiendas 7/12/18/23, fuego 4/s, área 6/10/14, megafonía 2 por nivel (mantiene control). Costes, ingresos y estadísticas enemigas se conservan. Simulación de compras continuas de tiendas completa veinte rondas y alcanza 35 construcciones; solo base mejorada pierde en ronda 4. Esto no establece un mínimo obligatorio de casetas: equilibrio humano pendiente. 85 pruebas correctas, incluida derrota de la base mejorada sin campamento.

Diario y botón principal superpuestos dentro de la parte superior del mapa. La fila queda fuera del flujo mediante posición absoluta: abrir el diario no desplaza ni redimensiona el canvas. Altura de lectura limitada con desplazamiento; los huecos entre controles permiten interactuar con el tablero. Se conserva el contraste y el minimizado. Revisión visual pendiente.

Legibilidad: sombras de texto eliminadas, textos secundarios aclarados sobre paneles oscuros, diario y escenas con tinta oscura explícita sobre fondos claros y controles con colores propios. Escenas de jefes con presentación inspirada en anime: panel diagonal, líneas radiales, rival al fondo, retrato grande y entrada lateral con acercamiento suave. Diálogo estable sobre cartela sólida, sin destellos ni sacudidas de cámara. Respeta preferencia de movimiento reducido en las escenas. 84 pruebas correctas; inspección visual pendiente.

Separación entre casetas reducida de 58 a 42 unidades en horizontal y de 40 a 30 en profundidad proyectada. Conserva margen de la base y restricciones de caminos, monumentos y límites. Prueba de construcción adyacente y rechazo de solapamiento añadida.

Botón principal de ronda trasladado junto al Diario de la plaza en una fila encima del tablero, también accesible cuando el diario está oculto en ataque. En móviles muy estrechos ocupa la primera fila. Lateral compacto: tarjetas y retratos reducidos, catálogo con altura limitada y desplazamiento, descripciones disponibles en título y nombre accesible, consejos y actualidad desplegables. No cambia el manejo del botón ni los atajos. Inspección visual pendiente.

Retiradas coletillas editoriales del juego: «Escena y diálogos de ficción satírica», aviso general de atribuciones, etiqueta de parodia de las escenas y explicaciones repetidas de personaje ficticio en selección y reclutamiento. Se conservan nombres, diálogos y procedencia concreta de las referencias; las notas de verificación permanecen en documentación interna.

Diario situado encima del tablero en el flujo de la página, a todo el ancho del área de juego. Sustituye la tarjeta superpuesta: al desplegarlo no tapa el mapa. Conserva apertura al completar ronda y minimizado manual. Revisión visual pendiente.

Salidas de atacantes más espaciadas: aproximadamente un segundo entre reclutas y mínimo de 0,95 s por acceso, incluso al mezclar jefes/escoltas o repetir envíos del laboratorio. Pancartistas y blindados salen cada 1,25 s; demás grupos entre 1,05 y 0,86 s según ronda, ajustados al mínimo común por acceso. Arranque de grupos separado 3,2 s. Se conserva la superposición durante el recorrido: no se añade bloqueo entre atacantes. Pruebas de espaciado, rutas y balance ejecutadas.

Diario movido del lateral a una tarjeta superpuesta arriba del tablero. Empieza minimizado, se abre al superar cada ronda mostrando el capítulo completado y se puede minimizar/reabrir desde su cabecera. Al iniciar combate se recoge automáticamente; se conserva la elección durante las actualizaciones de interfaz. Archivo limitado a capítulos completados (primero disponible como introducción), con altura limitada y desplazamiento para móvil. 81 pruebas correctas, incluida apertura por progreso, minimizado persistente y cierre al combatir. Inspección visual pendiente.

Fin de ronda limpia caseta, herramienta de colocación, vista previa y accesos seleccionados, también al terminar la partida. En ataque el campamento recibe una defensa nueva por ronda sobrevivida (2–8), con posición legal, identificador único y animación de montaje de 1,5 s. Pintura en 4/7, megafonía en 6 y tiendas en las demás; las anteriores persisten con su daño y reparación habitual. Presupuesto entre asaltos ajustado a 100 + 35 × ronda para permitir responder a los refuerzos. Simulación de resistentes normales gana; enviar solo rasos por el mismo acceso pierde. Verificación de ubicación, persistencia, exclusión de otros modos y final: 81 pruebas correctas. Revisión visual pendiente.

Escenas de historia antes de iniciar rondas 5, 9, 10, 15 y 20: retrato grande animado, intervención del jefe/personaje y respuesta del campamento. La final reúne a los tres. Avance manual, salto y Escape; combate comienza al terminar y se conserva la pausa anterior. Cada escena se ofrece una sola vez por partida; reiniciar cancela su continuación. Exclusivas de historia, sin interrumpir admin ni ataque/duelo. Todos los parlamentos de estas escenas se identifican como parodia original y se mantienen separados de las citas documentadas de combate. Inspección visual pendiente.

Material adjunto integrado como veinte escenas del Diario de la plaza: hummus, teletrabajo y videollamada, charla sobre la mili, limpieza, cartógrafo, lluvia, comisiones, anuncios de alquiler y personajes satíricos. Las consignas, burlas y referencias de 2011 se conservan con la procedencia y contexto indicados por el usuario, marcadas como pendientes de cotejo de originales. Diálogos inventados identificados como ficción; no se atribuyen a los jefes. Archivo permite releer solo capítulos alcanzados, mantiene controles y no añade texto al mapa ni cambios de balance. El 15M ocupa un capítulo de archivo separado. Revisión visual pendiente.

Animaciones amplificadas: zancadas, rebote, balanceo del torso, compresión al atacar, preparación y lanzamiento más largos y reacción al impacto. Las casetas tienen retroceso al disparar y sacudida local al recibir golpes. Proyectiles con arcos más altos y tres puntos de estela desde la primera ronda; impactos con radios luminosos, ondas y salpicaduras más visibles. Más polvo de pisadas y partículas rápidas, con intensidad creciente y el límite de 160 conservado. Sin cambios de reglas ni movimiento de cámara. Comprobación: 76 pruebas correctas; inspección visual en navegador pendiente.

Historia de defensa ampliada a veinte capítulos, con relato y consejo por ronda y desenlace propio. Dani en 5, Pedro en 10, Santi en 15 y los tres en 20; ataque y duelo conservan ocho rondas. Laboratorio admite las veinte oleadas. Agitador velocidad 92 y aura +25 %; Ultrasprint 125. Estelas direccionales y radio de agitación visibles. Dos clases nuevas con fichas: Socorrista (ronda 8, 5 de regeneración/s, maletín verde) e Indignado (ronda 12, bajo media vida +60 % velocidad y +50 % daño, guantes y halo rojo). El caos ambiental progresa ahora hasta la ronda 20. Verificación automática de calendario, progresión, fin de campaña y habilidades; revisión visual y equilibrio humano pendientes.

Balance revisado: área 12/20/28 (antes 20/40/60), armas de tienda 12/21/31/37 y fuego 7/s. Atacantes normales con aproximadamente 20 % más de vida y golpes algo mayores; jefes sin cambios. Cocinas 20 por nivel y ronda, Comedor +20, Catering 2 cada 5 s. Simulaciones: sin invertir pierde en ronda 1, solo mejorar base pierde en 5; estrategias con compras continuas siguen completando la campaña, con combates más largos. Pendiente valoración humana de dificultad.

Menos texto sobre atacantes: retirados nombres, estados escritos de jefe, distintivo LIVE y sus bocadillos del mapa. Las citas reales se conservan completas con atribución en el panel de fuente; las fichas de tipos siguen disponibles al descubrirlos. Recompensas representadas por pequeñas monedas. Efectos de caos crecientes entre rondas 1–8: polvo, humo suave, papeles, cristales, chispas, pintura y estelas. Partículas limitadas a 160, eventos deduplicados, pausa respetada y sin cambios de reglas.

Celebración al superar una ronda: saltos y brazos en alto de los defensores visibles, balanceo de casetas y breve margen antes del resultado final para verla. Se cancela al iniciar el siguiente combate y no se activa en derrota. Durante combate, todos los personajes visibles animan la boca con fases distintas. Murmullos colectivos graves/agudos de marioneta, ininteligibles y a ganancia baja; cadencia fija independiente del número de unidades, silencio al pausar, acabar o silenciar. Pendientes de revisión visual y escucha reales.

Revisión de timbres: lanzamiento separado del impacto; piedra pequeña/grande con percusión y gravilla, botella con parciales de cristal, molotov con rotura, llamarada y chasquidos, salpicadura de pintura y golpes de madera en barricadas. Construcción con golpes de herramientas y roce de lona; bajas discretas. Síntesis original por capas, con niveles por componente y filtros, sin muestras externas. Escucha real pendiente.

Sonido ampliado: efectos procedurales originales para construcción, mejora, reclutamiento, retirada, armas, impactos, bajas, habilidad y resultados. Activación con interacción del jugador, volumen ajustable y silencio inmediato. Deduplicación por evento, límite de voces y de repetición; los eventos pausados no se reproducen al reanudar. Verificación automática con contexto de audio simulado; escucha real pendiente junto con la revisión del navegador.

Panel de mejora reducido a 240 px, con información esencial, botones cortos y detalles desplegables. Los bocadillos se eliminan inmediatamente al terminar cualquier ronda, al ganar o al perder, sin esperar a su temporizador. Regresión cubierta en defensa, ataque y duelo local.

Nueva progresión visual y de campaña: casetas pequeñas y remendadas en nivel 1, con escala y acabados por nivel y defensores solo en algunas. Mejoras y especializaciones en un panel anclado a la caseta sobre el tablero. Seis clases normales con identidades visuales fijas, dos nuevas (Blindado y Ultrasprint), campaña de ocho rondas y fichas de primer encuentro que pausan la acción y explican diferencias. Jefes en 7–8; el laboratorio conserva todas las opciones de prueba sin fichas automáticas.

Detalles y límites comprobados en [camp-progression.md](camp-progression.md). Última verificación de esta petición: 63 pruebas correctas; las simulaciones de casetas, área, combinación, cocina y olor completan ocho rondas. No invertir pierde en la 2 y mejorar solo la base en la 6. Inspección visual pendiente: el proceso de navegador no consigue arrancar.

Revisión del 15-10-2026 cerrada: registro y limitaciones en [iterations-2026-10-15.md](iterations-2026-10-15.md). Ciclo de combate compartido, órdenes validadas, limpieza visual de admin, selección con resistencia en vivo, auras optimizadas y alcances coherentes. Campamento de ataque ajustado para admitir victorias con unidades normales; reclutamiento de jefes encarecido. Vista previa de casetas, cancelación, atajos, avisos persistentes y nuevas animaciones de colocación/mejora y ambiente. Última comprobación: 59 pruebas correctas; revisión visual pendiente por fallo de automatización. Una llamada quedó bloqueada de aproximadamente las 18:30 a las 22:39; durante ese intervalo no se realizaron iteraciones.

Laboratorio local disponible en `admin.html`: presupuesto infinito, construcción y mejoras durante combate, envío de cualquier atacante/jefe por los once accesos, cantidades de 1 a 100 por envío, carga de las cinco oleadas, limpieza de atacantes/efectos, vuelta a preparación, reparación, base invulnerable opcional, recarga de habilidad, cambio de especialización y reinicio. No avanza de ronda automáticamente. Usa el mismo motor y renderizador; las órdenes de laboratorio se implementan en `AdminGame`, separado de las partidas normales.

En defensa se puede deshacer la última colocación o retirar una construcción nueva seleccionándola antes del inicio de la ronda. Devuelve coste, niveles y especialización; no permite retirar la base, construcciones de rondas anteriores ni retirar durante combate. Pruebas de reembolso, restricciones, presupuesto infinito y controles de ambos bandos añadidas. Comprobación visual pendiente: el proceso de navegador volvió a fallar al conectar.

Iteración Bloons (15-10-2026): defensa con campaña de cinco rondas diseñadas, recompensas por baja, construcción y mejoras durante combate, especialización permanente entre dos ramas por construcción y Asamblea extraordinaria (detención de 3 s, recarga 25 s). Ataque y duelo conservan ocho rondas y sus turnos. Los ingresos por bajas en duelo van al defensor.

Los pesados reducen impactos pequeños; área, fuego y Contundencia ignoran armadura. Dani acelera escoltas cercanos; Pedro alterna 4 s de protección (65 %) y 4 s de velocidad; Santi reduce 8 de daño de impactos sin perforación. Indicadores visuales de protección, velocidad, armadura y detención. Recompensas flotantes, onda de habilidad y sonidos sintetizados opcionales de impacto, área, bajas y habilidad.

Verificación: 45 pruebas, incluyendo economía, especializaciones, recarga, diferencias entre modos, combinaciones de oleadas y jefes. Una simulación con compras y mejoras durante combate completó las cinco rondas y derrotó 120 enemigos. La conexión al navegador falló al iniciar el proceso: revisión visual de escritorio/móvil y prueba humana de equilibrio pendientes. La simulación no demuestra por sí sola que la partida resulte divertida.

Actualización: sistema de caminos completos y no bloqueables. Los once accesos confluyen hasta la caseta central; los atacantes no persiguen construcciones laterales. Construcciones reducidas al 70 % y espacio de colocación ajustado. Portavoz ficticia de la base inspirada en Alicia del Río.

Prototipo local con defensa de cinco rondas, ataque y duelo local de ocho rondas, construcción libre, mejoras, cocinas y laboratorio. Once accesos, selección múltiple de calles y rutas compartidas entre mapa y simulación. Personajes con equipo por rol, jefes y diálogos ocasionales.

## Historial de cambios anteriores

Registro histórico: algunas decisiones se sustituyeron en iteraciones posteriores. Para las reglas vigentes, consultar el estado actual, el README y el diario de revisiones.

- Retirada la separación de atacantes y el bloqueo de aparición por ocupación: pueden apilarse y golpear simultáneamente. Las barricadas siguen bloqueando.
- Nueva tienda Comité de Lanzamiento: coste 75, alcance 200, impacto de radio 65, 20/40/60 de daño por nivel cada 1,8 segundos. Bomba y salpicadura de pintura diferenciadas. No produce fuego; complementa las tiendas de molotov.
- Eau de Asamblea: cinco líneas verdes onduladas que ascienden y se desvanecen por encima de la caseta, complementando la nube y el radio ya existentes. Animación ligada al tiempo de partida y pausa.
- Portapancartas con mayor zona de separación sin reducir el dibujo; los seguidores esperan y los nuevos reclutas no aparecen encima de otros. Pancartas con balanceo al caminar, quietas al esperar y reacción al golpear. Las filas siguen el recorrido existente.
- Ronda 1 normal restaurada. Botón temporal «Probar ronda de jefes» en defensa, disponible entre oleadas; sustituye solo la siguiente oleada por los tres jefes. Rondas automáticas de jefe: 4 y 8. El botón no cobra provisiones ni interrumpe combates en curso.
- Mecánicas satíricas con contrajuego: nueva caseta de olor mejorable, atacante perfumado inmune al olor y aura de directo de los agitadores digitales. Efectos visuales específicos y bonificaciones sin acumulación. Fuentes y límites del análisis de redes en `docs/satire.md`.
- Diálogos de los tres jefes sustituidos por citas breves documentadas, con autor, contexto y fuente consultable en el panel. Las citas reales y la parodia original llevan rótulos distintos.
- Barricadas con bloqueo físico: los atacantes se detienen, las golpean hasta destruirlas y retoman el recorrido. Sin daño propio ni ralentización de área. Comprobación de colisión a lo largo de cada segmento para impedir atravesarlas al acelerar.
- Jefes de prueba en la ronda 1, también programados en 4 y 8 (`src/data/bosses.js`). Dani Desalojo, Pedro del Cambio y Santi de la Reconquista: mayor tamaño, vida y daño; distintos ritmos de movimiento. Reclutables en ataque y duelo local con presupuesto validado. Barra y nombre propios; la animación de derrota conserva el tamaño de jefe.
- Atacantes derrotados: caída lateral, compresión, polvo y desvanecimiento durante 0,8 s. El evento visual se conserva al acabar una ronda; los cuerpos dejan de combatir inmediatamente. Animación independiente del combate, con pausa y velocidad respetadas. Sintaxis y 29 pruebas comprobadas.
- Plaza ampliada hacia los laterales, el norte y el sur: límite ilustrado y límite de construcción comparten la misma geometría. Fachadas desplazadas a los bordes y zona sur disponible para construir. Muestreo de posiciones válidas sobre la misma rejilla: 264 frente a 120 antes del cambio; es una comprobación de espacio disponible, no una medida exacta de superficie.
- Tablero más ancho en escritorio: contenedor máximo de 1.680 px y panel lateral de 260 px. Los caminos y el tamaño de las unidades se conservan.
- Recorridos ampliados con rodeos: todos comparten un único corredor final serpenteante hasta la caseta. Longitudes aproximadas de 1.200 a 2.300 unidades de juego frente a 540–860 anteriores; velocidades de unidades sin cambios. Campamento predefinido recolocado fuera de los nuevos caminos.
- Rediseño cartoon solicitado: caras con ojos grandes, bocas expresivas y contornos marcados; cuerpos pequeños, zapatos grandes y rebote al caminar.
- Tiendas redondeadas, cocina a rayas, altavoces y barricadas simplificados; plaza con losas grandes y paleta verde, ocre y crema.
- Interfaz y bocadillos adaptados a la misma dirección. Retratos ampliados para no recortar las pancartas bajas.
- Sintaxis y 21 pruebas verificadas. Nuevo intento de revisión en navegador agotó el tiempo de conexión; la comprobación visual sigue pendiente.
- Primera aplicación de la dirección PvZ: armas visibles junto a tiendas, dibujo compartido entre reserva/mano/proyectil, animación de carga y lanzamiento ligada al disparo real.
- Roles con movimientos diferenciados; defensores quietos al defender, rápidos inclinados y resistentes más anchos. Vapor de cocinas, desgaste e impactos localizados.
- Fuego con humo y arco de duración. Sin cambios de estadísticas, costes, rutas ni colocación.
- Revisión centrada en diseño y efectos, sin nuevas funciones ni reglas: granito con grano fijo, luz ambiental, sombras de contacto, textura de ropa y lona.
- Cartón con trayectoria curva, ondas de megafonía, polvo de pasos e impactos y restos al caer una construcción. Efectos visuales deterministas sin retrasar el daño.
- Pausa, atajo Espacio y velocidades 1×, 2× y 3×.
- Simulación con pasos fijos: la velocidad no modifica la resolución del combate.
- Vista táctica opcional de rutas; las calles seleccionadas se destacan.
- Alcance visible al seleccionar una construcción o preparar su colocación.
- Inspección de construcciones durante el combate con estadísticas de daño, intervalo y alcance o producción.
- Orden de dibujo de atacantes por profundidad.
- Sintaxis y 21 pruebas comprobadas, incluidas mejoras de armas, fuego y velocidad. La prueba de velocidad compara estados completos de partidas a 1× y 3×.
- Intento de revisión visual bloqueado por un error del entorno de navegador (`windows sandbox failed`). Sigue pendiente comprobar la apariencia real y la adaptación móvil.

## Prioridades siguientes

La referencia de evolución acordada es Plants vs. Zombies: roles legibles, personalidad y decisiones entre economía y defensa. Véase `docs/design-direction.md` para fuentes, equivalencias y orden propuesto; conservar Sol y la colocación libre.

La dirección vigente es caricatura 2D. El usuario autorizó mejoras funcionales inspiradas en Bloons y una revisión continua hasta las 22:30 del 15-10-2026. Priorizar corregir y pulir esos sistemas; online sigue fuera del alcance de esta revisión.

1. **Revisión visual real:** comprobar legibilidad de caras, banderas, pancartas y colisiones aparentes en escritorio y móvil. Pendiente; no sustituir por pruebas de lógica.
2. **Equilibrio:** jugar ambos modos y registrar ronda final, gasto, unidades y construcciones. Ajustar economía y daño con esos resultados, no por intuición. Revisar que varias estrategias sean viables.
3. **Claridad del combate:** alcance e información de daño implementados; falta destacar el objetivo de cada unidad y mejorar la respuesta visual de impactos.
4. **Control de partida:** pausa, velocidad de simulación y reinicio implementados; verificar comodidad en móvil.
5. **Accesibilidad:** foco de teclado, alternativas a controles solo de Canvas y contraste de contadores y mensajes.
6. **Online:** servidor autoritativo, salas, turnos y reconexión, una vez validadas las reglas locales.

## Criterios para revisar una mejora

- El jugador entiende qué ha ocurrido y qué puede hacer después.
- Los accesorios distinguen roles sin tapar caras, barras ni accesos.
- No reaparece el parpadeo de botones ni se pierde la asignación de calles.
- Los cambios de aspecto no alteran el combate.
- Las comprobaciones pasan; cualquier limitación visual o de equilibrio queda documentada.

Esta hoja guía trabajo futuro cuando haya una sesión activa. No ejecuta tareas en segundo plano ni garantiza resultados comerciales.

## Referencias de eventos ? 16 octubre 2026

- Los seis eventos y escenas (rondas 4, 5, 9, 12, 15 y 20) enlazan noticias desde la escena, el diario y la sala de eventos. Metadatos centralizados; contexto breve en el t?tulo del enlace.
- Los enlaces de jefes documentan el gui?o o personaje, sin atribuirles los di?logos inventados. Sin cambios de combate.
- Revisi?n visual en navegador pendiente.
- Verificación: npm.cmd run check correcto; 108 pruebas superadas, incluida navegación entre referencias de los seis eventos.

## Primera optimización de multitudes · 16 octubre 2026

- Casetas rasterizadas una vez por tipo, nivel y condición de base, compartidas entre construcciones. Se mantienen animaciones, daño, propietarios y efectos en vivo. Texturas a doble resolución.
- Barricadas filtradas e indexadas una vez por paso de simulación, conservando comprobación de vida durante el movimiento.
- Eliminado el desenfoque de sombra por personaje; se conserva la elipse de sombra y todas sus animaciones.
- 109 pruebas correctas, incluida reutilización de imágenes e invalidación al mejorar. Benchmark de simulación: 600 unidades y 1800 pasos, 283 ms antes / 281 ms después en una ejecución; diferencia insuficiente para afirmar mejora de velocidad. No mide dibujo ni FPS.
- Pendiente perfilar Canvas en navegador con multitudes reales; valorar atlas de fotogramas para personajes si se confirma que su dibujo domina. No se ha realizado revisión visual en esta pasada.

## Animaciones compartidas para multitudes · 16 octubre 2026

- A partir de 30 atacantes se comparten 16 fotogramas de marcha por aspecto y variante de pancarta. Fase por unidad, velocidad de ciclo según rol, movimiento y barras/auras/efectos conservados. Menos de 30 usa dibujo vectorial original.
- Jefes, golpes, ataques, unidades paradas/congeladas y caídas siguen dibujándose en vivo. Simulación intacta.
- Caché local al renderer, máximo 256 imágenes de 128 por 128 (16 MiB de píxeles RGBA, más sobrecoste del navegador), expulsión por uso y creación limitada a cuatro imágenes por fotograma. Fallos de caché usan dibujo original, sin ocultar unidades.
- 111 pruebas correctas. Prueba con 600 atacantes de igual pose: una imagen compartida y 600 copias, sin reconstruir trazados en el lienzo principal. Pruebas de variantes, límite de creación y exclusión de impactos/jefes. No equivale a medir FPS reales.
- Pendiente revisión visual y perfil de rendimiento en navegador, especialmente continuidad del ciclo y nitidez de fotogramas.

## Segunda optimización de multitudes · 16 octubre 2026

- Durante el llenado de caché se reutiliza un fotograma disponible del mismo personaje, rol y variante de pancarta. Se evita volver al dibujo vectorial por cada fase pendiente; se conserva creación máxima de cuatro imágenes por fotograma y límite de memoria.
- Barras de vida agrupadas en tres pasadas de Canvas en lugar de dos rellenos y cambios de estilo por unidad. Todas las barras permanecen visibles.
- Polvo de pasos muestreado según densidad (aproximadamente 80 emisores ordinarios), conservando jefes, habilidades y efectos de combate.
- Recopilación de emisores de aura en una sola pasada por las unidades, manteniendo referencias vivas y reglas.
- 113 pruebas correctas: 600 unidades con fases diferentes reutilizan imágenes sin trazados vectoriales en el lienzo principal una vez disponible el primer fotograma; barras con 600 unidades requieren tres rellenos. Pendiente perfil de FPS y revisión visual reales en navegador; no se afirma una mejora porcentual.

## Plan de experiencia y apoyo · 16 octubre 2026

- Análisis y propuesta en docs/experience-plan.md: perfil real, impactos y bajas eficientes, audio jerarquizado, jugadas colectivas, decisiones, guardado y apoyo voluntario.
- Detectados en código: bajas genéricas con dibujo completo, aviso sonoro de baja sin distinguir tamaño de grupo, límite de 16 voces sin prioridad y solapamiento estratégico radio/Eau. Falta validar percepción, audio y FPS jugando.
- Tarifas de aportaciones contrastadas con documentación oficial de Stripe y Ko-fi. Propuesta sin pagos activados ni cambios de reglas. Primer bloque recomendado: rendimiento de bajas y respuesta audiovisual.
- Botón de apoyo: npm.cmd run check correcto, 131 pruebas, incluidos estado desactivado, activación, cambio de destino y rechazo de protocolos inseguros.
