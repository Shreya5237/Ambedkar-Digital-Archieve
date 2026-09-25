export interface TranscriptPage {
  pageNumber: number;
  content: string;
}

/**
 * Parses a transcript string formatted with [Page X], --- Page X ---, or explicit page markers
 * into an array of structured TranscriptPage objects.
 */
export function parseTranscriptPages(transcript?: string, totalPagesCount?: number): TranscriptPage[] {
  if (!transcript || !transcript.trim()) return [];

  const text = transcript.trim();

  // Pattern 1: [Page X] or [page X] or [Page 1]
  const bracketPageRegex = /\[page\s*(\d+)\]/gi;
  const bracketMatches = Array.from(text.matchAll(bracketPageRegex));

  if (bracketMatches.length > 0) {
    const pages: TranscriptPage[] = [];
    for (let i = 0; i < bracketMatches.length; i++) {
      const match = bracketMatches[i];
      const pageNum = parseInt(match[1], 10);
      const startIdx = match.index! + match[0].length;
      const endIdx = i < bracketMatches.length - 1 ? bracketMatches[i + 1].index! : text.length;

      let pageContent = text.slice(startIdx, endIdx).trim();
      // Strip trailing separators like '---'
      pageContent = pageContent.replace(/\n\s*---\s*$/, "").trim();

      pages.push({
        pageNumber: pageNum,
        content: pageContent,
      });
    }
    return pages;
  }

  // Pattern 2: --- Page X --- or Page X:
  const dashedPageRegex = /(?:---+\s*Page\s*(\d+)\s*---+)|(?:Page\s*(\d+)\s*:)/gi;
  const dashedMatches = Array.from(text.matchAll(dashedPageRegex));

  if (dashedMatches.length > 0) {
    const pages: TranscriptPage[] = [];
    for (let i = 0; i < dashedMatches.length; i++) {
      const match = dashedMatches[i];
      const pageNum = parseInt(match[1] || match[2], 10);
      const startIdx = match.index! + match[0].length;
      const endIdx = i < dashedMatches.length - 1 ? dashedMatches[i + 1].index! : text.length;

      let pageContent = text.slice(startIdx, endIdx).trim();
      pageContent = pageContent.replace(/\n\s*---\s*$/, "").trim();

      pages.push({
        pageNumber: pageNum,
        content: pageContent,
      });
    }
    return pages;
  }

  // Pattern 3: Split by \n\n---\n\n
  if (text.includes("\n\n---\n\n") || text.includes("\n---\n")) {
    const parts = text.split(/\n\s*---\s*\n/);
    return parts.map((part, idx) => ({
      pageNumber: idx + 1,
      content: part.trim(),
    }));
  }

  // Fallback: If totalPagesCount is specified and > 1, slice text into equal parts by length or paragraph
  if (totalPagesCount && totalPagesCount > 1) {
    const charsPerPage = Math.ceil(text.length / totalPagesCount);
    const pages: TranscriptPage[] = [];
    for (let i = 0; i < totalPagesCount; i++) {
      const start = i * charsPerPage;
      const end = Math.min(text.length, (i + 1) * charsPerPage);
      const pageContent = text.slice(start, end).trim();
      pages.push({
        pageNumber: i + 1,
        content: pageContent || `[Page ${i + 1} - Digitized Archival Content]`,
      });
    }
    return pages;
  }

  // Single page
  return [
    {
      pageNumber: 1,
      content: text,
    },
  ];
}
