export interface EventItem {
  day: number;
  dateStr: string;
  displayDate: string;
  time: string;
  title: string;
  description?: string;
  icon: string;
  category: 'Aagaman' | 'Games' | 'Cultural' | 'Puja' | 'Visarjan' | string;
  highlight?: boolean;
}

export interface SelectedEmcee {
  srNo: number;
  name: string;
  wing: string;
  flatNumber: string;
  status: string;
}

export interface CompetitionWinner {
  srNo: number;
  gameName: string;
  category: string;
  winnerName: string;
  wing: string;
  flatNumber: string;
  rank: string; // '1st', '2nd', '3rd'
}

export interface CompetitionParticipant {
  eventCategory: string;
  srNo: number;
  name: string;
  wing: string;
  flatNumber: string;
}

export interface NominationCategoryStat {
  category: string;
  nominations: number;
  wingA: number;
  wingB: number;
  percentOfTotal: string;
  icon?: string;
}

export interface NominationsDashboardData {
  totalNominations: number;
  totalCategories: number;
  wingATotal: number;
  wingBTotal: number;
  wingAPercent: string;
  wingBPercent: string;
  categories: NominationCategoryStat[];
  lastUpdated: string;
  isLive: boolean;
}

export interface WingCollection {
  wing: string;
  collected: number;
  collectedFormatted: string;
  share: string;
  donors: number;
}

export interface AccountsData {
  totalCollections: number;
  totalCollectionsFormatted: string;
  totalExpenses: number;
  totalExpensesFormatted: string;
  netBalance: number;
  netBalanceFormatted: string;
  contributorsCount: number;
  target?: number;
  targetFormatted?: string;
  remainingTarget?: number;
  remainingTargetFormatted?: string;
  percentageCollected?: number;
  wingWise: WingCollection[];
  lastUpdated: string;
  isLive: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: 'Aagaman' | 'Aarti & Darshan' | 'Cultural' | 'Mahaprasad' | 'Aarti' | 'Competitions' | 'Celebrations' | string;
  imageUrl: string;
  isTopper?: boolean;
  badge?: string;
}

export interface CommitteeMember {
  department: string;
  highlight?: boolean;
  members: {
    name: string;
    phone?: string;
    role?: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'alert' | 'info' | 'event';
  date: string;
  active: boolean;
  linkText?: string;
  linkSectionId?: string;
  linkUrl?: string;
}

export interface AartiStanza {
  type: 'stanza' | 'chorus';
  marathi: string[];
  english?: string[];
}

export interface AartiItem {
  id: string;
  title: string;
  marathiTitle: string;
  deity: string;
  composer?: string;
  icon: string;
  description: string;
  stanzas: AartiStanza[];
}

