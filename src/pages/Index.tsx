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
import RuneTalismans from "@/components/RuneTalismans";
import RunestavCreator from "@/components/RunestavCreator";
import ManualSpreadSelector from "@/components/ManualSpreadSelector";


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
  const [isManualMode, setIsManualMode] = useState(false);

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
    
    if (combinations.length === 0) return "";
    
    return `\n\nВ вашем раскладе обнаружены важные сочетания рун: ${combinations.join(" ")}`;
  };

  const translateElement = (element: string): string => {
    const translations: Record<string, string> = {
      'fire': 'огонь',
      'earth': 'земля',
      'air': 'воздух',
      'water': 'вода',
      'ice': 'лёд',
      'огонь': 'огонь',
      'земля': 'земля',
      'воздух': 'воздух',
      'вода': 'вода',
      'лёд': 'лёд'
    };
    return translations[element.toLowerCase()] || element;
  };

  const getRuneText = (drawnRune: DrawnRune): string => {
    if (drawnRune.name === "Вирд") {
      return "Пустая руна символизирует судьбу, которая ещё не написана. Здесь начинается область божественной тайны.";
    }
    const runeData = elderFuthark.find(r => r.id === drawnRune.id)!;
    return drawnRune.reversed ? runeData.reversed : runeData.upright;
  };

  const generateInterpretation = (runes: DrawnRune[], spread: RuneSpread) => {
    let text = '';
    
    const hasOdinRune = runes.some(r => r.name === "Вирд");
    
    if (hasOdinRune) {
      text += `✦ Руна Вирд в вашем раскладе ✦\n\n`;
      text += `Появление пустой руны — знак Всеотца, повелителя рун и провидца. Это не просто символ неизвестности, это приглашение довериться высшим силам. `;
      text += `Один говорит: "То, что скрыто от глаз, уже движется в твою сторону. Судьба не требует знания — она требует веры." `;
      text += `Пустая руна указывает на поворотную точку, где старые способы понимания уже не работают. Это момент абсолютной трансформации.\n\n`;
      text += `🔮 Медитация: Сядьте в тишине и представьте пустоту — не как отсутствие, а как пространство бесконечных возможностей. Что вы чувствуете? Это и есть ответ рун.\n\n`;
    }
    
    if (spread.id === "one-rune") {
      const rune = runes[0];
      
      if (rune.name === "Вирд") {
        text += `Вы задали вопрос, но руны молчат — и это самый мощный ответ. `;
        text += `Пустая руна говорит: ваш вопрос превосходит рамки предсказаний. Это вопрос кармический, судьбоносный. `;
        text += `Ответ придёт не через логику или знаки, а через опыт. Живите, наблюдайте, доверяйте процессу. `;
        text += `\n\nСейчас не время искать определённости. Сейчас время для принятия неизвестности как части пути. `;
        text += `Один требует от вас мужества отпустить контроль и позволить судьбе вести вас.`;
        return setInterpretation(text);
      }
      
      const runeData = elderFuthark.find(r => r.id === rune.id)!;
      const position = spread.positionMeanings[0];
      text += `${position} представлена руной ${rune.name} ${rune.symbol}. `;
      text += rune.reversed 
        ? `В перевёрнутом положении ${rune.name} говорит: ${runeData.reversed} `
        : `В прямом положении ${rune.name} объясняет: ${runeData.upright} `;
      text += `\n\nЭта руна отвечает на ваш вопрос через энергию элемента "${translateElement(runeData.element)}". `;
      text += rune.reversed 
        ? `Перевёрнутое положение указывает на блокировку энергии и необходимость внутренней работы. Руны советуют: остановитесь, присмотритесь к ситуации с разных сторон. Ваш урок — принять теневые аспекты и трансформировать их.`
        : `Прямое положение говорит о свободном течении энергии. Вы находитесь в гармонии с потоком жизни. Руны одобряют ваши действия и призывают двигаться вперёд с уверенностью.`;
    } else if (spread.id === "three-norns") {
      const rune0 = elderFuthark.find(r => r.id === runes[0].id)!;
      const rune1 = elderFuthark.find(r => r.id === runes[1].id)!;
      const rune2 = elderFuthark.find(r => r.id === runes[2].id)!;
      
      text += `${spread.positionMeanings[0]} представлено руной ${runes[0].name} ${runes[0].symbol}. `;
      text += runes[0].reversed 
        ? `В перевёрнутом положении это говорит о том, что ${rune0.reversed} `
        : `Это означает, что ${rune0.upright} `;
      
      text += `\n\n${spread.positionMeanings[1]} показывает руна ${runes[1].name} ${runes[1].symbol}. `;
      text += runes[1].reversed 
        ? `${rune1.reversed} Перевёрнутое положение предупреждает: сейчас время не для действия, а для размышления. `
        : `${rune1.upright} Энергия течёт свободно, действуйте смело. `;
      
      text += `\n\n${spread.positionMeanings[2]} раскрывает руна ${runes[2].name} ${runes[2].symbol}. `;
      text += runes[2].reversed 
        ? `${rune2.reversed} Если вы продолжите текущий путь, встретите препятствия. Измените подход.`
        : `${rune2.upright} Доверьтесь процессу.`;
      
      text += `\n\nТри норны — Урд, Верданди и Скульд — ткут нить вашей судьбы, соединяя прошлое, настоящее и будущее в единый узор судьбы.`;    
    } else if (spread.id === "runic-cross") {
      for (let i = 0; i < 5; i++) {
        text += `${spread.positionMeanings[i]} представлена руной ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 4 ? `\n\n` : '';
      }
      text += `\n\nРунический крест открывает пять измерений вашей ситуации, показывая суть вопроса, препятствия на пути, источники помощи, возможный результат и глубинные причины происходящего.`;
    } else if (spread.id === "five-runes") {
      for (let i = 0; i < 5; i++) {
        text += `${spread.positionMeanings[i]} показывает руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 4 ? `\n\n` : '';
      }
      text += `\n\nПятирунный расклад раскрывает динамику вашей проблемы, показывая центр вопроса, влияния прошлого, возможности будущего, совет рун и потенциальный результат.`;
    } else if (spread.id === "seven-runes") {
      for (let i = 0; i < 7; i++) {
        text += `${spread.positionMeanings[i]} открывает руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 6 ? `\n\n` : '';
      }
      text += `\n\nСемь рун открывают кармический узел вашей судьбы — уроки, которые вы пришли изучить в этой жизни. Прошлое, настоящее и будущее формируют ось времени, а ваша роль, внешние силы, скрытые факторы и итоговый урок показывают полную картину вашего духовного пути.`;
    } else if (spread.id === "nine-worlds") {
      for (let i = 0; i < 9; i++) {
        text += `${spread.positionMeanings[i]} представляет руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 8 ? `\n\n` : '';
      }
      text += `\n\nДевять миров Иггдрасиля открываются перед вами в этом шаманском раскладе. Каждый мир представляет свой аспект вашей ситуации: от высших целей и ресурсов до страхов и тайных знаний, завершаясь окончательной трансформацией.`;
    } else if (spread.id === "love-relations") {
      for (let i = 0; i < 5; i++) {
        text += `${spread.positionMeanings[i]} показывает руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 4 ? `\n\n` : '';
      }
      text += `\n\nРасклад на любовь и отношения открывает динамику вашей связи, показывая ваше состояние, энергию партнёра, характер связи, препятствия и перспективы развития отношений.`;
    } else if (spread.id === "career-calling") {
      for (let i = 0; i < 5; i++) {
        text += `${spread.positionMeanings[i]} открывает руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 4 ? `\n\n` : '';
      }
      text += `\n\nРасклад на карьеру показывает ваш профессиональный путь: текущую позицию, препятствия, новые возможности, совет рун и перспективы развития в профессиональной сфере.`;
    } else if (spread.id === "shamanic-throw") {
      for (let i = 0; i < 3; i++) {
        text += `${spread.positionMeanings[i]} представляет руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 2 ? `\n\n` : '';
      }
      text += `\n\nШаманский бросок — древнейший способ общения с духами рун. Эти три руны работают вместе, создавая целостную картину вашего состояния: тело раскрывает материальные обстоятельства, душа — эмоциональное состояние, а дух — высший духовный смысл.`;
    } else if (spread.id === "thors-hammer") {
      for (let i = 0; i < 5; i++) {
        text += `${spread.positionMeanings[i]} представляет руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 4 ? `\n\n` : '';
      }
      text += `\n\nМолот Тора — мощный защитный расклад для преодоления препятствий. Он показывает вашу внутреннюю силу (рукоять), что ослабляет вас (левая сторона), что усиливает (правая сторона), решающее действие (головка молота) и итоговый результат.`;
    } else if (spread.id === "celtic-cross") {
      for (let i = 0; i < 10; i++) {
        text += `${spread.positionMeanings[i]} представлена руной ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 9 ? `\n\n` : '';
      }
      text += `\n\nКельтский крест — самый глубокий и детальный расклад, раскрывающий все аспекты ситуации: суть вопроса, влияния, основу, прошлое, возможное будущее, вашу позицию, внешние факторы, надежды, страхи и итоговый результат.`;
    } else if (spread.id === "personal-growth") {
      for (let i = 0; i < 6; i++) {
        text += `${spread.positionMeanings[i]} открывает руна ${runes[i].name} ${runes[i].symbol}. `;
        text += getRuneText(runes[i]);
        text += i < 5 ? `\n\n` : '';
      }
      text += `\n\nРасклад личностного роста ведет вас к целостности и самопознанию. Он показывает ваше текущее состояние, теневые аспекты, которые нужно принять, светлые качества для развития, урок момента, инструменты для роста и ваш полный потенциал.`;
    }
    
    text += analyzeRuneCombinations(runes);
    
    text += `\n\n`;
    
    if (hasOdinRune) {
      const odinCount = runes.filter(r => r.name === "Вирд").length;
      if (odinCount === 1) {
        text += `Одна пустая руна среди других — это точка трансформации в вашем раскладе. `;
        text += `Там, где появляется руна Вирд, обычные законы предсказаний не работают. Это область божественного вмешательства, кармических узлов и судьбоносных поворотов. `;
        text += `Другие руны показывают путь, но пустая руна напоминает: финальное слово всегда остаётся за высшими силами.\n\n`;
      } else {
        text += `${odinCount} пустых руны — редкий и мощный знак! `;
        text += `Вы находитесь в точке абсолютной неопределённости, но именно здесь рождаются величайшие трансформации. `;
        text += `Один говорит: "Доверься мне полностью. То, что я скрываю, превосходит твоё воображение." `;
        text += `Это момент глубокой кармической перезагрузки. Отпустите все ожидания и позвольте судьбе развернуться.\n\n`;
      }
    }
    
    const hasReversed = runes.some(r => r.reversed);
    if (hasReversed) {
      text += `Перевёрнутые руны в вашем раскладе не предсказывают беду, а показывают области, требующие внимания и внутренней работы. `;
      text += `Это призыв к развитию теневых сторон личности. Медитируйте на перевёрнутые руны, принимайте их уроки. `;
    } else if (!hasOdinRune) {
      text += `Все руны в прямом положении — знак гармонии и благоприятного потока энергии. `;
      text += `Вселенная поддерживает ваши намерения. Действуйте смело и уверенно. `;
    }
    
    const elements = runes.filter(r => r.name !== "Вирд").map(r => translateElement(r.element));
    const elementCounts = elements.reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantElement = Object.entries(elementCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    
    if (dominantElement) {
      text += `\n\nВ вашем раскладе доминирует стихия "${dominantElement}". `;
      if (dominantElement === "земля") {
        text += `Это время для материализации планов, практичности и терпения. Работайте с кристаллами, ходите босиком по земле.`;
      } else if (dominantElement === "воздух") {
        text += `Это время для общения, обучения и новых идей. Практикуйте дыхательные практики, записывайте инсайты.`;
      } else if (dominantElement === "огонь") {
        text += `Это время для действий, страсти и трансформации. Зажигайте свечи, медитируйте у огня.`;
      } else if (dominantElement === "вода") {
        text += `Это время для эмоций, интуиции и исцеления. Принимайте ритуальные ванны, работайте с водой.`;
      } else if (dominantElement === "лёд") {
        text += `Это время для паузы, размышлений и накопления сил. Медитируйте в тишине, практикуйте осознанность.`;
      }
    }
    
    setInterpretation(text);
  };

  const resetSpread = () => {
    setSelectedSpread(null);
    setDrawnRunes([]);
    setInterpretation("");
    setIsManualMode(false);
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

  const handleManualComplete = (spread: RuneSpread, runes: DrawnRune[]) => {
    setSelectedSpread(spread);
    setDrawnRunes(runes);
    generateInterpretation(spread, runes);
    setIsManualMode(false);
  };

  return (
    <div className="min-h-screen relative py-12 mx-[712px] my-[9px] px-11 rounded-none">
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
            <h1 className="text-[6rem] md:text-[8rem] font-black font-runic animate-gradient-text animate-fade-in" style={{ letterSpacing: '0.08em' }}>
              Рунический Оракул
            </h1>
          </div>
          <div className="inline-block px-6 py-3 rounded-xl max-w-2xl mx-auto" style={{ background: 'linear-gradient(145deg, rgba(201, 169, 122, 0.4), rgba(139, 111, 71, 0.3))', backdropFilter: 'blur(12px)', border: '2px solid rgba(107, 89, 67, 0.5)' }}>
            <p className="font-cormorant text-amber-100 text-xl md:text-2xl font-extrabold drop-shadow-lg">Прикоснись к древней мудрости Старшего Футарка. Пусть Руны откроют путь к твоей судьбе.</p>
          </div>
        </header>

        <Tabs defaultValue="spreads" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 wooden-button h-14">
            <TabsTrigger value="spreads" className="font-cinzel text-xl font-bold">
              <Icon name="Sparkles" className="mr-2 h-6 w-6" />
              Расклады
            </TabsTrigger>
            <TabsTrigger value="library" className="font-cinzel text-xl font-bold">
              <Icon name="BookOpen" className="mr-2 h-6 w-6" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="talismans" className="font-cinzel text-xl font-bold">
              <Icon name="Sparkles" className="mr-2 h-6 w-6" />
              Талисманы
            </TabsTrigger>
            <TabsTrigger value="creator" className="font-cinzel text-xl font-bold">
              <Icon name="Wand2" className="mr-2 h-6 w-6" />
              Руноставы
            </TabsTrigger>
            <TabsTrigger value="history" className="font-cinzel text-xl font-bold">
              <Icon name="History" className="mr-2 h-6 w-6" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spreads" className="space-y-6">
            {!selectedSpread ? (
              <>
                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    onClick={handleCameraUpload}
                    size="lg"
                    className="wooden-button font-cinzel"
                  >
                    <Icon name="Camera" className="mr-2 h-5 w-5" />
                    Распознать расклад с камеры
                  </Button>
                  <Button
                    onClick={() => setIsManualMode(!isManualMode)}
                    size="lg"
                    className="wooden-button font-cinzel"
                    variant={isManualMode ? "default" : "outline"}
                  >
                    <Icon name="Hand" className="mr-2 h-5 w-5" />
                    Самостоятельный расклад
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
                {isManualMode ? (
                  <ManualSpreadSelector onComplete={handleManualComplete} />
                ) : (
                  <SpreadSelector onSelectSpread={drawRunes} isDrawing={isDrawing} />
                )}
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

          <TabsContent value="talismans">
            <RuneTalismans />
          </TabsContent>

          <TabsContent value="creator">
            <RunestavCreator />
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