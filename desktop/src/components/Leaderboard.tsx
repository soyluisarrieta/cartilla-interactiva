import { useEffect } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { SOCKET } from "@/constants";
import GameSelector from "@/components/GameSelector";
import { GAMES } from "@/mocks/games";
import { AnimatePresence } from "framer-motion";

const DEFAULT_STATS: StatType = {
  id: 'none',
  levelName: 'none',
  score: 0,
  time: 0,
  timestamp: null
}

export default function Leaderboard() {
  const { players, setPlayers, selectors } = useLeaderboardStore()
  const selectedGame = GAMES[selectors.game]
  const selectedLevel = selectedGame.levels[selectors.level]
  const selectedMode = selectedGame?.modes?.[selectors.mode]
  const selectedScale = selectedGame?.scales?.[selectors.scale]
  const selectedNotes = selectedGame?.notes?.[selectors.notes]

  const sortedPlayers = players
    .map(player => ({
      player,
      stats: player.stats.find(({ levelName, mode, scale, notes }) => 
        (levelName === 'unique' || levelName === selectedLevel) &&
        (!selectedMode || mode === selectedMode) &&
        (!selectedScale || scale === selectedScale) &&
        (!selectedNotes || notes === selectedNotes)
    ) ?? DEFAULT_STATS
    }))
    .sort((a, b) => b.stats?.score - a.stats?.score)
    .map(({ player, stats }) => ({...player, stats: [stats]}));
    
    console.log(sortedPlayers);

  useEffect(() => {
    if (selectors.reseted) { return }
    SOCKET.emit('init', { game: selectedGame });

    SOCKET.on('leaderboard', (players) => {
      console.log(players);
      
      setPlayers(players)
    });

    return () => {
      SOCKET.off('leaderboard');
    };
  }, [selectedGame, selectors.game, selectors.reseted, setPlayers]);

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
              key={`${player.id}-${selectors.game}-${selectors.level}-${selectors.mode}-${selectors.scale}-${selectors.notes}`}
              player={player}
              index={i}
              />
            ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
