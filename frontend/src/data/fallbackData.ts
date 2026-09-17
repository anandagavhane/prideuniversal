import { AccountsData, NominationsDashboardData, NotificationItem, SelectedEmcee, CompetitionWinner, CompetitionParticipant } from '../types';

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
  totalNominations: 69,
  totalCategories: 6,
  wingATotal: 32,
  wingBTotal: 37,
  wingAPercent: '46.4%',
  wingBPercent: '53.6%',
  categories: [
    { category: 'Drawing', nominations: 26, wingA: 13, wingB: 13, percentOfTotal: '37.7%', icon: '🎨' },
    { category: 'Dance', nominations: 22, wingA: 11, wingB: 11, percentOfTotal: '31.9%', icon: '💃' },
    { category: 'Emcee / Host', nominations: 10, wingA: 5, wingB: 5, percentOfTotal: '14.5%', icon: '⭐' },
    { category: 'Shloka', nominations: 5, wingA: 1, wingB: 4, percentOfTotal: '7.2%', icon: '📖' },
    { category: 'Singing', nominations: 4, wingA: 1, wingB: 3, percentOfTotal: '5.8%', icon: '🎤' },
    { category: 'Piano Play', nominations: 2, wingA: 1, wingB: 1, percentOfTotal: '2.9%', icon: '🎹' },
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

export const FALLBACK_WINNERS: CompetitionWinner[] = [
  { srNo: 1, gameName: 'Drawing', category: 'Junior (Under 10)', winnerName: 'Shivam Babar', wing: 'Wing A', flatNumber: '304', rank: '1st' },
  { srNo: 2, gameName: 'Drawing', category: 'Junior (Under 10)', winnerName: 'Dhruvu Garade', wing: 'Wing A', flatNumber: '502', rank: '2nd' },
  { srNo: 3, gameName: 'Drawing', category: 'Junior (Under 10)', winnerName: 'Sujal Rajbhoj', wing: 'Wing B', flatNumber: '405', rank: '3rd' },
  { srNo: 4, gameName: 'Dance', category: 'Solo Freestyle', winnerName: 'Divyanka Chaudhari', wing: 'Wing B', flatNumber: '706', rank: '1st' },
  { srNo: 5, gameName: 'Dance', category: 'Solo Freestyle', winnerName: 'Adhira Wani', wing: 'Wing A', flatNumber: '202', rank: '2nd' },
  { srNo: 6, gameName: 'Dance', category: 'Solo Freestyle', winnerName: 'Arohi Kaldate', wing: 'Wing B', flatNumber: '1006', rank: '3rd' },
  { srNo: 7, gameName: 'Singing', category: 'Classical Vocal', winnerName: 'Arohi Kashid', wing: 'Wing A', flatNumber: '102', rank: '1st' },
  { srNo: 8, gameName: 'Singing', category: 'Classical Vocal', winnerName: 'Keya Torane', wing: 'Wing A', flatNumber: '1004', rank: '2nd' },
  { srNo: 9, gameName: 'Shloka', category: 'Kids Recitation', winnerName: 'Ayush Pawar', wing: 'Wing B', flatNumber: '102', rank: '1st' },
  { srNo: 10, gameName: 'Piano Play', category: 'Open Instrumental', winnerName: 'Tanvi Deshmukh', wing: 'Wing A', flatNumber: '801', rank: '1st' }
];

export const FALLBACK_COMPETITION_PARTICIPANTS: CompetitionParticipant[] = [
  { eventCategory: 'Dance', srNo: 1, name: 'Adhira Wani', wing: 'A', flatNumber: '202' },
  { eventCategory: 'Dance', srNo: 2, name: 'Trisha Bhoir', wing: 'B', flatNumber: '503' },
  { eventCategory: 'Dance', srNo: 3, name: 'Arohi Kashid', wing: 'A', flatNumber: '102' },
  { eventCategory: 'Dance', srNo: 4, name: 'Divyanka Chaudhari', wing: 'B', flatNumber: '706' },
  { eventCategory: 'Dance', srNo: 5, name: 'Arohi Kaldate', wing: 'B', flatNumber: '1006' },
  { eventCategory: 'Dance', srNo: 6, name: 'Arnav Kaldate', wing: 'B', flatNumber: '1006' },
  { eventCategory: 'Dance', srNo: 6, name: 'Shambvi Pawar', wing: 'A', flatNumber: '102' },
  { eventCategory: 'Dance', srNo: 7, name: 'Advik Gavhane', wing: 'B', flatNumber: '803' },
  { eventCategory: 'Dance', srNo: 8, name: 'Sharvil Bhagwat', wing: 'B', flatNumber: '304' },
  { eventCategory: 'Dance', srNo: 10, name: 'Avani Dalavi', wing: 'B', flatNumber: '303' },
  { eventCategory: 'Dance', srNo: 11, name: 'Maitri Dorapalli', wing: 'B', flatNumber: '408' },
  { eventCategory: 'Dance', srNo: 12, name: 'Riva Phaple', wing: 'A', flatNumber: '603' },
  { eventCategory: 'Dance', srNo: 13, name: 'Shivash Jadhav', wing: 'A', flatNumber: '604' },
  { eventCategory: 'Dance', srNo: 14, name: 'Tanvish Jadhav', wing: 'A', flatNumber: '604' },
  { eventCategory: 'Dance', srNo: 15, name: 'Rajveer Maske', wing: 'A', flatNumber: '703' },
  { eventCategory: 'Dance', srNo: 16, name: 'Prashul Nikam', wing: 'A', flatNumber: '603' },
  { eventCategory: 'Dance', srNo: 17, name: 'Kashvi Patil', wing: 'B', flatNumber: '504' },
  { eventCategory: 'Dance', srNo: 18, name: 'Advika Darshane', wing: 'B', flatNumber: '805' },
  { eventCategory: 'Dance', srNo: 19, name: 'Dhruvi Garade', wing: 'A', flatNumber: '502' },
  { eventCategory: 'Dance', srNo: 20, name: 'Yadnya Patil', wing: 'A', flatNumber: '1201' },
  { eventCategory: 'Dance', srNo: 21, name: 'Mansvi Gorane', wing: 'A', flatNumber: '602' },
  { eventCategory: 'Dance', srNo: 22, name: 'Vikas Dalavi*', wing: 'B', flatNumber: '303' },
  { eventCategory: 'Drawing', srNo: 1, name: 'Trisha Bhoir', wing: 'B', flatNumber: '503' },
  { eventCategory: 'Drawing', srNo: 2, name: 'Arohi Kashid', wing: 'A', flatNumber: '102' },
  { eventCategory: 'Drawing', srNo: 3, name: 'Shivay Sikania', wing: 'A', flatNumber: '101' },
  { eventCategory: 'Drawing', srNo: 4, name: 'Divyanka Chaudhari', wing: 'B', flatNumber: '706' },
  { eventCategory: 'Drawing', srNo: 5, name: 'Arohi Kaldate', wing: 'B', flatNumber: '1006' },
  { eventCategory: 'Drawing', srNo: 6, name: 'Arnav Kaldate', wing: 'B', flatNumber: '1006' },
  { eventCategory: 'Drawing', srNo: 6, name: 'Keya Torane', wing: 'A', flatNumber: '1004' },
  { eventCategory: 'Drawing', srNo: 7, name: 'Shambvi Pawar', wing: 'A', flatNumber: '102' },
  { eventCategory: 'Drawing', srNo: 8, name: 'Advik Gavhane', wing: 'B', flatNumber: '803' },
  { eventCategory: 'Drawing', srNo: 9, name: 'Sharvil Bhagwat', wing: 'B', flatNumber: '304' },
  { eventCategory: 'Drawing', srNo: 10, name: 'Avani Dalavi', wing: 'B', flatNumber: '303' },
  { eventCategory: 'Drawing', srNo: 11, name: 'Maitri Dorapalli', wing: 'B', flatNumber: '408' },
  { eventCategory: 'Drawing', srNo: 12, name: 'Riva Phaple', wing: 'A', flatNumber: '603' },
  { eventCategory: 'Drawing', srNo: 13, name: 'Shivash Jadhav', wing: 'A', flatNumber: '604' },
  { eventCategory: 'Drawing', srNo: 14, name: 'Tanvish Jadhav', wing: 'A', flatNumber: '604' },
  { eventCategory: 'Drawing', srNo: 15, name: 'Rajveer Maske', wing: 'A', flatNumber: '703' },
  { eventCategory: 'Drawing', srNo: 16, name: 'Prashul Nikam', wing: 'A', flatNumber: '603' },
  { eventCategory: 'Drawing', srNo: 17, name: 'Yadnya Patil', wing: 'A', flatNumber: '1201' },
  { eventCategory: 'Drawing', srNo: 18, name: 'Arnav Kulkarni', wing: 'A', flatNumber: '402' },
  { eventCategory: 'Drawing', srNo: 19, name: 'Kashvi Patil', wing: 'B', flatNumber: '504' },
  { eventCategory: 'Drawing', srNo: 20, name: 'Advika Darshane', wing: 'B', flatNumber: '805' },
  { eventCategory: 'Drawing', srNo: 21, name: 'Dhruvi Garade', wing: 'A', flatNumber: '502' },
  { eventCategory: 'Drawing', srNo: 22, name: 'Mansvi Gorane', wing: 'A', flatNumber: '602' },
  { eventCategory: 'Drawing', srNo: 23, name: 'Prashil Kute', wing: 'B', flatNumber: '402' },
  { eventCategory: 'Drawing', srNo: 24, name: 'Dakshit Bhati', wing: 'B', flatNumber: '604' },
  { eventCategory: 'Drawing', srNo: 25, name: 'Ninad sawant', wing: 'B', flatNumber: '205' },
  { eventCategory: 'Emcee / Host', srNo: 1, name: 'Shivam Babar', wing: 'A', flatNumber: '304' },
  { eventCategory: 'Emcee / Host', srNo: 2, name: 'Dhruvu Garade', wing: 'A', flatNumber: '502' },
  { eventCategory: 'Emcee / Host', srNo: 3, name: 'Sujal Rajbhoj', wing: 'B', flatNumber: '405' },
  { eventCategory: 'Emcee / Host', srNo: 4, name: 'Divyanka Chaudhari', wing: 'B', flatNumber: '706' },
  { eventCategory: 'Emcee / Host', srNo: 5, name: 'Adhira Wani', wing: 'A', flatNumber: '202' },
  { eventCategory: 'Emcee / Host', srNo: 6, name: 'Arohi Kaldate', wing: 'B', flatNumber: '1006' },
  { eventCategory: 'Emcee / Host', srNo: 7, name: 'Arohi Kashid', wing: 'A', flatNumber: '102' },
  { eventCategory: 'Emcee / Host', srNo: 8, name: 'Keya Torane', wing: 'A', flatNumber: '1004' },
  { eventCategory: 'Emcee / Host', srNo: 9, name: 'Ayush Pawar', wing: 'B', flatNumber: '102' },
  { eventCategory: 'Emcee / Host', srNo: 10, name: 'Kashvi Patil', wing: 'B', flatNumber: '504' },
  { eventCategory: 'Piano Play', srNo: 1, name: 'Keya Torane', wing: 'A', flatNumber: '1004' },
  { eventCategory: 'Piano Play', srNo: 2, name: 'Ninad sawant', wing: 'B', flatNumber: '205' },
  { eventCategory: 'Shloka', srNo: 1, name: 'Advik Gavhane', wing: 'B', flatNumber: '803' },
  { eventCategory: 'Shloka', srNo: 2, name: 'Sharvil Bhagwat', wing: 'B', flatNumber: '304' },
  { eventCategory: 'Shloka', srNo: 3, name: 'Maitri Dorapalli', wing: 'B', flatNumber: '408' },
  { eventCategory: 'Shloka', srNo: 4, name: 'Arnav Kulkarni', wing: 'A', flatNumber: '402' },
  { eventCategory: 'Shloka', srNo: 5, name: 'Advika Darshane', wing: 'B', flatNumber: '805' },
  { eventCategory: 'Singing', srNo: 1, name: 'Avani Dalavi', wing: 'B', flatNumber: '303' },
  { eventCategory: 'Singing', srNo: 2, name: 'Sanket Bhalerao', wing: 'B', flatNumber: '1002' },
  { eventCategory: 'Singing', srNo: 3, name: 'Riva Phaple', wing: 'A', flatNumber: '603' },
  { eventCategory: 'Singing', srNo: 4, name: 'Advika Darshane', wing: 'B', flatNumber: '805' },
];



