import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { elderFuthark, runesSpreads, type Rune, type RuneSpread } from "@/data/runes";
import { toast } from "sonner";

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
      text += `Ваши таланты (${runes[1].name}) связаны с энергией "${runes[1].element}". `;
      text += `Возможности (${runes[2].name}) ${runes[2].reversed ? "сейчас ограничены, наберитесь терпения" : "открываются перед вами"}. `;
      text += `Препятствие (${runes[3].name}) показывает область роста. `;
      text += `Путь к успеху (${runes[4].name}): следуйте своему внутреннему зову.`;
    } else if (spread.id === "health") {
      text += `Расклад на здоровье и энергию раскрывает ваше целостное состояние. `;
      text += `Физическое тело (${runes[0].name}) ${runes[0].reversed ? "нуждается в заботе и внимании" : "в гармонии"}. `;
      text += `Эмоции (${runes[1].name}) ${runes[1].reversed ? "требуют исцеления" : "в балансе"}. `;
      text += `Духовная энергия (${runes[2].name}) связана с элементом "${runes[2].element}". `;
      text += `Путь к исцелению (${runes[3].name}): слушайте своё тело и душу.`;
    }
    
    text += analyzeRuneCombinations(runes);
    
    setInterpretation(text);
  };

  const saveReading = () => {
    if (!selectedSpread || drawnRunes.length === 0) return;
    
    const newReading: SavedReading = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ru-RU'),
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

  const loadReading = (reading: SavedReading) => {
    setSelectedSpread(runesSpreads.find(s => s.name === reading.spreadName) || null);
    setDrawnRunes(reading.runes);
    setInterpretation(reading.interpretation);
    toast.success("Гадание загружено");
  };

  const resetSpread = () => {
    setSelectedSpread(null);
    setDrawnRunes([]);
    setInterpretation("");
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/2e33d6f7-c82f-4381-9f7c-b9898a4cd797.jpg)',
          filter: 'brightness(0.4)'
        }}
      />
      <div className="sacred-geometry fixed inset-0 opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl animate-glow-pulse">ᚠ</div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold rune-glow">
              Рунический Оракул
            </h1>
            <div className="text-6xl animate-glow-pulse">ᛟ</div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-cormorant">
            Древняя мудрость скандинавских рун
          </p>
        </header>

        <Tabs defaultValue="divination" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="divination" className="font-cinzel">
              <Icon name="Sparkles" className="mr-2 h-4 w-4" />
              Гадание
            </TabsTrigger>
            <TabsTrigger value="history" className="font-cinzel">
              <Icon name="History" className="mr-2 h-4 w-4" />
              История
            </TabsTrigger>
            <TabsTrigger value="handbook" className="font-cinzel">
              <Icon name="Book" className="mr-2 h-4 w-4" />
              Справочник
            </TabsTrigger>
            <TabsTrigger value="camera" className="font-cinzel">
              <Icon name="Camera" className="mr-2 h-4 w-4" />
              Камера
            </TabsTrigger>
          </TabsList>

          <TabsContent value="divination" className="space-y-8">
            {!selectedSpread ? (
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                {runesSpreads.map((spread) => (
                  <Card
                    key={spread.id}
                    className="p-6 hover:scale-105 transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                    onClick={() => drawRunes(spread)}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 text-primary animate-float">
                        {spread.positions === 1 ? "ᚱ" : 
                         spread.positions === 3 ? "ᚦᚱᛁ" : 
                         spread.id === "love" ? "♥️" :
                         spread.id === "career" ? "⚔️" :
                         spread.id === "health" ? "✨" :
                         spread.id === "nine" ? "🌳" : "✤"}
                      </div>
                      <h3 className="text-2xl font-cinzel font-bold mb-2">
                        {spread.name}
                      </h3>
                      <p className="text-muted-foreground font-cormorant mb-4">
                        {spread.description}
                      </p>
                      <div className="text-sm text-accent font-semibold">
                        {spread.positions} {spread.positions === 1 ? "руна" : spread.positions < 5 ? "руны" : "рун"}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {isDrawing ? (
                  <Card className="p-12 text-center bg-card/80 backdrop-blur">
                    <div className="text-6xl mb-4 animate-spin">ᚦ</div>
                    <p className="text-xl font-cinzel">Руны выбирают вас...</p>
                  </Card>
                ) : (
                  <>
                    <Card className="p-8 bg-card/80 backdrop-blur border-primary/30">
                      <h2 className="text-3xl font-cinzel font-bold mb-6 text-center">
                        {selectedSpread.name}
                      </h2>
                      
                      <div className={`grid gap-6 ${
                        drawnRunes.length === 1 
                          ? "grid-cols-1 max-w-xs mx-auto" 
                          : drawnRunes.length === 3 
                          ? "grid-cols-1 md:grid-cols-3" 
                          : drawnRunes.length === 4
                          ? "grid-cols-2 md:grid-cols-4"
                          : drawnRunes.length === 7
                          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                          : drawnRunes.length === 9
                          ? "grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
                          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                      }`}>
                        {drawnRunes.map((rune, index) => (
                          <div
                            key={index}
                            className="text-center space-y-3 animate-rune-flip"
                            style={{ animationDelay: `${index * 200}ms` }}
                          >
                            <div className={`text-7xl font-bold ${
                              rune.reversed ? "transform rotate-180" : ""
                            } rune-glow hover:scale-110 transition-transform`}>
                              {rune.symbol}
                            </div>
                            <div className="space-y-1">
                              <p className="font-cinzel font-semibold text-lg">
                                {rune.name}
                              </p>
                              <p className="text-sm text-muted-foreground font-cormorant">
                                {selectedSpread.positionMeanings[index]}
                              </p>
                              {rune.reversed && (
                                <p className="text-xs text-accent font-semibold">
                                  Перевёрнутая
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {interpretation && (
                      <Card className="p-8 bg-card/80 backdrop-blur border-primary/30">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="prose prose-invert max-w-none font-cormorant">
                            {interpretation.split('\n').map((line, i) => {
                              if (line.startsWith('## ')) {
                                return (
                                  <h2 key={i} className="font-cinzel text-3xl mb-4 text-primary">
                                    {line.replace('## ', '')}
                                  </h2>
                                );
                              } else if (line.startsWith('### ')) {
                                return (
                                  <h3 key={i} className="font-cinzel text-xl mt-6 mb-3">
                                    {line.replace('### ', '')}
                                  </h3>
                                );
                              } else if (line.trim()) {
                                return (
                                  <p key={i} className="mb-3 text-base leading-relaxed">
                                    {line}
                                  </p>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </ScrollArea>
                      </Card>
                    )}

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={saveReading}
                        size="lg"
                        className="font-cinzel wooden-button"
                      >
                        <Icon name="Save" className="mr-2 h-5 w-5" />
                        Сохранить гадание
                      </Button>
                      <Button
                        onClick={resetSpread}
                        size="lg"
                        className="font-cinzel wooden-button"
                      >
                        <Icon name="RotateCcw" className="mr-2 h-5 w-5" />
                        Новое гадание
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="handbook" className="animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
              <h2 className="text-3xl font-cinzel font-bold mb-6 text-center">
                Старший Футарк
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {elderFuthark.map((rune) => (
                  <Card
                    key={rune.id}
                    className="p-4 cursor-pointer hover:scale-105 transition-all hover:border-primary"
                    onClick={() => setSelectedRuneInfo(rune)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl rune-glow">{rune.symbol}</div>
                      <div>
                        <p className="font-cinzel font-bold text-lg">{rune.name}</p>
                        <p className="text-sm text-muted-foreground">{rune.meaning}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedRuneInfo && (
                <Card className="p-6 bg-secondary/50 border-primary">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="text-8xl rune-glow animate-float">
                      {selectedRuneInfo.symbol}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-cinzel font-bold mb-2">
                        {selectedRuneInfo.name}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        {selectedRuneInfo.meaning}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRuneInfo.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-cinzel font-bold text-lg mb-2 text-accent">
                        ⬆️ Прямое положение
                      </h4>
                      <p className="font-cormorant leading-relaxed">
                        {selectedRuneInfo.upright}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-cinzel font-bold text-lg mb-2 text-destructive">
                        ⬇️ Перевёрнутое положение
                      </h4>
                      <p className="font-cormorant leading-relaxed">
                        {selectedRuneInfo.reversed}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Элемент:</span> {selectedRuneInfo.element}
                    </p>
                  </div>
                </Card>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
              <h2 className="text-3xl font-cinzel font-bold mb-6 text-center">
                История гаданий
              </h2>
              
              {savedReadings.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="BookOpen" className="mx-auto h-24 w-24 mb-6 text-muted-foreground animate-float" />
                  <p className="text-lg text-muted-foreground font-cormorant">
                    У вас пока нет сохранённых гаданий
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {savedReadings.map((reading) => (
                      <Card 
                        key={reading.id} 
                        className="p-6 bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => loadReading(reading)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-cinzel font-bold text-primary mb-1">
                              {reading.spreadName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {reading.date}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteReading(reading.id);
                            }}
                          >
                            <Icon name="Trash2" className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          {reading.runes.map((rune, i) => (
                            <div 
                              key={i}
                              className={`text-3xl ${rune.reversed ? 'rotate-180' : ''}`}
                            >
                              {rune.symbol}
                            </div>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground font-cormorant line-clamp-2">
                          {reading.interpretation.replace(/##|###/g, '').substring(0, 150)}...
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="camera" className="animate-fade-in">
            <Card className="p-12 text-center bg-card/80 backdrop-blur border-primary/30">
              <Icon name="Camera" className="mx-auto h-24 w-24 mb-6 text-primary animate-float" />
              <h2 className="text-3xl font-cinzel font-bold mb-4">
                Распознавание рун
              </h2>
              <p className="text-lg text-muted-foreground font-cormorant mb-6 max-w-2xl mx-auto">
                Функция распознавания рун через камеру будет доступна в следующей версии. 
                Вы сможете сфотографировать физические руны, и AI автоматически определит их значение.
              </p>
              <Button size="lg" disabled className="font-cinzel wooden-button">
                <Icon name="Camera" className="mr-2 h-5 w-5" />
                Скоро
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}