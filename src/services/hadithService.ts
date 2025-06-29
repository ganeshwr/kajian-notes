import { Hadith } from '../types';

// Enhanced Hadith service with more comprehensive mock data
export class HadithService {
  static async searchHadith(query: string): Promise<Hadith[]> {
    // Enhanced mock data with more Hadith for better search results
    const mockHadith: Hadith[] = [
      {
        id: '1',
        text: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        translation: 'Actions are but by intention, and every man shall have only that which he intended',
        book: 'Sahih Bukhari',
        chapter: 'Revelation',
        narrator: 'Umar ibn al-Khattab',
        grade: 'Sahih'
      },
      {
        id: '2',
        text: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent',
        book: 'Sahih Bukhari',
        chapter: 'Manners',
        narrator: 'Abu Hurairah',
        grade: 'Sahih'
      },
      {
        id: '3',
        text: 'الدِّينُ النَّصِيحَةُ',
        translation: 'Religion is sincere advice',
        book: 'Sahih Muslim',
        chapter: 'Faith',
        narrator: 'Tamim ad-Dari',
        grade: 'Sahih'
      },
      {
        id: '4',
        text: 'مَنْ لَمْ يَرْحَمِ النَّاسَ لَمْ يَرْحَمْهُ اللَّهُ',
        translation: 'He who does not show mercy to people, Allah will not show mercy to him',
        book: 'Sahih Bukhari',
        chapter: 'Manners',
        narrator: 'Jarir ibn Abdullah',
        grade: 'Sahih'
      },
      {
        id: '5',
        text: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
        translation: 'A Muslim is one from whose tongue and hand the Muslims are safe',
        book: 'Sahih Bukhari',
        chapter: 'Faith',
        narrator: 'Abdullah ibn Amr',
        grade: 'Sahih'
      },
      {
        id: '6',
        text: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        translation: 'None of you believes until he loves for his brother what he loves for himself',
        book: 'Sahih Bukhari',
        chapter: 'Faith',
        narrator: 'Anas ibn Malik',
        grade: 'Sahih'
      },
      {
        id: '7',
        text: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
        translation: 'Whoever prays Fajr is under Allah\'s protection',
        book: 'Sahih Muslim',
        chapter: 'Prayer',
        narrator: 'Jundub ibn Abdullah',
        grade: 'Sahih'
      },
      {
        id: '8',
        text: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
        translation: 'Cleanliness is half of faith',
        book: 'Sahih Muslim',
        chapter: 'Purification',
        narrator: 'Abu Malik al-Ashari',
        grade: 'Sahih'
      }
    ];

    // Enhanced search logic
    const lowerQuery = query.toLowerCase();
    return mockHadith.filter(hadith => {
      return (
        hadith.translation.toLowerCase().includes(lowerQuery) ||
        hadith.text.includes(query) ||
        hadith.book.toLowerCase().includes(lowerQuery) ||
        hadith.chapter.toLowerCase().includes(lowerQuery) ||
        hadith.narrator.toLowerCase().includes(lowerQuery) ||
        this.searchByTopic(lowerQuery, hadith)
      );
    });
  }

  private static searchByTopic(query: string, hadith: Hadith): boolean {
    const topicKeywords = {
      'intention': ['intention', 'نية'],
      'prayer': ['prayer', 'صلاة', 'fajr', 'الفجر'],
      'faith': ['faith', 'believe', 'إيمان'],
      'manners': ['manners', 'speak', 'mercy', 'أخلاق'],
      'cleanliness': ['clean', 'purification', 'طهور'],
      'brotherhood': ['brother', 'love', 'أخ'],
      'advice': ['advice', 'نصيحة'],
      'muslim': ['muslim', 'مسلم'],
      'protection': ['protection', 'ذمة']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        return keywords.some(keyword => 
          hadith.translation.toLowerCase().includes(keyword) ||
          hadith.text.includes(keyword)
        );
      }
    }

    return false;
  }

  static formatHadithForInsertion(hadith: Hadith): string {
    return `
<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 16px; margin: 16px 0; border-radius: 8px;">
  <h4 style="color: #d97706; margin: 0 0 12px 0; font-weight: 600;">${hadith.book} - ${hadith.chapter}</h4>
  <p style="text-align: right; font-size: 18px; line-height: 1.8; margin: 0 0 12px 0; font-family: 'Amiri', serif;">${hadith.text}</p>
  <p style="font-style: italic; color: #64748b; margin: 0 0 8px 0;">"${hadith.translation}"</p>
  <p style="font-size: 14px; color: #6b7280; margin: 0;"><strong>Narrator:</strong> ${hadith.narrator} | <strong>Grade:</strong> ${hadith.grade}</p>
</div>
    `.trim();
  }
}