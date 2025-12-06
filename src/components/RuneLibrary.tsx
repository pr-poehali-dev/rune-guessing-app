import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune } from "@/data/runes";

interface RuneLibraryProps {
  selectedRune: Rune | null;
  onSelectRune: (rune: Rune) => void;
}

export default function RuneLibrary({ selectedRune, onSelectRune }: RuneLibraryProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <h3 className="font-cinzel text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="BookOpen" className="h-5 w-5" />
            Старший Футарк
          </h3>
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-4 gap-3">
              {elderFuthark.map((rune) => (
                <button
                  key={rune.name}
                  onClick={() => onSelectRune(rune)}
                  className={`text-4xl p-3 rounded-lg transition-all rune-glow hover:scale-110 ${
                    selectedRune?.name === rune.name 
                      ? "bg-primary/20 ring-2 ring-primary" 
                      : "hover:bg-card"
                  } ${
                    rune.name === "Вирд" 
                      ? "bg-purple-950/30 border border-purple-600/30" 
                      : ""
                  }`}
                >
                  {rune.name === "Вирд" ? <span className="text-purple-200">∅</span> : rune.symbol}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {selectedRune ? (
          <Card className="p-8 bg-card/80 backdrop-blur border-primary/30">
            <div className="text-center mb-6">
              <div className={`text-8xl font-bold mb-4 rune-glow inline-block ${
                selectedRune.name === "Вирд" ? "text-purple-200" : ""
              }`}>
                {selectedRune.name === "Вирд" ? "∅" : selectedRune.symbol}
              </div>
              <h2 className="font-cinzel text-3xl font-bold mb-2">
                {selectedRune.name}
              </h2>
              <p className="text-muted-foreground font-cormorant text-lg mb-2">
                {selectedRune.meaning}
              </p>
              <p className="text-sm text-accent">
                Элемент: {selectedRune.element}
              </p>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="space-y-6 font-cormorant pr-4">
                {selectedRune.karmicLesson && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-cinzel text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Sparkles" className="h-5 w-5 text-primary" />
                      Кармический урок
                    </h3>
                    <p className="leading-relaxed text-base">
                      {selectedRune.karmicLesson}
                    </p>
                  </div>
                )}

                {selectedRune.energy && (
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                    <h3 className="font-cinzel text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Zap" className="h-5 w-5 text-accent" />
                      Энергия руны
                    </h3>
                    <p className="leading-relaxed text-base">
                      {selectedRune.energy}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-cinzel text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="ArrowUp" className="h-5 w-5 text-green-500" />
                    Прямое положение
                  </h3>
                  <p className="leading-relaxed text-base mb-3">
                    {selectedRune.upright}
                  </p>
                  {selectedRune.yesNo && (
                    <p className="text-sm text-green-600 font-semibold">
                      Да/Нет: {selectedRune.yesNo}
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-cinzel text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="ArrowDown" className="h-5 w-5 text-amber-500" />
                    Перевёрнутое положение
                  </h3>
                  <p className="leading-relaxed text-base">
                    {selectedRune.reversed}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedRune.events && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Calendar" className="h-4 w-4" />
                        События
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.events}
                      </p>
                    </div>
                  )}

                  {selectedRune.personality && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="User" className="h-4 w-4" />
                        Личность
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.personality}
                      </p>
                    </div>
                  )}

                  {selectedRune.health && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Heart" className="h-4 w-4" />
                        Здоровье
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.health}
                      </p>
                    </div>
                  )}

                  {selectedRune.relationships && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Heart" className="h-4 w-4" />
                        Отношения
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.relationships}
                      </p>
                    </div>
                  )}

                  {selectedRune.work && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Briefcase" className="h-4 w-4" />
                        Работа
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.work}
                      </p>
                    </div>
                  )}

                  {selectedRune.advice && (
                    <div className="bg-card/50 p-3 rounded-lg">
                      <h4 className="font-cinzel text-sm font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Lightbulb" className="h-4 w-4" />
                        Совет
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {selectedRune.advice}
                      </p>
                    </div>
                  )}
                </div>

                {selectedRune.warning && (
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/30">
                    <h3 className="font-cinzel text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="AlertTriangle" className="h-5 w-5 text-destructive" />
                      Предупреждение
                    </h3>
                    <p className="leading-relaxed text-base">
                      {selectedRune.warning}
                    </p>
                  </div>
                )}

                {selectedRune.typicalQuestions && selectedRune.typicalQuestions.length > 0 && (
                  <div className="bg-card/30 p-4 rounded-lg">
                    <h3 className="font-cinzel text-lg font-semibold mb-3 flex items-center gap-2">
                      <Icon name="MessageCircle" className="h-5 w-5" />
                      Типичные вопросы к руне
                    </h3>
                    <ul className="space-y-2">
                      {selectedRune.typicalQuestions.map((question, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-sm leading-relaxed">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-cinzel text-sm font-semibold mb-2 text-muted-foreground">
                    Ключевые слова
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRune.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <Card className="p-12 text-center bg-card/80 backdrop-blur border-primary/30">
            <Icon name="Hand" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-cormorant text-lg">
              Выберите руну, чтобы узнать её значение
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}