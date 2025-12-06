import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { elderFuthark, type Rune, type RuneSpread } from "@/data/runes";

interface ManualSpreadSelectorProps {
  onComplete: (spread: RuneSpread, runes: Array<Rune & { reversed: boolean }>) => void;
  onCancel?: () => void;
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

export default function ManualSpreadSelector({ onComplete, onCancel }: ManualSpreadSelectorProps) {
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
      <div className="space-y-8">
        <div className="text-center space-y-3">
          {onCancel && (
            <div className="flex justify-start mb-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="wooden-button"
              >
                <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                К обычным раскладам
              </Button>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-100">
            Выберите вид расклада
          </h2>
          <p className="text-amber-200/80 font-cormorant text-xl md:text-2xl">
            Самостоятельно подберите руны для гадания
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manualSpreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => handleSpreadSelect(spread)}
              className="group p-8 rounded-xl wooden-button text-left transition-all hover:scale-105"
            >
              <div className="flex items-start gap-4 mb-4">
                <Icon name="Hand" className="h-8 w-8 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-cinzel font-bold text-2xl text-amber-100 mb-2">
                    {spread.name}
                  </h3>
                  <p className="text-amber-200/70 text-base font-cormorant leading-relaxed">
                    {spread.description}
                  </p>
                </div>
              </div>
              <div className="text-amber-300/60 text-base font-cormorant">
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
          <h3 className="text-3xl font-cinzel font-bold text-amber-100">
            {selectedSpread.name}
          </h3>
          <p className="text-amber-200/70 font-cormorant text-lg mt-2">
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

        <div className="text-center mb-6">
          <h4 className="text-2xl font-cinzel text-amber-100 mb-3">
            Выберите руну для позиции: {selectedSpread.positionMeanings[currentPosition]}
          </h4>
          <p className="text-amber-200/70 font-cormorant text-base">
            Нажмите на руну чтобы выбрать её в прямом положении, или на стрелку для перевёрнутой руны
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[500px] overflow-y-auto pr-2">
          {elderFuthark.filter(rune => rune.name !== "Вирд").map((rune) => {
            const isAlreadySelected = selectedRunes.some(r => r.name === rune.name);
            return (
              <div key={rune.name} className="flex flex-col gap-1">
                <button
                  onClick={() => handleRuneSelect(rune, false)}
                  disabled={isAlreadySelected}
                  className={`group p-3 rounded-lg border transition-all ${
                    isAlreadySelected 
                      ? "bg-gray-900/50 border-gray-700/30 opacity-40 cursor-not-allowed" 
                      : "bg-amber-950/60 hover:bg-amber-900/60 border-amber-800/50 hover:border-amber-600 hover:scale-110"
                  }`}
                  title={isAlreadySelected ? `${rune.name} (уже выбрана)` : `${rune.name} (прямая)`}
                >
                  <div className="text-4xl text-center">{rune.symbol}</div>
                  <div className="text-xs text-amber-300/70 text-center mt-1 font-cormorant">
                    {rune.name}
                  </div>
                </button>
                {rune.canBeReversed !== false ? (
                  <button
                    onClick={() => handleRuneSelect(rune, true)}
                    disabled={isAlreadySelected}
                    className={`p-1 rounded border transition-all ${
                      isAlreadySelected
                        ? "bg-gray-900/50 border-gray-700/30 opacity-40 cursor-not-allowed"
                        : "bg-red-950/40 hover:bg-red-900/60 border-red-800/50 hover:border-red-600"
                    }`}
                    title={isAlreadySelected ? `${rune.name} (уже выбрана)` : `${rune.name} (перевёрнутая)`}
                  >
                    <Icon name="ArrowDown" className="h-3 w-3 text-red-400 mx-auto" />
                  </button>
                ) : (
                  <div className="p-1 rounded bg-gray-800/40 border border-gray-700/50">
                    <div className="h-3 w-3 mx-auto text-gray-600 text-xs text-center">—</div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="flex flex-col gap-1">
            {(() => {
              const isVirdSelected = selectedRunes.some(r => r.name === "Вирд");
              return (
                <>
                  <button
                    onClick={() => handleRuneSelect({
                      name: "Вирд",
                      symbol: " ",
                      upright: "Пустая руна символизирует судьбу, которая ещё не написана. Это пространство бесконечных возможностей.",
                      reversed: "Пустая руна не имеет перевёрнутого значения - тайна остаётся тайной.",
                      element: "mystery",
                      keywords: ["судьба", "неизвестность", "тайна", "карма", "божественное"]
                    } as Rune, false)}
                    disabled={isVirdSelected}
                    className={`group p-3 rounded-lg border-2 transition-all ${
                      isVirdSelected
                        ? "bg-gray-900/50 border-gray-700/30 opacity-40 cursor-not-allowed"
                        : "bg-purple-950/80 hover:bg-purple-900/80 border-purple-600/70 hover:border-purple-500 hover:scale-110"
                    }`}
                    title={isVirdSelected ? "Вирд (уже выбрана)" : "Вирд (пустая руна)"}
                  >
                    <div className="text-4xl text-center text-purple-200">&nbsp;</div>
                    <div className="text-xs text-purple-300 text-center mt-1 font-cormorant font-bold">
                      Вирд
                    </div>
                  </button>
                  <div className="p-1 rounded bg-gray-800/40 border border-gray-700/50">
                    <div className="h-3 w-3 mx-auto text-gray-600 text-xs text-center">—</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}