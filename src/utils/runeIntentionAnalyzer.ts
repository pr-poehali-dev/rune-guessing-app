import { type Rune } from "@/data/runes";

export interface IntentionAnalysis {
  recommendedRunes: number[];
  neutralRunes: number[];
  notRecommendedRunes: number[];
  runeReasons: Record<number, string>;
}

const intentionKeywords = {
  wealth: ["богатство", "деньги", "финансы", "прибыль", "процветание", "изобилие", "доход", "успех", "бизнес", "инвестиц"],
  love: ["любовь", "отношения", "романтик", "партнер", "встреча", "свидание", "семья", "брак", "страсть", "привлечение"],
  health: ["здоровье", "исцеление", "выздоровление", "лечение", "энергия", "сила", "восстановление", "болезнь"],
  protection: ["защита", "оберег", "безопасность", "щит", "охрана", "защитить"],
  success: ["успех", "достижение", "цель", "победа", "карьера", "продвижение", "рост"],
  wisdom: ["мудрость", "знание", "обучение", "понимание", "интуиция", "ясность", "учеба"],
  change: ["изменение", "трансформация", "перемены", "новое", "начало", "преобразование"],
  communication: ["общение", "коммуникация", "разговор", "понимание", "связь", "контакт"],
  creativity: ["творчество", "креатив", "вдохновение", "искусство", "создание"],
  peace: ["покой", "гармония", "равновесие", "умиротворение", "спокойствие", "баланс"],
  strength: ["сила", "мощь", "энергия", "выносливость", "стойкость", "воля"],
  fertility: ["плодородие", "рождение", "беременность", "зачатие", "дети", "потомство"],
  victory: ["победа", "преодоление", "триумф", "достижение", "завоевание"],
  journey: ["путешествие", "дорога", "путь", "поездка", "переезд", "движение"],
  joy: ["радость", "счастье", "веселье", "удовольствие", "праздник", "позитив"]
};

const runeAffinities: Record<number, string[]> = {
  1: ["wealth", "success", "prosperity"],
  2: ["strength", "health", "power"],
  3: ["protection", "breakthrough", "defense"],
  4: ["wisdom", "communication", "learning"],
  5: ["journey", "progress", "movement"],
  6: ["creativity", "inspiration", "fire"],
  7: ["love", "partnership", "gift"],
  8: ["joy", "success", "happiness"],
  9: ["destruction", "ending", "cleansing"],
  10: ["patience", "waiting", "harvest"],
  11: ["intuition", "flow", "emotions"],
  12: ["patience", "sacrifice", "pause"],
  13: ["death", "transformation", "change"],
  14: ["protection", "defense", "shield"],
  15: ["sun", "success", "victory"],
  16: ["victory", "justice", "courage"],
  17: ["birth", "growth", "fertility"],
  18: ["riding", "control", "movement"],
  19: ["awakening", "revelation", "dawn"],
  20: ["heritage", "tradition", "family"],
  21: ["defense", "protection", "reflection"],
  22: ["completion", "wholeness", "inheritance"],
  23: ["breakthrough", "day", "clarity"],
  24: ["home", "family", "heritage"]
};

const categoryDescriptions: Record<string, string> = {
  wealth: "богатство и материальное процветание",
  love: "любовь и гармоничные отношения",
  health: "здоровье и восстановление сил",
  protection: "защиту и безопасность",
  success: "успех и достижение целей",
  wisdom: "мудрость и знания",
  change: "трансформацию и изменения",
  communication: "общение и понимание",
  creativity: "творчество и вдохновение",
  peace: "гармонию и покой",
  strength: "силу и выносливость",
  fertility: "плодородие и рост",
  victory: "победу и преодоление",
  journey: "путешествие и движение вперёд",
  joy: "радость и счастье"
};

export function analyzeIntention(intention: string, allRunes: Rune[]): IntentionAnalysis {
  if (!intention.trim()) {
    return {
      recommendedRunes: [],
      neutralRunes: allRunes.map(r => r.id),
      notRecommendedRunes: [],
      runeReasons: {}
    };
  }

  const lowerIntention = intention.toLowerCase();
  const detectedCategories: string[] = [];

  for (const [category, keywords] of Object.entries(intentionKeywords)) {
    for (const keyword of keywords) {
      if (lowerIntention.includes(keyword)) {
        detectedCategories.push(category);
        break;
      }
    }
  }

  if (detectedCategories.length === 0) {
    return {
      recommendedRunes: [],
      neutralRunes: allRunes.map(r => r.id),
      notRecommendedRunes: [],
      runeReasons: {}
    };
  }

  const runeScores: Record<number, number> = {};
  const runeReasons: Record<number, string> = {};
  
  allRunes.forEach(rune => {
    let score = 0;
    const reasons: string[] = [];
    const affinities = runeAffinities[rune.id] || [];
    
    affinities.forEach(affinity => {
      if (detectedCategories.includes(affinity)) {
        score += 2;
        const desc = categoryDescriptions[affinity];
        if (desc) {
          reasons.push(desc);
        }
      }
    });

    const matchedKeywords: string[] = [];
    for (const keyword of rune.keywords) {
      if (lowerIntention.includes(keyword.toLowerCase())) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      reasons.push(`ключевые качества: ${matchedKeywords.join(', ')}`);
    }

    if (rune.meaning && lowerIntention.includes(rune.meaning.toLowerCase().split(',')[0])) {
      score += 1;
      reasons.push(`прямое значение: ${rune.meaning.split(',')[0]}`);
    }

    runeScores[rune.id] = score;
    
    if (reasons.length > 0) {
      runeReasons[rune.id] = `Подходит для: ${reasons.slice(0, 2).join('; ')}`;
    } else {
      runeReasons[rune.id] = rune.meaning;
    }
  });

  const maxScore = Math.max(...Object.values(runeScores));
  
  const recommended: number[] = [];
  const neutral: number[] = [];
  const notRecommended: number[] = [];

  allRunes.forEach(rune => {
    const score = runeScores[rune.id];
    if (score >= maxScore * 0.6 && score > 0) {
      recommended.push(rune.id);
    } else if (score > 0) {
      neutral.push(rune.id);
    } else {
      notRecommended.push(rune.id);
    }
  });

  return {
    recommendedRunes: recommended,
    neutralRunes: neutral,
    notRecommendedRunes: notRecommended,
    runeReasons
  };
}