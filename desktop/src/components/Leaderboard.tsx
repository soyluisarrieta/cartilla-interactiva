import { useEffect, useState } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { io } from 'socket.io-client';
import { HOST } from "@/constants";

const socket = io(HOST);
const SELECTED_LEVEL = 'easy'

export default function Leaderboard() {
  const [players, setPlayers] = useState<PlayerType[]>([])
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
  }, []);

  return (
    <div className="min-h-screen w-fit mx-auto grid gap-y-2 px-10">
      <div className="h-0 grid grid-cols-[minmax(auto,auto)_minmax(24rem,auto)_minmax(auto,14rem)_minmax(4rem,auto)] px-10 text-slate-700 text-center">
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
  );
}
