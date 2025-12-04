import { useState } from "react";
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

export default function Index() {
  const [selectedSpread, setSelectedSpread] = useState<RuneSpread | null>(null);
  const [drawnRunes, setDrawnRunes] = useState<DrawnRune[]>([]);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedRuneInfo, setSelectedRuneInfo] = useState<Rune | null>(null);

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

  const generateInterpretation = (runes: DrawnRune[], spread: RuneSpread) => {
    let text = `## ${spread.name}\n\n`;
    
    runes.forEach((rune, index) => {
      const position = spread.positionMeanings[index];
      const orientation = rune.reversed ? "перевёрнутое" : "прямое";
      const meaning = rune.reversed ? rune.reversed : rune.upright;
      
      text += `### ${position} — ${rune.name} ${rune.symbol} (${orientation})\n\n`;
      text += `${meaning}\n\n`;
    });
    
    text += `### 🔮 AI-интерпретация\n\n`;
    
    if (spread.id === "single") {
      const rune = runes[0];
      text += `Руна ${rune.name} ${rune.reversed ? "в перевёрнутом положении" : ""} отвечает на ваш вопрос прямо и ясно. `;
      text += rune.reversed 
        ? `Она предупреждает вас о возможных препятствиях и советует проявить осторожность. Сейчас важно не торопиться и внимательно оценить ситуацию.`
        : `Это благоприятный знак, указывающий на правильное направление. Доверьтесь своей интуиции и действуйте уверенно.`;
    } else if (spread.id === "three") {
      text += `Ваш рунический расклад показывает связь времён. `;
      text += `Прошлое (${runes[0].name}) заложило фундамент для текущей ситуации. `;
      text += `Настоящее (${runes[1].name}) требует вашего внимания и действий. `;
      text += `Будущее (${runes[2].name}) ${runes[2].reversed ? "предупреждает о необходимости изменить подход" : "обещает благоприятное развитие событий"}. `;
      text += `Используйте мудрость предков и доверьтесь потоку жизни.`;
    } else {
      text += `Рунический крест раскрывает глубинные аспекты вашей ситуации. `;
      text += `Суть вопроса (${runes[0].name}) определяет центральную тему. `;
      text += `Препятствия (${runes[1].name}) показывают, что нужно преодолеть. `;
      text += `Помощь (${runes[2].name}) указывает на ресурсы и поддержку. `;
      text += `Результат (${runes[3].name}) показывает возможный исход. `;
      text += `Основа (${runes[4].name}) раскрывает скрытые причины. `;
      text += `Доверьтесь древней мудрости рун и действуйте в гармонии с их советом.`;
    }
    
    setInterpretation(text);
  };

  const resetSpread = () => {
    setSelectedSpread(null);
    setDrawnRunes([]);
    setInterpretation("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="divination" className="font-cinzel">
              <Icon name="Sparkles" className="mr-2 h-4 w-4" />
              Гадание
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
                        {spread.positions === 1 ? "ᚱ" : spread.positions === 3 ? "ᚦᚱᛁ" : "✤"}
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

                    <div className="flex justify-center">
                      <Button
                        onClick={resetSpread}
                        size="lg"
                        className="font-cinzel"
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
              <Button size="lg" disabled className="font-cinzel">
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
