import { useEffect } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { io } from 'socket.io-client';
import { HOST } from "@/constants";
import { useLeaderboardStore } from "@/store/leaderboardStore";

const socket = io(HOST);
const SELECTED_LEVEL = 'hard'

export default function Leaderboard() {
  const { players, setPlayers } = useLeaderboardStore()
  
  const sortedPlayers = players
    .map(player => ({
      player,
      score: player.stats.find(({ levelName }) => levelName === SELECTED_LEVEL)?.score || 0
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ player }) => player);

  useEffect(() => {
    socket.emit('init', { game: {id: "g1-the-figures-and-their-silences"} });
    
    socket.on('leaderboard', (players) => {
      setPlayers(players)
    });

    return () => {
      socket.off('leaderboard');
    };
  }, [setPlayers]);

  return (
    <div className="h-full">
      <div className="w-fit mx-auto grid gap-y-1 px-10">
        <div className="grid grid-cols-[minmax(auto,auto)_minmax(24rem,auto)_minmax(auto,14rem)_minmax(4rem,auto)] px-10 pb-2 text-slate-700 text-center">
          <span></span>
          <span className="text-left pl-2">Nombre del jugador</span>
          <span className="pl-4">Duración</span>
          <span className="pl-2">Puntaje</span>
        </div>

        {sortedPlayers.map((player, i) => (
          <LeaderboardItem 
            key={player.id}
            player={player}
            selectedLevel={SELECTED_LEVEL}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
