import { Card } from "@/components/ui/card";
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
          className="wooden-card p-6 hover:scale-105 transition-all cursor-pointer group"
          onClick={() => !isDrawing && onSelectSpread(spread)}
        >
          <div className="text-center space-y-4">
            <div className="mb-4 flex justify-center">
              <span className="rune-glow rune-rotate">
                {spread.icon}
              </span>
            </div>
            <h3 className="wooden-card-title font-cinzel text-4xl">
              {spread.name}
            </h3>
            <p className="wooden-card-text font-cormorant leading-relaxed min-h-[3rem] text-xl my-[5px] font-extrabold">
              {spread.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs wooden-card-text pt-2 border-t border-amber-900/30">
              <Icon name="Sparkles" className="h-4 w-4" />
              <span className="font-semibold text-4xl">{spread.positions} {spread.positions === 1 ? 'руна' : spread.positions < 5 ? 'руны' : 'рун'}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}