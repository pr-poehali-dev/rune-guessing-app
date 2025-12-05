import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import type { Rune, RuneSpread } from "@/data/runes";

interface DrawnRune extends Rune {
  reversed: boolean;
}

interface RuneResultProps {
  selectedSpread: RuneSpread;
  drawnRunes: DrawnRune[];
  interpretation: string;
  onSave: () => void;
  onReset: () => void;
}

export default function RuneResult({ 
  selectedSpread, 
  drawnRunes, 
  interpretation, 
  onSave, 
  onReset 
}: RuneResultProps) {
  return (
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
          onClick={onSave}
          size="lg"
          className="font-cinzel wooden-button"
        >
          <Icon name="Save" className="mr-2 h-5 w-5" />
          Сохранить гадание
        </Button>
        <Button
          onClick={onReset}
          size="lg"
          className="font-cinzel wooden-button"
        >
          <Icon name="RotateCcw" className="mr-2 h-5 w-5" />
          Новое гадание
        </Button>
      </div>
    </>
  );
}
