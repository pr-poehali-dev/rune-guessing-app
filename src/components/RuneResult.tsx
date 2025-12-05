import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import type { Rune, RuneSpread } from "@/data/runes";

interface DrawnRune extends Rune {
  reversed: boolean;
}

interface RuneResultProps {
  selectedSpread: RuneSpread;
  drawnRunes: DrawnRune[];
  interpretation: string;
  onSave: () => void;
  onReset: () => void;
}

export default function RuneResult({ 
  selectedSpread, 
  drawnRunes, 
  interpretation, 
  onSave, 
  onReset 
}: RuneResultProps) {
  const getBackgroundImage = (spreadId: string) => {
    const backgrounds: Record<string, string> = {
      'one-rune': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/50d7c63f-8ba1-494f-8dc3-7e28c85871ee.jpg',
      'three-norns': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/e38bf317-a753-4fae-aef4-aa92e242a402.jpg',
      'five-runes': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/50d7c63f-8ba1-494f-8dc3-7e28c85871ee.jpg',
      'seven-runes': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/50d7c63f-8ba1-494f-8dc3-7e28c85871ee.jpg',
      'nine-worlds': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/50d7c63f-8ba1-494f-8dc3-7e28c85871ee.jpg',
      'runic-cross': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/2d53b3c3-8622-4a71-a055-40a7fd2ae0c4.jpg',
      'shamanic-throw': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/5d8a3d85-822c-475b-92b0-7fa2b873e70f.jpg',
      'thors-hammer': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/d07b2dad-c8b8-42b7-97ff-2fe6ae6ca440.jpg',
      'celtic-cross': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/e986afbc-e7d8-489c-a0a3-879f633fa6a5.jpg',
      'love-relations': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/418b129f-853a-4917-b5d7-0bdac2f7f4e8.jpg',
      'career-calling': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/eb2a0c3c-8f69-4e30-8547-e71b97a15e20.jpg',
      'health-energy': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/966b8f4e-d816-4e4b-bbf2-e13716c0f8ab.jpg',
      'personal-growth': 'https://cdn.poehali.dev/projects/35588b13-8e32-4550-9b06-f2fe27256a23/files/96097731-4039-4209-beab-1c41ec26b6bc.jpg'
    };
    return backgrounds[spreadId] || '';
  };

  const bgImage = getBackgroundImage(selectedSpread.id);

  return (
    <>
      <Card className="p-8 bg-card/80 backdrop-blur border-primary/30">
        <h2 className="text-3xl font-cinzel font-bold mb-6 text-center">
          {selectedSpread.name}
        </h2>
        
        <div className={`grid gap-6 ${
          drawnRunes.length === 1 
            ? "grid-cols-1 max-w-xs mx-auto" 
            : drawnRunes.length === 3 
            ? "grid-cols-1 md:grid-cols-3" 
            : drawnRunes.length === 4
            ? "grid-cols-2 md:grid-cols-4"
            : drawnRunes.length === 7
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : drawnRunes.length === 9
            ? "grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
            : drawnRunes.length === 10
            ? "grid-cols-2 md:grid-cols-5"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        }`}>
          {drawnRunes.map((rune, index) => (
            <div
              key={index}
              className="text-center space-y-3 animate-rune-flip"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`text-7xl font-bold ${
                rune.reversed ? "transform rotate-180" : ""
              } rune-glow hover:scale-110 transition-transform`}>
                {rune.symbol}
              </div>
              <div className="space-y-1">
                <p className="font-cinzel font-semibold text-lg">
                  {rune.name}
                </p>
                <p className="text-sm text-muted-foreground font-cormorant">
                  {selectedSpread.positionMeanings[index]}
                </p>
                {rune.reversed && (
                  <p className="text-xs text-accent font-semibold">
                    Перевёрнутая
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {interpretation && (
        <Card className="p-8 bg-card/80 backdrop-blur border-primary/30 relative overflow-hidden">
          {bgImage && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3,
                zIndex: 0
              }}
            />
          )}
          <div className="relative z-10">
            <h3 className="font-cinzel text-5xl font-bold mb-6 text-primary">
              🔮 Общая интерпретация расклада
            </h3>
            <ScrollArea className="h-[600px] pr-4">
              <div className="prose prose-invert max-w-none font-cormorant">
                {interpretation.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={i} className="font-cinzel text-6xl mb-6 text-primary">
                        {line.replace('## ', '')}
                      </h2>
                    );
                  } else if (line.startsWith('### ')) {
                    return (
                      <h3 key={i} className="font-cinzel text-4xl mt-8 mb-4">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={i} className="mb-6 text-2xl leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </ScrollArea>
          </div>
        </Card>
      )}

      <Card className="p-8 bg-card/80 backdrop-blur border-primary/30 relative overflow-hidden">
        {bgImage && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.3,
              zIndex: 0
            }}
          />
        )}
        <div className="relative z-10">
          <h3 className="font-cinzel text-5xl font-bold mb-6 text-primary">
            📖 Подробное объяснение рун
          </h3>
          <ScrollArea className="h-[800px] pr-4">
            <div className="space-y-12 font-cormorant">
              {drawnRunes.map((rune, index) => (
                <div key={index} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-7xl rune-glow">{rune.symbol}</span>
                    <div>
                      <h3 className="font-cinzel text-4xl font-bold">
                        {rune.name}
                      </h3>
                      <p className="text-xl text-accent mt-2">
                        {selectedSpread.positionMeanings[index]}
                      </p>
                    </div>
                  </div>

                  <div className="pl-6 space-y-4 border-l-4 border-primary/30">
                    <p className="text-2xl leading-relaxed">
                      <span className="font-semibold text-primary">
                        {rune.reversed ? "Перевёрнутое:" : "Прямое:"}
                      </span>{" "}
                      {rune.reversed ? rune.reversed : rune.upright}
                    </p>

                    {rune.karmicLesson && (
                      <p className="text-xl italic text-muted-foreground">
                        <span className="font-semibold">✨ Кармический урок:</span> {rune.karmicLesson}
                      </p>
                    )}

                    {rune.advice && (
                      <p className="text-xl bg-primary/5 p-4 rounded">
                        <span className="font-semibold">💡 Совет:</span> {rune.advice}
                      </p>
                    )}

                    {rune.warning && rune.reversed && (
                      <p className="text-xl bg-destructive/10 p-4 rounded border border-destructive/30">
                        <span className="font-semibold">⚠️ Предупреждение:</span> {rune.warning}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-lg">
                      {rune.events && (
                        <div className="bg-card/50 p-3 rounded">
                          <span className="font-semibold">📅 События:</span> {rune.events}
                        </div>
                      )}
                      {rune.health && (
                        <div className="bg-card/50 p-3 rounded">
                          <span className="font-semibold">💚 Здоровье:</span> {rune.health}
                        </div>
                      )}
                      {rune.relationships && (
                        <div className="bg-card/50 p-3 rounded">
                          <span className="font-semibold">❤️ Отношения:</span> {rune.relationships}
                        </div>
                      )}
                      {rune.work && (
                        <div className="bg-card/50 p-3 rounded">
                          <span className="font-semibold">💼 Работа:</span> {rune.work}
                        </div>
                      )}
                    </div>

                    {rune.energy && (
                      <p className="text-xl italic bg-accent/5 p-4 rounded border border-accent/20">
                        <span className="font-semibold">⚡ Энергия:</span> {rune.energy}
                      </p>
                    )}
                  </div>

                  {index < drawnRunes.length - 1 && (
                    <Separator className="my-8" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          onClick={onSave}
          size="lg"
          className="font-cinzel wooden-button"
        >
          <Icon name="Save" className="mr-2 h-5 w-5" />
          Сохранить гадание
        </Button>
        <Button
          onClick={onReset}
          size="lg"
          className="font-cinzel wooden-button"
        >
          <Icon name="RotateCcw" className="mr-2 h-5 w-5" />
          Новое гадание
        </Button>
      </div>
    </>
  );
}