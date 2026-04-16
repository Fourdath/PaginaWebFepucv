import React, { useMemo, useState } from 'react';
import { CHARACTERS } from './characters';
import { Game } from './Game';
import type { Character } from './types';

type SelectingFor = 'player' | 'cpu';

type FinalScore = {
  player: number;
  cpu: number;
} | null;

const getResultLabel = (finalScore: FinalScore) => {
  if (!finalScore) {
    return null;
  }
  if (finalScore.player > finalScore.cpu) {
    return 'Ganaste la pichanga';
  }
  if (finalScore.player < finalScore.cpu) {
    return 'La CPU se quedó con el partido';
  }
  return 'Empate con sabor a revancha';
};

export const GameMenu: React.FC = () => {
  const [selectingFor, setSelectingFor] = useState<SelectingFor>('player');
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [selectedCpuChar, setSelectedCpuChar] = useState<Character>(CHARACTERS[1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalScore, setFinalScore] = useState<FinalScore>(null);

  const resultLabel = useMemo(() => getResultLabel(finalScore), [finalScore]);

  const handlePickCharacter = (character: Character) => {
    if (selectingFor === 'player') {
      setSelectedChar(character);
      if (selectedCpuChar.id === character.id) {
        const replacement = CHARACTERS.find((item) => item.id !== character.id);
        if (replacement) {
          setSelectedCpuChar(replacement);
        }
      }
    } else {
      setSelectedCpuChar(character);
      if (selectedChar.id === character.id) {
        const replacement = CHARACTERS.find((item) => item.id !== character.id);
        if (replacement) {
          setSelectedChar(replacement);
        }
      }
    }
  };

  const handleGameOver = (playerScore: number, cpuScore: number) => {
    setFinalScore({ player: playerScore, cpu: cpuScore });
    setIsPlaying(false);
  };

  const startGame = () => {
    setFinalScore(null);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <Game
        key={`${selectedChar.id}-${selectedCpuChar.id}`}
        playerChar={selectedChar}
        cpuChar={selectedCpuChar}
        onGameOver={handleGameOver}
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-fepucv border border-fepucv-border bg-fepucv-surface/40 p-8 shadow-sm md:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-fepucv-primary">
              Minijuego FEPUCV
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-fepucv-secondary">
              ¿Estás aburrido?
            </h2>
            <p className="mt-3 text-lg text-fepucv-textSecondary">
              Juega una pichanga con la FEPUCV
            </p>
            <p className="mt-5 max-w-2xl text-fepucv-textSecondary leading-relaxed">
              Elige a tu representante, define tu rival y entra a una cancha arcade con salto,
              patadas, cronómetro, goles y marcador en tiempo real.
            </p>

            {finalScore && (
              <div className="mt-8 rounded-fepucv border border-fepucv-primary/30 bg-fepucv-primary/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-fepucv-secondary">
                  Último resultado
                </p>
                <p className="mt-3 text-3xl font-bold text-fepucv-secondary">
                  {finalScore.player} - {finalScore.cpu}
                </p>
                <p className="mt-2 text-sm font-semibold text-fepucv-textSecondary">{resultLabel}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSelectingFor('player')}
                className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-all ${
                  selectingFor === 'player'
                    ? 'bg-fepucv-secondary text-white shadow-lg'
                    : 'bg-fepucv-surface text-fepucv-textSecondary hover:bg-fepucv-border/70'
                }`}
              >
                Elegir jugador
              </button>
              <button
                type="button"
                onClick={() => setSelectingFor('cpu')}
                className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-all ${
                  selectingFor === 'cpu'
                    ? 'bg-fepucv-secondary text-white shadow-lg'
                    : 'bg-fepucv-surface text-fepucv-textSecondary hover:bg-fepucv-border/70'
                }`}
              >
                Elegir CPU
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PreviewCard label="Tu equipo" character={selectedChar} accent="player" />
            <PreviewCard label="Rival CPU" character={selectedCpuChar} accent="cpu" />
          </div>
        </div>
      </section>

      <section className="rounded-fepucv border border-fepucv-border bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-fepucv-primary">
              Plantel disponible
            </p>
            <h3 className="mt-3 text-2xl font-bold text-fepucv-secondary">
              Selecciona a quien entra a la cancha
            </h3>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="inline-flex items-center justify-center rounded-fepucv bg-fepucv-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-fepucv-secondary shadow-md transition-all hover:-translate-y-0.5 hover:bg-fepucv-light"
          >
            ¡Jugar Ahora!
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {CHARACTERS.map((character) => {
            const selectedForPlayer = selectedChar.id === character.id;
            const selectedForCpu = selectedCpuChar.id === character.id;
            const highlighted =
              (selectingFor === 'player' && selectedForPlayer) ||
              (selectingFor === 'cpu' && selectedForCpu);

            return (
              <button
                key={character.id}
                type="button"
                onClick={() => handlePickCharacter(character)}
                className={`rounded-fepucv border p-3 text-left transition-all ${
                  highlighted
                    ? 'border-fepucv-primary bg-fepucv-primary/10 shadow-lg'
                    : 'border-fepucv-border bg-fepucv-surface/60 hover:-translate-y-1 hover:border-fepucv-secondary/35 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="relative overflow-hidden rounded-fepucv bg-white">
                  <img
                    src={character.img}
                    alt={character.name}
                    className="aspect-[4/5] w-full object-cover object-top"
                  />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {selectedForPlayer && (
                      <span className="rounded-full bg-fepucv-primary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-fepucv-secondary">
                        Jugador
                      </span>
                    )}
                    {selectedForCpu && (
                      <span className="rounded-full bg-fepucv-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                        CPU
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-1 pb-1 pt-4">
                  <p className="text-lg font-bold text-fepucv-secondary">{character.name}</p>
                  <p className="text-sm text-fepucv-textSecondary">{character.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const PreviewCard: React.FC<{
  label: string;
  character: Character;
  accent: 'player' | 'cpu';
}> = ({ label, character, accent }) => (
  <div
    className={`rounded-fepucv border p-5 shadow-sm ${
      accent === 'player'
        ? 'border-fepucv-primary/40 bg-fepucv-primary/10'
        : 'border-fepucv-secondary/20 bg-fepucv-secondary/5'
    }`}
  >
    <p className="text-xs font-bold uppercase tracking-[0.28em] text-fepucv-textSecondary">{label}</p>
    <div className="mt-4 flex items-center gap-4">
      <img
        src={character.img}
        alt={character.name}
        className={`h-24 w-24 rounded-full border-4 object-cover object-top ${
          accent === 'player' ? 'border-fepucv-primary' : 'border-fepucv-secondary'
        }`}
      />
      <div>
        <p className="text-2xl font-bold text-fepucv-secondary">{character.name}</p>
        <p className="mt-1 text-sm text-fepucv-textSecondary">{character.role}</p>
      </div>
    </div>
  </div>
);
