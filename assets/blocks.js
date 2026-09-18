/* ==========================================================================
   Page content below the hero.
   --------------------------------------------------------------------------
   THIS FILE IS WRITTEN BY editor.html. Open the editor, arrange the page,
   press Export, and replace this file with what it gives you.

   You can also edit it by hand — it is only an array — but the editor is
   faster and cannot produce a broken block.

   Every entry is:
     { id, type, nav?, props }

   `type` is one of: heading, text, rows, facts, ledger, gallery, image,
   buttons, phone, divider, spacer.

   `nav` is optional. Give a block { id, label, labelEs } and it gets an
   anchor and a link in the header and the mobile menu. Leave it off and it
   has neither, so the navigation can never point at a section that is not
   on the page.

   props.background : ground | ground2 | panel | black   (default: ground)
   props.width      : narrow | normal | wide             (default: normal)
   props.align      : left | center                      (default: left)
   props.tight      : true to halve the vertical padding

   The phone number, the Instagram handle, the approval flags and the photo
   manifest all still live in site.config.js. Blocks reference them; they do
   not copy them.
   ========================================================================== */

window.BLOCKS = [

  {
    id: "b-intro",
    type: "heading",
    nav: { id: "business", label: "About", labelEs: "Nosotros" },
    props: {
      background: "ground",
      text: "A residential builder in New Jersey, working one house at a time.",
      textEs: "Un constructor residencial en Nueva Jersey, trabajando una casa a la vez.",
      sub: "Whole-home renovations, kitchens and bathrooms, additions and custom interiors. Every trade is coordinated by one contractor from demolition through final finish, on a written scope you read before anything comes apart.",
      subEs: "Remodelaciones de casa completa, cocinas y baños, ampliaciones e interiores a medida. Un solo contratista coordina todos los oficios desde la demolición hasta el acabado final, sobre un alcance por escrito que usted lee antes de que se desarme nada."
    }
  },

  {
    id: "b-facts",
    type: "facts",
    props: {
      background: "ground",
      tight: true,
      items: [
        { text: "Written scope before work begins", textEs: "Alcance por escrito antes de empezar" },
        { text: "Payments staged against progress, not taken up front", textEs: "Pagos por etapas ligados al avance, no cobrados por adelantado" },
        { text: "Serving New Jersey homeowners", textEs: "Atendemos a propietarios en Nueva Jersey" }
      ]
    }
  },

  {
    id: "b-phone",
    type: "phone",
    props: { background: "ground", width: "narrow", tight: true, label: "Call", labelEs: "Llame" }
  },

  {
    id: "b-services-h",
    type: "heading",
    nav: { id: "services", label: "What we build", labelEs: "Lo que construimos" },
    props: {
      background: "ground2",
      text: "What we build",
      textEs: "Lo que construimos",
      sub: "From one room to a whole house, every project is planned around the work behind the walls as carefully as the finish you end up seeing.",
      subEs: "De un solo cuarto a una casa completa, cada proyecto se planea alrededor del trabajo detrás de los muros con el mismo cuidado que el acabado que usted termina viendo."
    }
  },

  {
    id: "b-services",
    type: "rows",
    props: {
      background: "ground2",
      tight: true,
      items: [
        {
          title: "Whole-home renovations", titleEs: "Remodelación de casa completa",
          body: "Rooms, systems and finishes brought together as one coordinated scope rather than a series of separate jobs.",
          bodyEs: "Cuartos, instalaciones y acabados unidos en un solo alcance coordinado, en lugar de una serie de trabajos separados."
        },
        {
          title: "Kitchens & bathrooms", titleEs: "Cocinas y baños",
          body: "Waterproofing, tile, cabinetry, plumbing, lighting and finish carpentry handled as one scope by one contractor.",
          bodyEs: "Impermeabilizado, azulejo, gabinetes, plomería, iluminación y carpintería de acabado en un solo alcance y con un solo contratista."
        },
        {
          title: "Additions & reconfigurations", titleEs: "Ampliaciones y reconfiguraciones",
          body: "More space and better flow, built to connect naturally to the house that is already there.",
          bodyEs: "Más espacio y mejor circulación, construido para conectarse de forma natural con la casa que ya existe."
        },
        {
          title: "Custom interiors & millwork", titleEs: "Interiores y carpintería a medida",
          body: "Built-ins, trim, cabinetry, panelled walls and architectural detail, designed and fabricated to the room.",
          bodyEs: "Muebles empotrados, molduras, gabinetes, muros panelados y detalle arquitectónico, diseñados y fabricados a la medida del cuarto."
        }
      ]
    }
  },

  {
    id: "b-work-h",
    type: "heading",
    nav: { id: "work", label: "Work", labelEs: "Trabajos" },
    props: {
      background: "ground",
      text: "Finished work",
      textEs: "Trabajo terminado",
      sub: "Photographs from completed projects. Tap any one to see it full size.",
      subEs: "Fotografías de proyectos terminados. Toque cualquiera para verla en grande."
    }
  },

  {
    id: "b-gallery",
    type: "gallery",
    props: { background: "ground", width: "wide", tight: true, category: "bathrooms", columns: 3 }
  },

  {
    id: "b-materials-h",
    type: "heading",
    props: {
      background: "ground2",
      text: "Materials from jobs we have finished",
      textEs: "Materiales de trabajos que hemos terminado",
      sub: "Every surface below is photographed from our own work, not a catalogue.",
      subEs: "Cada superficie de abajo está fotografiada de nuestro propio trabajo, no de un catálogo."
    }
  },

  {
    id: "b-materials",
    type: "gallery",
    props: { background: "ground2", width: "wide", tight: true, category: "details", columns: 6 }
  },

  {
    /* The only dark band in the page body, and the only place the badge's
       own words are set as type. It sits here because it is the bridge
       between the finished photographs above and the written scope below:
       "finished strong" is a claim about what is behind the surface, and
       the proposal is where that claim gets enforced. */
    id: "b-creed",
    type: "heading",
    props: {
      background: "black",
      align: "center",
      width: "narrow",
      text: "Built right. Finished strong.",
      textEs: "Bien construido. Bien terminado.",
      sub: "Waterproofing, framing, venting and blocking are done the same way whether or not anyone is ever going to see them. That is the whole of it.",
      subEs: "La impermeabilización, la estructura, la ventilación y los refuerzos se hacen igual, sin importar si alguien los va a ver algún día. Eso es todo."
    }
  },

  {
    id: "b-scope-h",
    type: "heading",
    nav: { id: "scope", label: "Proposal", labelEs: "Propuesta" },
    props: {
      background: "ground",
      text: "What your proposal says",
      textEs: "Lo que dice su propuesta",
      sub: "Before any work is booked you get a written scope with both columns filled in. The right-hand one is the reason the final invoice matches the first number.",
      subEs: "Antes de agendar cualquier trabajo recibe un alcance por escrito con las dos columnas llenas. La de la derecha es la razón por la que la factura final coincide con el primer número."
    }
  },

  {
    id: "b-ledger",
    type: "ledger",
    props: {
      background: "ground",
      tight: true,
      titleA: "Included", titleAEs: "Incluido",
      itemsA: [
        { text: "Every item of work, listed line by line", textEs: "Cada partida de trabajo, listada línea por línea" },
        { text: "Protection of the work area and access routes", textEs: "Protección del área de trabajo y accesos" },
        { text: "Guidance on what to buy, how much, and what works together", textEs: "Asesoría sobre qué comprar, cuánto y qué combina" },
        { text: "Payments staged against progress, not taken up front", textEs: "Pagos por etapas ligados al avance, no cobrados por adelantado" },
        { text: "A final walkthrough and punch list with you", textEs: "Un recorrido final y lista de detalles con usted" }
      ],
      titleB: "Not included", titleBEs: "No incluido",
      itemsB: [
        { text: "On labor-only scopes, the finish materials are yours to buy: tile, vanity, faucet, toilet, mirror, light fixture, shower trim, molding and paint", textEs: "En alcances de solo mano de obra, los materiales de acabado los compra usted: azulejo, tocador, llave, inodoro, espejo, luminaria, accesorios de regadera, molduras y pintura" },
        { text: "Anything hidden until demolition: water damage, deteriorated framing, subfloor damage, concealed plumbing or electrical faults", textEs: "Todo lo oculto hasta la demolición: daño por agua, estructura deteriorada, daño en contrapiso, fallas ocultas de plomería o electricidad" },
        { text: "Work outside the room or scope you contracted", textEs: "Trabajo fuera del cuarto o alcance contratado" },
        { text: "Specialty items quoted separately, such as decorative wall covering", textEs: "Partidas especiales cotizadas aparte, como recubrimientos decorativos" },
        { text: "Architectural or engineering services, and permits, unless written in", textEs: "Servicios de arquitectura o ingeniería, y permisos, salvo que estén escritos" }
      ]
    }
  },

  {
    id: "b-scope-note",
    type: "text",
    props: {
      background: "panel",
      tight: true,
      text: "Anything found behind a wall is priced and approved by you in writing before we carry on. That is the whole mechanism, and it is why nobody gets a surprise at the end.",
      textEs: "Todo lo que aparezca detrás de un muro se cotiza y usted lo aprueba por escrito antes de continuar. Ese es todo el mecanismo, y por eso nadie se lleva una sorpresa al final."
    }
  },

  {
    id: "b-contact-h",
    type: "heading",
    nav: { id: "contact", label: "Contact", labelEs: "Contacto" },
    props: {
      background: "ground2",
      align: "center",
      text: "Start a project",
      textEs: "Empezar un proyecto",
      sub: "The fastest way to start is a call. Tell us what you are planning and we will let you know whether it is a fit and what the next step looks like.",
      subEs: "Lo más rápido es una llamada. Cuéntenos qué está planeando y le diremos si encaja y cómo es el siguiente paso."
    }
  },

  {
    id: "b-contact-cta",
    type: "buttons",
    props: {
      background: "ground2",
      align: "center",
      tight: true,
      items: [
        { label: "Call (732) 890-6244", labelEs: "Llame al (732) 890-6244", href: "tel:+17328906244", style: "primary" }
      ]
    }
  }
];
