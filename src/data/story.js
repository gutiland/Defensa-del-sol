// Story scenes are fictional adaptations; news references provide context.
const reported = (text, source, context) => ({
  text,
  source,
  context,
  kind: "Material aportado: cita pendiente de cotejo",
});
export const STORY_CHAPTERS = [
  {
    title: "Una vivienda que puedes pagar",
    speaker: "Acampado recién llegado",
    scene:
      "Se levantan las primeras lonas. El alquiler de una habitación ya parece ciencia ficción.",
    line: "Por fin una vivienda que puedes pagar. No incluye suelo.",
    material: [
      reported(
        "Hemos normalizado vivir en una habitación",
        "HuffPost",
        "Declaración atribuida a una manifestante entrevistada por Jorge Ponce; no es un cántico.",
      ),
      reported(
        "Hasta que no acabe el rentismo, seguiremos okupando",
        "El Español",
        "Lema atribuido a un reportaje sobre la acampada.",
      ),
    ],
  },
  {
    title: "La revolución patrocinada",
    speaker: "Influencer revolucionario",
    scene:
      "El directo empieza tarde: primero hay que terminar una colaboración comercial.",
    line: "La revolución empieza después del patrocinio.",
    material: [],
  },
  {
    title: "El ministerio de las pancartas",
    speaker: "Asambleario eterno",
    scene:
      "Hay una pancarta para cada problema y ningún acuerdo sobre dónde colgarlas.",
    line: "Se abre un turno para decidir cuándo cerramos el turno.",
    material: [
      reported(
        "Madrid será la tumba del rentismo",
        "El País",
        "Consigna atribuida a una crónica sobre vivienda.",
      ),
      reported(
        "La lucha es el único camino",
        "El País",
        "Consigna atribuida a la misma crónica.",
      ),
      reported(
        "Ellos por dinero, nosotras por amor",
        "HuffPost",
        "Pancarta citada en una galería de la plaza.",
      ),
    ],
  },
  {
    title: "El estudio con personalidad",
    speaker: "Cuñado propietario",
    scene:
      "Un casero anuncia un rincón sin ventana mientras su asesor propone arreglarlo todo construyendo.",
    line: "No es un zulo: es un estudio con personalidad.",
    aside:
      "Cuñado inmobiliario: «El problema se arregla construyendo. Siguiente pregunta».",
    material: [
      reported(
        "Ser casero no es una profesión",
        "HuffPost",
        "Pancarta atribuida a una fotografía de Sol.",
      ),
    ],
  },
  {
    title: "El primer cerco",
    speaker: "Comisión de comisiones",
    scene:
      "El Portero llega a la plaza. La respuesta defensiva queda a la espera de constituir una subcomisión.",
    line: "Antes de actuar necesitamos crear un grupo de trabajo.",
    material: [
      reported(
        "No toleramos ni un desahucio más",
        "HuffPost",
        "Consigna atribuida a una marcha de homenaje a Maricarmen.",
      ),
      reported(
        "El rentismo mata",
        "HuffPost",
        "Pancarta atribuida a esa marcha; se conserva su contexto de homenaje.",
      ),
    ],
  },
  {
    title: "La clase de mili",
    speaker: "Vecino indignado",
    scene:
      "Un paseante viene a explicar que todo se arreglaba con la mili. Nadie recuerda haber convocado esta charla.",
    line: "Yo a tu edad ya tenía hipoteca y dolor de espalda.",
    material: [
      reported(
        "Poneos a trabajar, sinvergüenzas",
        "El País",
        "Reproche atribuido a un paseante, no una descripción de los acampados.",
      ),
      reported(
        "¿A qué hora entran a trabajar?",
        "Burbuja.info",
        "Tema de un foro, no cántico documentado en la plaza.",
      ),
    ],
  },
  {
    title: "¿Puedes silenciar la revolución?",
    speaker: "Acampado con portátil",
    scene:
      "Una participante teletrabaja desde la tienda. El megáfono entra en su videollamada antes que ella.",
    line: "Un segundo, que tengo reunión con el cliente.",
    aside: "Videollamada: «¿Puedes silenciar la revolución?»",
    material: [],
    context:
      "Escena inspirada en los reportajes sobre portátiles y personas que alternan trabajo y acampada atribuidos a Somos Madrid en el material aportado.",
  },
  {
    title: "Emergencia de hummus",
    speaker: "Responsable de inventario",
    scene:
      "Las donaciones siguen llegando. Alguien ha confundido solidaridad con un pedido industrial de hummus.",
    line: "No puedes recoger más hummus.",
    material: [],
    context:
      "El material aportado atribuye a El País una crónica sobre más de mil envases de hummus y donantes que daban por hecho que todos eran veganos. La escena es una adaptación satírica.",
  },
  {
    title: "La tormenta de las duchas",
    speaker: "Comisión meteorológica",
    scene:
      "Empieza a llover. La lona gotea y fuera del campamento ya se está preparando el chiste.",
    line: "Evento climático: comienza el debate sobre las duchas.",
    material: [
      reported(
        "Por primera vez en días se duchan",
        "Espejo Público / Antena 3",
        "Burla atribuida a Nuevas Generaciones en X y reproducida en prensa; no cotejada en su cuenta original.",
      ),
      reported(
        "Deberían ponerse un puntito en la boca",
        "Espejo Público / Antena 3",
        "Respuesta atribuida a un acampado frente a esa burla.",
      ),
    ],
  },
  {
    title: "Decreto con megáfono",
    speaker: "Tertuliano en directo",
    scene:
      "La plaza pide medidas y las cámaras buscan su mejor encuadre mientras crece el cerco.",
    line: "No he venido a escuchar; he venido a conectar en directo.",
    material: [
      reported(
        "Pedro, rey, haz un decreto ley",
        "HuffPost",
        "Pancarta de tono humorístico atribuida a una galería.",
      ),
      reported(
        "O cae el rentismo o cae el Gobierno",
        "Heraldo",
        "Consigna atribuida a la protesta.",
      ),
    ],
  },
  {
    title: "Esto no es un botellón",
    speaker: "Comisión de limpieza",
    scene:
      "Aparece un cartel para recordar que protestar no exime de recoger. La asamblea debate dónde va cada envase.",
    line: "Te quedan dos minutos de batería y cuarenta de intervención.",
    material: [
      reported(
        "Esto no es un botellón, recoge tu basura",
        "El Independiente",
        "Cartel atribuido a una crónica del campamento.",
      ),
    ],
  },
  {
    title: "La guerra de las etiquetas",
    speaker: "Indignado profesional",
    scene:
      "La discusión se llena de motes. La pantalla del móvil parece más ruidosa que la propia plaza.",
    line: "Tu propuesta ha sido enviada a otra comisión.",
    material: [
      reported(
        "Lávate, zarrapastral jipuzo",
        "Así Va España",
        "Comentario en una web de memes; no consta como cántico de la plaza.",
      ),
      reported(
        "Perroflauta / acampada piojosa",
        "Periodista Digital",
        "Etiquetas despectivas atribuidas a un titular; no descripción comprobada.",
      ),
      reported(
        "No trabajan ni se duchan",
        "Reddit",
        "Estereotipo que motiva un hilo, no hecho comprobado sobre los participantes.",
      ),
    ],
    context:
      "«Piojoso, lávate» no figura como combinación literal confirmada en el documento: se conserva únicamente como ejemplo de parodia, no como cita real.",
  },
  {
    title: "El mapa del campamento",
    speaker: "Cartógrafo voluntario",
    scene:
      "Una persona dibuja calles y espacios de la acampada. Un turista cree que es el plano de una atracción.",
    line: "¿Esta es la cola del Tío Pepe?",
    material: [],
    context:
      "La escena del cartógrafo adapta el plano del campamento atribuido a una crónica de El País en el material aportado.",
  },
  {
    title: "Exterior: se oye la calle",
    speaker: "Agencia inmobiliaria",
    scene:
      "La plaza recibe anuncios de habitaciones con condiciones cada vez más creativas.",
    line: "Exterior: se oye la calle.",
    aside:
      "Anuncio de habitación: «Buscamos persona tranquila que no esté nunca».",
    material: [],
  },
  {
    title: "La plaza a gritos",
    speaker: "Cronista del campamento",
    scene:
      "Los refuerzos llegan entre ruido y consignas enfrentadas. La plaza prepara su resistencia final.",
    line: "Hoy hay más conexiones en directo que gente dispuesta a escuchar.",
    material: [
      reported(
        "Madrid será la tumba del fascismo",
        "HuffPost",
        "Cántico atribuido a los acampados en los incidentes del 12-O.",
      ),
      reported(
        "Rojo el que no bote",
        "HuffPost",
        "Cántico atribuido al grupo que acudió a increpar a la acampada el 12-O.",
      ),
      reported("A por ellos", "HuffPost", "Proclama atribuida a ese grupo."),
      reported(
        "Manipuladores, hijos de puta",
        "HuffPost",
        "Insulto atribuido a quienes increpaban a cámaras de prensa durante los incidentes; no se atribuye a un jefe del juego.",
      ),
    ],
  },
  {
    title: "La cartera del barrio",
    speaker: "Fondo buitre",
    scene:
      "Alguien descubre que el barrio entero cabe en una presentación de inversores.",
    line: "Tu barrio ha sido añadido a nuestra cartera.",
    material: [],
  },
  {
    title: "El turno infinito",
    speaker: "Asambleario eterno",
    scene:
      "Se propone cerrar el turno. La propuesta abre un nuevo turno sobre cómo cerrarlo.",
    line: "Se abre un turno para decidir cuándo cerramos el turno.",
    material: [],
  },
  {
    title: "Aval para entrar en la tienda",
    speaker: "Casero del jefe final",
    scene:
      "La tienda más pequeña recibe los requisitos más grandes. El indignado sigue discutiendo en la puerta.",
    line: "Te pide nómina, aval, fianza y una recomendación del anterior casero.",
    material: [],
  },
  {
    title: "Sol clásico: archivo de pancartas",
    speaker: "Archivo de la plaza",
    scene:
      "Antes del último asalto, el campamento recuerda lemas asociados al 15M. Son un archivo histórico separado de esta ficción.",
    line: "Antes de actuar necesitamos crear un grupo de trabajo.",
    material: [
      ...[
        "No nos representan",
        "No hay pan para tanto chorizo",
        "No es crisis, es estafa",
        "Pienso, luego estorbo",
      ].map((text) =>
        reported(
          text,
          "Carteles 15M",
          "Referencia histórica de 2011; no atribuida a la acampada actual.",
        ),
      ),
      ...[
        "Democracia real ya",
        "No somos mercancía de políticos y banqueros",
        "La primavera ha llegado a Sol",
      ].map((text) =>
        reported(
          text,
          "Movimiento15M",
          "Lema del archivo del 15M indicado en el documento; separado de la acampada actual.",
        ),
      ),
    ],
  },
  {
    title: "La casilla de salida",
    speaker: "Portavoz del campamento",
    scene:
      "El Prorrogador se presenta como jefe final. Queda una última noche de resistencia y una montaña de hummus por repartir.",
    line: "Has conseguido una casa. Era la casilla de salida.",
    material: [],
  },
];
