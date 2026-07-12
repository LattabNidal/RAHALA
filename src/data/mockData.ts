import { Landmark, Hotel } from '../types';

export const mockLandmarks: Landmark[] = [
  {
    id: 'casbah',
    name: 'The Casbah of Algiers',
    location: 'Algiers (Alger)',
    category: 'historical',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596120206305-c10b0058bcde?auto=format&fit=crop&w=1200&q=80',
    panoramas: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80', // Street gate
      'https://images.unsplash.com/photo-1627581165609-b6dc24660eb6?auto=format&fit=crop&w=1200&q=80', // Traditional tile courtyard
      'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1200&q=80'  // Sea view
    ],
    description: {
      en: 'A unique Islamic city of incredible history. It contains remains of citadel, ancient mosques and Ottoman-style palaces, maintaining deep-rooted Algiers culture.',
      fr: "Un exemple unique de ville islamique historique. Elle préserve les vestiges d'une citadelle, de mosquées anciennes et de palais ottomans, au cœur de la culture algéroise.",
      ar: 'مدينة إسلامية فريدة ذات تاريخ حافل. تضم بقايا قلعة، مساجد قديمة وقصور عثمانية مذهلة، وتحافظ على ثقافة العاصمة العريقة.',
      es: 'Una ciudad islámica única con una historia increíble. Contiene restos de una ciudadela, mezquitas antiguas y palacios otomanos.'
    },
    facts: {
      en: [
        'Recognized as a UNESCO World Heritage site since 1991.',
        'Features spectacular traditional houses built closely to sustain earthquakes.',
        'Was the vital fortress and stronghold of Algiers during the Regency era.'
      ],
      fr: [
        'Reconnue comme site du patrimoine mondial de l’UNESCO depuis 1991.',
        'Dispose de structures traditionnelles serrées pour résister aux séismes.',
        'Fut la forteresse vitale d’Alger durant l’époque de la Régence.'
      ],
      ar: [
        'مصنفة كإرث عالمي لليونسكو منذ عام 1991.',
        'تتميز بمنازلها التقليدية المتلاصقة لمقاومة الزلازل.',
        'كانت المعقل الرئيسي والحصن المنيع لمدينة الجزائر في العهد العثماني.'
      ],
      es: [
        'Reconocida como Patrimonio de la Humanidad por la UNESCO desde 1991.',
        'Presenta casas tradicionales construidas de forma compacta para resistir terremotos.',
        'Fue la fortaleza vital de Argel durante la época de la Regencia.'
      ]
    }
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz Fort & Cathedral',
    location: 'Oran (Wahran)',
    category: 'cultural',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    panoramas: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // Fort walls
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'  // Panorama of Oran Port
    ],
    description: {
      en: 'Perched on Mt. Murdjadjo, the fort provides breathtaking panoramic views of the Oran coastline and is connected to a stunning historic chapel built after a cholera outbreak.',
      fr: "Perché sur le mont Murdjadjo, ce fort offre une vue panoramique époustouflante sur la côte d'Oran. Il côtoie une magnifique chapelle historique.",
      ar: 'يقع الحصن على جبل مرجاجو الشامخ، ويوفر إطلالات بانورامية خلابة على ساحل وهران، وبجواره كنيسة تاريخية مهيبة بنتها الجالية للإغاثة من وباء الكوليرا.',
      es: 'Situado en el Monte Murdjadjo, el fuerte ofrece impresionantes vistas panorámicas de la costa de Orán y está conectado a una capilla histórica.'
    },
    facts: {
      en: [
        'Built by the Spaniards between 1563 and 1577.',
        'Underwent heavy battles between Ottoman and Spanish forces.',
        'Offers visual line-of-sight to Spain’s coast on clear days.'
      ],
      fr: [
        'Construit par les Espagnols entre 1563 et 1577.',
        'Fut le théâtre de rudes batailles entre Ottomans et Espagnols.',
        'Permet d’apercevoir les côtes espagnoles par temps très clair.'
      ],
      ar: [
        'بناه الإسبان بين عامي 1563 و 1577 م.',
        'شهد معارك ضارية بين القوات العثمانية والإسبانية للسيطرة عليه.',
        'يمكن رؤية خط الأفق نحو إسبانيا في الأيام الصافية تماماً.'
      ],
      es: [
        'Construido por los españoles entre 1563 y 1577.',
        'Sufrió intensas batallas entre las fuerzas otomanas y españolas.',
        'Ofrece una línea de visión directa a la costa de España en días despejados.'
      ]
    }
  },
  {
    id: 'tassili',
    name: 'Tassili n’Ajjer National Park',
    location: 'Djanet (Sahara)',
    category: 'sahara',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', // Beautiful desert dunes
    panoramas: [
      'https://images.unsplash.com/photo-1530521951415-32410a74134f?auto=format&fit=crop&w=1200&q=80', // Rock arches
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80'  // Golden dunes of Djanet
    ],
    description: {
      en: 'A vast, alien-like plateau in the Sahara containing one of the world’s most important groupings of prehistoric cave art, dating back more than 10,000 years.',
      fr: "Un vaste plateau désertique du Sahara abritant l'un des plus importants ensembles d'art rupestre préhistorique au monde, datant de plus de 10 000 ans.",
      ar: 'هضبة شاسعة في قلب الصحراء الكبرى تشبه طقساً فضائياً، وتحتوي على واحدة من أهم مجموعات الفنون الصخرية التي ترجع لما قبل التاريخ وتعود لأكثر من 10,000 سنة.',
      es: 'Una vasta meseta en el Sahara que contiene uno de los conjuntos de arte rupestre prehistórico más importantes del mundo, con más de 10.000 años de antigüedad.'
    },
    facts: {
      en: [
        'Famous for its "Forest of Stone" – sandstone chimneys carved by wind.',
        'Features paintings depicting green savannah, cattle, and complex human societies in ancient Sahara.',
        'Covers over 72,000 square kilometers of protected National Reserve.'
      ],
      fr: [
        'Célèbre pour sa "Forêt de Pierre" – cheminées de grès sculptées par le vent.',
        'Des peintures y décrivent la savane verte et le bétail de l’ancien Sahara.',
        'S’étend sur plus de 72 000 kilomètres carrés de réserve protégée.'
      ],
      ar: [
        'مشهورة بـ "غابة الصخور" - أعمدة صخرية رملية رائعة نحتتها الرياح عبر العصور.',
        'تظهر الرسومات صخرية مناظر السفاري الخضراء والمواشي التي عاشت في الصحراء الغابرة.',
        'تغطي مساحة تزيد عن 72,000 كيلومتر مربع كأكبر متحف مفتوح تحت السماء.'
      ],
      es: [
        'Famoso por su "Bosque de Piedra", chimeneas de arenisca talladas por el viento.',
        'Presenta pinturas que representan la sabana verde, ganado y sociedades complejas en el Sahara antiguo.',
        'Cubre más de 72.000 kilómetros cuadrados de Reserva Nacional protegida.'
      ]
    }
  },
  {
    id: 'constantine-bridges',
    name: 'Suspension Bridges of Constantine',
    location: 'Constantine (Qasentina)',
    category: 'historical',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // High suspension views
    panoramas: [
      'https://images.unsplash.com/photo-1545231027-63b3f16260cd?auto=format&fit=crop&w=1200&q=80', // Gorge edge
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'  // Sidi M’Cid bridge height
    ],
    description: {
      en: 'The city of bridges, built over a deep rocky canyon of the Rhumel River. The dramatic suspension bridges link hills together, suspended hundreds of meters above ground.',
      fr: "La ville des ponts suspendus, bâtie au-dessus des gorges du fleuve Rhumel. Ces chefs-d'œuvre audacieux relient les falaises à des hauteurs vertigineuses.",
      ar: 'مدينة الجسور المعلقة الأسطورية، مبنية فوق منحدرات صخرية سحيقة يشقها وادي الرمال. تربط هذه الجسور الرائعة بين ضفتي المدينة على ارتفاع مئات الأمتار.',
      es: 'La ciudad de los puentes suspendidos, construida sobre un profundo cañón del río Rhumel.'
    },
    facts: {
      en: [
        'Sidi M’Cid bridge was the highest suspension bridge in the world when built in 1912 (175m).',
        'Has 8 iconic bridges, each representing different structural eras.',
        'The natural gorges provided a legendary defense mechanism for the ancient Numidian capital.'
      ],
      fr: [
        'Le pont de Sidi M’Cid était le plus haut pont du monde lors de sa construction en 1912 (175m).',
        'Comporte 8 ponts emblématiques reflétant différentes époques.',
        'Les gorges offraient une défense naturelle imprenable à la capitale Numide.'
      ],
      ar: [
        'كان جسر سيدي مسيد أعلى جسر معلق في العالم عند بنائه عام 1912م (بارتفاع 175 متراً).',
        'تضم المدينة ثمانية جسور أيقونية مذهلة ذات طابع هندسي متباين.',
        'شكل الأخدود الطبيعي حصناً دفاعياً منيعاً لعاصمة نوميديا التاريخية سيرتا.'
      ],
      es: [
        'El puente Sidi M’Cid era el puente colgante más alto del mundo cuando se construyó en 1912 (175 m).',
        'Cuenta con 8 puentes icónicos, cada uno representando diferentes épocas estructurales.',
        'Los cañones naturales proporcionaron un mecanismo de defensa legendario para la antigua capital de Numidia.'
      ]
    }
  },
  {
    id: 'timgad',
    name: 'Timgad Roman Ruins',
    location: 'Batna (Aures)',
    category: 'nature',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1627581165609-b6dc24660eb6?auto=format&fit=crop&w=1200&q=80', // Timgad columns arch
    panoramas: [
      'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1200&q=80', // Trajan Arch
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'  // Roman Amphitheater rows
    ],
    description: {
      en: 'Known as the "Pompeii of North Africa," Timgad was a Roman military colony created by Emperor Trajan in AD 100, famous for its grid-iron city planning and towering Arch of Trajan.',
      fr: "Surnommée la « Pompéi d'Afrique du Nord », Timgad était une colonie militaire romaine fondée par l'empereur Trajan en l'an 100 de notre ère. Célèbre pour son plan en damier parfait.",
      ar: 'المعروفة بـ "بومبي أفريقيا الشمالية"، تيمقاد مدينة عسكرية رومانية أسسها الإمبراطور ترايان عام 100 ميلادي، وتشتهر بتنظيمها العمراني المذهل وتخطيطها الشبكي الدقيق.',
      es: 'Conocida como la "Pompeya del norte de África", Timgad fue una colonia militar romana creada por el emperador Trajano en el año 100 d.C., famosa por su diseño de cuadrícula.'
    },
    facts: {
      en: [
        'An incredibly preserved UNESCO World Heritage site with zero modern buildings over the ruins.',
        'Features the majestic Arch of Trajan, a triumphal arch rebuilt in the second century.',
        'The grid-iron plan is the finest surviving example of Roman town planning.'
      ],
      fr: [
        'Un site classé au patrimoine mondial de l’UNESCO incroyablement préservé, sans constructions modernes.',
        'Comprend le majestueux Arc de Trajan, un arc de triomphe reconstruit au deuxième siècle.',
        'Son plan en damier est le plus bel exemple de planification urbaine romaine subsistant.'
      ],
      ar: [
        'موقع أثري مسجل في قائمة التراث العالمي لليونسكو ومحمي تماماً من أي زحف عمراني حديث.',
        'تضم قوس ترايان المهيب، وهو قوس نصر روماني فريد أعيد ترميمه وتشييده في القرن الثاني.',
        'مخططها الشبكي يعتبر أفضل نموذج متكامل ومحفوظ للتخطيط العمراني الروماني القديم.'
      ],
      es: [
        'Un sitio del Patrimonio Mundial de la UNESCO increíblemente conservado sin construcciones modernas.',
        'Alberga el majestuoso Arco de Trajano, un arco de triunfo reconstruido en el siglo II.',
        'El diseño de cuadrícula es el mejor ejemplo sobreviviente de planificación urbana romana.'
      ]
    }
  }
];

export const mockHotels: Hotel[] = [
  {
    id: 'el-aurassi',
    name: 'Hotel El Aurassi',
    location: 'Algiers',
    rating: 4.6,
    pricePerNight: 18500, // DZD
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Spa', 'Wifi', 'Sea View', 'Fine Dining'],
    description: {
      en: 'A legendary five-star luxury hotel in Algiers offering sweeping views of the harbor and high-end services for business and wellness travelers.',
      fr: "Un hôtel légendaire cinq étoiles offrant des vues imprenables sur le port d'Alger, idéal pour les voyages d'affaires et de détente.",
      ar: 'فندق الأوراسي الأسطوري ذو الخمس نجوم المطل مباشرة على ميناء العاصمة، يقدم مستويات رفيعة من الفخامة والخدمات.',
      es: 'Un legendario hotel de lujo de cinco estrellas en Argel que ofrece vistas panorámicas del puerto.'
    },
    latitude: 36.7812,
    longitude: 3.0515
  },
  {
    id: 'sofitel-algiers',
    name: 'Sofitel Algiers Hamma Garden',
    location: 'Algiers',
    rating: 4.5,
    pricePerNight: 17200, // DZD
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Garden View', 'Pool', 'Gym', 'Bar', 'Wifi'],
    description: {
      en: 'Nestled next to the beautiful Jardin d’Essai du Hamma, this premium French-luxury business hotel is perfect for culture and relaxation.',
      fr: "Niché juste à côté du magnifique Jardin d'Essai du Hamma, cet hôtel d'affaires haut de gamme allie luxe à la française et détente absolue.",
      ar: 'يقع بجوار حديقة التجارب التاريخية بالحامة، ويوفر أرقى مستويات الخدمة الفرنسية والراحة لرجال الأعمال والسياح.',
      es: 'Situado junto al hermoso Jardin d’Essai du Hamma, este hotel de negocios de lujo combina el estilo francés con el descanso.'
    },
    latitude: 36.7512,
    longitude: 3.0725
  },
  {
    id: 'hyatt-regency-algiers',
    name: 'Hyatt Regency Algiers Airport',
    location: 'Algiers',
    rating: 4.7,
    pricePerNight: 19500, // DZD
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    amenities: ['Airport Shuttle', 'Wifi', 'Meeting Rooms', 'Gym', 'Lounge'],
    description: {
      en: 'Directly linked to Houari Boumediene Airport Terminal 4, offering elegant contemporary spaces with high performance acoustic dampening.',
      fr: "Directement relié au terminal 4 de l'aéroport Houari Boumediene, proposant des espaces contemporains élégant avec insonorisation de pointe.",
      ar: 'متصل مباشرة بالمحطة رقم 4 لمطار هواري بومدين الدولي، يقدم مساحات عصرية أنيقة ونظام عزل صوتي متطور.',
      es: 'Conectado directement con la Terminal 4 del aeropuerto Houari Boumediene, ofrece espacios contemporáneos y elegantes con excelente insonorización.'
    },
    latitude: 36.6912,
    longitude: 3.2150
  },
  {
    id: 'sheraton-club-algiers',
    name: 'Sheraton Club des Pins Resort',
    location: 'Algiers',
    rating: 4.6,
    pricePerNight: 23500, // DZD
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Beach', 'Indoor/Outdoor Pools', 'Tennis Court', 'High Security', 'Marina'],
    description: {
      en: 'The premier five-star beach resort in Algiers, situated in the tranquil Pines Club area, featuring white sandy beaches and an exclusive marina.',
      fr: 'Le premier complexe hôtelier cinq étoiles en bord de mer à Alger, situé dans le quartier paisible du Club des Pins, offrant des plages de sable fin.',
      ar: 'نزل شيراتون نادي الصنوبر الراقي، يتمتع بشاطئ خاص آمن ومطاعم فخمة مع إاطالة بحرية ساحرة ومرفأ لليخوت.',
      es: 'El principal complejo de playa de cinco estrellas de Argel, situado en la tranquila zona del Club des Pins, con playas de arena blanca.'
    },
    latitude: 36.7592,
    longitude: 2.8710
  },
  {
    id: 'royal-oran',
    name: 'Royal Hotel Oran (M-Gallery)',
    location: 'Oran',
    rating: 4.8,
    pricePerNight: 22000, // DZD
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    amenities: ['Historical Architecture', 'Gourmet restaurant', 'Spa', 'Wifi', 'Gym'],
    description: {
      en: 'Built in 1920, this classic masterpiece combines Belle Époque prestige with contemporary Algerian style, located at the heart of Oran.',
      fr: "Construit en 1920, ce chef-d'œuvre classique marie le prestige de la Belle Époque au style algérien contemporain, au centre d'Oran.",
      ar: 'تحفة معمارية كلاسيكية بنيت عام 1920م تجمع بين عراقة الفن الجميل واللمسة الجزائرية المعاصرة لضمان إقامة ملكية.',
      es: 'Construido en 1920, este clásico combina el prestigio de la Belle Époque con el estilo contemporáneo argelino.'
    },
    latitude: 35.7018,
    longitude: -0.6322
  },
  {
    id: 'four-points-oran',
    name: 'Four Points by Sheraton Oran',
    location: 'Oran',
    rating: 4.5,
    pricePerNight: 16500, // DZD
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Clifftop Pool', 'Bar', 'Gym', 'Buffet', 'Sea Breeze Lounge'],
    description: {
      en: 'Perched on a cliff overlooking the Mediterranean, this modern resort offers beautiful coastal vistas, local cuisines, and a stunning pool deck.',
      fr: "Perché sur une falaise dominant la Méditerranée, cet hôtel moderne propose de superbes vues sur la côte, une cuisine locale et une superbe terrasse de piscine.",
      ar: 'فندق عصري مشيد على جرف شاهق يطل على البحر الأبيض المتوسط، ويوفر مناظر بحرية ساحرة وتجربة طعام استثنائية.',
      es: 'Situado en un acantilado sobre el Mediterráneo, este complejo moderno ofrece vistas a la costa y una maravillosa área de piscina.'
    },
    latitude: 35.7198,
    longitude: -0.6062
  },
  {
    id: 'le-meridien-oran',
    name: 'Le Méridien Oran Hotel',
    location: 'Oran',
    rating: 4.7,
    pricePerNight: 21500, // DZD
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    amenities: ['Convention Center', 'Pool', 'Full Spa', 'Ocean Views', 'Creative Dining'],
    description: {
      en: 'A premier architectural landmark on the Oran coast which houses the signature convention center and boasts sweeping sights over the gulf.',
      fr: "Un repère architectural majeur de la côte d'Oran abritant un grand centre de congrès et offrant d'incroyables panoramas sur le Golfe.",
      ar: 'صرح معماري رائد على ساحل وهران يضم مركز المؤتمرات ومسابح علاجية مع إطلالة كاملة على خليج الباهية.',
      es: 'Un hito arquitectónico en la costa de Orán, que alberga el centro de convenciones y ofrece vistas espectacular del golfo.'
    },
    latitude: 35.7275,
    longitude: -0.5985
  },
  {
    id: 'hotel-liberte-oran',
    name: 'Hotel Liberté Oran',
    location: 'Oran',
    rating: 4.3,
    pricePerNight: 11500, // DZD
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['City Center', 'Gym', 'Heated Indoor Pool', 'Wifi', 'Secure Parking'],
    description: {
      en: 'A highly responsive urban business hotel situated in Orans modern commercial quarter, offering premium executive facilities and cozy design rooms.',
      fr: "Un hôtel d'affaires urbain idéalement situé dans le quartier d'affaires d'Oran, offrant des installations haut de gamme et d'élégantes suites exécutives.",
      ar: 'فندق الحرية ذو الطراز العصري في قلب المنطقة التجارية بوهران، يوفر غرفاً مريحة للغاية وخدمات ممتازة لرجال الأعمال.',
      es: 'Un hotel de negocios urbano situado en el moderno barrio comercial de Orán, que ofrece instalaciones ejecutivas y habitaciones confortables.'
    },
    latitude: 35.7005,
    longitude: -0.6120
  },
  {
    id: 'constantine-palace',
    name: 'Marriott Hotel Constantine',
    location: 'Constantine',
    rating: 4.7,
    pricePerNight: 19500, // DZD
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Rim Cliff Pool', 'Luxury Lounges', 'Wifi', 'Spa', 'Valet'],
    description: {
      en: 'A majestic modern luxury resort situated on cliffs overlooking the Rhumel river gorges with breathtaking suspension views.',
      fr: "Un complexe hôtelier moderne et majestueux perché sur des falaises qui surplombent les gorges du Rhumel avec des vues à couper le souffle.",
      ar: 'منتجع فاخر يتربع بفخامته على صخور قسنطينة الشاهقة ويوفر إطلالات علوية خلابة على أخدود وادي الرمال الخالد.',
      es: 'Un majestuoso complejo de lujo moderno situado en los acantilados que dominan las gargantas del río Rhumel.'
    },
    latitude: 36.3481,
    longitude: 6.6310
  },
  {
    id: 'djanet-oasis',
    name: 'Tassili Sahara Lodge',
    location: 'Djanet (Sahara)',
    rating: 4.9,
    pricePerNight: 12000, // DZD
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    amenities: ['Desert Excursions', 'Traditional Meals', 'Campfire Tours', 'Star Gazing'],
    description: {
      en: 'Traditional mud-brick architecture inside Djanet Oasis. Serves as the ultimate warm gateway into the deep Sahara desert under the starry sky.',
      fr: "Architecture traditionnelle en terre crue au sein de l'oasis de Djanet. Le portail d'accueil idéal pour le Sahara profond sous la voûte céleste.",
      ar: 'نزل صحراوي مريح مبني على الطراز الطيني التقليدي في واحة جانت الخلابة، يعتبر بوابتك الدافئة لاستكشاف روعة الصحراء الكبرى.',
      es: 'Arquitectura tradicional de adobe dentro del Oasis de Djanet. Sirve como la puerta de entrada definitiva al desierto del Sahara.'
    },
    latitude: 24.5550,
    longitude: 9.4862
  },
  {
    id: 'camp-tin-akachaker',
    name: 'Camp Tin Akachaker',
    location: 'Djanet (Sahara)',
    rating: 5.0,
    pricePerNight: 16000, // DZD
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    amenities: ['Glamping Domes', 'Star Gazing', 'Touareg Guides', 'Tradition Tea'],
    description: {
      en: 'Premium desert glamping domes nestled amidst the majestic red sandstone structures of Tin Akachaker.',
      fr: "Dômes de glamping haut de gamme nichés au cœur des majestueuses formations rocheuses ocre de Tin Akachaker.",
      ar: 'مخيم فاخر وقباب مجهزة للإقامة تحت النجوم المتلألئة وسط تشكيلات الصخور الحمراء الأسطورية بتين عكاشكار.',
      es: 'Domos de glamping de primera categoría situados en medio de las majestuosas estructuras de arenisca roja de Tin Akachaker.'
    },
    latitude: 24.2100,
    longitude: 9.7200
  },
  {
    id: 'sabri-annaba',
    name: 'Sabri Hotel Resort',
    location: 'Annaba',
    rating: 4.1,
    pricePerNight: 9500, // DZD
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Beach Access', 'Aqua Park', 'Seaside Terrace', 'Breakfast', 'Family suites'],
    description: {
      en: 'A highly popular beach resort located on the golden sands of Les Andalouses bay in Annaba, perfect for family tourism and watersports.',
      fr: "Un complexe hôtelier très populaire sur la plage d'Annaba, idéal pour le tourisme familial et les loisirs aquatiques.",
      ar: 'فندق صبري عنابة العائلي الممتد على شاطئ البحر، يضم مسبحاً ترفيهياً وحدائق مائية وجلسات شاطئية بامتياز.',
      es: 'Un complejo de playa muy popular situado en las arenas doradas de la costa de Annaba, ideal para turismo familiar.'
    },
    latitude: 36.9250,
    longitude: 7.7540
  },
  {
    id: 'hotel-mzab',
    name: 'Hotel El M’zab',
    location: 'Ghardaia',
    rating: 4.5,
    pricePerNight: 11000, // DZD
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    amenities: ['Architectural design by Pouillon', 'Mzab Valley View', 'Pool', 'Terraces', 'Traditional Craft Shop'],
    description: {
      en: 'Built by renowned architect Fernand Pouillon, this masterpiece blends harmoniously with the thousands-year-old structures of Ghardaia.',
      fr: "Conçu par le célèbre architecte Fernand Pouillon, cet hôtel s'harmonise en beauté avec l'architecture millénaire de la vallée du M'zab.",
      ar: 'فندق ميزاب الأثري من تصميم المعماري فرناند بويون، مصمم ليتناغم تماماً مع بيئة قصور وادي ميزاب التاريخية التراثية المعلقة.',
      es: 'Diseñado por el famoso arquitecto Fernand Pouillon, este hotel se integra con la milenaria arquitectura del valle de M\'zab.'
    },
    latitude: 32.4850,
    longitude: 3.6730
  },
  {
    id: 'hotel-saldae-bejaia',
    name: 'Hotel Saldae Béjaïa',
    location: 'Bejaia',
    rating: 4.2,
    pricePerNight: 10500, // DZD
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Gulf Views', 'Sea-view Restaurant', 'Meeting Halls', 'Baggage storage', 'Wifi'],
    description: {
      en: 'A pleasant seaside hotel with marvelous sights over the Gulf of Bejaia and the legendary Gouraya national park mountains.',
      fr: 'Un agréable hôtel avec des vues de carte postale sur le golfe de Béjaïa et la montagne sacrée de Yemma Gouraya.',
      ar: 'فندق صالداي بجاية المطل عى زرقة البحر والمتكئ على سلسلة جبال قورايا الخلابة، تجسيد لجمال الطبيعة الساحلية وكرم الضيافة.',
      es: 'Un acogedor hotel con vistas de postal sobre el golfo de Bejaia y las montañas del parque nacional de Gouraya.'
    },
    latitude: 36.7510,
    longitude: 5.0810
  },
  {
    id: 'park-mall-setif',
    name: 'Park Mall Hotel Setif',
    location: 'Setif',
    rating: 4.6,
    pricePerNight: 15800, // DZD
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    amenities: ['Connected to Mall', 'Sky Restaurant', 'Wifi', 'Valet Parking', 'Indoor Leisure Area'],
    description: {
      en: 'Conveniently attached to the giant Park Mall complex in Sétif, this premium high-rise offers contemporary comfort and scenic city views.',
      fr: "Connecté au grand complexe commercial Park Mall à Sétif, cet hôtel haut de gamme propose un superbe confort contemporain et des vues panoramiques sur la ville.",
      ar: 'فندق بارك مول سطيف الفخم المتصل مباشرة بالمركز التجاري الضخم لسطيف العالية، يوفر تجربة تسوق وإقامة حديثة غاية في الرقي.',
      es: 'Conectado al gran complejo comercial Park Mall de Sétif, este hotel ofrece confort moderno y espectaculares vistas de la ciudad.'
    },
    latitude: 36.1915,
    longitude: 5.4080
  }
];
