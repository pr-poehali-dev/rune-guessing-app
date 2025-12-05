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
                  }`}
                >
                  {rune.symbol}
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
              <div className="text-8xl font-bold mb-4 rune-glow inline-block">
                {selectedRune.symbol}
              </div>
              <h2 className="font-cinzel text-3xl font-bold mb-2">
                {selectedRune.name}
              </h2>
              <p className="text-muted-foreground font-cormorant text-lg">
                Элемент: {selectedRune.element}
              </p>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-6 font-cormorant">
                <div>
                  <h3 className="font-cinzel text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="ArrowUp" className="h-5 w-5 text-green-500" />
                    Прямое положение
                  </h3>
                  <p className="leading-relaxed text-base">
                    {selectedRune.upright}
                  </p>
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
