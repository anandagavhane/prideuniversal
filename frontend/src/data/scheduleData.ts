import { EventItem, CommitteeMember, GalleryPhoto } from '../types';

export const FESTIVAL_SCHEDULE: EventItem[] = [
  {
    day: 1,
    dateStr: '2026-09-14',
    displayDate: 'Day 1 - 14 Sep 2026',
    time: '4:00 PM onwards',
    title: '🪔 Shree Aagaman & Sthapana',
    description: 'Grand welcoming procession from Main Society Gate to Clubhouse, followed by Sthapana & Aarti.',
    icon: '🪔',
    category: 'Aagaman',
    highlight: true
  },
  {
    day: 2,
    dateStr: '2026-09-15',
    displayDate: 'Day 2 - 15 Sep 2026',
    time: '8:30 PM',
    title: '👯 Games (Three Leg & Octopus Race)',
    description: 'Fun-filled outdoor pair races for kids, youth, and society residents.',
    icon: '👯',
    category: 'Games'
  },
  {
    day: 3,
    dateStr: '2026-09-16',
    displayDate: 'Day 3 - 16 Sep 2026',
    time: '8:30 PM',
    title: '🎵 Musical Chair / Lemon Spoon Race',
    description: 'Classic competitive party games for women, seniors, and children.',
    icon: '🎵',
    category: 'Games'
  },
  {
    day: 4,
    dateStr: '2026-09-17',
    displayDate: 'Day 4 - 17 Sep 2026',
    time: '8:30 PM',
    title: '🎈 Balloon Challenge / Cup Balancing',
    description: 'Dexterity and quick-reflex challenges with exciting gifts.',
    icon: '🎈',
    category: 'Games'
  },
  {
    day: 5,
    dateStr: '2026-09-18',
    displayDate: 'Day 5 - 18 Sep 2026',
    time: '8:30 PM',
    title: '🎨 Drawing & Painting Competition',
    description: 'Theme: "Eco-Friendly Bappa & My Society". Drawing sheets will be provided.',
    icon: '🎨',
    category: 'Cultural',
    highlight: true
  },
  {
    day: 6,
    dateStr: '2026-09-19',
    displayDate: 'Day 6 - 19 Sep 2026',
    time: '8:30 PM',
    title: '🧠 Brain Game / Focus Challenge',
    description: 'Puzzles, memory recall, and speed trivia games for all age brackets.',
    icon: '🧠',
    category: 'Games'
  },
  {
    day: 7,
    dateStr: '2026-09-20',
    displayDate: 'Day 7 - 20 Sep 2026',
    time: '9:00 AM & 6:30 PM',
    title: '📖 Atharvashirsha Pathan & 💃 Cultural Program',
    description: 'Morning 9:00 AM community recitation. Evening 6:30 PM spectacular stage dance, singing & drama performances.',
    icon: '💃',
    category: 'Cultural',
    highlight: true
  },
  {
    day: 8,
    dateStr: '2026-09-21',
    displayDate: 'Day 8 - 21 Sep 2026',
    time: '8:30 PM',
    title: '🎲 Fun Games & Society Tambola',
    description: 'Interactive family games night with community prizes.',
    icon: '🎲',
    category: 'Games'
  },
  {
    day: 9,
    dateStr: '2026-09-22',
    displayDate: 'Day 9 - 22 Sep 2026',
    time: '6:30 PM & 8:30 PM',
    title: '🙏 Bhajan Sandhya & 🎮 Games',
    description: 'Evening 6:30 PM melodious devotional hymns followed by 8:30 PM games.',
    icon: '🙏',
    category: 'Cultural'
  },
  {
    day: 10,
    dateStr: '2026-09-23',
    displayDate: 'Day 10 - 23 Sep 2026',
    time: '8:30 PM',
    title: '🎮 Fun Games & Quiz Challenge',
    description: 'Exciting quiz and minute-to-win-it activities for Wing A & Wing B.',
    icon: '🎮',
    category: 'Games'
  },
  {
    day: 11,
    dateStr: '2026-09-24',
    displayDate: 'Day 11 - 24 Sep 2026',
    time: '4:00 PM & 8:00 PM',
    title: '🪔 Shri Satyanarayan Puja & 🍽️ Mahaprasad',
    description: '4:00 PM sacred Satyanarayan Mahapooja with community participation, followed by 8:00 PM grand society Mahaprasad feast.',
    icon: '🍽️',
    category: 'Puja',
    highlight: true
  },
  {
    day: 12,
    dateStr: '2026-09-25',
    displayDate: 'Day 12 - 25 Sep 2026',
    time: '3:00 PM onwards',
    title: '🪔 Ganesh Visarjan Miravnuk',
    description: 'Grand farewell procession with Dhol Tasha, Gulal, and eco-friendly immersion ceremony.',
    icon: '🪔',
    category: 'Visarjan',
    highlight: true
  }
];

export const COMMITTEE_DATA: CommitteeMember[] = [
  {
    department: 'MANAGEMENT & OPERATIONS',
    highlight: true,
    members: [
      { name: 'Vivek Nikam', phone: '+91 88888 70055', role: 'Festival Secretary' },
      { name: 'Vikas Dalavi', phone: '+91 99702 96330', role: 'Event Operations & Treasurer' },
      { name: 'Pride Universal Management Team', role: 'Volunteers & Coordination' }
    ]
  },
  {
    department: 'EVENTS & COMPETITIONS',
    members: [
      { name: 'Priyesh', role: 'Event Lead & Cultural Coordinator' },
      { name: 'Prafull & Vijay', role: 'Event Lead & Competition Operations' },
      { name: 'Pride Universal Cultural Team', role: 'Stage & Event Management' }
    ]
  },
  {
    department: 'TEMPLE & MANDAP DECORATION',
    highlight: true,
    members: [
      { name: 'Prasad Jadhav', role: 'Temple & Altar Decoration Lead' },
      { name: 'Rahul Walunj', role: 'Mandap Architecture & Lighting Lead' },
      { name: 'Pride Universal Decoration Mandal', role: 'Floral Art & Pandal Volunteers' }
    ]
  },
  {
    department: 'DIGITAL & TECHNOLOGY',
    members: [
      { name: 'Ananda Gavhane', phone: '+91 98813 69872', role: 'Lead Architect & Tech Lead' },
      { name: 'Vijay Bhagwat', phone: '+91 70308 07007', role: 'Digital Coordination' },
      { name: 'Pride Universal Tech Team', role: 'Support & Media' }
    ]
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // ==========================================
  // 1) Aarti & Darshan (2 Photos)
  // ==========================================
  {
    id: 'g_front_idol',
    title: 'श्री गणेश दिव्य दर्शन (Bappa Divine Darshan)',
    category: 'Aarti & Darshan',
    caption: 'प्राइड युनिव्हर्सल सोसायटीच्या लाडक्या बाप्पाचे मनमोहक, तेजस्वी व मंगलमयी मुख्य दर्शन.',
    imageUrl: '/photos/memories_2025_idol2.jpeg',
    isTopper: true,
    badge: '👑 मुख्य गणेश दर्शन'
  },
  {
    id: 'g_maha_aarti',
    title: 'संध्या महाआरती सोहळा (Daily Sandhya Maha Aarti)',
    category: 'Aarti & Darshan',
    caption: 'सोसायटीचे ज्येष्ठ नागरिक, महिला व बालगोपाळ दररोज संध्याकाळी ७:३० च्या महाआरतीला उपस्थित असताना.',
    imageUrl: '/photos/memories_2025_aarti.jpeg'
  },

  // ==========================================
  // 2) Ganpati Aagaman (2 Photos)
  // ==========================================
  {
    id: 'g_aagaman_bike_rally',
    title: 'भव्य बाईक रॅली (Grand Society Bike Rally)',
    category: 'Aagaman',
    caption: 'भगवे ध्वज, शिस्तबद्ध बाईक रॅली आणि जयघोषासह सोसायटीच्या युवकांकडून बाप्पांचे जल्लोषात आगमन.',
    imageUrl: '/photos/img_20250906_wa0108.jpg'
  },
  {
    id: 'g_aagaman_courtyard',
    title: 'सोसायटी प्रांगणातील भव्य स्वागत (Courtyard Welcome Gathering)',
    category: 'Aagaman',
    caption: 'प्राइड युनिव्हर्सलच्या प्रांगणात शेकडो कुटुंबे व बालगोपाळ बाप्पांचे स्वागत करण्यासाठी एकत्र जमले असताना.',
    imageUrl: '/photos/img_20250906_wa0112.jpg'
  },

  // ==========================================
  // 3) Cultural & Competitions (2 Photos)
  // ==========================================
  {
    id: 'g_drawing_felicitation',
    title: 'चित्रकला स्पर्धा व बक्षीस वितरण (Drawing Competition & Felicitation)',
    category: 'Cultural',
    caption: 'सोसायटीतील चिमुकल्यांनी बाप्पाच्या चित्रांमध्ये भरलेले अप्रतिम रंग व आयोजकांसोबत गौरव सोहळा.',
    imageUrl: '/photos/img_20250830_wa0005.jpg'
  },
  {
    id: 'g_women_lezim',
    title: 'महिला भगिनींचे लेझिम स्वागत (Women & Girls Lezim Dance)',
    category: 'Cultural',
    caption: 'भगव्या नववारी साड्यांमध्ये महिला व युवतींनी सादर केलेले पारंपरिक व जोमदार लेझिम नृत्य.',
    imageUrl: '/photos/img_20250906_wa0110.jpg'
  },

  // ==========================================
  // 4) Mahaprasad (2 Photos)
  // ==========================================
  {
    id: 'g_mahaprasad_serve',
    title: 'महाप्रसाद सेवा व आदरतिथ्य (Mahaprasad Volunteer Seva)',
    category: 'Mahaprasad',
    caption: 'सोसायटी कार्यकर्ते व स्वयंसेवक एकत्र येऊन महाप्रसाद भोजन व्यवस्था आनंदाने सांभाळताना.',
    imageUrl: '/photos/memories_mahaprasad_serve.jpeg'
  },
  {
    id: 'g_mahaprasad_gathering',
    title: 'सोसायटी महाप्रसाद सहभोजन (Community Gathering)',
    category: 'Mahaprasad',
    caption: 'सोसायटीचे ज्येष्ठ नागरिक व रहिवासी एकत्र बसून स्नेहभोजनाचा आनंद घेताना.',
    imageUrl: '/photos/memories_mahaprasad1.jpeg'
  },

  // ==========================================
  // 5) Visarjan (2 Photos)
  // ==========================================
  {
    id: 'g_bridge_procession',
    title: 'झगमगत्या केबल पुलावरून निरोप (Cable Bridge Visarjan Procession)',
    category: 'Visarjan',
    caption: 'रात्रीच्या झगमगत्या केबल पुलावरून बाप्पांची नयनरम्य मिरवणूक व भाविकांचा अथांग जनसागर.',
    imageUrl: '/photos/img_20250908_wa0020.jpg'
  },
  {
    id: 'g_final_visarjan',
    title: 'अंतिम विसर्जन मिरवणूक सोहळा (Final Visarjan Ceremony & Dhol Tasha)',
    category: 'Visarjan',
    caption: 'पुढच्या वर्षी लवकर या! रस्त्यावरून ढोल-ताशांच्या गजरात, गुलाल व फुलांच्या उधळणीत बाप्पांचे भावपूर्ण अंतिम विसर्जन.',
    imageUrl: '/photos/memories_visrjan_2025.jpg',
    isTopper: true,
    badge: '🌊 अंतिम विसर्जन निरोप'
  }
];

