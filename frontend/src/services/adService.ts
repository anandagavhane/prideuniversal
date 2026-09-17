export interface SponsorAd {
  id: string;
  title: string;
  companyName: string;
  tagline: string;
  imageUrl: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  phone?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';
  badgeText: string;
  category: string;
}

export const GOOGLE_DRIVE_ADS_FOLDER_ID = '1uWY62gEzFzl2bgiLlOoeGIoUewgcj8a9';
export const GOOGLE_DRIVE_ADS_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_ADS_FOLDER_ID}`;
export const GOOGLE_DRIVE_APK_FOLDER_URL = 'https://drive.google.com/drive/folders/19r6t1VDSuo0Syq0pWD9m5NHNqpLdAlNR';


/**
 * Baseline sponsor ads displayed while Google Drive folder photos are loaded or as defaults
 */
export const DEFAULT_SPONSOR_ADS: SponsorAd[] = [
  {
    id: 'ad_pride_jewellers',
    title: 'श्री गणेश सुवर्ण महोत्सव विशेष सवलत',
    companyName: 'Pride Gold & Diamonds',
    tagline: 'गणेशोत्सवानिमित्त सर्व सोन्याच्या व हिऱ्यांच्या दागिन्यांवर घडणावळीत २५% भरघोस सूट!',
    imageUrl: '/photos/memories_2025_idol2.jpeg',
    phone: '+91 88888 70055',
    linkUrl: 'https://wa.me/918888870055?text=Hello%20I%20saw%20your%20festival%20ad',
    tier: 'platinum',
    badgeText: '🏆 Platinum Sponsor',
    category: 'Jewellery & Gifts'
  },
  {
    id: 'ad_pride_sweets',
    title: 'शुद्ध तुपातील मोदक व लाडू',
    companyName: 'Universal Sweets & Catering',
    tagline: 'उकडीचे मोदक, मावा मोदक व शुद्ध तुपातील मोतीचूर लाडूचे खास फेस्टिव्हल पॅक्स उपलब्ध.',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    phone: '+91 99702 96330',
    linkUrl: 'https://wa.me/919970296330?text=Hello%20Modak%20Order',
    tier: 'gold',
    badgeText: '🥇 Gold Sponsor',
    category: 'Food & Sweets'
  },
  {
    id: 'ad_pride_realty',
    title: 'प्राइड युनिव्हर्सल ड्रीम होम्स',
    companyName: 'Pride Universal Realty & Infra',
    tagline: 'तुमच्या स्वप्नातील २ आणि ३ BHK लक्झरी फ्लॅट्स. गणेशोत्सवासाठी विशेष बुकिंग ऑफर्स!',
    imageUrl: '/photos/memories_2025_idol3.jpeg',
    phone: '+91 98813 69872',
    linkUrl: 'https://wa.me/919881369872?text=Hello%20Property%20Inquiry',
    tier: 'gold',
    badgeText: '🥇 Gold Sponsor',
    category: 'Real Estate'
  },
  {
    id: 'ad_pride_decor',
    title: 'इको-फ्रेंडली सजावट व मंडप सेवा',
    companyName: 'Omkar Decorators & Sound',
    tagline: 'लग्नसोहळे, कौटुंबिक कार्यक्रम व उत्सवांसाठी आकर्षक विद्युत रोषणाई व भव्य मंडप व्यवस्था.',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    phone: '+91 70308 07007',
    tier: 'silver',
    badgeText: '🥈 Silver Sponsor',
    category: 'Event Decor'
  }
];

// Published Google Sheets CSV URL for Sponsor Ads Tab
export const SPONSORS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRy2TOtVOzK9uBkcaJAQnSPQwgcN21uqsPAUPXf2W9qt9yHm1X6BTqlwR7onzBzw7r2O4KpqsHoKI_J/pub?gid=0&single=true&output=csv';

/**
 * Sanitizes and validates a URL to prevent XSS (blocks javascript:, data:, vbscript:, file:)
 */
export function sanitizeSafeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  const lower = trimmed.toLowerCase();

  // Strictly block dangerous script schemes
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('about:')
  ) {
    return undefined;
  }

  // Safe explicitly allowed web protocols
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('tel:') ||
    lower.startsWith('mailto:')
  ) {
    return trimmed;
  }

  // WhatsApp shorthand
  if (lower.startsWith('wa.me/') || lower.startsWith('api.whatsapp.com/')) {
    return `https://${trimmed}`;
  }

  // Common web domain (e.g. www.example.com or linkedin.com/in/...)
  if (/^[a-zA-Z0-9][a-zA-Z0-9-._~%]+(\.[a-zA-Z]{2,})/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return undefined;
}

/**
 * Normalizes an image input from Excel/Google Sheets.
 * Supports:
 * - Google Drive share links (e.g. drive.google.com/file/d/{id}/view)
 * - Google Drive open links (e.g. drive.google.com/open?id={id})
 * - Raw Google Drive File IDs (e.g. 1uWY62gEzFzl2bgiLlOoeGIoUewgcj8a9)
 * - Direct image links (https://...)
 * - Local asset paths (/photos/...)
 */
export function normalizeImageUrl(input: string): string {
  const FALLBACK_IMAGE = '/photos/memories_2025_idol2.jpeg';
  if (!input) return FALLBACK_IMAGE;
  const trimmed = input.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  const lower = trimmed.toLowerCase();

  // Disallow script injections and malicious data URIs
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return FALLBACK_IMAGE;
  }

  // Safe local relative asset path
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Safe data image
  if (lower.startsWith('data:image/')) {
    return trimmed;
  }

  // Google Drive URL matching: /file/d/{id} or ?id={id}
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // If it points directly to the ads folder rather than an individual photo
    if (match[1] === GOOGLE_DRIVE_ADS_FOLDER_ID) {
      return FALLBACK_IMAGE;
    }
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // If it's a raw Drive file ID string (25+ characters)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    if (trimmed === GOOGLE_DRIVE_ADS_FOLDER_ID) {
      return FALLBACK_IMAGE;
    }
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  // Ensure external image links use https or http
  if (lower.startsWith('https://') || lower.startsWith('http://')) {
    return trimmed;
  }

  return FALLBACK_IMAGE;
}

/**
 * Simple robust CSV parser for ad rows
 */
function parseAdCSV(text: string): string[][] {
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
        i++;
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
      if (currentRow.some((c) => c !== '')) {
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
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Robust fetch wrapper with timeout (8 seconds) for ad service
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse Sponsor Ads directly from a published Google Sheet / Excel CSV
 */
export async function fetchSponsorAdsFromSheet(csvUrl: string = SPONSORS_CSV_URL): Promise<SponsorAd[] | null> {
  try {
    const separator = csvUrl.includes('?') ? '&' : '?';
    const cacheBuster = `${separator}_t=${Date.now()}&_cb=${Math.random().toString(36).substring(7)}`;
    const res = await fetchWithTimeout(`${csvUrl}${cacheBuster}`, { 
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    if (!res.ok) return null;

    const csvText = await res.text();
    const rows = parseAdCSV(csvText);
    if (!rows || rows.length < 1) return null;

    // Search for header row containing sponsor/company keywords
    let headerRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const rowStr = rows[i].join(' ').toLowerCase();
      if (
        (rowStr.includes('company') || rowStr.includes('sponsor') || rowStr.includes('कंपनी') || rowStr.includes('प्रायोजक')) &&
        (rowStr.includes('title') || rowStr.includes('शीर्षक') || rowStr.includes('name') || rowStr.includes('नाव') || rowStr.includes('phone') || rowStr.includes('फोन'))
      ) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) return null;

    const headerRow = rows[headerRowIndex];
    const colMap = {
      company: -1,
      title: -1,
      tagline: -1,
      image: -1,
      phone: -1,
      link: -1,
      tier: -1,
      category: -1,
      active: -1
    };

    headerRow.forEach((cell, idx) => {
      const c = cell.toLowerCase().trim();
      if (c.includes('company') || c.includes('sponsor') || c.includes('कंपनी') || c.includes('नाव') || c.includes('business')) {
        colMap.company = idx;
      } else if (c.includes('title') || c.includes('शीर्षक') || c.includes('headline')) {
        colMap.title = idx;
      } else if (c.includes('tagline') || c.includes('details') || c.includes('description') || c.includes('तपशील') || c.includes('माहिती') || c.includes('offer')) {
        colMap.tagline = idx;
      } else if (c.includes('image') || c.includes('photo') || c.includes('drive') || c.includes('फोटो') || c.includes('तस्वीर') || c.includes('poster')) {
        colMap.image = idx;
      } else if (c.includes('phone') || c.includes('mobile') || c.includes('contact') || c.includes('संपर्क') || c.includes('मोबाईल') || c.includes('फोन')) {
        colMap.phone = idx;
      } else if (c.includes('link') || c.includes('url') || c.includes('whatsapp') || c.includes('वेबसाईट')) {
        colMap.link = idx;
      } else if (c.includes('tier') || c.includes('श्रेणी') || c.includes('दर्जा') || c.includes('level')) {
        colMap.tier = idx;
      } else if (c.includes('category') || c.includes('प्रकार') || c.includes('क्षेत्र')) {
        colMap.category = idx;
      } else if (c.includes('active') || c.includes('status') || c.includes('चालू') || c.includes('सक्रिय')) {
        colMap.active = idx;
      }
    });

    const compIdx = colMap.company !== -1 ? colMap.company : 0;
    const titleIdx = colMap.title !== -1 ? colMap.title : 1;
    const tagIdx = colMap.tagline !== -1 ? colMap.tagline : 2;
    const imgIdx = colMap.image !== -1 ? colMap.image : 3;
    const phoneIdx = colMap.phone !== -1 ? colMap.phone : 4;
    const linkIdx = colMap.link !== -1 ? colMap.link : 5;
    const tierIdx = colMap.tier !== -1 ? colMap.tier : 6;
    const catIdx = colMap.category !== -1 ? colMap.category : 7;
    const actIdx = colMap.active !== -1 ? colMap.active : 8;

    const dataRows = rows.slice(headerRowIndex + 1);
    const parsedAds: SponsorAd[] = [];

    dataRows.forEach((cols, idx) => {
      if (!cols || cols.length === 0 || cols.every((c) => !c.trim())) return;

      const rawActive = (cols[actIdx] || 'yes').toLowerCase().trim();
      const isActive = !['no', 'false', '0', 'बंद', 'नाही', 'inactive'].includes(rawActive);
      if (!isActive) return;

      const companyName = (cols[compIdx] || '').trim();
      const title = (cols[titleIdx] || '').trim() || companyName;
      if (!companyName && !title) return;

      const tagline = (cols[tagIdx] || '').trim() || 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ अधिकृत प्रायोजक';
      
      let rawImage = (cols[imgIdx] || '').trim();
      let rawLink = (cols[linkIdx] || '').trim();

      // If the user placed the specific Drive photo link in the Link column and the folder link in Photo URL
      if (
        (rawImage.includes(GOOGLE_DRIVE_ADS_FOLDER_ID) || !rawImage) &&
        rawLink.includes('drive.google.com') &&
        !rawLink.includes(GOOGLE_DRIVE_ADS_FOLDER_ID)
      ) {
        rawImage = rawLink;
        rawLink = '';
      }

      const imageUrl = normalizeImageUrl(rawImage);

      const cleanPhone = (cols[phoneIdx] || '').trim();
      let phone = cleanPhone;
      if (/^\d{10}$/.test(cleanPhone)) {
        phone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
      } else if (/^91\d{10}$/.test(cleanPhone)) {
        phone = `+91 ${cleanPhone.slice(2, 7)} ${cleanPhone.slice(7)}`;
      }

      const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
      const waDigits = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

      let linkUrl: string | undefined = rawLink;
      if (linkUrl) {
        if (linkUrl.includes('drive.google.com')) {
          if (cleanDigits) {
            linkUrl = `https://wa.me/${waDigits}?text=Hello%20${encodeURIComponent(companyName)}%2C%20I%20saw%20your%20festival%20ad`;
          } else {
            linkUrl = undefined;
          }
        } else {
          linkUrl = sanitizeSafeUrl(linkUrl);
        }
      } else if (cleanDigits) {
        linkUrl = `https://wa.me/${waDigits}?text=Hello%20${encodeURIComponent(companyName)}%2C%20I%20saw%20your%20festival%20ad`;
      }

      const rawTier = (cols[tierIdx] || 'gold').toLowerCase().trim();
      let tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'community' = 'gold';
      let badgeText = '🥇 Gold Sponsor';

      if (rawTier.includes('plat') || rawTier.includes('प्लॅटिनम')) {
        tier = 'platinum';
        badgeText = '🏆 Platinum Sponsor';
      } else if (rawTier.includes('gold') || rawTier.includes('गोल्ड') || rawTier.includes('सुवर्ण')) {
        tier = 'gold';
        badgeText = '🥇 Gold Sponsor';
      } else if (rawTier.includes('silv') || rawTier.includes('सिल्व्हर') || rawTier.includes('रौप्य')) {
        tier = 'silver';
        badgeText = '🥈 Silver Sponsor';
      } else if (rawTier.includes('bronze') || rawTier.includes('ब्राँझ') || rawTier.includes('कांस्य')) {
        tier = 'bronze';
        badgeText = '🥉 Bronze Sponsor';
      } else if (rawTier.includes('comm') || rawTier.includes('स्थानिक')) {
        tier = 'community';
        badgeText = '🤝 Community Sponsor';
      }

      const category = (cols[catIdx] || '').trim() || 'Festival Sponsor';

      parsedAds.push({
        id: `sheet_ad_${idx}_${companyName.replace(/\s+/g, '_')}`,
        companyName: companyName || title,
        title,
        tagline,
        imageUrl,
        phone,
        linkUrl,
        tier,
        badgeText,
        category
      });
    });

    if (parsedAds.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_sponsor_ads', JSON.stringify(parsedAds));
      }
      return parsedAds;
    }
  } catch (err) {
    console.warn('Could not parse sponsor ads from Google Sheets CSV:', err);
  }

  return null;
}

/**
 * High-level fetcher:
 * 1. Checks published Google Sheet / Excel CSV for sponsor rows.
 * 2. If available, uses live spreadsheet data.
 * 3. Falls back to Google Drive JSON feed if configured.
 * 4. Falls back to cached ads or default preset templates.
 */
export async function fetchSponsorAds(sheetCsvUrl: string = SPONSORS_CSV_URL, driveFeedUrl?: string): Promise<SponsorAd[]> {
  // 1. Try Google Sheets / Excel live data
  const sheetAds = await fetchSponsorAdsFromSheet(sheetCsvUrl);
  if (sheetAds && sheetAds.length > 0) {
    return sheetAds;
  }

  // 2. Try Google Drive JSON feed if provided
  if (driveFeedUrl) {
    try {
      const separator = driveFeedUrl.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}`;
      const res = await fetchWithTimeout(`${driveFeedUrl}${cacheBuster}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item, idx) => {
            const fileId = item.id || `drive_ad_${idx}`;
            const directUrl = item.imageUrl || `https://lh3.googleusercontent.com/d/${fileId}`;
            const driveThumb = item.thumbnailUrl || `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
            const rawName = (item.name || item.title || `Sponsor ${idx + 1}`).replace(/\.[^/.]+$/, '');

            return {
              id: fileId,
              title: item.title || rawName,
              companyName: item.companyName || rawName,
              tagline: item.tagline || 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ अधिकृत प्रायोजक (Official Festival Partner)',
              imageUrl: directUrl,
              thumbnailUrl: driveThumb,
              linkUrl: sanitizeSafeUrl(item.linkUrl) || GOOGLE_DRIVE_ADS_FOLDER_URL,
              phone: item.phone || '+91 98813 69872',
              tier: (item.tier as any) || 'gold',
              badgeText: item.badgeText || '📢 Official Sponsor',
              category: item.category || 'Local Business'
            };
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch ads from Google Drive feed:', err);
    }
  }

  // 3. Try cached ads in localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('cached_sponsor_ads');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  // 4. Default fallback templates
  return DEFAULT_SPONSOR_ADS;
}

