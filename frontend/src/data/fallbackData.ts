import { AccountsData, NominationsDashboardData, NotificationItem, SelectedEmcee } from '../types';

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'दैनिक महाआरती वेळ बदल / Daily Aarti Timings',
    message: 'गणेशोत्सवातील सकाळची आरती सकाळी ८:०० वाजता व संध्याकाळची महाआरती संध्याकाळी ७:३० वाजता होईल. सर्व भक्तांनी वेळेत उपस्थित राहावे.',
    type: 'urgent',
    date: '13 Sep 2026',
    active: true,
    linkText: 'View Aarti',
    linkSectionId: 'aarti'
  },
  {
    id: 'notif_2',
    title: 'बालगोपाळ व सांस्कृतिक स्पर्धा रंगीत तालीम',
    message: 'डान्स, गायन व वक्तृत्व स्पर्धांची रंगीत तालीम (Rehearsal) उद्या संध्याकाळी ६ वाजता क्लबहाऊसमध्ये आयोजित केली आहे.',
    type: 'event',
    date: '12 Sep 2026',
    active: true,
    linkText: 'Competitions',
    linkSectionId: 'competitions'
  },
  {
    id: 'notif_3',
    title: 'महाप्रसाद महापूजन व स्वयंसेवक नोंदणी',
    message: '११ व्या दिवशी होणाऱ्या श्री सत्यनारायण महापूजा व महाप्रसाद सेवेसाठी इच्छुक स्वयंसेवकांनी समितीशी संपर्क साधावा.',
    type: 'info',
    date: '11 Sep 2026',
    active: true,
    linkText: 'Committee',
    linkSectionId: 'committee'
  }
];

export const FALLBACK_ACCOUNTS_DATA: AccountsData = {
  totalCollections: 5100,
  totalCollectionsFormatted: '₹5,100',
  totalExpenses: 500,
  totalExpensesFormatted: '₹500',
  netBalance: 4600,
  netBalanceFormatted: '₹4,600',
  contributorsCount: 3,
  target: 160000,
  targetFormatted: '₹1,60,000',
  remainingTarget: 154900,
  remainingTargetFormatted: '₹1,54,900',
  percentageCollected: 3.19,
  wingWise: [
    {
      wing: 'Wing A',
      collected: 1700,
      collectedFormatted: '₹1,700',
      share: '33.3%',
      donors: 1
    },
    {
      wing: 'Wing B',
      collected: 3400,
      collectedFormatted: '₹3,400',
      share: '66.7%',
      donors: 2
    }
  ],
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isLive: false
};

export const FALLBACK_NOMINATIONS_DATA: NominationsDashboardData = {
  totalNominations: 67,
  totalCategories: 6,
  wingATotal: 32,
  wingBTotal: 35,
  wingAPercent: '47.8%',
  wingBPercent: '52.2%',
  categories: [
    { category: 'Drawing', nominations: 25, wingA: 13, wingB: 12, percentOfTotal: '37.3%', icon: '🎨' },
    { category: 'Dance', nominations: 22, wingA: 11, wingB: 11, percentOfTotal: '32.8%', icon: '💃' },
    { category: 'Emcee / Host', nominations: 10, wingA: 5, wingB: 5, percentOfTotal: '14.9%', icon: '⭐' },
    { category: 'Shloka', nominations: 5, wingA: 1, wingB: 4, percentOfTotal: '7.5%', icon: '📖' },
    { category: 'Singing', nominations: 4, wingA: 1, wingB: 3, percentOfTotal: '6.0%', icon: '🎤' },
    { category: 'Piano Play', nominations: 1, wingA: 1, wingB: 0, percentOfTotal: '1.5%', icon: '🎹' },
  ],
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isLive: false
};

export const FALLBACK_SELECTED_EMCEES: SelectedEmcee[] = [
  { srNo: 1, name: 'Shivam Babar', wing: 'A', flatNumber: '304', status: 'Selected' },
  { srNo: 2, name: 'Dhruvu Garade', wing: 'A', flatNumber: '502', status: 'Selected' },
  { srNo: 3, name: 'Sujal Rajbhoj', wing: 'B', flatNumber: '405', status: 'Selected' },
  { srNo: 6, name: 'Arohi Kaldate', wing: 'B', flatNumber: '1006', status: 'Selected' },
  { srNo: 7, name: 'Arohi Kashid', wing: 'A', flatNumber: '102', status: 'Selected' },
  { srNo: 9, name: 'Ayush Pawar', wing: 'B', flatNumber: '102', status: 'Selected' }
];


