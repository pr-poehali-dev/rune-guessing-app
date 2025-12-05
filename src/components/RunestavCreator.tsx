import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune } from "@/data/runes";
import { toast } from "sonner";

interface CreatedRunestav {
  id: string;
  name: string;
  runes: Rune[];
  intention: string;
  description: string;
  date: string;
}

export default function RunestavCreator() {
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [runestavName, setRunestavName] = useState("");
  const [intention, setIntention] = useState("");
  const [description, setDescription] = useState("");
  const [savedRunestavs, setSavedRunestavs] = useState<CreatedRunestav[]>(() => {
    const saved = localStorage.getItem('createdRunestavs');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingRunestav, setViewingRunestav] = useState<CreatedRunestav | null>(null);

  const addRune = (rune: Rune) => {
    if (selectedRunes.length >= 9) {
      toast.error("Максимум 9 рун в руноставе");
      return;
    }
    setSelectedRunes([...selectedRunes, rune]);
    toast.success(`Добавлена руна ${rune.name}`);
  };

  const removeRune = (index: number) => {
    setSelectedRunes(selectedRunes.filter((_, i) => i !== index));
  };

  const clearRunestav = () => {
    setSelectedRunes([]);
    setRunestavName("");
    setIntention("");
    setDescription("");
    toast.info("Руностав очищен");
  };

  const saveRunestav = () => {
    if (selectedRunes.length === 0) {
      toast.error("Выберите хотя бы одну руну");
      return;
    }
    if (!runestavName.trim()) {
      toast.error("Введите название рунстава");
      return;
    }
    if (!intention.trim()) {
      toast.error("Опишите намерение рунослава");
      return;
    }

    const newRunestav: CreatedRunestav = {
      id: Date.now().toString(),
      name: runestavName,
      runes: selectedRunes,
      intention: intention,
      description: description,
      date: new Date().toLocaleString('ru-RU')
    };

    const updated = [newRunestav, ...savedRunestavs];
    setSavedRunestavs(updated);
    localStorage.setItem('createdRunestavs', JSON.stringify(updated));
    
    toast.success("Руностав сохранен!");
    clearRunestav();
  };

  const deleteRunestav = (id: string) => {
    const updated = savedRunestavs.filter(r => r.id !== id);
    setSavedRunestavs(updated);
    localStorage.setItem('createdRunestavs', JSON.stringify(updated));
    setViewingRunestav(null);
    toast.success("Руностав удален");
  };

  const analyzeCompatibility = () => {
    if (selectedRunes.length < 2) return null;

    const elements = selectedRunes.map(r => r.element);
    const elementCounts: Record<string, number> = {};
    elements.forEach(el => {
      elementCounts[el] = (elementCounts[el] || 0) + 1;
    });

    const warnings: string[] = [];
    const strengths: string[] = [];

    if (elementCounts['огонь'] && elementCounts['вода']) {
      warnings.push("Конфликт огня и воды может создавать напряжение в формуле");
    }
    if (elementCounts['лёд'] && elementCounts['огонь']) {
      warnings.push("Лёд гасит огонь — формула может замедлять процессы");
    }
    
    if (elementCounts['огонь'] >= 2) {
      strengths.push("Мощная огненная энергия — активация и трансформация");
    }
    if (elementCounts['земля'] >= 2) {
      strengths.push("Стабильная земная энергия — надежность и материализация");
    }
    if (elementCounts['воздух'] >= 2) {
      strengths.push("Легкая воздушная энергия — коммуникация и движение");
    }
    if (elementCounts['вода'] >= 2) {
      strengths.push("Глубокая водная энергия — интуиция и эмоции");
    }

    const hasFehu = selectedRunes.some(r => r.name === "Феху");
    const hasVunjo = selectedRunes.some(r => r.name === "Вуньо");
    if (hasFehu && hasVunjo) {
      strengths.push("Феху + Вуньо — классическое сочетание для изобилия и радости");
    }

    const hasAlgiz = selectedRunes.some(r => r.name === "Альгиз");
    const hasTeiwaz = selectedRunes.some(r => r.name === "Тейваз");
    if (hasAlgiz && hasTeiwaz) {
      strengths.push("Альгиз + Тейваз — божественная защита воина");
    }

    return { warnings, strengths };
  };

  const compatibility = analyzeCompatibility();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Wand2" className="h-6 w-6" />
            Создание рунослава
          </h3>
          
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
              <div className="flex items-center justify-between mb-3">
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
              
              {selectedRunes.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Icon name="Plus" className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground font-cormorant">
                    Выберите руны из библиотеки ниже
                  </p>
                </div>
              ) : (
                <div className="bg-card/50 rounded-lg p-6 border-2 border-primary/30">
                  <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {selectedRunes.map((rune, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <div className="text-6xl rune-glow cursor-pointer hover:scale-110 transition-transform">
                          {rune.symbol}
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-1">
                          {rune.name}
                        </p>
                        <button
                          onClick={() => removeRune(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {compatibility && selectedRunes.length >= 2 && (
              <div className="space-y-3">
                <h4 className="font-cinzel text-lg font-semibold flex items-center gap-2">
                  <Icon name="Sparkles" className="h-5 w-5" />
                  Анализ совместимости
                </h4>
                
                {compatibility.strengths.length > 0 && (
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                    <p className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Icon name="CheckCircle" className="h-4 w-4" />
                      Сильные стороны:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {compatibility.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {compatibility.warnings.length > 0 && (
                  <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                    <p className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                      <Icon name="AlertTriangle" className="h-4 w-4" />
                      Предупреждения:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {compatibility.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={saveRunestav}
                size="lg"
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
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <h3 className="font-cinzel text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Library" className="h-5 w-5" />
            Библиотека рун
          </h3>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {elderFuthark.map((rune) => (
                <button
                  key={rune.id}
                  onClick={() => addRune(rune)}
                  className="group relative"
                  title={rune.name}
                >
                  <div className="text-4xl p-2 rounded-lg transition-all rune-glow hover:scale-110 hover:bg-primary/10">
                    {rune.symbol}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-primary/30 rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                    {rune.name}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <h3 className="font-cinzel text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="BookMarked" className="h-5 w-5" />
            Сохранённые ({savedRunestavs.length})
          </h3>
          
          {savedRunestavs.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Inbox" className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-cormorant">
                Здесь будут ваши сохранённые руноставы
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {savedRunestavs.map((runestav) => (
                  <div
                    key={runestav.id}
                    className="bg-card/50 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setViewingRunestav(runestav)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-cinzel font-semibold text-sm pr-2">
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
                        <span key={i} className="text-2xl rune-glow">
                          {rune.symbol}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
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
              <h3 className="font-cinzel text-xl font-bold">
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
                    <div className="text-5xl rune-glow">{rune.symbol}</div>
                    <p className="text-xs text-muted-foreground mt-1">{rune.name}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-cinzel font-semibold text-sm mb-2 flex items-center gap-2">
                  <Icon name="Target" className="h-4 w-4" />
                  Намерение
                </h4>
                <p className="text-sm font-cormorant leading-relaxed">
                  {viewingRunestav.intention}
                </p>
              </div>

              {viewingRunestav.description && (
                <div>
                  <h4 className="font-cinzel font-semibold text-sm mb-2 flex items-center gap-2">
                    <Icon name="FileText" className="h-4 w-4" />
                    Описание
                  </h4>
                  <p className="text-sm font-cormorant leading-relaxed">
                    {viewingRunestav.description}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Создан: {viewingRunestav.date}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
