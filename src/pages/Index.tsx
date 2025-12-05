import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune, type RuneSpread } from "@/data/runes";
import { toast } from "sonner";
import SpreadSelector from "@/components/SpreadSelector";
import RuneResult from "@/components/RuneResult";
import SavedReadings from "@/components/SavedReadings";
import RuneLibrary from "@/components/RuneLibrary";

interface DrawnRune extends Rune {
  reversed: boolean;
}

interface SavedReading {
  id: string;
  date: string;
  spreadName: string;
  runes: DrawnRune[];
  interpretation: string;
}

export default function Index() {
  const [selectedSpread, setSelectedSpread] = useState<RuneSpread | null>(null);
  const [drawnRunes, setDrawnRunes] = useState<DrawnRune[]>([]);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedRuneInfo, setSelectedRuneInfo] = useState<Rune | null>(null);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('runeReadings');
    if (saved) {
      setSavedReadings(JSON.parse(saved));
    }
  }, []);

  const drawRunes = (spread: RuneSpread) => {
    setIsDrawing(true);
    setSelectedSpread(spread);
    
    setTimeout(() => {
      const drawn: DrawnRune[] = [];
      const usedIndices = new Set<number>();
      
      for (let i = 0; i < spread.positions; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * elderFuthark.length);
        } while (usedIndices.has(randomIndex));
        
        usedIndices.add(randomIndex);
        const rune = elderFuthark[randomIndex];
        const reversed = Math.random() > 0.5;
        
        drawn.push({ ...rune, reversed });
      }
      
      setDrawnRunes(drawn);
      generateInterpretation(drawn, spread);
      setIsDrawing(false);
      toast.success("Руны брошены");
    }, 1500);
  };

  const analyzeRuneCombinations = (runes: DrawnRune[]): string => {
    if (runes.length < 2) return "";
    
    const combinations: string[] = [];
    
    for (let i = 0; i < runes.length - 1; i++) {
      const r1 = runes[i];
      const r2 = runes[i + 1];
      
      if (r1.element === r2.element) {
        combinations.push(`Сочетание ${r1.name} и ${r2.name} усиливает энергию элемента "${r1.element}".`);
      }
      
      if ((r1.name === "Феху" && r2.name === "Вуньо") || (r1.name === "Вуньо" && r2.name === "Феху")) {
        combinations.push(`Феху + Вуньо: мощное сочетание для достижения радости через материальное благополучие.`);
      }
      
      if ((r1.name === "Ансуз" && r2.name === "Райдо") || (r1.name === "Райдо" && r2.name === "Ансуз")) {
        combinations.push(`Ансуз + Райдо: путешествие к мудрости, важные знания на пути.`);
      }
      
      if ((r1.name === "Альгиз" && r2.name === "Тейваз") || (r1.name === "Тейваз" && r2.name === "Альгиз")) {
        combinations.push(`Альгиз + Тейваз: божественная защита воина, победа под покровительством высших сил.`);
      }
    }
    
    return combinations.length > 0 ? `\n\n### ⚡ Важные сочетания\n\n${combinations.join(" ")}` : "";
  };

  const generateInterpretation = (runes: DrawnRune[], spread: RuneSpread) => {
    let text = `## ${spread.name}\n\n`;
    
    runes.forEach((rune, index) => {
      const position = spread.positionMeanings[index];
      const orientation = rune.reversed ? "перевёрнутое" : "прямое";
      const meaning = rune.reversed ? rune.reversed : rune.upright;
      
      text += `### ${position} — ${rune.name} ${rune.symbol} (${orientation})\n\n`;
      text += `${meaning}\n\n`;
    });
    
    text += `### 🔮 Углублённая интерпретация\n\n`;
    
    if (spread.id === "single") {
      const rune = runes[0];
      text += `Руна ${rune.name} ${rune.reversed ? "в перевёрнутом положении" : ""} отвечает на ваш вопрос через энергию элемента "${rune.element}". `;
      text += rune.reversed 
        ? `Перевёрнутое положение указывает на блокировку энергии и необходимость внутренней работы. Руны советуют: остановитесь, присмотритесь к ситуации с разных сторон. Ваш урок — принять теневые аспекты и трансформировать их.`
        : `Прямое положение говорит о свободном течении энергии. Вы находитесь в гармонии с потоком жизни. Руны одобряют ваши действия и призывают двигаться вперёд с уверенностью.`;
    } else if (spread.id === "three") {
      text += `Три норны — Урд, Верданди и Скульд — ткут нить вашей судьбы. `;
      text += `Прошлое, представленное руной ${runes[0].name}, несёт в себе кармический опыт — уроки, которые сформировали вас. `;
      text += `Настоящее (${runes[1].name}) — точка вашей силы, здесь и сейчас, где рождаются решения. ${runes[1].reversed ? "Перевёрнутое положение предупреждает: сейчас время не для действия, а для размышления." : "Энергия течёт свободно, действуйте смело."} `;
      text += `Будущее (${runes[2].name}) ${runes[2].reversed ? "в перевёрнутом виде говорит: если вы продолжите текущий путь, встретите препятствия. Измените подход." : "обещает реализацию задуманного. Доверьтесь процессу."}`;    
    } else if (spread.id === "cross") {
      text += `Рунический крест открывает пять измерений вашей ситуации. `;
      text += `Суть (${runes[0].name}) — это сердце вопроса, то, что действительно важно. `;
      text += `Препятствия (${runes[1].name}) раскрывают испытания, которые делают вас сильнее. `;
      text += `Помощь (${runes[2].name}) приходит из неожиданных источников — обратите внимание. `;
      text += `Результат (${runes[3].name}) ${runes[3].reversed ? "в перевёрнутом положении требует коррекции планов" : "показывает гармоничное завершение"}. `;
      text += `Основа (${runes[4].name}) открывает глубинные причины, корни ситуации.`;
    } else if (spread.id === "five") {
      text += `Пятирунный расклад раскрывает динамику вашей проблемы и пути её решения. `;
      text += `Центр вопроса (${runes[0].name}) определяет главную тему. `;
      text += `Прошлые влияния (${runes[1].name}) показывают карму, которую вы принесли в эту ситуацию. `;
      text += `Будущие тенденции (${runes[2].name}) раскрывают потенциал развития. `;
      text += `Совет рун (${runes[3].name}): ${runes[3].upright.split(".")[0]}. `;
      text += `Конечный результат (${runes[4].name}) зависит от ваших действий сейчас.`;
    } else if (spread.id === "seven") {
      text += `Семь рун открывают кармический узел вашей судьбы — уроки, которые вы пришли изучить в этой жизни. `;
      text += `Прошлое (${runes[0].name}), настоящее (${runes[1].name}), будущее (${runes[2].name}) формируют ось времени. `;
      text += `Ваша роль (${runes[3].name}) — ключ к пониманию того, какие качества вы развиваете. `;
      text += `Внешние силы (${runes[4].name}) влияют на вас, но не определяют исход. `;
      text += `Скрытые факторы (${runes[5].name}) раскрывают теневые аспекты. `;
      text += `Итоговый урок (${runes[6].name}) — то, что вы должны понять и интегрировать.`;
    } else if (spread.id === "nine") {
      text += `Девять миров Иггдрасиля открываются перед вами в этом шаманском раскладе. `;
      text += `В центре (${runes[0].name}) — вы, ваше текущее состояние, ядро ситуации. `;
      text += `Асгард (${runes[1].name}) показывает высшие цели. `;
      text += `Ванахейм (${runes[2].name}) — ваши ресурсы и благословения. `;
      text += `Льёссальвхейм (${runes[3].name}) приносит свет и помощь. `;
      text += `Йотунхейм (${runes[4].name}) открывает ваши испытания. `;
      text += `Муспельхейм (${runes[5].name}) дарует огонь и энергию для действий. `;
      text += `Нифльхейм (${runes[6].name}) показывает ваши страхи. `;
      text += `Свартальвхейм (${runes[7].name}) скрывает тайные знания. `;
      text += `Хель (${runes[8].name}) — итог, трансформация, которая ждёт.`;
    } else if (spread.id === "love") {
      text += `Расклад на любовь и отношения открывает динамику вашей связи. `;
      text += `Вы (${runes[0].name}) ${runes[0].reversed ? "в перевёрнутом положении блокируете любовь, откройте сердце" : "находитесь в гармонии с собой, готовы к любви"}. `;
      text += `Партнёр (${runes[1].name}) приносит энергию ${runes[1].element}. `;
      text += `Связь (${runes[2].name}) ${runes[2].reversed ? "нуждается в исцелении и внимании" : "сильна и гармонична"}. `;
      text += `Препятствия (${runes[3].name}) представляют уроки для роста. `;
      text += `Перспектива (${runes[4].name}): ${runes[4].reversed ? "отношения требуют переосмысления" : "вас ждёт глубокая связь и развитие"}.`;
    } else if (spread.id === "career") {
      text += `Расклад на карьеру показывает ваш профессиональный путь. `;
      text += `Текущая позиция (${runes[0].name}) ${runes[0].reversed ? "требует переоценки" : "стабильна"}. `;
      text += `Препятствия (${runes[1].name}) учат вас преодолевать профессиональные вызовы. `;
      text += `Возможности (${runes[2].name}) открывают новые перспективы. `;
      text += `Совет (${runes[3].name}): ${runes[3].upright.split(".")[0]}. `;
      text += `Перспектива (${runes[4].name}): ${runes[4].reversed ? "смените подход к карьере" : "ожидается успех и рост"}.`;
    }
    
    text += analyzeRuneCombinations(runes);
    
    text += `\n\n### 📿 Магический совет\n\n`;
    
    const hasReversed = runes.some(r => r.reversed);
    if (hasReversed) {
      text += `Перевёрнутые руны в вашем раскладе не предсказывают беду, а показывают области, требующие внимания и внутренней работы. `;
      text += `Это призыв к развитию теневых сторон личности. Медитируйте на перевёрнутые руны, принимайте их уроки. `;
    } else {
      text += `Все руны в прямом положении — знак гармонии и благоприятного потока энергии. `;
      text += `Вселенная поддерживает ваши намерения. Действуйте смело и уверенно. `;
    }
    
    const elements = runes.map(r => r.element);
    const elementCounts = elements.reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantElement = Object.entries(elementCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    
    if (dominantElement) {
      text += `\n\nВ вашем раскладе доминирует стихия "${dominantElement}". `;
      if (dominantElement === "Земля") {
        text += `Это время для материализации планов, практичности и терпения. Работайте с кристаллами, ходите босиком по земле.`;
      } else if (dominantElement === "Воздух") {
        text += `Это время для общения, обучения и новых идей. Практикуйте дыхательные практики, записывайте инсайты.`;
      } else if (dominantElement === "Огонь") {
        text += `Это время для действий, страсти и трансформации. Зажигайте свечи, медитируйте у огня.`;
      } else if (dominantElement === "Вода") {
        text += `Это время для эмоций, интуиции и исцеления. Принимайте ритуальные ванны, работайте с водой.`;
      } else if (dominantElement === "Лёд") {
        text += `Это время для паузы, размышлений и накопления сил. Медитируйте в тишине, практикуйте осознанность.`;
      }
    }
    
    setInterpretation(text);
  };

  const resetSpread = () => {
    setSelectedSpread(null);
    setDrawnRunes([]);
    setInterpretation("");
  };

  const saveReading = () => {
    if (!selectedSpread || drawnRunes.length === 0) return;
    
    const newReading: SavedReading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      spreadName: selectedSpread.name,
      runes: drawnRunes,
      interpretation: interpretation
    };
    
    const updated = [newReading, ...savedReadings];
    setSavedReadings(updated);
    localStorage.setItem('runeReadings', JSON.stringify(updated));
    toast.success("Гадание сохранено");
  };

  const deleteReading = (id: string) => {
    const updated = savedReadings.filter(r => r.id !== id);
    setSavedReadings(updated);
    localStorage.setItem('runeReadings', JSON.stringify(updated));
    toast.success("Гадание удалено");
  };

  const handleCameraUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.info("Функция распознавания рун в разработке");
    }
  };

  return (
    <div className="min-h-screen relative py-12 px-4">
      <div 
        className="fixed inset-0 bg-no-repeat bg-cover bg-center -z-10" 
        style={{ 
          backgroundImage: 'url("https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/e3d4fffd-f747-402d-8936-1d07cedffcdf.jpg")',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-white/5 via-transparent to-green-900/10 -z-10" />
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="text-center space-y-4 mb-12">
          <div className="inline-block px-8 py-4 rounded-2xl" style={{ background: 'linear-gradient(145deg, rgba(201, 169, 122, 0.4), rgba(139, 111, 71, 0.3))', backdropFilter: 'blur(12px)', border: '2px solid rgba(107, 89, 67, 0.5)' }}>
            <h1 className="text-5xl md:text-6xl font-black font-runic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in" style={{ letterSpacing: '0.08em' }}>
              Рунический Оракул
            </h1>
          </div>
          <div className="inline-block px-6 py-3 rounded-xl max-w-2xl mx-auto" style={{ background: 'linear-gradient(145deg, rgba(201, 169, 122, 0.4), rgba(139, 111, 71, 0.3))', backdropFilter: 'blur(12px)', border: '2px solid rgba(107, 89, 67, 0.5)' }}>
            <p className="font-cormorant text-amber-100 text-xl md:text-2xl font-extrabold drop-shadow-lg">Прикоснись к древней мудрости Старшего Футарка. Пусть Руны откроют путь к твоей судьбе.</p>
          </div>
        </header>

        <Tabs defaultValue="spreads" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 wooden-button">
            <TabsTrigger value="spreads" className="font-cinzel text-lg font-bold">
              <Icon name="Sparkles" className="mr-2 h-5 w-5" />
              Расклады
            </TabsTrigger>
            <TabsTrigger value="library" className="font-cinzel text-lg font-bold">
              <Icon name="BookOpen" className="mr-2 h-5 w-5" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="history" className="font-cinzel text-lg font-bold">
              <Icon name="History" className="mr-2 h-5 w-5" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spreads" className="space-y-6">
            {!selectedSpread ? (
              <>
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={handleCameraUpload}
                    size="lg"
                    className="wooden-button font-cinzel"
                  >
                    <Icon name="Camera" className="mr-2 h-5 w-5" />
                    Распознать расклад с камеры
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <SpreadSelector onSelectSpread={drawRunes} isDrawing={isDrawing} />
              </>
            ) : (
              <div className="space-y-6">
                {drawnRunes.length > 0 && (
                  <RuneResult
                    selectedSpread={selectedSpread}
                    drawnRunes={drawnRunes}
                    interpretation={interpretation}
                    onSave={saveReading}
                    onReset={resetSpread}
                  />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="library">
            <RuneLibrary 
              selectedRune={selectedRuneInfo} 
              onSelectRune={setSelectedRuneInfo} 
            />
          </TabsContent>

          <TabsContent value="history">
            <SavedReadings 
              readings={savedReadings} 
              onDelete={deleteReading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}