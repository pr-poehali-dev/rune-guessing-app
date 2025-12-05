import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { type Rune } from "@/data/runes";

export interface CreatedRunestav {
  id: string;
  name: string;
  runes: Rune[];
  intention: string;
  description: string;
  date: string;
}

interface SavedRunestavsProps {
  savedRunestavs: CreatedRunestav[];
  viewingRunestav: CreatedRunestav | null;
  setViewingRunestav: (runestav: CreatedRunestav | null) => void;
  deleteRunestav: (id: string) => void;
  exportAsImage: (runestav: CreatedRunestav) => void;
}

export default function SavedRunestavs({
  savedRunestavs,
  viewingRunestav,
  setViewingRunestav,
  deleteRunestav,
  exportAsImage
}: SavedRunestavsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
        <h3 className="font-cinzel text-3xl font-bold mb-4 flex items-center gap-2">
          <Icon name="BookMarked" className="h-7 w-7" />
          Мои руноставы
        </h3>

        {savedRunestavs.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="BookOpen" className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-base text-muted-foreground font-cormorant">
              Здесь появятся ваши сохранённые руноставы
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {savedRunestavs.map((runestav) => (
                <div
                  key={runestav.id}
                  className="bg-card/50 rounded-lg p-5 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setViewingRunestav(runestav)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-cinzel font-semibold text-base pr-2">
                      {runestav.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRunestav(runestav.id);
                      }}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Icon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {runestav.runes.map((rune, i) => (
                      <span key={i} className="text-3xl rune-glow">
                        {rune.symbol}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {runestav.date}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      {viewingRunestav && (
        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30 mt-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-cinzel text-2xl font-bold">
              {viewingRunestav.name}
            </h3>
            <button
              onClick={() => setViewingRunestav(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-3 py-4">
              {viewingRunestav.runes.map((rune, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl rune-glow">{rune.symbol}</div>
                  <p className="text-sm text-muted-foreground mt-1">{rune.name}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h4 className="font-cinzel font-semibold text-base mb-2 flex items-center gap-2">
                <Icon name="Target" className="h-5 w-5" />
                Намерение
              </h4>
              <p className="text-base font-cormorant leading-relaxed">
                {viewingRunestav.intention}
              </p>
            </div>

            {viewingRunestav.description && (
              <div>
                <h4 className="font-cinzel font-semibold text-base mb-2 flex items-center gap-2">
                  <Icon name="FileText" className="h-5 w-5" />
                  Описание
                </h4>
                <p className="text-base font-cormorant leading-relaxed">
                  {viewingRunestav.description}
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Создан: {viewingRunestav.date}
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => exportAsImage(viewingRunestav)}
                variant="outline"
                className="flex-1 wooden-button font-cinzel"
              >
                <Icon name="Download" className="h-5 w-5 mr-2" />
                Экспортировать как изображение
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}