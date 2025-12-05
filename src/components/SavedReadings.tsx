import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import type { Rune } from "@/data/runes";

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

interface SavedReadingsProps {
  readings: SavedReading[];
  onDelete: (id: string) => void;
}

export default function SavedReadings({ readings, onDelete }: SavedReadingsProps) {
  if (readings.length === 0) {
    return (
      <Card className="p-12 text-center bg-card/80 backdrop-blur border-primary/30">
        <Icon name="BookOpen" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground font-cormorant text-lg">
          У вас пока нет сохранённых гаданий. Сделайте расклад и сохраните результат.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {readings.map((reading) => (
        <Card key={reading.id} className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-cinzel text-xl font-bold">{reading.spreadName}</h3>
              <p className="text-sm text-muted-foreground font-cormorant">
                {new Date(reading.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(reading.id)}
              className="text-destructive hover:text-destructive"
            >
              <Icon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-3 mb-4 flex-wrap">
            {reading.runes.map((rune, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-3xl font-bold ${
                  rune.reversed ? "transform rotate-180" : ""
                } rune-glow`}>
                  {rune.symbol}
                </div>
                <p className="text-xs font-cinzel mt-1">{rune.name}</p>
              </div>
            ))}
          </div>
          
          <ScrollArea className="h-[200px]">
            <div className="prose prose-invert prose-sm max-w-none font-cormorant">
              {reading.interpretation.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="font-cinzel text-xl mb-2 text-primary">
                      {line.replace('## ', '')}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className="font-cinzel text-base mt-4 mb-2">
                      {line.replace('### ', '')}
                    </h3>
                  );
                } else if (line.trim()) {
                  return (
                    <p key={i} className="mb-2 text-sm leading-relaxed">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </ScrollArea>
        </Card>
      ))}
    </div>
  );
}
