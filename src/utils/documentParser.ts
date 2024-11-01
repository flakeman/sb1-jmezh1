import { Document } from '../types';

export async function parseDocumentContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function analyzeLevels(content: string): string[] {
  const lines = content.split('\n');
  const levels: string[] = [];
  
  // Look for level indicators in text (1-5)
  for (let i = 1; i <= 5; i++) {
    const levelPattern = new RegExp(`Level\\s*${i}[:\\s]*(.*?)(?=Level\\s*${i + 1}|$)`, 'i');
    const match = content.match(levelPattern);
    if (match && match[1]) {
      levels[i - 1] = match[1].trim();
    } else {
      levels[i - 1] = `Level ${i}`;
    }
  }

  return levels;
}