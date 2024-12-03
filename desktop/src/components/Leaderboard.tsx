import { useEffect } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { SOCKET } from "@/constants";
import GameSelector from "@/components/GameSelector";
import { GAMES } from "@/mocks/games";
import { AnimatePresence } from "framer-motion";

export default function Leaderboard() {
  const { players, setPlayers, selectors } = useLeaderboardStore()
  const selectedLevel = GAMES[selectors.game].levels[selectors.level]
  const selectedMode = GAMES[selectors.game]?.modes?.[selectors.mode]
  const selectedScale = GAMES[selectors.game]?.scales?.[selectors.scale]
  const selectedNotes = GAMES[selectors.game]?.notes?.[selectors.notes]

  const sortedPlayers = players
    .map(player => ({
      player,
      score: player.stats.find(({ levelName, mode, scale, notes }) => 
        (levelName === 'unique' || levelName === selectedLevel) &&
        (!selectedMode || mode === selectedMode) &&
        (!selectedScale || scale === selectedScale) &&
        (!selectedNotes || notes === selectedNotes)
    )?.score || 0
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ player }) => player);

  useEffect(() => {
    if (selectors.reseted) { return }
    SOCKET.emit('init', { game: GAMES[selectors.game] });

    SOCKET.on('leaderboard', (players) => {
      console.log(players);
      
      setPlayers(players)
    });

    return () => {
      SOCKET.off('leaderboard');
    };
  }, [selectors.game, selectors.reseted, setPlayers]);

  return (
    <main>
      <GameSelector />
      <div className="w-fit mx-auto grid gap-y-1 px-10">
        <div className="grid grid-cols-[minmax(auto,auto)_minmax(24rem,auto)_minmax(auto,14rem)_minmax(4rem,auto)] px-10 pb-2 text-slate-700 text-center">
          <span></span>
          <span className="text-left pl-2">Nombre del jugador</span>
          <span className="pl-4">Duración</span>
          <span className="pl-2">Puntaje</span>
        </div>

        <AnimatePresence mode="wait">
          {sortedPlayers.map((player, i) => (
            <LeaderboardItem
              key={`${player.id}-${selectors.game}-${selectedLevel}`}
              player={player}
              selectedLevel={selectedLevel}
              index={i}
              />
            ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
