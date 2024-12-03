import { useEffect } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { SOCKET } from "@/constants";
import GameSelector from "@/components/GameSelector";
import { GAMES } from "@/mocks/games";

const SELECTED_LEVEL = 'easy'

export default function Leaderboard() {
  const { players, setPlayers, selectors } = useLeaderboardStore()

  const sortedPlayers = players
    .map(player => ({
      player,
      score: player.stats.find(({ levelName: lvl }) => lvl === 'unique' || lvl === SELECTED_LEVEL)?.score || 0
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ player }) => player);

  useEffect(() => {
    if (selectors.reseted) { return }
    SOCKET.emit('init', { game: GAMES[selectors.game] });

    SOCKET.on('leaderboard', (players) => {
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

        {sortedPlayers.map((player, i) => (
          <LeaderboardItem
            key={`${player.id}-${SELECTED_LEVEL}`}
            player={player}
            selectedLevel={SELECTED_LEVEL}
            index={i}
          />
        ))}
      </div>
    </main>
  );
}
