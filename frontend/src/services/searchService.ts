import { FESTIVAL_SCHEDULE, COMMITTEE_DATA, GALLERY_PHOTOS } from '../data/scheduleData';
import { AARTI_LIST } from '../data/aartiData';
import { AccountsData, NominationsDashboardData, NotificationItem, EventItem, SelectedEmcee, CompetitionWinner } from '../types';

export interface SearchResultItem {
  id: string;
  title: string;
  marathiTitle?: string;
  description: string;
  category: 'Aarti' | 'Schedule' | 'Competition' | 'Accounts' | 'Committee' | 'Notification' | 'Gallery' | 'Nominations';
  categoryLabel: string;
  categoryColor: string; // Tailwind color class for badge
  sectionId: string;
  icon: string;
  timeOrDate?: string;
  keywords: string[];
  targetAartiId?: string;
}

export const QUICK_SEARCH_TAGS = [
  { label: '🏆 Winners / विजेते', query: 'winner' },
  { label: '🪔 Aarti Sangrah / आरती संग्रह', query: 'aarti' },
  { label: '🎙️ Selected Emcees', query: 'emcee' },
  { label: '💃 Dance / नृत्य स्पर्धा', query: 'dance' },
  { label: '🍽️ Satyanarayan & Mahaprasad', query: 'mahaprasad' },
  { label: '💰 Accounts / जमा-खर्च', query: 'accounts' },
  { label: '📅 12-Day Schedule', query: 'schedule' },
  { label: '🎨 Drawing Competition', query: 'drawing' }
];

/**
 * Builds a comprehensive search index combining static festival data and live Google Sheets data
 */
export function buildSearchIndex(
  accounts?: AccountsData | null,
  notifications?: NotificationItem[] | null,
  nominations?: NominationsDashboardData | null,
  schedule?: EventItem[] | null,
  selectedEmcees?: SelectedEmcee[] | null,
  winners?: CompetitionWinner[] | null
): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. DAILY AARTI & PUJA
  items.push(
    {
      id: 'aarti_morning',
      title: 'Daily Morning Aarti (सकाळची मंगल आरती)',
      marathiTitle: 'दैनिक प्रभात आरती',
      description: 'Daily morning devotional prayers and Ganapati aarti at 8:45 AM in the festival pandal.',
      category: 'Aarti',
      categoryLabel: 'आरती व पूजा',
      categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
      sectionId: 'aarti',
      icon: '🪔',
      timeOrDate: 'Daily 8:45 AM',
      keywords: ['aarti', 'arti', 'morning', 'puja', 'pooja', 'prabhat', 'आरती', 'सकाळची आरती', 'पूजा', 'वेळापत्रक']
    },
    {
      id: 'aarti_evening',
      title: 'Daily Evening Maha Aarti (दैनिक सायंकालीन महाआरती)',
      marathiTitle: 'दैनिक सायंकालीन महाआरती',
      description: 'Grand community Maha Aarti with all society residents, families, and children at 7:30 PM.',
      category: 'Aarti',
      categoryLabel: 'आरती व पूजा',
      categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
      sectionId: 'aarti',
      icon: '🪔',
      timeOrDate: 'Daily 7:30 PM',
      keywords: ['aarti', 'arti', 'evening', 'maha aarti', 'sandhya', 'mahaarti', 'आरती', 'महाआरती', 'सायंकाळ', 'वेळ']
    },
    {
      id: 'puja_satyanarayan',
      title: 'Shri Satyanarayan Maha Puja (श्री सत्यनारायण महापूजा)',
      marathiTitle: 'श्री सत्यनारायण महापूजा',
      description: 'Day 11 sacred community Satyanarayan Pooja at 4:00 PM for health, peace, and prosperity.',
      category: 'Aarti',
      categoryLabel: 'आरती व पूजा',
      categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
      sectionId: 'aarti',
      icon: '🪔',
      timeOrDate: '24 Sep 2026, 4:00 PM',
      keywords: ['satyanarayan', 'satya narayan', 'puja', 'pooja', 'havan', 'day 11', 'सत्यनारायण', 'महापूजा', 'पूजा']
    },
    {
      id: 'puja_mahaprasad',
      title: 'Grand Community Mahaprasad Feast (भव्य महाप्रसाद सोहळा)',
      marathiTitle: 'भव्य महाप्रसाद स्नेहभोजन',
      description: 'Day 11 grand festival dinner and Mahaprasad distribution for all devotees from 8:00 PM onwards.',
      category: 'Aarti',
      categoryLabel: 'महाप्रसाद',
      categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
      sectionId: 'aarti',
      icon: '🍽️',
      timeOrDate: '24 Sep 2026, 8:00 PM',
      keywords: ['mahaprasad', 'prasad', 'bhojan', 'dinner', 'feast', 'annadan', 'महाप्रसाद', 'प्रसाद', 'अन्नदान', 'भोजन']
    }
  );

  // 1b. AARTI SANGRAH (LIVELYRICS FOR CHANTING & DEVOTION)
  AARTI_LIST.forEach(aarti => {
    // Extract key stanza snippets for deep search matching
    const lyricsSnippet = aarti.stanzas
      .flatMap(s => [...s.marathi, ...(s.english || [])])
      .slice(0, 10)
      .join(' ')
      .toLowerCase();

    items.push({
      id: `aarti_book_${aarti.id}`,
      title: `${aarti.title} (${aarti.marathiTitle.split('(')[0].trim()})`,
      marathiTitle: aarti.marathiTitle,
      description: `${aarti.deity} • ${aarti.composer ? aarti.composer + ' • ' : ''}${aarti.description}`,
      category: 'Aarti',
      categoryLabel: 'आरती संग्रह (Lyrics)',
      categoryColor: 'bg-amber-100 text-amber-950 border-amber-400',
      sectionId: 'aarti',
      icon: aarti.icon || '🪔',
      targetAartiId: aarti.id,
      timeOrDate: aarti.deity,
      keywords: [
        'aarti', 'arti', 'sangrah', 'lyrics', 'stotra', 'prayer', 'chant', 'book',
        aarti.id,
        aarti.title.toLowerCase(),
        aarti.marathiTitle.toLowerCase(),
        aarti.deity.toLowerCase(),
        aarti.composer ? aarti.composer.toLowerCase() : '',
        'आरती', 'बोल', 'संग्रह', 'पठण', 'वंदन', 'प्रार्थना',
        lyricsSnippet
      ]
    });
  });

  // 2. COMPETITIONS & TALENT SHOWCASES
  const competitionEntries = [
    {
      id: 'comp_dance',
      title: 'Dance Competition (नृत्य स्पर्धा)',
      desc: 'Solo, Duet, and Group dance performances. Classical, Semi-Classical, Folk & Bollywood.',
      keywords: ['dance', 'nrutya', 'dancing', 'group dance', 'solo dance', 'डान्स', 'नृत्य', 'स्पर्धा', 'कला']
    },
    {
      id: 'comp_singing',
      title: 'Singing Competition (गायन स्पर्धा)',
      desc: 'Devotional Abhang, Bhakti Geet, Classical & Light Music singing for kids and adults.',
      keywords: ['singing', 'song', 'gaayan', 'bhajan', 'abhang', 'गायन', 'गाणी', 'भजन', 'अभंग']
    },
    {
      id: 'comp_drawing',
      title: 'Drawing & Painting Competition (चित्रकला स्पर्धा)',
      desc: 'Express creativity with eco-friendly Lord Ganesha and social themes. Drawing sheets provided.',
      keywords: ['drawing', 'painting', 'art', 'chitrakala', 'colors', 'चित्रकला', 'चित्र', 'रंग']
    },
    {
      id: 'comp_drama',
      title: 'Drama & Skits (नाट्य व अभिनय स्पर्धा)',
      desc: 'Short skits, monologue / ekpatri abhinay, and mythological enactments with social messages.',
      keywords: ['drama', 'skit', 'natak', 'acting', 'abhinay', 'नाट्य', 'नाटक', 'अभिनय', 'एकपात्री']
    },
    {
      id: 'comp_shloka',
      title: 'Shloka & Stotra Recitation (श्लोक व स्तोत्र पठण)',
      desc: 'Ganesh Atharvashirsha, Ramraksha, and Sanskrit shloka chanting with correct pronunciation.',
      keywords: ['shloka', 'stotra', 'atharvashirsha', 'ramraksha', 'sanskrit', 'chanting', 'श्लोक', 'स्तोत्र', 'अथर्वशीर्ष']
    },
    {
      id: 'comp_emcee',
      title: 'Emcee & Anchoring (निवेदन व सूत्रसंचालन)',
      desc: 'Anchor festival events, cultural nights, and games as the official voice of Pride Universal.',
      keywords: ['emcee', 'anchor', 'hosting', 'sutrasanchalan', 'सूत्रसंचालन', 'निवेदन', 'होस्ट']
    },
    {
      id: 'comp_piano',
      title: 'Piano & Instruments (वाद्य संगीत स्पर्धा)',
      desc: 'Keyboard, harmonium, flute, violin, or acoustic solo instrumental showcase.',
      keywords: ['piano', 'instrument', 'music', 'harmonium', 'keyboard', 'flute', 'वाद्य', 'संगीत', 'पियानो']
    }
  ];

  competitionEntries.forEach(c => {
    items.push({
      id: c.id,
      title: c.title,
      description: c.desc,
      category: 'Competition',
      categoryLabel: 'सांस्कृतिक स्पर्धा',
      categoryColor: 'bg-purple-100 text-purple-900 border-purple-300',
      sectionId: 'competitions',
      icon: '🏆',
      keywords: [...c.keywords, 'competition', 'spardha', 'competitions', 'स्पर्धा', 'सहभाग']
    });
  });

  // 3. 12-DAY FESTIVAL SCHEDULE
  const activeSchedule = (schedule && schedule.length > 0) ? schedule : FESTIVAL_SCHEDULE;
  activeSchedule.forEach(evt => {
    items.push({
      id: `schedule_day_${evt.day}`,
      title: `${evt.displayDate}: ${evt.title}`,
      description: evt.description || '',
      category: 'Schedule',
      categoryLabel: 'वेळापत्रक',
      categoryColor: 'bg-blue-100 text-blue-900 border-blue-300',
      sectionId: 'schedule',
      icon: evt.icon || '📅',
      timeOrDate: `${evt.time} (${evt.dateStr})`,
      keywords: [
        'schedule',
        'event',
        `day ${evt.day}`,
        `day${evt.day}`,
        evt.dateStr,
        evt.title.toLowerCase(),
        evt.category.toLowerCase(),
        'दिवस',
        `दिवस ${evt.day}`,
        'वेळापत्रक',
        'कार्यक्रम',
        'तारीख'
      ]
    });
  });

  // 3b. SELECTED EMCEES (OFFICIAL HOSTS)
  if (selectedEmcees && selectedEmcees.length > 0) {
    selectedEmcees.forEach(e => {
      items.push({
        id: `emcee_${e.srNo}`,
        title: `🎙️ ${e.name} (Selected Emcee / सूत्रसंचालक)`,
        marathiTitle: `${e.name} - अधिकृत सूत्रसंचालक`,
        description: `Official festival host representing Wing ${e.wing} - Flat ${e.flatNumber}. Congratulations!`,
        category: 'Competition',
        categoryLabel: 'निवडलेले सूत्रसंचालक',
        categoryColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        sectionId: 'selected-emcees',
        icon: '🎙️',
        timeOrDate: `Wing ${e.wing} - Flat ${e.flatNumber}`,
        keywords: [
          'emcee', 'host', 'anchor', 'sutrasanchalan', 'selected',
          e.name.toLowerCase(),
          `wing ${e.wing.toLowerCase()}`,
          e.flatNumber,
          `${e.wing.toLowerCase()}-${e.flatNumber}`,
          'सूत्रसंचालक', 'निवेदक', 'निवड'
        ]
      });
    });
  }

  // 3c. COMPETITION WINNERS (CHAMPIONS)
  if (winners && winners.length > 0) {
    winners.forEach(w => {
      items.push({
        id: `winner_${w.srNo}_${w.gameName}`,
        title: `🏆 ${w.winnerName} (${w.rank} Prize - ${w.gameName})`,
        marathiTitle: `${w.winnerName} - ${w.rank} क्रमांक (${w.gameName})`,
        description: `${w.gameName} (${w.category}) ${w.rank} Place Winner from ${w.wing} - Flat ${w.flatNumber}. Congratulations!`,
        category: 'Competition',
        categoryLabel: 'स्पर्धा विजेते',
        categoryColor: 'bg-yellow-100 text-yellow-950 border-amber-400',
        sectionId: 'winners',
        icon: '🏆',
        timeOrDate: `${w.wing} - Flat ${w.flatNumber}`,
        keywords: [
          'winner', 'champion', 'prize', 'first', 'second', 'third', '1st', '2nd', '3rd',
          w.winnerName.toLowerCase(),
          w.gameName.toLowerCase(),
          w.category.toLowerCase(),
          w.wing.toLowerCase(),
          w.flatNumber,
          `${w.wing.toLowerCase()}-${w.flatNumber}`,
          'विजेता', 'विजेते', 'पारितोषिक', 'क्रमांक', 'प्रथम', 'द्वितीय', 'तृतीय'
        ]
      });
    });
  }

  // 4. FINANCIAL ACCOUNTS & EXPENSES
  const colFmt = accounts?.totalCollectionsFormatted || '₹5,100';
  const expFmt = accounts?.totalExpensesFormatted || '₹500';
  const balFmt = accounts?.netBalanceFormatted || '₹4,600';

  items.push(
    {
      id: 'accounts_overview',
      title: `Financial Transparency Overview (जमा-खर्च हिशोब)`,
      description: `Total Collections: ${colFmt} | Total Expenses: ${expFmt} | Net Balance: ${balFmt}`,
      category: 'Accounts',
      categoryLabel: 'जमा-खर्च हिशोब',
      categoryColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      sectionId: 'accounts',
      icon: '💰',
      keywords: ['accounts', 'collection', 'expense', 'balance', 'funds', 'donation', 'हिशोब', 'जमा', 'खर्च', 'शिल्लक', 'वर्गणी']
    },
    {
      id: 'accounts_wings',
      title: 'Wing-Wise Contribution (विंग ए आणि विंग बी वर्गणी)',
      description: 'Live breakdown of Wing A and Wing B donation collections, donor counts, and shares.',
      category: 'Accounts',
      categoryLabel: 'जमा-खर्च हिशोब',
      categoryColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      sectionId: 'accounts',
      icon: '🏢',
      keywords: ['wing a', 'wing b', 'wings', 'contributions', 'donors', 'विंग', 'विंग ए', 'विंग बी', 'देणगी']
    }
  );

  // 5. NOMINATIONS DASHBOARD
  const nomTotal = nominations?.totalNominations || 67;
  items.push({
    id: 'nominations_dashboard',
    title: `Live Event Nominations Dashboard (${nomTotal} Participations)`,
    description: 'Track real-time registrations across Dance, Singing, Drawing, Drama, Shloka and Instrumental categories.',
    category: 'Nominations',
    categoryLabel: 'स्पर्धा नोंदणी',
    categoryColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    sectionId: 'nominations',
    icon: '📊',
    keywords: ['nominations', 'nomination', 'registration', 'dashboard', 'entries', 'नोंदणी', 'अर्ज', 'सहभाग']
  });

  // 6. ORGANIZING COMMITTEE & DIRECTORY
  COMMITTEE_DATA.forEach((dept, deptIdx) => {
    dept.members.forEach((m, mIdx) => {
      items.push({
        id: `committee_${deptIdx}_${mIdx}`,
        title: m.role ? `${m.name} – ${m.role}` : m.name,
        description: `Department: ${dept.department}${m.phone ? ` | Call: ${m.phone}` : ''}`,
        category: 'Committee',
        categoryLabel: 'उत्सव समिती',
        categoryColor: 'bg-orange-100 text-orange-900 border-orange-300',
        sectionId: 'committee',
        icon: '🤝',
        timeOrDate: m.phone || undefined,
        keywords: [
          m.name.toLowerCase(),
          (m.role || '').toLowerCase(),
          dept.department.toLowerCase(),
          'committee',
          'contact',
          'phone',
          'volunteer',
          'समिती',
          'संपर्क',
          'पदाधिकारी',
          'फोन'
        ]
      });
    });
  });

  // 7. LIVE ANNOUNCEMENTS / NOTIFICATIONS
  if (notifications && notifications.length > 0) {
    notifications.forEach(n => {
      items.push({
        id: `notif_${n.id}`,
        title: n.title,
        description: n.message,
        category: 'Notification',
        categoryLabel: 'सूचना फलक',
        categoryColor: 'bg-rose-100 text-rose-900 border-rose-300',
        sectionId: n.linkSectionId || 'home',
        icon: '📢',
        timeOrDate: n.date,
        keywords: [
          (n.title || '').toLowerCase(),
          (n.message || '').toLowerCase(),
          'notification',
          'announcement',
          'notice',
          'flash',
          'urgent',
          'सूचना',
          'घोषणा',
          'नोटीस'
        ]
      });
    });
  }

  // 8. PHOTO GALLERY CATEGORIES & KEY MEMORIES
  items.push(
    {
      id: 'gallery_darshan',
      title: 'Bappa Idol & Mandap Darshan Photos (श्री गणेश मुख्य दर्शन)',
      description: 'Devotional photographs of Lord Ganesha idol, altar decorations, and illuminated pandal.',
      category: 'Gallery',
      categoryLabel: 'छायाचित्रे',
      categoryColor: 'bg-teal-100 text-teal-900 border-teal-300',
      sectionId: 'gallery',
      icon: '📸',
      keywords: ['gallery', 'photos', 'darshan', 'idol', 'mandap', 'decor', 'फोटो', 'दर्शन', 'मंडप', 'सजावट']
    },
    {
      id: 'gallery_aagaman',
      title: 'Grand Aagaman & Bike Rally Photos (श्री आगमन सोहळा)',
      description: 'Photos from the grand welcoming procession, bike rally, and society courtyard arrival.',
      category: 'Gallery',
      categoryLabel: 'छायाचित्रे',
      categoryColor: 'bg-teal-100 text-teal-900 border-teal-300',
      sectionId: 'gallery',
      icon: '📸',
      keywords: ['aagaman', 'agman', 'rally', 'bike rally', 'procession', 'आगमन', 'रॅली', 'स्वागत']
    }
  );

  return items;
}

/**
 * Searches the festival index with case-insensitive tokenization and bilingual matching
 */
export function searchFestivalIndex(
  query: string,
  searchIndex: SearchResultItem[]
): SearchResultItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);

  return searchIndex.filter(item => {
    const haystack = [
      item.title.toLowerCase(),
      item.marathiTitle ? item.marathiTitle.toLowerCase() : '',
      item.description.toLowerCase(),
      item.categoryLabel.toLowerCase(),
      item.timeOrDate ? item.timeOrDate.toLowerCase() : '',
      ...item.keywords.map(k => k.toLowerCase())
    ].join(' ');

    // Match if all tokens appear in the searchable text
    return tokens.every(token => haystack.includes(token));
  });
}

