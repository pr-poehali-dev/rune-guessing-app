import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { type Rune } from "@/data/runes";

interface RunestavFormProps {
  runestavName: string;
  setRunestavName: (name: string) => void;
  intention: string;
  setIntention: (intention: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedRunes: Rune[];
  removeRune: (index: number) => void;
  clearRunestav: () => void;
  saveRunestav: () => void;
  exportAsImage: () => void;
  compatibility: {
    warnings: string[];
    strengths: string[];
  } | null;
}

export default function RunestavForm({
  runestavName,
  setRunestavName,
  intention,
  setIntention,
  description,
  setDescription,
  selectedRunes,
  removeRune,
  clearRunestav,
  saveRunestav,
  exportAsImage,
  compatibility
}: RunestavFormProps) {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
      <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">Создание руностава</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-cinzel font-semibold mb-2">
            Название рунослава
          </label>
          <Input
            value={runestavName}
            onChange={(e) => setRunestavName(e.target.value)}
            placeholder="Например: Руностав на процветание"
            className="bg-card/50"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel font-semibold mb-2">
            Намерение (цель рунослава)
          </label>
          <Textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Чётко опишите, для чего создаётся этот руностав..."
            className="bg-card/50 min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel font-semibold mb-2">
            Описание (необязательно)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Дополнительные заметки о руноставе..."
            className="bg-card/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-cinzel font-semibold">
              Выбранные руны ({selectedRunes.length}/9)
            </label>
            {selectedRunes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRunestav}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="Trash2" className="h-4 w-4 mr-1" />
                Очистить
              </Button>
            )}
          </div>

          <div className="mb-3 p-2 bg-muted/30 rounded-md">
            <p className="text-xs font-cormorant text-muted-foreground flex items-center gap-1.5">
              <Icon name="Lightbulb" className="h-3.5 w-3.5" />
              {selectedRunes.length === 0 && "Начните с выбора 3-7 рун для создания сбалансированного рунослава"}
              {selectedRunes.length === 1 && "Добавьте ещё 2-6 рун для усиления формулы"}
              {selectedRunes.length === 2 && "Добавьте ещё 1-5 рун для завершения композиции"}
              {selectedRunes.length >= 3 && selectedRunes.length <= 7 && "Оптимальное количество рун для мощного рунослава"}
              {selectedRunes.length === 8 && "Ещё одна руна — и формула достигнет максимума"}
              {selectedRunes.length === 9 && "Максимальное количество рун достигнуто"}
            </p>
          </div>
          
          {selectedRunes.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Icon name="Plus" className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-cormorant">
                Выберите руны из списка ниже
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 p-4 bg-card/50 rounded-lg border border-border">
              {selectedRunes.map((rune, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => removeRune(index)}
                  title={`${rune.name} - нажмите для удаления`}
                >
                  <div className="text-4xl rune-glow">{rune.symbol}</div>
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="X" className="h-4 w-4 text-destructive bg-card rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {compatibility && (
          <div className="space-y-3">
            {compatibility.warnings.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <p className="font-cinzel font-semibold text-sm mb-2 flex items-center gap-2">
                  <Icon name="AlertTriangle" className="h-4 w-4" />
                  Возможные конфликты
                </p>
                {compatibility.warnings.map((warning, i) => (
                  <p key={i} className="text-xs font-cormorant text-muted-foreground">
                    • {warning}
                  </p>
                ))}
              </div>
            )}

            {compatibility.strengths.length > 0 && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="font-cinzel font-semibold text-sm mb-2 flex items-center gap-2">
                  <Icon name="Sparkles" className="h-4 w-4" />
                  Сильные стороны формулы
                </p>
                {compatibility.strengths.map((strength, i) => (
                  <p key={i} className="text-xs font-cormorant text-muted-foreground">
                    • {strength}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={saveRunestav}
            size="lg"
            disabled={selectedRunes.length === 0}
            className="flex-1 wooden-button font-cinzel"
          >
            <Icon name="Save" className="mr-2 h-5 w-5" />
            Сохранить руностав
          </Button>
          <Button
            onClick={clearRunestav}
            size="lg"
            variant="outline"
            className="wooden-button font-cinzel"
          >
            <Icon name="RotateCcw" className="mr-2 h-5 w-5" />
            Начать заново
          </Button>
          <Button
            onClick={() => exportAsImage()}
            size="lg"
            variant="outline"
            disabled={selectedRunes.length === 0}
            className="wooden-button font-cinzel"
          >
            <Icon name="Download" className="h-5 w-5 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>
    </Card>
  );
}