import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune } from "@/data/runes";

interface RuneSelectorProps {
  addRune: (rune: Rune) => void;
}

export default function RuneSelector({ addRune }: RuneSelectorProps) {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
      <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Grid3x3" className="h-6 w-6" />
        Elder Futhark
      </h3>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {elderFuthark.map((rune) => (
            <div
              key={rune.name}
              onClick={() => addRune(rune)}
              className="group p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:scale-105"
            >
              <div className="text-5xl text-center mb-2 rune-glow group-hover:scale-110 transition-transform">
                {rune.symbol}
              </div>
              <div className="text-center">
                <p className="font-cinzel font-semibold text-sm">
                  {rune.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {rune.element}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
