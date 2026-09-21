import { AccountsData, NominationsDashboardData, NominationCategoryStat, WingCollection, NotificationItem, EventItem, SelectedEmcee, CompetitionWinner, CompetitionParticipant } from '../types';
import { FALLBACK_ACCOUNTS_DATA, FALLBACK_NOMINATIONS_DATA, FALLBACK_NOTIFICATIONS, FALLBACK_SELECTED_EMCEES, FALLBACK_WINNERS, FALLBACK_COMPETITION_PARTICIPANTS } from '../data/fallbackData';
import { FESTIVAL_SCHEDULE } from '../data/scheduleData';
import { SPONSORS_CSV_URL } from './adService';
import { normalizeCategory, isExcludedCategory } from './nominationService';
import { DRIVE_FOLDER_REEL_VIDEOS, DRIVE_REELS_FOLDER_ID } from '../data/driveReelsData';
export { DRIVE_FOLDER_REEL_VIDEOS, DRIVE_REELS_FOLDER_ID };

export const NOMINATIONS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=614822234&single=true&output=csv';

export const ACCOUNTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmUbMzPUJKEiPO-A8VsgjmdUKSpqcM84hr-XqJcP8fz69kJme7BWhqyKrZRS55aAvCZSjR2qtYRfZY/pub?gid=0&single=true&output=csv';

// Published CSV URL for Notifications Tab
export const NOTIFICATIONS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9pEjn_gQvQc0I6-ZEt_UGzxIjaKNnHS8mrhRrdBcbkfCMbsDbdyZN3Jg-vhona_gqW9Cl8hXEttA/pub?gid=0&single=true&output=csv';

// Published CSV URL for Event Schedules Tab
export const SCHEDULE_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=2029319196&single=true&output=csv';

// Published CSV URL for Selected Emcees Tab
export const SELECTED_EMCEES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=903570614&single=true&output=csv';

// Published CSV URL for Competition Winners Tab
export const WINNERS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=1253355035&single=true&output=csv';

// Published CSV URL for Live Competition Participants / Nominations List by Event Category
export const COMPETITIONS_PARTICIPANTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=614822234&single=true&output=csv';

export const GOOGLE_NOMINATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeEZ2Hpizk_ySdCG9hBmA2i22sC6FqWa9lyqI3N25huP0NLXw/viewform';

// Live Google Apps Script Webhook URL to append new nominations to Google Sheet gid=614822234
export const NOMINATION_SUBMIT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxC0JfQ1eS2TVB5VUQ3MO0bxzakon2VK8At37kqRTsl6B8zsp1o3mZL3DmDnBgnLQG7sw/exec';

/**
 * Submit nomination directly to the Google Sheet via Google Apps Script Webhook
 */
export async function submitNominationToGoogleSheet(data: {
  eventCategory: string;
  name: string;
  wing: string;
  flatNumber: string;
  srNo?: number;
  mobile?: string;
  trackUrl?: string;
  notes?: string;
  ageGroup?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    await fetch(NOMINATION_SUBMIT_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
    return { success: true, message: 'Nomination saved to Google Sheet' };
  } catch (err) {
    console.error('Failed to submit nomination to Google Sheet:', err);
    return { success: false, message: String(err) };
  }
}

export const YOUTUBE_DANCE_VIDEO_URL = 'https://www.youtube.com/watch?v=FilZjigvL1c';
export const YOUTUBE_EMBED_URL = 'https://www.youtube-nocookie.com/embed/FilZjigvL1c?autoplay=1';

/**
 * Robust CSV parser handling double quotes, commas, and line breaks
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Robust fetch wrapper with configurable timeout (defaults to 8000ms / 8s).
 * Prevents requests from hanging indefinitely on sluggish mobile networks.
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
/**
 * Dynamically compute nominations statistics (totals, wing distribution, category breakdown)
 * directly from the competition participants list of the Google Sheet (gid=614822234).
 */
export function computeNominationsStatsFromParticipants(
  participants: CompetitionParticipant[]
): NominationsDashboardData {
  const iconMap: Record<string, string> = {
    'Dance': '💃',
    'Drawing': '🎨',
    'Singing': '🎤',
    'Shloka': '📖',
    'Piano Play': '🎹',
    'Emcee / Host': '⭐',
    'Drama': '🎭',
    'Rangoli': '🌸',
    'Fashion Show': '✨',
    'Cooking': '🍲'
  };

  const validParticipants = (participants || []).filter(p => !isExcludedCategory(p.eventCategory));
  const seenKeys = new Set<string>();
  const uniqueParticipants: CompetitionParticipant[] = [];

  for (const p of validParticipants) {
    const normCat = normalizeCategory(p.eventCategory);
    if (isExcludedCategory(normCat)) continue;
    const key = `${normCat.toLowerCase()}_${(p.name || '').trim().toLowerCase()}_${(p.wing || '').trim().toLowerCase()}_${(p.flatNumber || '').trim().toLowerCase()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueParticipants.push({
        ...p,
        eventCategory: normCat
      });
    }
  }

  const total = uniqueParticipants.length;
  let wingA = 0;
  let wingB = 0;
  const catMap = new Map<string, { total: number; wingA: number; wingB: number }>();

  for (const p of uniqueParticipants) {
    const cat = p.eventCategory;
    const ex = catMap.get(cat) || { total: 0, wingA: 0, wingB: 0 };
    ex.total += 1;
    const w = (p.wing || '').trim().toUpperCase();
    if (w.includes('A')) {
      ex.wingA += 1;
      wingA += 1;
    } else if (w.includes('B')) {
      ex.wingB += 1;
      wingB += 1;
    }
    catMap.set(cat, ex);
  }

  const categories: NominationCategoryStat[] = Array.from(catMap.entries()).map(([cat, counts]) => ({
    category: cat,
    nominations: counts.total,
    wingA: counts.wingA,
    wingB: counts.wingB,
    percentOfTotal: total > 0 ? `${((counts.total / total) * 100).toFixed(1)}%` : '0%',
    icon: iconMap[cat] || '🏆'
  })).sort((a, b) => b.nominations - a.nominations);

  return {
    totalNominations: total,
    totalCategories: categories.length,
    wingATotal: wingA,
    wingBTotal: wingB,
    wingAPercent: total > 0 ? `${((wingA / total) * 100).toFixed(1)}%` : '0%',
    wingBPercent: total > 0 ? `${((wingB / total) * 100).toFixed(1)}%` : '0%',
    categories,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isLive: true
  };
}

/**
 * Fetch and calculate Nominations count and dashboard data directly from the same Google Sheet (gid=614822234)
 */
export async function fetchNominationsData(): Promise<NominationsDashboardData> {
  try {
    const participants = await fetchCompetitionParticipants();
    if (participants && participants.length > 0) {
      const computed = computeNominationsStatsFromParticipants(participants);
      try {
        localStorage.setItem('cached_nominations', JSON.stringify(computed));
      } catch {
        // ignore
      }
      return computed;
    }
  } catch (err) {
    console.warn('Could not compute nominations from participants sheet, falling back:', err);
  }

  // Fallback to cached or fallback participants
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_nominations') : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isLive: false };
    }
  } catch {
    // safe fallback
  }

  return computeNominationsStatsFromParticipants(FALLBACK_COMPETITION_PARTICIPANTS);
}

/**
 * Fetch and parse Accounts Sheet data
 */
export async function fetchAccountsData(): Promise<AccountsData> {
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const response = await fetchWithTimeout(`${ACCOUNTS_CSV_URL}${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    const parseCurrency = (str?: string): number => {
      if (!str) return 0;
      const cleaned = str.replace(/[^0-9]/g, '');
      const val = parseInt(cleaned, 10);
      return isNaN(val) ? 0 : val;
    };

    let totalCollections = 0;
    let totalExpenses = 0;
    let netBalance = 0;
    let contributorsCount = 0;
    let target = 160000;
    const wingWise: WingCollection[] = [];

    let headerIndices: { col: number; exp: number; bal: number; cont: number } | null = null;
    let wingHeaderIndices: { wing: number; col: number; share: number; donors: number } | null = null;
    let totalsParsed = false;

    for (let i = 0; i < rows.length; i++) {
      const rawRow = rows[i];
      const rowJoined = rawRow.join(' ').toLowerCase();

      // 1. Detect Financial Overview Header row
      if (!totalsParsed && (rowJoined.includes('total collection') || (rowJoined.includes('collection') && rowJoined.includes('expense')))) {
        headerIndices = { col: -1, exp: -1, bal: -1, cont: -1 };
        rawRow.forEach((cell, idx) => {
          const c = cell.toLowerCase();
          if (c.includes('collection')) headerIndices!.col = idx;
          else if (c.includes('expense')) headerIndices!.exp = idx;
          else if (c.includes('balance')) headerIndices!.bal = idx;
          else if (c.includes('contributor') || c.includes('donor')) headerIndices!.cont = idx;
        });
        continue;
      }

      // 2. Parse the figures row immediately following the totals header
      if (headerIndices && !totalsParsed) {
        const hasNumbers = rawRow.some(c => /[0-9]/.test(c));
        if (hasNumbers) {
          if (headerIndices.col !== -1 && rawRow[headerIndices.col]) {
            totalCollections = parseCurrency(rawRow[headerIndices.col]);
          }
          if (headerIndices.exp !== -1 && rawRow[headerIndices.exp]) {
            totalExpenses = parseCurrency(rawRow[headerIndices.exp]);
          }
          if (headerIndices.bal !== -1 && rawRow[headerIndices.bal]) {
            netBalance = parseCurrency(rawRow[headerIndices.bal]);
          }
          if (headerIndices.cont !== -1 && rawRow[headerIndices.cont]) {
            contributorsCount = parseCurrency(rawRow[headerIndices.cont]);
          }
          totalsParsed = true;
          headerIndices = null;
          continue;
        }
      }

      // 3. Detect Wing-Wise Table Header
      if (rowJoined.includes('wing') && (rowJoined.includes('collected') || rowJoined.includes('donors') || rowJoined.includes('share'))) {
        wingHeaderIndices = { wing: -1, col: -1, share: -1, donors: -1 };
        rawRow.forEach((cell, idx) => {
          const c = cell.toLowerCase();
          if (c === 'wing' || (c.includes('wing') && !c.includes('collection'))) wingHeaderIndices!.wing = idx;
          else if (c.includes('collected') || c.includes('amount')) wingHeaderIndices!.col = idx;
          else if (c.includes('share') || c.includes('%')) wingHeaderIndices!.share = idx;
          else if (c.includes('donor') || c.includes('contributor') || c.includes('count')) wingHeaderIndices!.donors = idx;
        });
        continue;
      }

      // 4. Parse Wing Rows
      if (wingHeaderIndices) {
        const wingCell = wingHeaderIndices.wing !== -1 ? (rawRow[wingHeaderIndices.wing] || '').trim() : '';
        const wingCellLower = wingCell.toLowerCase();

        // Stop on total row or end of table
        if (wingCellLower.startsWith('total') || wingCellLower.includes('all wings')) {
          wingHeaderIndices = null;
          continue;
        }

        // Accept any row in the table that has a name and is not the header
        if (wingCell && wingCellLower !== 'wing' && !wingCellLower.includes('wing-wise')) {
          const colCell = wingHeaderIndices.col !== -1 ? rawRow[wingHeaderIndices.col] : '';
          const shareCell = wingHeaderIndices.share !== -1 ? rawRow[wingHeaderIndices.share] : '';
          const donorsCell = wingHeaderIndices.donors !== -1 ? rawRow[wingHeaderIndices.donors] : '';

          const collected = parseCurrency(colCell);
          const donors = parseCurrency(donorsCell);
          const share = shareCell && shareCell.includes('%') ? shareCell.trim() : '';

          if (collected > 0 || donors > 0 || share !== '') {
            wingWise.push({
              wing: wingCell,
              collected,
              collectedFormatted: `₹${collected.toLocaleString('en-IN')}`,
              share,
              donors
            });
          }
        }
      }

      // 5. Look for target / budget in any cell
      if (rowJoined.includes('target') || rowJoined.includes('budget')) {
        for (const cell of rawRow) {
          const val = parseCurrency(cell);
          if (val > 10000 && val !== totalCollections) {
            target = val;
            break;
          }
        }
      }
    }

    // Cross-verification & calculations
    const wingTotal = wingWise.reduce((sum, w) => sum + w.collected, 0);
    const wingDonors = wingWise.reduce((sum, w) => sum + w.donors, 0);

    if (totalCollections === 0 && wingTotal > 0) {
      totalCollections = wingTotal;
    }
    if (contributorsCount === 0 && wingDonors > 0) {
      contributorsCount = wingDonors;
    }

    // Ensure net balance is accurately calculated (Collections - Expenses)
    if (netBalance === 0 || netBalance === totalCollections) {
      netBalance = totalCollections - totalExpenses;
    }

    // Ensure wing percentage shares are mathematically accurate
    if (totalCollections > 0) {
      wingWise.forEach(w => {
        if (!w.share || w.share === '') {
          w.share = `${((w.collected / totalCollections) * 100).toFixed(1)}%`;
        }
      });
    }

    const remainingTarget = Math.max(target - totalCollections, 0);
    const percentageCollected = target > 0 ? Number(((totalCollections / target) * 100).toFixed(2)) : 0;

    const result: AccountsData = {
      totalCollections,
      totalCollectionsFormatted: `₹${totalCollections.toLocaleString('en-IN')}`,
      totalExpenses,
      totalExpensesFormatted: `₹${totalExpenses.toLocaleString('en-IN')}`,
      netBalance,
      netBalanceFormatted: `₹${netBalance.toLocaleString('en-IN')}`,
      contributorsCount,
      target,
      targetFormatted: `₹${target.toLocaleString('en-IN')}`,
      remainingTarget,
      remainingTargetFormatted: `₹${remainingTarget.toLocaleString('en-IN')}`,
      percentageCollected,
      wingWise: wingWise.length > 0 ? wingWise : FALLBACK_ACCOUNTS_DATA.wingWise,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true
    };

    try {
      localStorage.setItem('cached_accounts', JSON.stringify(result));
    } catch {
      // safe fallback if storage is restricted
    }
    return result;
  } catch (err) {
    console.warn('Could not fetch live Accounts CSV from Google Sheets, using fallback cache:', err);
  }

  // Fallback to localStorage or static fallback
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_accounts') : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isLive: false };
    }
  } catch {
    // safe fallback
  }

  return FALLBACK_ACCOUNTS_DATA;
}

export const GOOGLE_DRIVE_FOLDER_ID = '1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0';
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

export interface DriveFolderPhoto {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title?: string;
  subtitle?: string;
}

// Live Google Apps Script Web App URL connected to Google Drive folder 1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0
export const GOOGLE_DRIVE_FEED_URL =
  'https://script.google.com/macros/s/AKfycbz9KdpfxK7LqR9JNehDTH2BX4aXzfIvtJCkbK55RxWNOWsAAsRo_BwxQodztj52epuTUQ/exec';

function formatPhotoTitle(rawName: string): { title: string; subtitle: string } {
  if (!rawName) {
    return {
      title: 'श्री गणेशोत्सव २०२६ क्षणचित्र',
      subtitle: 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ थेट क्षणचित्रे'
    };
  }

  const clean = rawName.replace(/\.[^/.]+$/, '').trim();
  const lower = clean.toLowerCase();

  // 1. Dynamic Keyword Matching for newly uploaded 2026 festival photos
  if (lower.includes('aagaman') || lower.includes('agman') || lower.includes('rally') || lower.includes('bike')) {
    return {
      title: 'श्री गणेश आगमन सोहळा २०२६ (Grand Aagaman 2026)',
      subtitle: 'भगवे ध्वज, ढोल-ताशांचा गजर आणि तरुणाईच्या जल्लोषात बाप्पांचे वाजत-गाजत आगमन.'
    };
  }
  if (lower.includes('aarti') || lower.includes('arti') || lower.includes('sandhya') || lower.includes('morning_aarti')) {
    return {
      title: 'सामूहिक महाआरती २०२६ (Maha Aarti 2026)',
      subtitle: 'सर्व रहिवासी, महिला व बालकांच्या उपस्थितीत बाप्पांची मंगल आरती व दीप आराधना.'
    };
  }
  if (lower.includes('darshan') || lower.includes('mukh') || lower.includes('idol') || lower.includes('murti')) {
    return {
      title: 'श्री गणेश मुख्य दर्शन २०२६ (Divine Bappa Darshan 2026)',
      subtitle: 'प्राइड युनिव्हर्सल परिवाराचे आराध्य दैवत विघ्नहर्ता गणपती बाप्पांचे मंगलमय दर्शन.'
    };
  }
  if (lower.includes('mahaprasad') || lower.includes('prasad') || lower.includes('bhojan') || lower.includes('annadan') || lower.includes('seva')) {
    return {
      title: 'भव्य महाप्रसाद व सेवा सोहळा २०२६ (Community Mahaprasad 2026)',
      subtitle: 'सोसायटी सदस्यांचा एकत्र स्नेहभोजन व भाविकांसाठी पवित्र अन्नदान सेवा.'
    };
  }
  if (lower.includes('satyanarayan') || lower.includes('puja') || lower.includes('pooja') || lower.includes('havan') || lower.includes('hom')) {
    return {
      title: 'श्री सत्यनारायण महापूजा २०२६ (Satyanarayan Maha Puja 2026)',
      subtitle: 'सोसायटी परिवाराच्या सुख, समृद्धी व आरोग्यासाठी सामूहिक सत्यनारायण महापूजा.'
    };
  }
  if (lower.includes('cultural') || lower.includes('dance') || lower.includes('lezim') || lower.includes('natak') || lower.includes('spardha') || lower.includes('drawing') || lower.includes('rangoli')) {
    return {
      title: 'सांस्कृतिक कार्यक्रम व स्पर्धा २०२६ (Cultural Highlights 2026)',
      subtitle: 'सोसायटीतील बालगोपाळ, महिला व तरुणांचा कलाविष्कार, नृत्य व स्पर्धा.'
    };
  }
  if (lower.includes('decor') || lower.includes('mandap') || lower.includes('lighting') || lower.includes('makhar') || lower.includes('flower')) {
    return {
      title: 'मंदिर व मंडप कलात्मक सजावट २०२६ (Mandap & Decor 2026)',
      subtitle: 'सुवर्ण रोषणाई, कलात्मक मखर आणि फुलांच्या मनमोहक आराशीने सजलेला बाप्पांचा दरबार.'
    };
  }
  if (lower.includes('visarjan') || lower.includes('miravnuk') || lower.includes('prasthan') || lower.includes('farewell')) {
    return {
      title: 'पुढच्या वर्षी लवकर या! भव्य विसर्जन २०२६ (Grand Visarjan 2026)',
      subtitle: 'ढोल-ताशांच्या गजरात, गुलाल व फुलांच्या उधळणीत बाप्पांचे भावपूर्ण विसर्जन.'
    };
  }

  // 2. Dictionary for known historical archive photos
  const dict: Record<string, { title: string; subtitle: string }> = {
    memories_2025_idol_croped: {
      title: 'श्री गणेश मुख्य दर्शन (Divine Bappa Darshan)',
      subtitle: 'प्राइड युनिव्हर्सल परिवाराचे आराध्य दैवत विघ्नहर्ता गणपती बाप्पांचे मंगलमय दर्शन.'
    },
    memories_2025_idol2: {
      title: 'श्री गणेश मुख्य दर्शन (Divine Idol Darshan)',
      subtitle: 'प्राइड युनिव्हर्सल परिवाराचे आराध्य दैवत विघ्नहर्ता गणपती बाप्पांचे मंगलमय दर्शन.'
    },
    memories_2025_idol: {
      title: 'मंदिर व मंडप कलात्मक सजावट (Temple & Mandap Decor)',
      subtitle: 'प्रसाद जाधव व राहुल वाळुंज यांच्या कलात्मक संयोजनाने साकारलेली सुवर्ण झालर, झुंबर व रोषणाई.'
    },
    memories_2025_idol3: {
      title: 'फुलांची आकर्षक आरास (Floral Garland Darshan)',
      subtitle: 'सुवर्ण व केशरी झेंडूच्या फुलांच्या माळांनी सजलेले बाप्पांचे विलोभनीय रूप.'
    },
    img_20250908_wa0020: {
      title: 'केबल ब्रिज भव्य विसर्जन मिरवणूक (Cable Bridge Visarjan)',
      subtitle: 'सुवर्ण रोषणाईने झगमगणाऱ्या केबल ब्रिजवरून बाप्पांची अथांग भक्तीमय अंतिम मिरवणूक.'
    },
    memories_visrjan_2025: {
      title: 'पुढच्या वर्षी लवकर या! (Final Visarjan Miravnuk)',
      subtitle: 'ढोल-ताशांच्या गजरात, गुलाल व फुलांच्या उधळणीत बाप्पांचे भावपूर्ण अंतिम विसर्जन.'
    },
    memories_prasthan_2025: {
      title: 'श्री गणेश प्रस्थान व निरोप आरती (Farewell Aarti & Chariot)',
      subtitle: 'सजविलेल्या रथासमोर बाप्पांची अंतिम प्रस्थान आरती व निरोप सोहळा.'
    },
    img_20250906_wa0108: {
      title: 'भव्य बाईक रॅली व आगमन मिरवणूक (Grand Aagaman Rally)',
      subtitle: 'भगवे ध्वज, ढोल-ताशांचा गजर आणि तरुणाईच्या जल्लोषात बाप्पांचे स्वागत.'
    },
    img_20250906_wa0110: {
      title: 'पारंपारिक लेझीम व महिला मंडळ नृत्य (Traditional Lezim)',
      subtitle: 'पारंपारिक नऊवारी साड्या नेसून महिला व युवतींनी बाप्पांच्या स्वागतात सादर केलेले लेझीम.'
    },
    memories_2025_aarti: {
      title: 'सामूहिक संध्या महाआरती (Sandhya Maha Aarti)',
      subtitle: 'सर्व रहिवासी, महिला व बालकांच्या उपस्थितीत बाप्पांची मंगल आरती व दीप आराधना.'
    },
    memories_mahaprasad1: {
      title: 'सोसायटी महाप्रसाद सोहळा (Community Feast)',
      subtitle: 'सत्यनारायण पूजेनंतर सर्व सोसायटी सदस्यांचा एकत्र स्नेहभोजन व महाप्रसाद सोहळा.'
    },
    memories_mahaprasad4: {
      title: 'आनंद मेजवानी व स्नेहभोजन (Mahaprasad Hall Dining)',
      subtitle: 'प्राइड युनिव्हर्सल परिवारातील शेकडो रहिवाशांचा एकत्र महाप्रसाद आस्वाद.'
    },
    memories_mahaprasad5: {
      title: 'प्रसाद वितरण व स्वयंसेवक सेवा (Prasad Distribution Seva)',
      subtitle: 'महिला मंडळ व स्वयंसेवकांनी प्रेमाने रहिवाशांना वाढलेला पवित्र प्रसाद.'
    },
    memories_mahaprasad_serve: {
      title: 'महाप्रसाद सेवा कार्य (Volunteer Seva & Hospitality)',
      subtitle: 'सोसायटी स्वयंसेवकांनी समर्पण भावाने केलेली अन्नदान व भोजन सेवा.'
    },
    img_20250906_wa0049: {
      title: 'श्रींच्या चरणी परिवार व भाविक दर्शन (Society Devotees Group)',
      subtitle: 'सजविलेल्या बाप्पांच्या मंडपात संपूर्ण सोसायटी परिवार व कार्यकर्त्यांचा एकत्रित फोटो.'
    },
    img_20250907_wa0029: {
      title: 'मंडप व सजावट सेवा पथक (Mandap Seva Team)',
      subtitle: 'रात्रंदिवस मेहनत करून मंदिर व मंडप साकारणारे उत्साही स्वयंसेवक.'
    },
    img_20250830_wa0005: {
      title: 'बालगोपाळ चित्रकला स्पर्धा सत्कार (Drawing Awards)',
      subtitle: 'गणेशोत्सवातील चिमुकल्या बालकलाकारांचा बाप्पांच्या चरणी सत्कार सोहळा.'
    },
    img_20250830_wa0007: {
      title: 'रंगरेषांत बाप्पा - चित्रकला स्पर्धा (Little Artists)',
      subtitle: 'विविध रंगांत बाप्पांची सुंदर चित्रे रेखाटणारे सोसायटीतील बालगोपाळ.'
    },
    img_20250830_wa0009: {
      title: 'कला व कल्पकता आविष्कार (Creative Art Workshop)',
      subtitle: 'सर्व वयोगटातील मुलांची उत्साही उपस्थिती व कलाविष्कार.'
    },
    img_20250906_wa0112: {
      title: 'सोसायटी प्रांगण आगमन सोहळा (Courtyard Welcome)',
      subtitle: 'इमारतीच्या बाल्कनी व प्रांगणातून बाप्पांवर फुलांची उधळण.'
    },
    img_20250907_wa0044: {
      title: 'मुख्य प्रवेशद्वार स्वागत (Main Gate Reception)',
      subtitle: 'पारंपारिक पोशाखात सोसायटीच्या मुख्य गेटवर बाप्पांचे जल्लोषात स्वागत.'
    },
    img_20250907_wa0048: {
      title: 'महिला मंडळ उत्सव जल्लोष (Wing A Celebrations)',
      subtitle: 'सणासुदीच्या आनंदात एकत्र आलेल्या सोसायटीतील महिला व भगिनी.'
    },
    img_20250907_wa0114: {
      title: 'लेझीम व झांज पथक प्रात्यक्षिक (Lezim Performance)',
      subtitle: 'सोसायटीच्या पटांगणात उत्साहाने सादर केलेले पारंपारिक लेझीम नृत्य.'
    },
    img_20250907_wa0118: {
      title: 'तरुणाईचा जयघोष व ढोल गजर (Youth Dhol Celebrations)',
      subtitle: 'बाप्पांच्या जयघोषात तरुणाईचा भक्तिमय व उत्साही सहभाग.'
    },
    memories_advik_2025: {
      title: 'चिमुकला भाविक बालगोपाळ (Bal Devotee)',
      subtitle: 'गणपती बाप्पांचा निष्पाप व गोड लहानांचा उत्साह दर्शविणारे क्षणचित्र.'
    },
    memories_ganapati_devotte1: {
      title: 'मूर्तिकार कार्यशाळा भेट (Idol Workshop Visit)',
      subtitle: 'बाप्पांच्या मूर्तीची निवड व आदरपूर्वक पाहणी करताना बालगोपाळ.'
    },
    memories_ganapati_devotee2: {
      title: 'मूर्ती बुकिंग व आगमन संकल्प (Puja Booking & Sankalp)',
      subtitle: 'गणेशोत्सवाची पूर्वतयारी व मूर्ती बुकिंग प्रसंगी समिती सदस्य.'
    },
    memories_2025_ganesh_booking: {
      title: 'महिला मंडळ आगमन संकल्प (Puja Planning Meeting)',
      subtitle: 'उत्सवाच्या नियोजनात उत्साहाने सहभागी झालेले महिला मंडळ.'
    }
  };

  const matchKey = Object.keys(dict).find((k) => clean.toLowerCase().includes(k.toLowerCase()));
  if (matchKey) {
    return dict[matchKey];
  }

  // 3. For any camera filenames (e.g. IMG_2026..., PXL_..., WhatsApp Image...)
  if (/^(img|pxl|dsc|whatsapp|photo)[\-_0-9]/i.test(clean)) {
    return {
      title: 'श्री गणेशोत्सव २०२६ क्षणचित्र (Festival 2026 Moment)',
      subtitle: 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ थेट क्षणचित्रे (Pride Universal Festival 2026)'
    };
  }

  // 4. Friendly title generation for any future photo added into Google Drive
  const formatted = clean
    .replace(/\s*-\s*copy/gi, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formatted} २०२६`,
    subtitle: 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ थेट क्षणचित्रे (Pride Universal Festival 2026)'
  };
}

export async function fetchDriveFolderPhotos(feedUrl: string = GOOGLE_DRIVE_FEED_URL): Promise<DriveFolderPhoto[]> {
  if (!feedUrl) return [];
  try {
    const separator = feedUrl.includes('?') ? '&' : '?';
    const cacheBuster = `${separator}_t=${Date.now()}`;
    const res = await fetchWithTimeout(`${feedUrl}${cacheBuster}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, idx) => {
        const rawName = item.name || item.title || '';
        const info = formatPhotoTitle(rawName);
        const fileId = item.id || `drive_${idx}`;
        const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
        const driveThumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
        return {
          id: fileId,
          name: rawName,
          imageUrl: item.imageUrl || directUrl,
          thumbnailUrl: item.thumbnailUrl || driveThumb,
          title: info.title,
          subtitle: info.subtitle
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching live photos from Google Drive feed:', err);
  }
  return [];
}

/**
 * Fetch notifications from published Google Sheets CSV or cached fallback
 */
export async function fetchNotificationsData(csvUrl: string = NOTIFICATIONS_CSV_URL): Promise<NotificationItem[]> {
  const tryParseFromUrl = async (url: string): Promise<NotificationItem[] | null> => {
    try {
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}&_cb=${Math.random().toString(36).substring(7)}`;
      const response = await fetchWithTimeout(`${url}${cacheBuster}`, { 
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      if (!response.ok) return null;
      const text = await response.text();
      const rows = parseCSV(text);
      if (!rows || rows.length < 1) return null;

      let headerRowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        const rowText = rows[i].join(' ').toLowerCase();
        if (
          (rowText.includes('title') && rowText.includes('message')) ||
          (rowText.includes('शीर्षक') && rowText.includes('संदेश')) ||
          rowText.includes('सूचना फलक') ||
          rowText.includes('announcement')
        ) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) return null;

      // Dynamically locate column indices from header row
      const headerRow = rows[headerRowIndex];
      const colMap = {
        title: -1,
        message: -1,
        type: -1,
        date: -1,
        active: -1,
        linkText: -1,
        linkUrl: -1,
        linkSectionId: -1
      };

      headerRow.forEach((cell, idx) => {
        const c = cell.toLowerCase().trim();
        if (c.includes('title') || c.includes('शीर्षक')) colMap.title = idx;
        else if (c.includes('message') || c.includes('संदेश')) colMap.message = idx;
        else if (c.includes('type') || c.includes('प्रकार')) colMap.type = idx;
        else if (c.includes('date') || c.includes('तारीख') || c.includes('वेळ')) colMap.date = idx;
        else if (c.includes('active') || c.includes('चालू') || c.includes('सक्रिय') || c.includes('status')) colMap.active = idx;
        else if (c.includes('link url') || c.includes('url') || c.includes('लिंक')) colMap.linkUrl = idx;
        else if (c.includes('link text') || c.includes('बटण') || c.includes('button')) colMap.linkText = idx;
        else if (c.includes('link section') || c.includes('section') || c.includes('विभाग')) colMap.linkSectionId = idx;
      });

      const titleIdx = colMap.title !== -1 ? colMap.title : 0;
      const msgIdx = colMap.message !== -1 ? colMap.message : 1;
      const typeIdx = colMap.type !== -1 ? colMap.type : 2;
      const dateIdx = colMap.date !== -1 ? colMap.date : 3;
      const activeIdx = colMap.active !== -1 ? colMap.active : 4;
      const linkTextIdx = colMap.linkText !== -1 ? colMap.linkText : 5;
      const linkUrlIdx = colMap.linkUrl !== -1 ? colMap.linkUrl : -1;
      const linkSecIdx = colMap.linkSectionId !== -1 ? colMap.linkSectionId : (linkUrlIdx !== -1 ? linkUrlIdx + 1 : 6);

      const dataRows = rows.slice(headerRowIndex + 1);
      const parsedItems: NotificationItem[] = [];

      dataRows.forEach((cols, idx) => {
        if (!cols || cols.length === 0 || cols.every(c => !c.trim())) return;

        const title = (cols[titleIdx] || '').trim();
        const message = (cols[msgIdx] || '').trim();
        if (!title || !message) return;

        const rawType = (cols[typeIdx] || 'info').toLowerCase().trim();
        const validTypes: ('urgent' | 'alert' | 'info' | 'event')[] = ['urgent', 'alert', 'info', 'event'];
        const type: 'urgent' | 'alert' | 'info' | 'event' = validTypes.includes(rawType as any)
          ? (rawType as any)
          : 'info';

        const date = (cols[dateIdx] || '').trim() || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const rawActive = (cols[activeIdx] || 'yes').toLowerCase().trim();
        const active = !['no', 'false', '0', 'बंद', 'नाही'].includes(rawActive);

        const linkText = linkTextIdx !== -1 && cols[linkTextIdx] ? cols[linkTextIdx].trim() : undefined;
        let linkUrl = linkUrlIdx !== -1 && cols[linkUrlIdx] ? cols[linkUrlIdx].trim() : undefined;
        const rawLinkSec = linkSecIdx !== -1 && cols[linkSecIdx] ? cols[linkSecIdx].trim() : undefined;
        const linkSectionId = rawLinkSec && !/^(https?:\/\/)/i.test(rawLinkSec) ? rawLinkSec.toLowerCase() : rawLinkSec;

        // Fallback for linkUrl if URL was pasted in linkText or rawLinkSec
        if (!linkUrl) {
          if (rawLinkSec && /^https?:\/\//i.test(rawLinkSec)) {
            linkUrl = rawLinkSec;
          } else if (linkText && /^https?:\/\//i.test(linkText)) {
            linkUrl = linkText;
          }
        }

        // Content-aware unique ID so that any added or updated message in Google Sheets is immediately detected as new
        const cleanSignature = `${title}_${message}_${date}`.replace(/\s+/g, '_').slice(0, 36);

        parsedItems.push({
          id: `notif_${idx}_${cleanSignature}`,
          title,
          message,
          type,
          date,
          active,
          linkText,
          linkSectionId,
          linkUrl
        });
      });

      return parsedItems.length > 0 ? parsedItems : null;
    } catch {
      return null;
    }
  };

  // 1. Try dedicated Notifications tab URL
  const fromNotifUrl = await tryParseFromUrl(csvUrl);
  if (fromNotifUrl && fromNotifUrl.length > 0) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cached_notifications', JSON.stringify(fromNotifUrl));
    }
    return fromNotifUrl;
  }

  // 2. Try parsing from the Accounts / Festival overview sheet (in case user added rows there)
  if (csvUrl !== ACCOUNTS_CSV_URL) {
    const fromAccountsUrl = await tryParseFromUrl(ACCOUNTS_CSV_URL);
    if (fromAccountsUrl && fromAccountsUrl.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_notifications', JSON.stringify(fromAccountsUrl));
      }
      return fromAccountsUrl;
    }
  }

  // 3. Fallback to localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('cached_notifications');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Error reading cached notifications:', e);
      }
    }
  }

  // 4. Default baseline fallback
  return FALLBACK_NOTIFICATIONS;
}

/**
 * Request HTML5 browser notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }
  return false;
}

/**
 * Trigger native browser/OS push notification popup
 */
export function triggerBrowserNotification(item: NotificationItem) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(item.title, {
      body: item.message,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: item.id
    });
  } catch (e) {
    console.warn('Could not trigger browser notification:', e);
  }
}

/**
 * Dedicated published Google Sheets CSV URL for Ganapati Temple & Mandap Decoration Photos
 */
export const TEMPLE_DECORATION_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRy2TOtVOzK9uBkcaJAQnSPQwgcN21uqsPAUPXf2W9qt9yHm1X6BTqlwR7onzBzw7r2O4KpqsHoKI_J/pub?gid=490872032&single=true&output=csv';

export type DecorationMediaType = 'image' | 'youtube' | 'drive-video' | 'video';

export interface DecorationSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  order?: number;
  mediaType?: DecorationMediaType;
  videoUrl?: string;
  embedUrl?: string;
  youtubeId?: string;
  driveFileId?: string;
  category?: string;
}

export interface TempleDecorationInfo {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export const DEFAULT_DECORATION_SLIDES: DecorationSlide[] = [
  {
    id: 'decor-1',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    title: 'श्री गणेश दिव्य दर्शन व आशीर्वाद',
    subtitle: 'प्राइड युनिव्हर्सल बाप्पांचे तेजस्वी व विलोभनीय रूप',
    mediaType: 'image'
  },
  {
    id: 'decor-2',
    imageUrl: '/photos/memories_2025_aarti.jpeg',
    title: 'संध्या महाआरती व भाविकांचा गजर',
    subtitle: 'सामूहिक महाआरती, पारंपरिक वाद्ये व टाळ्यांचा गजर',
    mediaType: 'image'
  },
  {
    id: 'decor-3',
    imageUrl: '/photos/memories_2025_idol2.jpeg',
    title: 'उत्सव प्रांगण व मनमोहक आरास',
    subtitle: 'भक्तिमय वातावरणात सजलेला लाडक्या बाप्पांचा दरबार',
    mediaType: 'image'
  }
];

/**
 * Formats any Google Drive URL into a high-speed direct CDN image stream URL
 */
export function formatSafeDriveUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;

  const match =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);

  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Parses and classifies media URLs (images, YouTube, Google Drive video previews, direct video files).
 */
export function parseDecorationMedia(mediaUrl?: string, explicitVideoUrl?: string): {
  mediaType: DecorationMediaType;
  imageUrl: string;
  videoUrl?: string;
  embedUrl?: string;
  youtubeId?: string;
  driveFileId?: string;
} {
  const targetUrl = (explicitVideoUrl || mediaUrl || '').trim();
  if (!targetUrl) {
    return { mediaType: 'image', imageUrl: '/photos/memories_2025_idol.jpeg' };
  }

  // 1. YouTube detection (watch?v=, youtu.be, shorts, embed)
  const ytMatch = targetUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const ytId = ytMatch[1];
    return {
      mediaType: 'youtube',
      youtubeId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
      videoUrl: `https://www.youtube.com/watch?v=${ytId}`,
      imageUrl: mediaUrl && !mediaUrl.includes('youtu') ? formatSafeDriveUrl(mediaUrl) : `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    };
  }

  // 2. Direct video file detection (.mp4, .webm, .mov, .m4v, .ogv)
  const isDirectVideo = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(targetUrl);
  if (isDirectVideo) {
    return {
      mediaType: 'video',
      videoUrl: targetUrl,
      imageUrl: mediaUrl && !/\.(mp4|webm|mov|m4v|ogv)/i.test(mediaUrl) ? formatSafeDriveUrl(mediaUrl) : '/photos/memories_2025_idol.jpeg'
    };
  }

  // 3. Google Drive URL detection
  const driveMatch =
    targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    targetUrl.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);

  if (driveMatch && driveMatch[1]) {
    const driveId = driveMatch[1];
    const isExplicitVideo = Boolean(explicitVideoUrl) || /preview|video|\.mp4/i.test(targetUrl);
    if (isExplicitVideo) {
      return {
        mediaType: 'drive-video',
        driveFileId: driveId,
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        videoUrl: `https://drive.usercontent.google.com/download?id=${driveId}&confirm=t`,
        imageUrl: `https://lh3.googleusercontent.com/d/${driveId}`
      };
    }
  }

  // 4. Default: Standard photo / image
  return {
    mediaType: 'image',
    imageUrl: formatSafeDriveUrl(targetUrl)
  };
}

/**
 * Dynamically fetches all Ganapati Temple & Mandap Decoration Photos & Videos from Google Sheets / Drive
 * Supports dedicated tab format: Photo URL | Video URL | Title | Subtitle | Active | Order
 * Supports YouTube, Google Drive video previews, MP4 files, and Drive photos.
 */
export async function fetchTempleDecorationSlides(csvUrl: string = TEMPLE_DECORATION_CSV_URL): Promise<DecorationSlide[]> {
  const cacheBuster = `&_t=${Date.now()}`;
  const foundSlides: DecorationSlide[] = [];

  // 1. If an explicit published CSV URL is provided
  if (csvUrl) {
    try {
      const separator = csvUrl.includes('?') ? '&' : '?';
      const res = await fetchWithTimeout(`${csvUrl}${separator}_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        if (rows.length > 1) {
          const headers = rows[0].map((h) => h.toLowerCase().trim());
          const videoColIdx = headers.findIndex((h) => h.includes('video') || h.includes('व्हिडिओ') || h.includes('vid') || h.includes('youtube') || h.includes('yt'));
          const photoColIdx = headers.findIndex((h) => h.includes('photo') || h.includes('image') || h.includes('pic') || h.includes('img') || h.includes('url') || h.includes('link'));
          const titleColIdx = headers.findIndex((h) => h.includes('title') || h.includes('name') || h.includes('नाव') || h.includes('शीर्षक'));
          const subtitleColIdx = headers.findIndex((h) => h.includes('subtitle') || h.includes('desc') || h.includes('वर्णन') || h.includes('caption'));
          const activeColIdx = headers.findIndex((h) => h.includes('active') || h.includes('status') || h.includes('सक्रिय'));
          const orderColIdx = headers.findIndex((h) => h.includes('order') || h.includes('seq') || h.includes('क्रमांक') || h.includes('sort'));

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rawVideo = videoColIdx !== -1 ? row[videoColIdx]?.trim() : '';
            const rawPhoto = photoColIdx !== -1 ? row[photoColIdx]?.trim() : '';
            const rawFallback = !rawVideo && !rawPhoto ? row.find((c) => /https?:\/\/|\.jpg|\.jpeg|\.png|\.mp4|\.webm|youtu|drive\.google\.com/i.test(c)) : '';
            const targetMedia = rawVideo || rawPhoto || rawFallback;
            if (!targetMedia) continue;

            // Check active flag if present
            if (activeColIdx !== -1 && row[activeColIdx]) {
              const activeVal = row[activeColIdx].toLowerCase().trim();
              if (activeVal === 'no' || activeVal === 'false' || activeVal === '0' || activeVal === 'नाही') {
                continue;
              }
            }

            const mediaParsed = parseDecorationMedia(rawPhoto || targetMedia, rawVideo);
            let title = (titleColIdx !== -1 && row[titleColIdx]) ? row[titleColIdx].trim() : `उत्सव क्षणचित्र ${i}`;
            let subtitle = (subtitleColIdx !== -1 && row[subtitleColIdx]) ? row[subtitleColIdx].trim() : undefined;

            // Provide tangy, festive context if subtitle is not given
            if (!subtitle) {
              const lowTitle = title.toLowerCase();
              if (lowTitle.includes('bappa') && !lowTitle.includes('aarti')) {
                subtitle = 'प्राइड युनिव्हर्सल बाप्पांचे मनमोहक व तेजस्वी दिव्य दर्शन';
              } else if (lowTitle.includes('aarti')) {
                subtitle = 'सामूहिक महाआरती, पारंपरिक मंत्रघोष व भक्तिमय वातावरण';
              } else if (lowTitle.includes('devotee')) {
                subtitle = 'सोसायटीचे भाविक, ज्येष्ठ नागरिक व बालगोपाळ आरती दर्शन';
              } else if (lowTitle.includes('game') || lowTitle.includes('खेळ')) {
                subtitle = '२ मिनिटांचे मजेशीर खेळ, जल्लोष व रहिवाशांचे आनंदी क्षण';
              } else if (mediaParsed.mediaType === 'video' || mediaParsed.mediaType === 'drive-video' || mediaParsed.mediaType === 'youtube') {
                subtitle = 'सोसायटी प्रांगणातील थेट उत्सव व्हिडिओ व जल्लोष क्षण';
              } else {
                subtitle = 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ चे अविस्मरणीय क्षण';
              }
            }

            const order = (orderColIdx !== -1 && row[orderColIdx]) ? parseInt(row[orderColIdx], 10) : i;

            foundSlides.push({
              id: `decor-sheet-${i}`,
              imageUrl: mediaParsed.imageUrl,
              title,
              subtitle,
              order: isNaN(order) ? i : order,
              mediaType: mediaParsed.mediaType,
              videoUrl: mediaParsed.videoUrl,
              embedUrl: mediaParsed.embedUrl,
              youtubeId: mediaParsed.youtubeId,
              driveFileId: mediaParsed.driveFileId
            });
          }
        } else if (rows.length === 1) {
          // If only 1 row without header, or raw list
          for (let i = 0; i < rows[0].length; i++) {
            const cell = rows[0][i];
            if (/https?:\/\/|\.jpg|\.jpeg|\.png|\.mp4|\.webm|youtu|drive\.google\.com/i.test(cell)) {
              const mediaParsed = parseDecorationMedia(cell);
              foundSlides.push({
                id: `decor-raw-${i}`,
                imageUrl: mediaParsed.imageUrl,
                title: 'गणेश मंदिर व मखर सजावट',
                mediaType: mediaParsed.mediaType,
                videoUrl: mediaParsed.videoUrl,
                embedUrl: mediaParsed.embedUrl,
                youtubeId: mediaParsed.youtubeId,
                driveFileId: mediaParsed.driveFileId
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching explicit temple decoration CSV:', e);
    }
  }

  // 2. Check Notifications Sheet for any decor/mandap/temple announcements or photo URLs
  if (foundSlides.length === 0) {
    try {
      const res = await fetchWithTimeout(`${NOTIFICATIONS_CSV_URL}${cacheBuster}`);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        if (rows.length > 1) {
          const headers = rows[0].map((h) => h.toLowerCase().trim());
          const photoColIdx = headers.findIndex((h) => h.includes('photo') || h.includes('image') || h.includes('pic'));
          const typeColIdx = headers.findIndex((h) => h.includes('type'));
          const titleColIdx = headers.findIndex((h) => h.includes('title'));
          const msgColIdx = headers.findIndex((h) => h.includes('message'));

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const type = (row[typeColIdx] || '').toLowerCase();
            const title = (row[titleColIdx] || '').toLowerCase();
            const isDecor =
              type.includes('decor') ||
              type.includes('mandap') ||
              type.includes('temple') ||
              title.includes('decor') ||
              title.includes('mandap') ||
              title.includes('temple') ||
              title.includes('मखर');

            if (isDecor) {
              let photoUrl = photoColIdx !== -1 ? row[photoColIdx] : '';
              if (!photoUrl) {
                const foundUrl = row.find((cell) => /https?:\/\/|drive\.google\.com/i.test(cell));
                if (foundUrl) {
                  const urlMatch = foundUrl.match(/https?:\/\/[^\s,"]+/);
                  if (urlMatch) photoUrl = urlMatch[0];
                }
              }

              if (photoUrl) {
                foundSlides.push({
                  id: `decor-notif-${i}`,
                  imageUrl: formatSafeDriveUrl(photoUrl),
                  title: row[titleColIdx] || 'भव्य गणेश मंदिर व मखर',
                  subtitle: row[msgColIdx] || undefined
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error checking notifications sheet for decor photo:', e);
    }
  }

  // 3. Check Sponsors Sheet for any Mandap/Decoration sponsor row or poster
  if (foundSlides.length === 0) {
    try {
      const res = await fetchWithTimeout(`${SPONSORS_CSV_URL}${cacheBuster}`);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        if (rows.length > 1) {
          const headers = rows[0].map((h) => h.toLowerCase().trim());
          const photoColIdx = headers.findIndex((h) => h.includes('photo'));
          const companyColIdx = headers.findIndex((h) => h.includes('company'));
          const categoryColIdx = headers.findIndex((h) => h.includes('category'));
          const titleColIdx = headers.findIndex((h) => h.includes('title'));
          const taglineColIdx = headers.findIndex((h) => h.includes('tagline'));

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cat = (row[categoryColIdx] || '').toLowerCase();
            const comp = (row[companyColIdx] || '').toLowerCase();
            const tit = (row[titleColIdx] || '').toLowerCase();
            if (
              cat.includes('decor') ||
              cat.includes('mandap') ||
              comp.includes('mandap') ||
              comp.includes('decor') ||
              tit.includes('mandap') ||
              tit.includes('decor')
            ) {
              const photoUrl = row[photoColIdx];
              if (photoUrl) {
                foundSlides.push({
                  id: `decor-sponsor-${i}`,
                  imageUrl: formatSafeDriveUrl(photoUrl),
                  title: row[titleColIdx] || row[companyColIdx] || 'गणेश मंदिर व मंडप सजावट',
                  subtitle: row[taglineColIdx] || undefined
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error checking sponsors sheet for decor photo:', e);
    }
  }

  // 4. Check Google Drive folder feed for any uploaded mandap/decoration images
  if (foundSlides.length === 0) {
    try {
      const drivePhotos = await fetchDriveFolderPhotos();
      const matches = drivePhotos.filter((p) => {
        const name = (p.name || p.title || '').toLowerCase();
        return name.includes('mandap') || name.includes('decor') || name.includes('makhar') || name.includes('temple');
      });
      matches.forEach((match, idx) => {
        if (match && (match.imageUrl || match.thumbnailUrl)) {
          foundSlides.push({
            id: `decor-drive-${idx}`,
            imageUrl: formatSafeDriveUrl(match.imageUrl || match.thumbnailUrl),
            title: match.title || 'भव्य गणेश मंदिर व मखर सजावट',
            subtitle: match.subtitle
          });
        }
      });
    } catch (e) {
      console.warn('Error checking drive photos for decor photo:', e);
    }
  }

  // 5. Merge all celebration videos from the user's Google Drive folder (1w5Sdy03ogdlVQLEBvVf2LpYtpgTIFOrS)
  const existingIds = new Set<string>();
  foundSlides.forEach((s) => {
    if (s.driveFileId) existingIds.add(s.driveFileId);
  });

  DRIVE_FOLDER_REEL_VIDEOS.forEach((videoSlide) => {
    if (videoSlide.driveFileId && !existingIds.has(videoSlide.driveFileId)) {
      foundSlides.push({
        ...videoSlide,
        order: videoSlide.order ?? (foundSlides.length + 10)
      });
      existingIds.add(videoSlide.driveFileId);
    }
  });

  // Sort by order if available
  if (foundSlides.length > 0) {
    foundSlides.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return foundSlides;
  }

  // Gracefully fallback to high-res local photos + drive reel videos
  return [...DEFAULT_DECORATION_SLIDES, ...DRIVE_FOLDER_REEL_VIDEOS];
}

/**
 * Dynamically fetches the Ganapati Temple & Mandap Decoration Photo from Google Sheets / Drive
 * (Backward compatibility helper that returns the primary slide)
 */
export async function fetchTempleDecorationData(csvUrl: string = TEMPLE_DECORATION_CSV_URL): Promise<TempleDecorationInfo | null> {
  const slides = await fetchTempleDecorationSlides(csvUrl);
  if (slides && slides.length > 0) {
    return {
      imageUrl: slides[0].imageUrl,
      title: slides[0].title,
      subtitle: slides[0].subtitle
    };
  }
  return null;
}

/**
 * Format 24-hour time or irregular time strings into friendly AM/PM display
 */
export function formatScheduleTime(timeStr: string): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  // Match 24h format like 20:30, 08:45, 20:30:00
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    let hour = parseInt(match24[1], 10);
    const minute = match24[2];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  }
  // Standardize am/pm casing to uppercase AM/PM
  return trimmed.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
}

/**
 * Normalizes any date string into standard ISO YYYY-MM-DD
 */
export function normalizeScheduleDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  // YYYY-MM-DD
  const mISO = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (mISO) {
    const y = mISO[1];
    const m = mISO[2].padStart(2, '0');
    const d = mISO[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  // DD-MM-YYYY or DD/MM/YYYY
  const mDMY = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (mDMY) {
    const d = mDMY[1].padStart(2, '0');
    const m = mDMY[2].padStart(2, '0');
    const y = mDMY[3];
    return `${y}-${m}-${d}`;
  }
  return trimmed;
}

/**
 * Format date string (e.g., 2026-09-14) into "Day X - 14 Sep 2026"
 */
export function formatScheduleDisplayDate(day: number, dateStr: string): string {
  if (!dateStr) return `Day ${day}`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trimmed = dateStr.trim();
  const m = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const monthIdx = parseInt(m[2], 10) - 1;
    const monthName = months[monthIdx] || m[2];
    const dayNum = parseInt(m[3], 10);
    return `Day ${day} - ${dayNum} ${monthName} ${m[1]}`;
  }
  const m2 = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m2) {
    const dayNum = parseInt(m2[1], 10);
    const monthIdx = parseInt(m2[2], 10) - 1;
    const monthName = months[monthIdx] || m2[2];
    return `Day ${day} - ${dayNum} ${monthName} ${m2[3]}`;
  }
  return `Day ${day} - ${trimmed}`;
}

/**
 * Fetch and parse live Festival Schedule from Google Sheets
 */
export async function fetchFestivalSchedule(csvUrl: string = SCHEDULE_CSV_URL): Promise<EventItem[]> {
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const response = await fetchWithTimeout(`${csvUrl}${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length > 1) {
      // Find header column indices
      const headerRow = rows[0].map(h => h.toLowerCase().trim());
      const dayIdx = headerRow.findIndex(h => h.includes('day'));
      const dateIdx = headerRow.findIndex(h => h.includes('date'));
      const timeIdx = headerRow.findIndex(h => h.includes('time'));
      const titleIdx = headerRow.findIndex(h => h.includes('title') || h.includes('event') || h.includes('name'));
      const descIdx = headerRow.findIndex(h => h.includes('desc') || h.includes('detail'));
      const catIdx = headerRow.findIndex(h => h.includes('cat') || h.includes('type'));
      const iconIdx = headerRow.findIndex(h => h.includes('icon') || h.includes('emoji'));
      const highlightIdx = headerRow.findIndex(h => h.includes('highlight') || h.includes('major') || h.includes('important'));

      const parsedEvents: EventItem[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 2 || row.every(cell => !cell || cell.trim() === '')) continue;

        const rawDay = dayIdx !== -1 && row[dayIdx] ? row[dayIdx].trim() : '';
        const day = parseInt(rawDay.replace(/\D/g, ''), 10) || (parsedEvents.length + 1);
        const rawDate = dateIdx !== -1 && row[dateIdx] ? row[dateIdx].trim() : '';
        const dateStr = normalizeScheduleDate(rawDate);
        const rawTime = timeIdx !== -1 && row[timeIdx] ? row[timeIdx].trim() : '';
        const time = formatScheduleTime(rawTime);
        const rawTitle = titleIdx !== -1 && row[titleIdx] ? row[titleIdx].trim() : `Festival Event ${day}`;
        const description = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : '';
        const category = (catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : 'Cultural');
        const rawIcon = iconIdx !== -1 && row[iconIdx] ? row[iconIdx].trim() : '';
        const icon = rawIcon || '📅';

        const rawHighlight = highlightIdx !== -1 && row[highlightIdx] ? row[highlightIdx].trim() : '';
        const highlight = /^(yes|true|1|y)$/i.test(rawHighlight);

        // Prepend icon to title if not already starting with an emoji or icon
        const startsWithEmoji = /^[\p{Emoji}\u200d]+/u.test(rawTitle);
        const displayTitle = icon && !startsWithEmoji && !rawTitle.startsWith(icon)
          ? `${icon} ${rawTitle}`
          : rawTitle;

        parsedEvents.push({
          day,
          dateStr,
          displayDate: formatScheduleDisplayDate(day, dateStr),
          time,
          title: displayTitle,
          description,
          icon,
          category,
          highlight
        });
      }

      if (parsedEvents.length > 0) {
        parsedEvents.sort((a, b) => a.day - b.day);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cached_festival_schedule', JSON.stringify(parsedEvents));
          } catch (e) {
            // ignore quota error
          }
        }
        return parsedEvents;
      }
    }
  } catch (err) {
    console.warn('Error fetching live Festival Schedule from Google Sheets:', err);
  }

  // 1. Fallback to localStorage cached sheet data if available
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('cached_festival_schedule');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Final fallback to bundled data
  return FESTIVAL_SCHEDULE;
}

/**
 * Fetch and parse Selected Emcees list from Google Sheets
 * Shows ONLY participants where 'Selected or Not' equals 'Selected'
 */
export async function fetchSelectedEmcees(csvUrl: string = SELECTED_EMCEES_CSV_URL): Promise<SelectedEmcee[]> {
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const response = await fetchWithTimeout(`${csvUrl}${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length <= 1) {
      return FALLBACK_SELECTED_EMCEES;
    }

    const headerRow = rows[0].map(h => h.toLowerCase().trim());
    const srNoIdx = headerRow.findIndex(h => h.includes('sr') || h.includes('no'));
    const nameIdx = headerRow.findIndex(h => h.includes('name'));
    const wingIdx = headerRow.findIndex(h => h.includes('wing'));
    const flatIdx = headerRow.findIndex(h => h.includes('flat'));
    const statusIdx = headerRow.findIndex(h => h.includes('selected') || h.includes('status'));

    const list: SelectedEmcee[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2 || row.every(c => !c || c.trim() === '')) continue;

      const rawStatus = statusIdx !== -1 && row[statusIdx] ? row[statusIdx].trim() : '';
      // Strict filter: ONLY show selected emcees
      if (!/^selected$/i.test(rawStatus.trim())) {
        continue;
      }

      const srNo = srNoIdx !== -1 && row[srNoIdx]
        ? parseInt(row[srNoIdx].replace(/\D/g, ''), 10) || (list.length + 1)
        : (list.length + 1);
      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
      const wing = wingIdx !== -1 && row[wingIdx] ? row[wingIdx].trim().toUpperCase() : '';
      const flatNumber = flatIdx !== -1 && row[flatIdx] ? row[flatIdx].trim() : '';

      if (name) {
        list.push({
          srNo,
          name,
          wing,
          flatNumber,
          status: 'Selected'
        });
      }
    }

    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn('Error fetching selected emcees from Google Sheet:', err);
  }

  return FALLBACK_SELECTED_EMCEES;
}

/**
 * Fetch and parse Competition Winners list from Google Sheets
 */
export async function fetchCompetitionWinners(csvUrl: string = WINNERS_CSV_URL): Promise<CompetitionWinner[]> {
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const response = await fetchWithTimeout(`${csvUrl}${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length <= 1) {
      return FALLBACK_WINNERS;
    }

    const headerRow = rows[0].map(h => h.toLowerCase().trim());
    const srNoIdx = headerRow.findIndex(h => h.includes('sr') || (h.includes('no') && !h.includes('flat')));
    const gameIdx = headerRow.findIndex(h => h.includes('game') || h.includes('event') || h.includes('competition') || h.includes('spardha'));
    const catIdx = headerRow.findIndex(h => h.includes('cat') || h.includes('group') || h.includes('age'));
    
    // Explicitly target winner person name, NOT 'game name'
    let winnerIdx = headerRow.findIndex(h => h.includes('winner name') || h.includes('winner_name') || h.includes('participant name') || h.includes('student name'));
    if (winnerIdx === -1) {
      winnerIdx = headerRow.findIndex(h => h.includes('winner') && !h.includes('state') && !h.includes('rank') && !h.includes('status') && !h.includes('prize'));
    }
    if (winnerIdx === -1) {
      winnerIdx = headerRow.findIndex(h => !h.includes('game') && !h.includes('event') && h.includes('name'));
    }
    // Positional fallback for 4th column (index 3)
    if (winnerIdx === -1 && headerRow.length >= 4) {
      winnerIdx = 3;
    }

    const wingIdx = headerRow.findIndex(h => h.includes('wing'));
    const flatIdx = headerRow.findIndex(h => h.includes('flat') || h.includes('room'));
    const rankIdx = headerRow.findIndex(h => h.includes('state') || h.includes('rank') || h.includes('prize') || h.includes('place') || h.includes('position'));

    const list: CompetitionWinner[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2 || row.every(c => !c || c.trim() === '')) continue;

      const srNo = srNoIdx !== -1 && row[srNoIdx]
        ? parseInt(row[srNoIdx].replace(/\D/g, ''), 10) || (list.length + 1)
        : (list.length + 1);
      const gameName = gameIdx !== -1 && row[gameIdx] ? row[gameIdx].trim() : (row[1] ? row[1].trim() : '');
      const category = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : (row[2] ? row[2].trim() : '');
      let winnerName = winnerIdx !== -1 && row[winnerIdx] ? row[winnerIdx].trim() : '';
      
      // Critical failsafe: if winnerName was mapped to gameName or empty, use column 3
      if ((!winnerName || winnerName.toLowerCase() === gameName.toLowerCase()) && row[3]) {
        winnerName = row[3].trim();
      }

      let wing = wingIdx !== -1 && row[wingIdx] ? row[wingIdx].trim() : (row[4] ? row[4].trim() : '');
      if (wing.toUpperCase() === 'A' || wing.toUpperCase() === 'B') {
        wing = `Wing ${wing.toUpperCase()}`;
      }
      const flatNumber = flatIdx !== -1 && row[flatIdx] ? row[flatIdx].trim() : (row[5] ? row[5].trim() : '');
      const rank = rankIdx !== -1 && row[rankIdx] ? row[rankIdx].trim() : (row[6] ? row[6].trim() : 'Winner');

      if (winnerName) {
        list.push({
          srNo,
          gameName,
          category,
          winnerName,
          wing,
          flatNumber,
          rank
        });
      }
    }

    if (list.length > 0) {
      try {
        localStorage.setItem('cached_winners', JSON.stringify(list));
      } catch {
        // safe fallback
      }
      return list;
    }
  } catch (err) {
    console.warn('Error fetching competition winners from Google Sheet:', err);
  }

  // Fallback to cached winners if valid
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_winners') : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].winnerName && parsed[0].winnerName.toLowerCase() !== parsed[0].gameName?.toLowerCase()) {
        return parsed;
      }
    }
  } catch {
    // safe fallback
  }

  return FALLBACK_WINNERS;
}

/**
 * Fetch and parse Live Competition Participants list by event category from Google Sheets
 */
export async function fetchCompetitionParticipants(
  csvUrl: string = COMPETITIONS_PARTICIPANTS_CSV_URL
): Promise<CompetitionParticipant[]> {
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const response = await fetchWithTimeout(`${csvUrl}${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length <= 1) {
      return FALLBACK_COMPETITION_PARTICIPANTS;
    }

    const headerRow = rows[0].map(h => h.toLowerCase().trim());
    const catIdx = headerRow.findIndex(h => h.includes('category') || h.includes('event') || h.includes('spardha'));
    const srNoIdx = headerRow.findIndex(h => h.includes('sr') || (h.includes('no') && !h.includes('flat')));
    const nameIdx = headerRow.findIndex(h => h.includes('name'));
    const wingIdx = headerRow.findIndex(h => h.includes('wing'));
    const flatIdx = headerRow.findIndex(h => h.includes('flat') || h.includes('room'));
    const mobileIdx = headerRow.findIndex(h => h.includes('mobile') || h.includes('phone') || h.includes('contact'));
    const trackIdx = headerRow.findIndex(h => h.includes('track') || h.includes('song') || h.includes('audio') || h.includes('link') || h.includes('url'));

    const list: CompetitionParticipant[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2 || row.every(c => !c || c.trim() === '')) continue;

      const rawCategory = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : (row[0] ? row[0].trim() : '');
      if (isExcludedCategory(rawCategory)) continue;
      const eventCategory = normalizeCategory(rawCategory);
      if (isExcludedCategory(eventCategory)) continue;
      const srNo = srNoIdx !== -1 && row[srNoIdx]
        ? parseInt(row[srNoIdx].replace(/\D/g, ''), 10) || (list.length + 1)
        : (list.length + 1);
      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
      
      let wing = wingIdx !== -1 && row[wingIdx] ? row[wingIdx].trim().toUpperCase() : '';
      if (wing.includes('A')) wing = 'A';
      else if (wing.includes('B')) wing = 'B';

      const flatNumber = flatIdx !== -1 && row[flatIdx] ? row[flatIdx].trim() : '';
      const mobile = mobileIdx !== -1 && row[mobileIdx] ? row[mobileIdx].trim() : undefined;
      const trackUrl = trackIdx !== -1 && row[trackIdx] ? row[trackIdx].trim() : undefined;

      if (name && eventCategory) {
        list.push({
          eventCategory,
          srNo,
          name,
          wing,
          flatNumber,
          mobile,
          trackUrl
        });
      }
    }

    if (list.length > 0) {
      try {
        localStorage.setItem('cached_competition_participants', JSON.stringify(list));
      } catch {
        // safe fallback
      }
      return list;
    }
  } catch (err) {
    console.warn('Error fetching competition participants from Google Sheet:', err);
  }

  // Fallback to cached participants if valid
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_competition_participants') : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].eventCategory) {
        return parsed;
      }
    }
  } catch {
    // safe fallback
  }

  return FALLBACK_COMPETITION_PARTICIPANTS;
}
