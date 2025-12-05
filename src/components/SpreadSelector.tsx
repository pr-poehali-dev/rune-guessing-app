import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { runesSpreads, type RuneSpread } from "@/data/runes";

interface SpreadSelectorProps {
  onSelectSpread: (spread: RuneSpread) => void;
  isDrawing: boolean;
}

export default function SpreadSelector({ onSelectSpread, isDrawing }: SpreadSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {runesSpreads.map((spread) => (
        <Card 
          key={spread.id} 
          className="wooden-card p-6 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => !isDrawing && onSelectSpread(spread)}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0 rune-glow">
              {spread.icon}
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="wooden-card-title text-xl font-cinzel">
                {spread.name}
              </h3>
              <p className="wooden-card-text text-sm font-cormorant leading-relaxed">
                {spread.description}
              </p>
              <div className="flex items-center gap-2 text-xs wooden-card-text pt-2">
                <Icon name="Sparkles" className="h-3 w-3" />
                <span>{spread.positions} {spread.positions === 1 ? 'руна' : spread.positions < 5 ? 'руны' : 'рун'}</span>
              </div>
            </div>
          </div>
          <Button 
            className="w-full mt-4 wooden-button font-cinzel"
            disabled={isDrawing}
          >
            {isDrawing ? "Бросаем руны..." : "Выбрать расклад"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
