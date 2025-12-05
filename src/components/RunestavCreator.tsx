import { useState, useRef, useMemo } from "react";
import { type Rune, elderFuthark } from "@/data/runes";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import RunestavForm from "./runestav/RunestavForm";
import RuneSelector from "./runestav/RuneSelector";
import SavedRunestavs, { type CreatedRunestav } from "./runestav/SavedRunestavs";
import RunestavExportCanvas from "./runestav/RunestavExportCanvas";
import { analyzeIntention } from "@/utils/runeIntentionAnalyzer";

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
  const exportRef = useRef<HTMLDivElement>(null);

  const intentionAnalysis = useMemo(() => {
    return analyzeIntention(intention, elderFuthark);
  }, [intention]);

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

  const exportAsImage = async (runestav: CreatedRunestav | null = null) => {
    const runestavToExport = runestav || {
      name: runestavName,
      runes: selectedRunes,
      intention: intention,
      description: description,
      date: new Date().toLocaleString('ru-RU')
    };

    if (runestavToExport.runes.length === 0) {
      toast.error("Нечего экспортировать");
      return;
    }

    if (!exportRef.current) {
      toast.error("Ошибка экспорта");
      return;
    }

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0f0a1f',
        scale: 2,
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${runestavToExport.name || 'runestav'}.png`;
      link.href = image;
      link.click();
      
      toast.success("Руностав сохранен как изображение!");
    } catch (error) {
      toast.error("Ошибка при создании изображения");
      console.error(error);
    }
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
        <RunestavForm
          runestavName={runestavName}
          setRunestavName={setRunestavName}
          intention={intention}
          setIntention={setIntention}
          description={description}
          setDescription={setDescription}
          selectedRunes={selectedRunes}
          removeRune={removeRune}
          clearRunestav={clearRunestav}
          saveRunestav={saveRunestav}
          exportAsImage={exportAsImage}
          compatibility={compatibility}
        />

        <RuneSelector 
          addRune={addRune}
          recommendedRunes={intentionAnalysis.recommendedRunes}
          neutralRunes={intentionAnalysis.neutralRunes}
          notRecommendedRunes={intentionAnalysis.notRecommendedRunes}
          runeReasons={intentionAnalysis.runeReasons}
        />
      </div>

      <SavedRunestavs
        savedRunestavs={savedRunestavs}
        viewingRunestav={viewingRunestav}
        setViewingRunestav={setViewingRunestav}
        deleteRunestav={deleteRunestav}
        exportAsImage={exportAsImage}
      />

      <RunestavExportCanvas
        ref={exportRef}
        viewingRunestav={viewingRunestav}
        runestavName={runestavName}
        selectedRunes={selectedRunes}
        intention={intention}
        description={description}
      />
    </div>
  );
}