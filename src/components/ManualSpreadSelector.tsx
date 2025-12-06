import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune, type RuneSpread } from "@/data/runes";

interface ManualSpreadSelectorProps {
  onComplete: (spread: RuneSpread, runes: Array<Rune & { reversed: boolean }>) => void;
}

const manualSpreads: RuneSpread[] = [
  {
    id: "single-rune",
    name: "Одна руна",
    description: "Простой ответ на прямой вопрос",
    positions: 1,
    positionMeanings: ["Ответ"]
  },
  {
    id: "three-norns",
    name: "Три норны",
    description: "Прошлое, настоящее, будущее",
    positions: 3,
    positionMeanings: ["Прошлое", "Настоящее", "Будущее"]
  },
  {
    id: "runic-cross",
    name: "Рунический крест",
    description: "Глубокий анализ ситуации",
    positions: 5,
    positionMeanings: ["Суть вопроса", "Препятствия", "Помощь", "Результат", "Основа"]
  },
  {
    id: "five-runes",
    name: "Пятирунный расклад",
    description: "Всесторонний взгляд на проблему",
    positions: 5,
    positionMeanings: ["Центр проблемы", "Прошлое", "Будущее", "Совет", "Итог"]
  },
  {
    id: "seven-runes",
    name: "Семь рун судьбы",
    description: "Карма и жизненные уроки",
    positions: 7,
    positionMeanings: ["Прошлое", "Настоящее", "Будущее", "Ваша роль", "Внешние силы", "Скрытое", "Итоговый урок"]
  }
];

export default function ManualSpreadSelector({ onComplete }: ManualSpreadSelectorProps) {
  const [selectedSpread, setSelectedSpread] = useState<RuneSpread | null>(null);
  const [selectedRunes, setSelectedRunes] = useState<Array<Rune & { reversed: boolean }>>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleSpreadSelect = (spread: RuneSpread) => {
    setSelectedSpread(spread);
    setSelectedRunes([]);
    setCurrentPosition(0);
  };

  const handleRuneSelect = (rune: Rune, reversed: boolean) => {
    const newRune = { ...rune, reversed };
    const updated = [...selectedRunes, newRune];
    setSelectedRunes(updated);

    if (updated.length === selectedSpread!.positions) {
      setTimeout(() => {
        onComplete(selectedSpread!, updated);
        setSelectedSpread(null);
        setSelectedRunes([]);
        setCurrentPosition(0);
      }, 300);
    } else {
      setCurrentPosition(updated.length);
    }
  };

  const handleBack = () => {
    if (selectedRunes.length > 0) {
      setSelectedRunes(selectedRunes.slice(0, -1));
      setCurrentPosition(selectedRunes.length - 1);
    } else {
      setSelectedSpread(null);
    }
  };

  if (!selectedSpread) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-cinzel font-bold text-amber-100">
            Выберите вид расклада
          </h2>
          <p className="text-amber-200/80 font-cormorant text-lg">
            Самостоятельно подберите руны для гадания
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {manualSpreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => handleSpreadSelect(spread)}
              className="group p-6 rounded-xl wooden-button text-left transition-all hover:scale-105"
            >
              <div className="flex items-start gap-3 mb-3">
                <Icon name="Hand" className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-cinzel font-bold text-xl text-amber-100 mb-1">
                    {spread.name}
                  </h3>
                  <p className="text-amber-200/70 text-sm font-cormorant">
                    {spread.description}
                  </p>
                </div>
              </div>
              <div className="text-amber-300/60 text-sm font-cormorant">
                Позиций: {spread.positions}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          className="wooden-button"
        >
          <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="text-center">
          <h3 className="text-2xl font-cinzel font-bold text-amber-100">
            {selectedSpread.name}
          </h3>
          <p className="text-amber-200/70 font-cormorant">
            Позиция {currentPosition + 1} из {selectedSpread.positions}: {selectedSpread.positionMeanings[currentPosition]}
          </p>
        </div>
        <div className="w-32" />
      </div>

      <div className="wooden-button p-6 rounded-xl">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRunes.map((rune, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-900/40 border border-amber-700/50"
            >
              <span className="text-3xl">{rune.symbol}</span>
              <span className="text-sm text-amber-200 font-cormorant">
                {rune.name} {rune.reversed && "(↓)"}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <h4 className="text-xl font-cinzel text-amber-100 mb-2">
            Выберите руну для позиции: {selectedSpread.positionMeanings[currentPosition]}
          </h4>
          <p className="text-amber-200/70 font-cormorant text-sm">
            Нажмите на руну чтобы выбрать её в прямом положении, или на стрелку для перевёрнутой руны
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[500px] overflow-y-auto pr-2">
          {elderFuthark.map((rune) => (
            <div key={rune.name} className="flex flex-col gap-1">
              <button
                onClick={() => handleRuneSelect(rune, false)}
                className="group p-3 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/50 hover:border-amber-600 transition-all hover:scale-110"
                title={`${rune.name} (прямая)`}
              >
                <div className="text-4xl text-center">{rune.symbol}</div>
                <div className="text-xs text-amber-300/70 text-center mt-1 font-cormorant">
                  {rune.name}
                </div>
              </button>
              <button
                onClick={() => handleRuneSelect(rune, true)}
                className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 hover:border-red-600 transition-all"
                title={`${rune.name} (перевёрнутая)`}
              >
                <Icon name="ArrowDown" className="h-3 w-3 text-red-400 mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
