import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune } from "@/data/runes";
import { cn } from "@/lib/utils";

interface RuneSelectorProps {
  addRune: (rune: Rune) => void;
  recommendedRunes: number[];
  neutralRunes: number[];
  notRecommendedRunes: number[];
}

export default function RuneSelector({ 
  addRune, 
  recommendedRunes, 
  neutralRunes, 
  notRecommendedRunes 
}: RuneSelectorProps) {
  const getRuneStatus = (runeId: number) => {
    if (recommendedRunes.includes(runeId)) return "recommended";
    if (notRecommendedRunes.includes(runeId)) return "not-recommended";
    return "neutral";
  };

  const hasAnalysis = recommendedRunes.length > 0 || notRecommendedRunes.length > 0;

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-cinzel text-2xl font-bold flex items-center gap-2">
          <Icon name="Grid3x3" className="h-6 w-6" />
          Elder Futhark
        </h3>
        {hasAnalysis && (
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary/30 border-2 border-primary"></div>
              <span className="text-muted-foreground">Подходит</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted/30"></div>
              <span className="text-muted-foreground">Не подходит</span>
            </div>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {elderFuthark.map((rune) => {
            const status = getRuneStatus(rune.id);
            const isRecommended = status === "recommended";
            const isNotRecommended = status === "not-recommended";

            return (
              <div
                key={rune.name}
                onClick={() => addRune(rune)}
                className={cn(
                  "relative group p-4 bg-card/50 rounded-lg border cursor-pointer transition-all",
                  isRecommended && "border-primary/50 bg-primary/5 hover:border-primary hover:scale-105 shadow-lg shadow-primary/20",
                  isNotRecommended && "opacity-40 hover:opacity-60 border-border hover:border-border",
                  !isRecommended && !isNotRecommended && "border-border hover:border-primary/50 hover:scale-105"
                )}
              >
                <div className={cn(
                  "text-5xl text-center mb-2 transition-transform",
                  isRecommended && "rune-glow group-hover:scale-110",
                  !isRecommended && "group-hover:scale-110"
                )}>
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
                {isRecommended && (
                  <div className="absolute top-2 right-2">
                    <Icon name="Sparkles" className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}