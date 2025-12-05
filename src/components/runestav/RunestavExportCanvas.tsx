import { forwardRef } from "react";
import { type Rune } from "@/data/runes";
import { type CreatedRunestav } from "./SavedRunestavs";

interface RunestavExportCanvasProps {
  viewingRunestav: CreatedRunestav | null;
  runestavName: string;
  selectedRunes: Rune[];
  intention: string;
  description: string;
}

const RunestavExportCanvas = forwardRef<HTMLDivElement, RunestavExportCanvasProps>(
  ({ viewingRunestav, runestavName, selectedRunes, intention, description }, ref) => {
    return (
      <div className="fixed -left-[9999px] -top-[9999px]">
        <div
          ref={ref}
          className="w-[800px] p-12 bg-gradient-to-br from-primary/20 via-card to-secondary/20 border-4 border-primary/50 rounded-lg"
        >
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-4xl font-bold text-primary mb-2">
              {viewingRunestav ? viewingRunestav.name : runestavName}
            </h1>
            <p className="text-muted-foreground font-cormorant">
              {viewingRunestav ? viewingRunestav.date : new Date().toLocaleString('ru-RU')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {(viewingRunestav ? viewingRunestav.runes : selectedRunes).map((rune, i) => (
              <div key={i} className="text-center">
                <div className="text-7xl rune-glow mb-2">{rune.symbol}</div>
                <p className="text-sm font-cinzel">{rune.name}</p>
                <p className="text-xs text-muted-foreground">{rune.element}</p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-primary/30 pt-6">
            <h3 className="font-cinzel text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Намерение
            </h3>
            <p className="font-cormorant text-base leading-relaxed">
              {viewingRunestav ? viewingRunestav.intention : intention}
            </p>

            {(viewingRunestav ? viewingRunestav.description : description) && (
              <>
                <h3 className="font-cinzel text-xl font-semibold mb-3 mt-6 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Описание
                </h3>
                <p className="font-cormorant text-base leading-relaxed">
                  {viewingRunestav ? viewingRunestav.description : description}
                </p>
              </>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground font-cormorant">
            Создано на poehali.dev
          </div>
        </div>
      </div>
    );
  }
);

RunestavExportCanvas.displayName = "RunestavExportCanvas";

export default RunestavExportCanvas;
