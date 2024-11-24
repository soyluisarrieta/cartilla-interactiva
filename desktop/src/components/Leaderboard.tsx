import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PATH } from "@/constants";
import { cn } from "@/lib/utils";
import { useIPStore } from "@/store/useIPStore";
import { TimerIcon } from "lucide-react";

const AVATARS_IMAGES = [
  "boy1.png",
  "boy2.png",
  "boy3.png",
  "girl1.png",
  "girl2.png",
  "girl3.png",
]

interface PlayerType {
  id: number
  name: string
  isOnline: boolean
  attempts: number
  avatarId: number
}

const PLAYERS = [
  {id: 0, name: 'Luis Arrieta', isOnline: false, attempts: 234, avatarId: 1},
  {id: 1, name: 'Jessica Pistala', isOnline: true, attempts: 643, avatarId: 4},
  {id: 2, name: 'Sebastián Arristala', isOnline: true, attempts: 873, avatarId: 2},
  {id: 3, name: 'Martina López', isOnline: false, attempts: 165, avatarId: 5},
  {id: 4, name: 'Pepito Pérez', isOnline: false, attempts: 254, avatarId: 2},
  {id: 5, name: 'Julanito detal', isOnline: true, attempts: 28, avatarId: 4},
  {id: 6, name: 'Paylus Estudio', isOnline: true, attempts: 0, avatarId: 5},
  {id: 7, name: 'Amazonas Verdes', isOnline: true, attempts: 0, avatarId: 0}
]

interface BestScoreType {
  playerId: number
  points: number
  seconds: number
  timestamp: number
}

const BEST_SCORES = [
  { playerId: 2, points: 92, seconds: 25, timestamp: 1732103183 },
  { playerId: 6, points: 91, seconds: 29, timestamp: 1732543183 },
  { playerId: 4, points: 88, seconds: 27, timestamp: 1732323183 },
  { playerId: 1, points: 85, seconds: 28, timestamp: 1731993183 },
  { playerId: 7, points: 83, seconds: 26, timestamp: 1732653183 },
  { playerId: 3, points: 77, seconds: 230, timestamp: 1732213183 },
  { playerId: 0, points: 73, seconds: 32, timestamp: 1731883183 },
  { playerId: 5, points: 73, seconds: 31, timestamp: 1732433183 },
]

export default function Leaderboard() {
  const { localIP } = useIPStore();
  const sortedScores: BestScoreType[] = BEST_SCORES.sort((a, b) => b.points - a.points);
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <div className="flex justify-between py-1 px-10 gap-4 text-slate-700">
        <span>Puesto</span>
        <span className="w-96">Nombre del jugador</span>
        <span className="pr-3">Duración</span>
        <span>Puntaje</span>
      </div>

      {sortedScores.map((score, index) => {
        const player: PlayerType | undefined = PLAYERS.find((p) => p.id === score.playerId);
        const avatarSrc = player ? `${localIP}/${PATH.AVATARS}/${AVATARS_IMAGES[player.avatarId]}` : "";
        const isOnline = player?.isOnline;
        const date = new Date(score.timestamp * 1000);
        const formattedDate = date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        return (
          <div
            key={score.playerId}
            className="bg-white shadow-md shadow-slate-400/50 rounded-2xl py-4 px-10 flex justify-between items-center gap-4 hover:scale-105 cursor-default transition-transform"
          >
            <span className="text-3xl font-bold text-slate-700" title="Puesto">
              {index + 1}
            </span>

            <div className="relative">
              <Avatar className="size-16 border-slate-100 border-4">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              
              {isOnline && (
                <span
                  className="size-6 bg-emerald-500/30 rounded-full absolute -bottom-1 -right-1 animate-ping"
                  title="En línea"
                />
              )}
              
              <span
                className={cn("size-6 border-4 border-white rounded-full absolute -bottom-1 -right-1 hover:scale-110", isOnline ? 'bg-emerald-500' : 'bg-slate-300')}
                title={isOnline ? 'En línea' : 'Desconectado'}
              />
            </div>

            <div className="w-72 flex flex-col items-start">
              <span className="text-3xl font-bold text-slate-900" title="Nombre del jugador">
                {player?.name || "Desconocido"}
              </span>
              <time className="font-mono -mb-1 text-slate-700" title="Fecha de puntaje">
                {formattedDate}
              </time>
            </div>

            <time
              className="font-mono text-xl px-5 flex gap-1 items-center text-slate-700"
              title="Duración"
            >
              <TimerIcon size={20} /> 
              {String(Math.floor(score.seconds / 60)).padStart(2, "0")}:{String(score.seconds % 60).padStart(2, "0")}
            </time>

            <span className="text-3xl font-bold" title="Puntos">
              {score.points}
            </span>
          </div>
        );
      })}
    </div>
  );
}

