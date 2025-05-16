export interface Chapter {
  title: string;
  content: string;
}

export function splitChaptersFromText(text: string): Chapter[] {
  const chapters: Chapter[] = [];
  const lines = text.split(/\r?\n/);
  let currentTitle = "Chapter 1";
  let currentContent: string[] = [];

  const chapterRegex = /^chapter\s+\d+/i;

  for (let line of lines) {
    if (chapterRegex.test(line.trim())) {
      if (currentContent.length > 0) {
        chapters.push({
          title: currentTitle,
          content: currentContent.join("\n").trim(),
        });
      }

      currentTitle = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    chapters.push({
      title: currentTitle,
      content: currentContent.join("\n").trim(),
    });
  }

  return chapters;
}
