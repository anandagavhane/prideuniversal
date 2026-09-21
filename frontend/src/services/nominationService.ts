import { CompetitionParticipant } from '../types';

export interface NominationFormEntry {
  id: string;
  srNo?: number;
  name: string;
  eventCategory: string;
  wing: 'A' | 'B' | string;
  flatNumber: string;
  mobile?: string;
  ageGroup?: string;
  trackUrl?: string; // Audio / Song Track Link (YouTube, Drive, etc.)
  notes?: string;
  submittedAt: string; // ISO string
}

const LOCAL_STORAGE_KEY = 'festive_user_nominations_2026';

/**
 * Check if a category is excluded from festival competitions
 */
export function isExcludedCategory(category?: string): boolean {
  if (!category) return false;
  const lower = category.toLowerCase();
  return lower.includes('modak') || lower.includes('मोदक');
}

/**
 * Normalize event category names to ensure consistency across Google Sheet variations,
 * card titles, and user inputs (e.g. "Emcee Nomination" and "⭐ Emcee / Host" -> "Emcee / Host").
 */
export function normalizeCategory(category?: string): string {
  if (!category) return 'Other';
  const clean = category.trim();
  const lower = clean.toLowerCase();

  // Merge "Emcee Nomination", "⭐ Emcee / Host", "Emcee / Host", "Emcee", "Host" into unified "Emcee / Host"
  if (lower.includes('emcee') || lower.includes('host') || lower.includes('सूत्रसंचालन') || lower.includes('निवेदन')) {
    return 'Emcee / Host';
  }
  if (lower.includes('dance') || lower.includes('नृत्य')) {
    return 'Dance';
  }
  if (lower.includes('drawing') || lower.includes('चित्रकला')) {
    return 'Drawing';
  }
  if (lower.includes('singing') || lower.includes('गायन')) {
    return 'Singing';
  }
  if (lower.includes('shloka') || lower.includes('श्लोक')) {
    return 'Shloka';
  }
  if (lower.includes('piano') || lower.includes('instrumental') || lower.includes('वाद्य')) {
    return 'Piano Play';
  }
  if (lower.includes('drama') || lower.includes('नाट्य') || lower.includes('अभिनय') || lower.includes('skit')) {
    return 'Drama';
  }
  if (lower.includes('rangoli') || lower.includes('रांगोळी')) {
    return 'Rangoli';
  }

  // Strip leading decorative emojis like '⭐ ', '💃 ', etc. if present
  const stripped = clean.replace(/^[\p{Emoji}\s]+/u, '').trim();
  return stripped || clean;
}

/**
 * Construct composite deduplication key
 */
export function getParticipantKey(name?: string, category?: string, wing?: string, flat?: string): string {
  const normCat = normalizeCategory(category).toLowerCase();
  return `${normCat}_${(name || '').trim().toLowerCase()}_${(wing || '').trim().toLowerCase()}_${(flat || '').trim().toLowerCase()}`;
}

/**
 * Retrieve user-submitted nominations from local storage, deduplicating any legacy duplicates
 * and permanently excluding disallowed categories like Modak Making
 */
export function getLocalNominations(): NominationFormEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const deduplicated: NominationFormEntry[] = [];
    let hadExcluded = false;

    for (const item of parsed) {
      if (!item || !item.name) continue;
      if (isExcludedCategory(item.eventCategory)) {
        hadExcluded = true;
        continue;
      }
      const normCat = normalizeCategory(item.eventCategory);
      const normalizedItem = { ...item, eventCategory: normCat };
      const key = getParticipantKey(normalizedItem.name, normCat, normalizedItem.wing, normalizedItem.flatNumber);
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(normalizedItem);
      }
    }

    if (hadExcluded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduplicated));
      } catch (e) {
        // ignore
      }
    }

    return deduplicated;
  } catch (err) {
    console.error('Failed to parse local nominations:', err);
    return [];
  }
}

/**
 * Save a new user nomination to local storage with duplicate prevention
 */
export function saveLocalNomination(entry: Omit<NominationFormEntry, 'id' | 'submittedAt'>): NominationFormEntry {
  const normalizedCat = normalizeCategory(entry.eventCategory);
  const normalizedEntry = {
    ...entry,
    eventCategory: normalizedCat
  };
  const existing = getLocalNominations();
  const targetKey = getParticipantKey(normalizedEntry.name, normalizedEntry.eventCategory, normalizedEntry.wing, normalizedEntry.flatNumber);

  const duplicateIndex = existing.findIndex(
    e => getParticipantKey(e.name, e.eventCategory, e.wing, e.flatNumber) === targetKey
  );

  const newEntry: NominationFormEntry = {
    ...normalizedEntry,
    id: duplicateIndex >= 0 ? existing[duplicateIndex].id : `nom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: duplicateIndex >= 0 ? existing[duplicateIndex].submittedAt : new Date().toISOString()
  };

  let updated: NominationFormEntry[];
  if (duplicateIndex >= 0) {
    updated = [...existing];
    updated[duplicateIndex] = newEntry; // update existing entry in-place
  } else {
    updated = [newEntry, ...existing];
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save nomination to localStorage:', err);
  }

  return newEntry;
}

/**
 * Merge base Google Sheet participants with local nominations into a strictly deduplicated list
 */
export function mergeParticipantsWithLocalNominations(
  baseParticipants: CompetitionParticipant[],
  localNominations: NominationFormEntry[]
): CompetitionParticipant[] {
  const seenKeys = new Set<string>();
  const result: CompetitionParticipant[] = [];

  // 1. Add base participants first (maintaining sheet order)
  if (baseParticipants && Array.isArray(baseParticipants)) {
    for (const p of baseParticipants) {
      if (isExcludedCategory(p.eventCategory)) continue;
      const normCat = normalizeCategory(p.eventCategory);
      const key = getParticipantKey(p.name, normCat, p.wing, p.flatNumber);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push({
          ...p,
          eventCategory: normCat
        });
      }
    }
  }

  // 2. Compute next serial number
  let nextSrNo = result.length > 0
    ? Math.max(...result.map(p => p.srNo || 0)) + 1
    : 1;

  // 3. Add local nominations ONLY if not already present
  if (localNominations && Array.isArray(localNominations)) {
    for (const n of localNominations) {
      if (isExcludedCategory(n.eventCategory)) continue;
      const normCat = normalizeCategory(n.eventCategory);
      const key = getParticipantKey(n.name, normCat, n.wing, n.flatNumber);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push({
          eventCategory: normCat,
          srNo: n.srNo || nextSrNo++,
          name: n.name,
          wing: n.wing,
          flatNumber: n.flatNumber,
          mobile: n.mobile,
          trackUrl: n.trackUrl
        });
      }
    }
  }

  return result;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate formatted Microsoft Excel XML Spreadsheet (.xls)
 * Opens seamlessly in Excel with saffron styled headers, centered columns, and borders.
 */
export function generateExcelWorkbookXml(
  participants: CompetitionParticipant[],
  localEntries: NominationFormEntry[] = [],
  festivalTitle: string = 'Pride Universal Ganesh Mahotsav 2026'
): string {
  // Build lookup map for additional local details (phone, notes, etc.)
  const detailsMap = new Map<string, NominationFormEntry>();
  localEntries.forEach(entry => {
    const key = getParticipantKey(entry.name, entry.eventCategory, entry.wing, entry.flatNumber);
    detailsMap.set(key, entry);
  });

  // Strict deduplication safeguard: ensure every participant row is unique
  const seenKeys = new Set<string>();
  const uniqueParticipants: CompetitionParticipant[] = [];
  for (const p of participants) {
    if (isExcludedCategory(p.eventCategory)) continue;
    const key = getParticipantKey(p.name, p.eventCategory, p.wing, p.flatNumber);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueParticipants.push(p);
    }
  }

  const generatedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  let rowsXml = '';
  uniqueParticipants.forEach((p, idx) => {
    const key = getParticipantKey(p.name, p.eventCategory, p.wing, p.flatNumber);
    const extra = detailsMap.get(key);
    const mobile = extra?.mobile || p.mobile || '-';
    const age = extra?.ageGroup || '-';
    const track = extra?.trackUrl || p.trackUrl || '-';
    const notes = extra?.notes || '-';
    const submitted = extra?.submittedAt ? new Date(extra.submittedAt).toLocaleString('en-IN') : 'Official Sheet';

    const bgClass = idx % 2 === 0 ? 'sEven' : 'sOdd';

    rowsXml += `
      <Row ss:Height="20">
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Left"><Data ss:Type="String">${escapeXml(p.name)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Left"><Data ss:Type="String">${escapeXml(normalizeCategory(p.eventCategory))}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="String">${escapeXml(p.wing)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="String">${escapeXml(p.flatNumber)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="String">${escapeXml(mobile)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="String">${escapeXml(age)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Left"><Data ss:Type="String">${escapeXml(track)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Left"><Data ss:Type="String">${escapeXml(notes)}</Data></Cell>
        <Cell ss:StyleID="${bgClass}Center"><Data ss:Type="String">${escapeXml(submitted)}</Data></Cell>
      </Row>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
    </Style>
    <Style ss:ID="sTitle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#78350F"/>
      <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sSubtitle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#92400E"/>
      <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sHeader">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#78350F"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#78350F"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#B45309"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#B45309"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#B45309" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sEvenCenter">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
      </Borders>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sEvenLeft">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
      </Borders>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sOddCenter">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
      </Borders>
      <Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sOddLeft">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
      </Borders>
      <Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Nominations 2026">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="50"/>
      <Column ss:Width="160"/>
      <Column ss:Width="150"/>
      <Column ss:Width="60"/>
      <Column ss:Width="80"/>
      <Column ss:Width="110"/>
      <Column ss:Width="90"/>
      <Column ss:Width="200"/>
      <Column ss:Width="180"/>
      <Column ss:Width="140"/>

      <Row ss:Height="30">
        <Cell ss:MergeAcross="9" ss:StyleID="sTitle">
          <Data ss:Type="String">॥ श्री गणेशाय नमः ॥ ${escapeXml(festivalTitle)}</Data>
        </Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:MergeAcross="9" ss:StyleID="sSubtitle">
          <Data ss:Type="String">अधिकृत स्पर्धा नोंदणी यादी (Competition Nominations List) • Generated: ${escapeXml(generatedDate)} • Total: ${participants.length} Participants</Data>
        </Cell>
      </Row>
      <Row ss:Height="10"/>

      <Row ss:Height="25">
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">अ.क्र. (Sr)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">स्पर्धकाचे नाव (Participant Name)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">स्पर्धा प्रकार (Event Category)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">विंग (Wing)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">फ्लॅट (Flat No)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">मोबाईल (Mobile)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">वय / गट (Age)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">गाण्याची / ट्रॅक लिंक (Track Link)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">विशेष माहिती (Notes)</Data></Cell>
        <Cell ss:StyleID="sHeader"><Data ss:Type="String">नोंदणी तारीख (Submitted At)</Data></Cell>
      </Row>

      ${rowsXml}
    </Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <FreezePanes/>
      <FrozenNoSplit/>
      <SplitHorizontal>4</SplitHorizontal>
      <TopRowBottomPane>4</TopRowBottomPane>
      <ActivePane>2</ActivePane>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;
}

/**
 * Generate CSV with UTF-8 BOM so Excel opens Marathi text with correct encoding
 */
export function generateExcelCsv(
  participants: CompetitionParticipant[],
  localEntries: NominationFormEntry[] = []
): string {
  const detailsMap = new Map<string, NominationFormEntry>();
  localEntries.forEach(entry => {
    const key = getParticipantKey(entry.name, entry.eventCategory, entry.wing, entry.flatNumber);
    detailsMap.set(key, entry);
  });

  // Strict deduplication safeguard: ensure every participant row is unique
  const seenKeys = new Set<string>();
  const uniqueParticipants: CompetitionParticipant[] = [];
  for (const p of participants) {
    if (isExcludedCategory(p.eventCategory)) continue;
    const key = getParticipantKey(p.name, p.eventCategory, p.wing, p.flatNumber);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueParticipants.push(p);
    }
  }

  const headers = [
    'Sr.No',
    'Participant Name',
    'Event Category',
    'Wing',
    'Flat Number',
    'Mobile Number',
    'Age Group',
    'Song / Audio Track Link',
    'Notes / Details',
    'Registration Date'
  ];

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = uniqueParticipants.map((p, idx) => {
    const key = getParticipantKey(p.name, p.eventCategory, p.wing, p.flatNumber);
    const extra = detailsMap.get(key);
    return [
      idx + 1,
      escapeCsv(p.name),
      escapeCsv(normalizeCategory(p.eventCategory)),
      escapeCsv(p.wing),
      escapeCsv(p.flatNumber),
      escapeCsv(extra?.mobile || p.mobile || ''),
      escapeCsv(extra?.ageGroup || ''),
      escapeCsv(extra?.trackUrl || p.trackUrl || ''),
      escapeCsv(extra?.notes || ''),
      escapeCsv(extra?.submittedAt ? new Date(extra.submittedAt).toLocaleString('en-IN') : 'Official Sheet')
    ].join(',');
  });

  // UTF-8 BOM '\uFEFF' ensures Microsoft Excel interprets UTF-8 characters correctly
  return '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
}

/**
 * Download a file in the browser
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export participants to Microsoft Excel XML (.xls)
 */
export function exportToExcel(
  participants: CompetitionParticipant[],
  localEntries: NominationFormEntry[] = [],
  filenamePrefix: string = 'PrideUniversal_Nominations_2026'
) {
  const xml = generateExcelWorkbookXml(participants, localEntries);
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xls`;
  triggerFileDownload(xml, filename, 'application/vnd.ms-excel;charset=utf-8');
}

/**
 * Export participants to Excel-compatible CSV (.csv)
 */
export function exportToCsv(
  participants: CompetitionParticipant[],
  localEntries: NominationFormEntry[] = [],
  filenamePrefix: string = 'PrideUniversal_Nominations_2026'
) {
  const csv = generateExcelCsv(participants, localEntries);
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerFileDownload(csv, filename, 'text/csv;charset=utf-8;');
}

