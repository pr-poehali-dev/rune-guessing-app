import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune } from "@/data/runes";
import { cn } from "@/lib/utils";

interface RuneSelectorProps {
  addRune: (rune: Rune) => void;
  recommendedRunes: number[];
  neutralRunes: number[];
  notRecommendedRunes: number[];
  runeReasons: Record<number, string>;
}

export default function RuneSelector({ 
  addRune, 
  recommendedRunes, 
  neutralRunes, 
  notRecommendedRunes,
  runeReasons
}: RuneSelectorProps) {
  const getRuneStatus = (runeId: number) => {
    if (recommendedRunes.includes(runeId)) return "recommended";
    if (notRecommendedRunes.includes(runeId)) return "not-recommended";
    return "neutral";
  };

  const hasAnalysis = recommendedRunes.length > 0 || notRecommendedRunes.length > 0;

  const sortedRunes = [...elderFuthark].sort((a, b) => {
    const statusA = getRuneStatus(a.id);
    const statusB = getRuneStatus(b.id);
    
    if (statusA === "recommended" && statusB !== "recommended") return -1;
    if (statusB === "recommended" && statusA !== "recommended") return 1;
    if (statusA === "not-recommended" && statusB !== "not-recommended") return 1;
    if (statusB === "not-recommended" && statusA !== "not-recommended") return -1;
    
    return 0;
  });

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cinzel text-3xl font-bold flex items-center gap-2">
            <Icon name="Grid3x3" className="h-7 w-7" />
            Elder Futhark
          </h3>
          {hasAnalysis && (
            <div className="flex gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-primary/30 border-2 border-primary"></div>
                <span className="text-muted-foreground">Подходит</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-muted/30"></div>
                <span className="text-muted-foreground">Не подходит</span>
              </div>
            </div>
          )}
        </div>

        {hasAnalysis && (
          <div className="mb-5 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="font-cormorant text-muted-foreground flex items-center gap-2 text-base leading-relaxed">
              <Icon name="Info" className="h-5 w-5 text-primary flex-shrink-0" />
              Подходящие руны отображаются в начале списка. Рекомендуется использовать 3-7 рун в руноставе.
            </p>
          </div>
        )}
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedRunes.map((rune) => {
              const status = getRuneStatus(rune.id);
              const isRecommended = status === "recommended";
              const isNotRecommended = status === "not-recommended";
              const reason = runeReasons[rune.id] || rune.meaning;

              return (
                <Tooltip key={rune.name}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => addRune(rune)}
                      className={cn(
                        "relative group p-5 bg-card/50 rounded-lg border cursor-pointer transition-all",
                        isRecommended && "border-primary/50 bg-primary/5 hover:border-primary hover:scale-105 shadow-lg shadow-primary/20",
                        isNotRecommended && "opacity-40 hover:opacity-60 border-border hover:border-border",
                        !isRecommended && !isNotRecommended && "border-border hover:border-primary/50 hover:scale-105"
                      )}
                    >
                      <div className={cn(
                        "text-6xl text-center mb-3 transition-transform",
                        isRecommended && "rune-glow group-hover:scale-110",
                        !isRecommended && "group-hover:scale-110"
                      )}>
                        {rune.symbol}
                      </div>
                      <div className="text-center">
                        <p className="font-cinzel font-semibold text-base">
                          {rune.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          {rune.element}
                        </p>
                      </div>
                      {isRecommended && (
                        <div className="absolute top-3 right-3">
                          <Icon name="Sparkles" className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-w-[320px] bg-card/95 backdrop-blur border-primary/30 font-cormorant"
                  >
                    <p className="text-base leading-relaxed">{reason}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </TooltipProvider>
  );
}