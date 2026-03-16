export type Region = 'rafaela' | 'rosario' | 'cordoba';

export interface TarifaRegional {
  id: string;
  name: string;
  baseCategory?: string;
  prices: Record<Region, number>;
}

export const regionalTariffs: TarifaRegional[] = [
  {
    id: 'cat-qq3r1u',
    name: 'Hora de Trabajo',
    prices: {
      rafaela: 24400,
      rosario: 36600,
      cordoba: 43920,
    }
  },
  {
    id: 'cat-b744w1',
    name: 'Nueva Identidad Corporativa',
    prices: {
      rafaela: 1084300,
      rosario: 1626450,
      cordoba: 1951740,
    }
  },
  {
    id: 'cat-222bgl',
    name: 'Nuevo logotipo/isotipo/imagotipo/isologo',
    prices: {
      rafaela: 433100,
      rosario: 649650,
      cordoba: 779580,
    }
  },
  {
    id: 'cat-3pkobj',
    name: 'Rediseño Identidad Corporativa',
    prices: {
      rafaela: 1084300,
      rosario: 1626450,
      cordoba: 1951740,
    }
  },
  {
    id: 'cat-os4tzi',
    name: 'Rediseño logotipo/isotipo/imagotipo/isologo',
    prices: {
      rafaela: 433100,
      rosario: 649650,
      cordoba: 779580,
    }
  },
  {
    id: 'cat-br3tgl',
    name: 'Restyling Identidad Corporativa',
    prices: {
      rafaela: 905800,
      rosario: 1358700,
      cordoba: 1630440,
    }
  },
  {
    id: 'cat-t4u1qv',
    name: 'Restyling logotipo/isotipo/imagotipo/isologo',
    prices: {
      rafaela: 330300,
      rosario: 495450,
      cordoba: 594540,
    }
  },
  {
    id: 'cat-b4wlzb',
    name: 'Manual de normas/uso',
    prices: {
      rafaela: 289100,
      rosario: 433650,
      cordoba: 520380,
    }
  },
  {
    id: 'cat-t60kwf',
    name: 'Identidad efímera',
    prices: {
      rafaela: 357700,
      rosario: 536550,
      cordoba: 643860,
    }
  },
  {
    id: 'cat-jojd3k',
    name: 'Identidad de un producto',
    prices: {
      rafaela: 582600,
      rosario: 873900,
      cordoba: 1048680,
    }
  },
  {
    id: 'cat-ve9xvm',
    name: 'Naming corporativo/institucional',
    prices: {
      rafaela: 224900,
      rosario: 337350,
      cordoba: 404820,
    }
  },
  {
    id: 'cat-3uf4e7',
    name: 'Naming producto/evento',
    prices: {
      rafaela: 117400,
      rosario: 176100,
      cordoba: 211320,
    }
  },
  {
    id: 'cat-b3bxtm',
    name: 'Slogan / Lema',
    prices: {
      rafaela: 117400,
      rosario: 176100,
      cordoba: 211320,
    }
  },
  {
    id: 'cat-s62909',
    name: 'Claim',
    prices: {
      rafaela: 117400,
      rosario: 176100,
      cordoba: 211320,
    }
  },
  {
    id: 'cat-2uda5e',
    name: 'Prenda única',
    prices: {
      rafaela: 109200,
      rosario: 163800,
      cordoba: 196560,
    }
  },
  {
    id: 'cat-k9zs41',
    name: 'Sistema de uniforme/vestuario completo',
    prices: {
      rafaela: 589000,
      rosario: 883500,
      cordoba: 1060200,
    }
  },
  {
    id: 'cat-kwrx5z',
    name: 'Papelería básica',
    prices: {
      rafaela: 349200,
      rosario: 523800,
      cordoba: 628560,
    }
  },
  {
    id: 'cat-xrp57m',
    name: 'Papeleria comercial',
    prices: {
      rafaela: 173200,
      rosario: 259800,
      cordoba: 311760,
    }
  },
  {
    id: 'cat-ggojcp',
    name: 'Tarjetas personales',
    prices: {
      rafaela: 74600,
      rosario: 111900,
      cordoba: 134280,
    }
  },
  {
    id: 'cat-6ksqva',
    name: 'Hojas membretadas',
    prices: {
      rafaela: 74600,
      rosario: 111900,
      cordoba: 134280,
    }
  },
  {
    id: 'cat-0eiypc',
    name: 'Sobres',
    prices: {
      rafaela: 74600,
      rosario: 111900,
      cordoba: 134280,
    }
  },
  {
    id: 'cat-jnk7sk',
    name: 'Firma o encabezado de e-mail',
    prices: {
      rafaela: 74600,
      rosario: 111900,
      cordoba: 134280,
    }
  },
  {
    id: 'cat-6av0qm',
    name: 'Carpeta empresarial/institucional',
    prices: {
      rafaela: 164000,
      rosario: 246000,
      cordoba: 295200,
    }
  },
  {
    id: 'cat-nq1vek',
    name: 'Certificado',
    prices: {
      rafaela: 154100,
      rosario: 231150,
      cordoba: 277380,
    }
  },
  {
    id: 'cat-49pk7a',
    name: 'Postal',
    prices: {
      rafaela: 128400,
      rosario: 192600,
      cordoba: 231120,
    }
  },
  {
    id: 'cat-qiw6lq',
    name: 'Volante/Flyer sólo frente',
    prices: {
      rafaela: 114000,
      rosario: 171000,
      cordoba: 205200,
    }
  },
  {
    id: 'cat-mgiqa9',
    name: 'Volante/Flyer frente y dorso',
    prices: {
      rafaela: 176300,
      rosario: 264450,
      cordoba: 317340,
    }
  },
  {
    id: 'cat-nj4drj',
    name: 'Folleto díptico',
    prices: {
      rafaela: 245000,
      rosario: 367500,
      cordoba: 441000,
    }
  },
  {
    id: 'cat-0nmyzz',
    name: 'Folleto tríptico',
    prices: {
      rafaela: 330300,
      rosario: 495450,
      cordoba: 594540,
    }
  },
  {
    id: 'cat-nycfx7',
    name: 'Brochure',
    prices: {
      rafaela: 647000,
      rosario: 970500,
      cordoba: 1164600,
    }
  },
  {
    id: 'cat-45azl0',
    name: 'Aviso institucional para diario o revista',
    prices: {
      rafaela: 99400,
      rosario: 149100,
      cordoba: 178920,
    }
  },
  {
    id: 'cat-ilyfqg',
    name: 'Aviso institucional para diario o revista',
    prices: {
      rafaela: 151300,
      rosario: 226950,
      cordoba: 272340,
    }
  },
  {
    id: 'cat-gebp2w',
    name: 'Aviso publicitario para diario o revista',
    prices: {
      rafaela: 176300,
      rosario: 264450,
      cordoba: 317340,
    }
  },
  {
    id: 'cat-h6y71m',
    name: 'Aviso publicitario para diario o revista',
    prices: {
      rafaela: 215600,
      rosario: 323400,
      cordoba: 388080,
    }
  },
  {
    id: 'cat-z8w3ys',
    name: 'Social Media Plan',
    prices: {
      rafaela: 269400,
      rosario: 404100,
      cordoba: 484920,
    }
  },
  {
    id: 'cat-pfseh4',
    name: 'Creación de perfil, fanpage, grupo, evento, cuenta, canal, etc.',
    prices: {
      rafaela: 136400,
      rosario: 204600,
      cordoba: 245520,
    }
  },
  {
    id: 'cat-ll55c9',
    name: 'Creación de álbum (productos, evento, etc)',
    prices: {
      rafaela: 43700,
      rosario: 65550,
      cordoba: 78660,
    }
  },
  {
    id: 'cat-vnvhqw',
    name: 'Compartir/Repost contenido de tercero',
    prices: {
      rafaela: 15200,
      rosario: 22800,
      cordoba: 27360,
    }
  },
  {
    id: 'cat-s1sme9',
    name: 'Administración/Gestión básica de RRSS (costo x mes)',
    prices: {
      rafaela: 179700,
      rosario: 269550,
      cordoba: 323460,
    }
  },
  {
    id: 'cat-eghq2h',
    name: 'Administración/Gestión estándar de RRSS (costo x mes)',
    prices: {
      rafaela: 251000,
      rosario: 376500,
      cordoba: 451800,
    }
  },
  {
    id: 'cat-sf8qsc',
    name: 'Administración/Gestión intensiva de RRSS (costo x mes)',
    prices: {
      rafaela: 323700,
      rosario: 485550,
      cordoba: 582660,
    }
  },
  {
    id: 'cat-e80re6',
    name: 'Flyers para IG',
    prices: {
      rafaela: 23000,
      rosario: 34500,
      cordoba: 41400,
    }
  },
  {
    id: 'cat-ulq141',
    name: 'Merchandising',
    prices: {
      rafaela: 400500,
      rosario: 600750,
      cordoba: 720900,
    }
  },
  {
    id: 'cat-411jc6',
    name: 'Remeras',
    prices: {
      rafaela: 79200,
      rosario: 118800,
      cordoba: 142560,
    }
  },
  {
    id: 'cat-ohgr5a',
    name: 'Calcos',
    prices: {
      rafaela: 64200,
      rosario: 96300,
      cordoba: 115560,
    }
  },
  {
    id: 'cat-qdrrpq',
    name: 'Lapicera, pin, llavero',
    prices: {
      rafaela: 64200,
      rosario: 96300,
      cordoba: 115560,
    }
  },
  {
    id: 'cat-l8ed1o',
    name: 'Pad, funda celulares, taza',
    prices: {
      rafaela: 64200,
      rosario: 96300,
      cordoba: 115560,
    }
  },
  {
    id: 'cat-ocswqx',
    name: 'Bandera',
    prices: {
      rafaela: 64200,
      rosario: 96300,
      cordoba: 115560,
    }
  },
  {
    id: 'cat-3q2j00',
    name: 'Bolsas / Envoltorios',
    prices: {
      rafaela: 79200,
      rosario: 118800,
      cordoba: 142560,
    }
  },
  {
    id: 'cat-2pzoyq',
    name: 'Almanaque de pared tipo " poster"',
    prices: {
      rafaela: 225500,
      rosario: 338250,
      cordoba: 405900,
    }
  },
  {
    id: 'cat-pyb7g4',
    name: 'Almanaque de pared tipo "revista" o "con anillado"',
    prices: {
      rafaela: 524800,
      rosario: 787200,
      cordoba: 944640,
    }
  },
  {
    id: 'cat-mgb7de',
    name: 'Arte de tapa',
    prices: {
      rafaela: 334300,
      rosario: 501450,
      cordoba: 601740,
    }
  },
  {
    id: 'cat-mk0xgt',
    name: 'Armado de página simple',
    prices: {
      rafaela: 20100,
      rosario: 30150,
      cordoba: 36180,
    }
  },
  {
    id: 'cat-e1llbk',
    name: 'Armado de página compuesta',
    prices: {
      rafaela: 34900,
      rosario: 52350,
      cordoba: 62820,
    }
  },
  {
    id: 'cat-lubov2',
    name: 'Libro (cuerpo y puesta en página)',
    prices: {
      rafaela: 1485200,
      rosario: 2227800,
      cordoba: 2673360,
    }
  },
  {
    id: 'cat-6vpmn6',
    name: 'Revista',
    prices: {
      rafaela: 669000,
      rosario: 1003500,
      cordoba: 1204200,
    }
  },
  {
    id: 'cat-hu97kj',
    name: 'Catálogo de productos',
    prices: {
      rafaela: 1000500,
      rosario: 1500750,
      cordoba: 1800900,
    }
  },
  {
    id: 'cat-g5zkk0',
    name: 'Menú/carta para restaurante',
    prices: {
      rafaela: 269400,
      rosario: 404100,
      cordoba: 484920,
    }
  },
  {
    id: 'cat-6uii6m',
    name: 'Manual de instrucciones. COSTO X PÁGINA',
    prices: {
      rafaela: 51100,
      rosario: 76650,
      cordoba: 91980,
    }
  },
  {
    id: 'cat-by4jcf',
    name: 'Folleto instructivo',
    prices: {
      rafaela: 287300,
      rosario: 430950,
      cordoba: 517140,
    }
  },
  {
    id: 'cat-hbcpsp',
    name: 'Ploteado vehicular',
    prices: {
      rafaela: 244400,
      rosario: 366600,
      cordoba: 439920,
    }
  },
  {
    id: 'cat-20k5ae',
    name: 'Ploteado vidriera simple/efímero',
    prices: {
      rafaela: 151300,
      rosario: 226950,
      cordoba: 272340,
    }
  },
  {
    id: 'cat-fhiok9',
    name: 'Ploteado vidriera complejo/perdurable',
    prices: {
      rafaela: 385800,
      rosario: 578700,
      cordoba: 694440,
    }
  },
  {
    id: 'cat-hwdiq5',
    name: 'Cenefa / Saltarín / Llamador',
    prices: {
      rafaela: 194000,
      rosario: 291000,
      cordoba: 349200,
    }
  },
  {
    id: 'cat-7r9ezs',
    name: 'Afiche',
    prices: {
      rafaela: 194000,
      rosario: 291000,
      cordoba: 349200,
    }
  },
  {
    id: 'cat-6do0sf',
    name: 'Banner',
    prices: {
      rafaela: 194000,
      rosario: 291000,
      cordoba: 349200,
    }
  },
  {
    id: 'cat-7jln1l',
    name: 'Cartel de fachada',
    prices: {
      rafaela: 282200,
      rosario: 423300,
      cordoba: 507960,
    }
  },
  {
    id: 'cat-4fmm4z',
    name: 'Cartel para exteriores',
    prices: {
      rafaela: 307200,
      rosario: 460800,
      cordoba: 552960,
    }
  },
  {
    id: 'cat-xnhdeu',
    name: 'Diseño de Sistema señalético y su soporte',
    prices: {
      rafaela: 1172500,
      rosario: 1758750,
      cordoba: 2110500,
    }
  },
  {
    id: 'cat-jvz1uu',
    name: 'Digitalización',
    prices: {
      rafaela: 62000,
      rosario: 93000,
      cordoba: 111600,
    }
  },
  {
    id: 'cat-c5ne5z',
    name: 'Ilustración mano alzada',
    prices: {
      rafaela: 298600,
      rosario: 447900,
      cordoba: 537480,
    }
  },
  {
    id: 'cat-fty5ue',
    name: 'Ilustración vectorial',
    prices: {
      rafaela: 298600,
      rosario: 447900,
      cordoba: 537480,
    }
  },
  {
    id: 'cat-tpfney',
    name: 'Ilustración/modelado 3D',
    prices: {
      rafaela: 582600,
      rosario: 873900,
      cordoba: 1048680,
    }
  },
  {
    id: 'cat-ach48o',
    name: 'Animación de personaje o escenario',
    prices: {
      rafaela: 1186000,
      rosario: 1779000,
      cordoba: 2134800,
    }
  },
  {
    id: 'cat-373951',
    name: 'Desarrollo de sistema de signos',
    prices: {
      rafaela: 1007100,
      rosario: 1510650,
      cordoba: 1812780,
    }
  },
  {
    id: 'cat-4zmp9n',
    name: 'Infografía',
    prices: {
      rafaela: 1256600,
      rosario: 1884900,
      cordoba: 2261880,
    }
  },
  {
    id: 'cat-xuw8g4',
    name: 'Pack digital presentation',
    prices: {
      rafaela: 674600,
      rosario: 1011900,
      cordoba: 1214280,
    }
  },
  {
    id: 'cat-kl202n',
    name: 'Etiqueta simple',
    prices: {
      rafaela: 326000,
      rosario: 489000,
      cordoba: 586800,
    }
  },
  {
    id: 'cat-xh7dzq',
    name: 'Etiqueta compuesta',
    prices: {
      rafaela: 970600,
      rosario: 1455900,
      cordoba: 1747080,
    }
  },
  {
    id: 'cat-0ini5y',
    name: 'Envase',
    prices: {
      rafaela: 1136000,
      rosario: 1704000,
      cordoba: 2044800,
    }
  },
  {
    id: 'cat-izb0ho',
    name: 'Modelado 3D de envase',
    prices: {
      rafaela: 187000,
      rosario: 280500,
      cordoba: 336600,
    }
  },
  {
    id: 'cat-flfu21',
    name: 'Renderizado de modelo 3D',
    prices: {
      rafaela: 43700,
      rosario: 65550,
      cordoba: 78660,
    }
  },
  {
    id: 'cat-s15aqh',
    name: 'Animacion de modelo 3D',
    prices: {
      rafaela: 442400,
      rosario: 663600,
      cordoba: 796320,
    }
  },
  {
    id: 'cat-a5f6q2',
    name: 'Modificaciones a sitio WEB HTML/CSS',
    prices: {
      rafaela: 562900,
      rosario: 844350,
      cordoba: 1013220,
    }
  },
  {
    id: 'cat-r4rzg1',
    name: 'Diseño sitio WEB PÁGINA DE ATERRIZAJE',
    prices: {
      rafaela: 168100,
      rosario: 252150,
      cordoba: 302580,
    }
  },
  {
    id: 'cat-6zse6w',
    name: 'Maquetación sitio WEB PÁGINA DE ATERRIZAJE',
    prices: {
      rafaela: 383000,
      rosario: 574500,
      cordoba: 689400,
    }
  },
  {
    id: 'cat-0m87ol',
    name: 'Diseño sitio WEB “One Page”',
    prices: {
      rafaela: 239800,
      rosario: 359700,
      cordoba: 431640,
    }
  },
  {
    id: 'cat-nrnnv0',
    name: 'Maquetación sitio WEB “One Page”',
    prices: {
      rafaela: 694100,
      rosario: 1041150,
      cordoba: 1249380,
    }
  },
  {
    id: 'cat-yn3qlj',
    name: 'Diseño sitio WEB “Estándar”',
    prices: {
      rafaela: 305700,
      rosario: 458550,
      cordoba: 550260,
    }
  },
  {
    id: 'cat-6vdgoi',
    name: 'Maquetación sitio WEB “Estándar”',
    prices: {
      rafaela: 855300,
      rosario: 1282950,
      cordoba: 1539540,
    }
  },
  {
    id: 'cat-o94by5',
    name: 'Diseño sitio WEB “Completo"',
    prices: {
      rafaela: 369200,
      rosario: 553800,
      cordoba: 664560,
    }
  },
  {
    id: 'cat-ekc1tx',
    name: 'Maquetación sitio WEB “Completo”',
    prices: {
      rafaela: 1171400,
      rosario: 1757100,
      cordoba: 2108520,
    }
  },
  {
    id: 'cat-kz8ltt',
    name: 'Opcional WEB: Sección adicional',
    prices: {
      rafaela: 67900,
      rosario: 101850,
      cordoba: 122220,
    }
  },
  {
    id: 'cat-od3n5p',
    name: 'Opcional WEB: Sistema autoadministrable / autogestión',
    prices: {
      rafaela: 328500,
      rosario: 492750,
      cordoba: 591300,
    }
  },
  {
    id: 'cat-7yh2ci',
    name: 'WEB Alta en “Google Mi Negocio”',
    prices: {
      rafaela: 147800,
      rosario: 221700,
      cordoba: 266040,
    }
  },
  {
    id: 'cat-ru6gry',
    name: 'Opcional WEB: Google Analytics',
    prices: {
      rafaela: 147800,
      rosario: 221700,
      cordoba: 266040,
    }
  },
  {
    id: 'cat-faj21d',
    name: 'Opcional WEB: Posicionamiento SEO optimizado',
    prices: {
      rafaela: 161000,
      rosario: 241500,
      cordoba: 289800,
    }
  },
  {
    id: 'cat-l3lnzb',
    name: 'Opcional WEB: Campaña SEM básica',
    prices: {
      rafaela: 161000,
      rosario: 241500,
      cordoba: 289800,
    }
  },
  {
    id: 'cat-3pabsz',
    name: 'Armado tienda WEB online (TiendaNube, Wix o similar) 5',
    prices: {
      rafaela: 334200,
      rosario: 501300,
      cordoba: 601560,
    }
  },
  {
    id: 'cat-9eyou1',
    name: 'Armado tienda WEB online (TiendaNube, Wix o similar) 30',
    prices: {
      rafaela: 503900,
      rosario: 755850,
      cordoba: 907020,
    }
  },
  {
    id: 'cat-youufb',
    name: 'Diseño APP UX (experiencia de usuario)',
    prices: {
      rafaela: 755500,
      rosario: 1133250,
      cordoba: 1359900,
    }
  },
  {
    id: 'cat-qrl4id',
    name: 'Diseño APP UI (interfase de usuario)',
    prices: {
      rafaela: 755500,
      rosario: 1133250,
      cordoba: 1359900,
    }
  },
  {
    id: 'cat-mcu3f2',
    name: 'Maquetación APP (programación Híbrida)',
    prices: {
      rafaela: 755500,
      rosario: 1133250,
      cordoba: 1359900,
    }
  },
  {
    id: 'cat-33xf1u',
    name: 'Maquetación APP (programación Nativa)',
    prices: {
      rafaela: 1133900,
      rosario: 1700850,
      cordoba: 2041020,
    }
  },
  {
    id: 'cat-ylupsq',
    name: 'Banner publicitario animado',
    prices: {
      rafaela: 190300,
      rosario: 285450,
      cordoba: 342540,
    }
  },
  {
    id: 'cat-pmd0b4',
    name: 'Mailing publicitario / Newsletter',
    prices: {
      rafaela: 166300,
      rosario: 249450,
      cordoba: 299340,
    }
  },
  {
    id: 'cat-s2v3ba',
    name: 'Placa animada 2D',
    prices: {
      rafaela: 110500,
      rosario: 165750,
      cordoba: 198900,
    }
  },
  {
    id: 'cat-wbwt1d',
    name: 'Spot publicitario/animación complejidad baja',
    prices: {
      rafaela: 183600,
      rosario: 275400,
      cordoba: 330480,
    }
  },
  {
    id: 'cat-euyofh',
    name: 'Spot publicitario/animación complejidad media',
    prices: {
      rafaela: 305300,
      rosario: 457950,
      cordoba: 549540,
    }
  },
  {
    id: 'cat-ota4kx',
    name: 'Spot publicitario/animación complejidad alta',
    prices: {
      rafaela: 489000,
      rosario: 733500,
      cordoba: 880200,
    }
  },
  {
    id: 'cat-ur4s4o',
    name: 'Títulos apertura (TV, YouTube, Vimeo, etc. )',
    prices: {
      rafaela: 183600,
      rosario: 275400,
      cordoba: 330480,
    }
  },
  {
    id: 'cat-3byxv1',
    name: 'Zócalo (TV, YouTube, Vimeo, etc.)',
    prices: {
      rafaela: 84500,
      rosario: 126750,
      cordoba: 152100,
    }
  },
  {
    id: 'cat-ie869a',
    name: 'Spot radial',
    prices: {
      rafaela: 80100,
      rosario: 120150,
      cordoba: 144180,
    }
  },
  {
    id: 'cat-z8p0rw',
    name: 'Composición y grabación de música original',
    prices: {
      rafaela: 305300,
      rosario: 457950,
      cordoba: 549540,
    }
  },
  {
    id: 'cat-9yuvln',
    name: 'Locución',
    prices: {
      rafaela: 60900,
      rosario: 91350,
      cordoba: 109620,
    }
  },
  {
    id: 'cat-w7fd8j',
    name: 'En estudio: armado de set',
    prices: {
      rafaela: 132400,
      rosario: 198600,
      cordoba: 238320,
    }
  },
  {
    id: 'cat-1dtir8',
    name: 'En locación: sesión fotográfica',
    prices: {
      rafaela: 132400,
      rosario: 198600,
      cordoba: 238320,
    }
  },
  {
    id: 'cat-3wb839',
    name: 'Escaneo digital',
    prices: {
      rafaela: 9000,
      rosario: 13500,
      cordoba: 16200,
    }
  },
  {
    id: 'cat-3tfswl',
    name: 'Filmación (costo x hora)',
    prices: {
      rafaela: 144300,
      rosario: 216450,
      cordoba: 259740,
    }
  },
  {
    id: 'cat-e1oz2b',
    name: 'Supervisión de tomas fotográficas (costo x hora)',
    prices: {
      rafaela: 23400,
      rosario: 35100,
      cordoba: 42120,
    }
  },
  {
    id: 'cat-h8bsya',
    name: 'Retoque digital (se recomienda ver hora de trabajo diseñador) x 1 hora.',
    prices: {
      rafaela: 23400,
      rosario: 35100,
      cordoba: 42120,
    }
  },
];

export interface RangoSugerido {
  base: number;
  min: number;
  max: number;
}

export function getServicePricing(serviceId: string): RangoSugerido | null {
  const service = regionalTariffs.find(s => s.id === serviceId);
  if (!service) return null;

  const prices = Object.values(service.prices);
  return {
    base: service.prices.rafaela,
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

// Local Storage Management
export const STORAGE_KEY = 'cotiza_tariffs';

export function getCustomTariffs(): TarifaRegional[] {
  if (typeof window === 'undefined') return regionalTariffs;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved tariffs", e);
    }
  }
  return regionalTariffs;
}

export function saveCustomTariffs(tariffs: TarifaRegional[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tariffs));
  }
}

export function resetTariffsToDefault() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
