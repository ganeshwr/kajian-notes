import { QuranVerse } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export class QuranService {
  static async searchVerses(query: string): Promise<QuranVerse[]> {
    try {
      // Search by surah and verse number (e.g., "2:255")
      const surahVerseMatch = query.match(/(\d+):(\d+)/);
      if (surahVerseMatch) {
        const surahNumber = parseInt(surahVerseMatch[1]);
        const verseNumber = parseInt(surahVerseMatch[2]);
        return await this.getVerseByReference(surahNumber, verseNumber);
      }

      // Search by surah number only (e.g., "2" for Al-Baqarah)
      const surahMatch = query.match(/^(\d+)$/);
      if (surahMatch) {
        const surahNumber = parseInt(surahMatch[1]);
        return await this.getSurahVerses(surahNumber, 1, 5); // Get first 5 verses
      }

      // Search for popular verses by keywords
      const keywordVerses = await this.searchByKeywords(query);
      return keywordVerses;
    } catch (error) {
      console.error('Error searching Quran verses:', error);
      return [];
    }
  }

  static async getVerseByReference(surahNumber: number, verseNumber: number): Promise<QuranVerse[]> {
    try {
      const response = await fetch(`${BASE_URL}/ayah/${surahNumber}:${verseNumber}/editions/quran-uthmani,en.asad`);
      const data = await response.json();
      
      if (data.code === 200 && data.data.length >= 2) {
        const arabicVerse = data.data[0];
        const translationVerse = data.data[1];
        
        return [{
          number: arabicVerse.number,
          text: arabicVerse.text,
          translation: translationVerse.text,
          surah: {
            number: arabicVerse.surah.number,
            name: arabicVerse.surah.name,
            englishName: arabicVerse.surah.englishName
          },
          numberInSurah: arabicVerse.numberInSurah
        }];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching verse:', error);
      return [];
    }
  }

  static async getSurahVerses(surahNumber: number, startVerse: number = 1, count: number = 5): Promise<QuranVerse[]> {
    try {
      const verses: QuranVerse[] = [];
      for (let i = startVerse; i < startVerse + count; i++) {
        const verseData = await this.getVerseByReference(surahNumber, i);
        if (verseData.length > 0) {
          verses.push(verseData[0]);
        }
      }
      return verses;
    } catch (error) {
      console.error('Error fetching surah verses:', error);
      return [];
    }
  }

  static async searchByKeywords(query: string): Promise<QuranVerse[]> {
    // Popular verses that users might search for
    const popularVerses = {
      'kursi': { surah: 2, verse: 255 },
      'ayat kursi': { surah: 2, verse: 255 },
      'fatiha': { surah: 1, verse: 1 },
      'al-fatiha': { surah: 1, verse: 1 },
      'ikhlas': { surah: 112, verse: 1 },
      'al-ikhlas': { surah: 112, verse: 1 },
      'falaq': { surah: 113, verse: 1 },
      'al-falaq': { surah: 113, verse: 1 },
      'nas': { surah: 114, verse: 1 },
      'an-nas': { surah: 114, verse: 1 },
      'light': { surah: 24, verse: 35 },
      'nur': { surah: 24, verse: 35 },
      'throne': { surah: 2, verse: 255 },
      'bismillah': { surah: 1, verse: 1 },
      'rahman': { surah: 55, verse: 1 },
      'ar-rahman': { surah: 55, verse: 1 }
    };

    const lowerQuery = query.toLowerCase();
    const matchedVerse = popularVerses[lowerQuery as keyof typeof popularVerses];
    
    if (matchedVerse) {
      return await this.getVerseByReference(matchedVerse.surah, matchedVerse.verse);
    }

    return [];
  }

  static async getSurahList() {
    try {
      const response = await fetch(`${BASE_URL}/surah`);
      const data = await response.json();
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.error('Error fetching surah list:', error);
      return [];
    }
  }

  static formatVerseReference(verse: QuranVerse): string {
    return `${verse.surah.englishName} ${verse.surah.number}:${verse.numberInSurah}`;
  }

  static formatVerseForInsertion(verse: QuranVerse): string {
    return `
<div style="background: #f8fafc; border-left: 4px solid #16a34a; padding: 16px; margin: 16px 0; border-radius: 8px;">
  <h4 style="color: #16a34a; margin: 0 0 12px 0; font-weight: 600;">${this.formatVerseReference(verse)}</h4>
  <p style="text-align: right; font-size: 18px; line-height: 1.8; margin: 0 0 12px 0; font-family: 'Amiri', serif;">${verse.text}</p>
  <p style="font-style: italic; color: #64748b; margin: 0;">"${verse.translation}"</p>
</div>
    `.trim();
  }
}