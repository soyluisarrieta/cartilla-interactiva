import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HOST, PATH } from "@/constants";
import { cn } from "@/lib/utils";
import { TimerIcon } from "lucide-react";

interface Props {
  player: PlayerType
  selectedLevel: string
  index: number
}

const DEFAULT_STATS = {
  timestamp: null,
  time: 0,
  score: 0
}

export default function LeaderboardItem({ player, selectedLevel, index }: Props) {
  const { avatar, isOnline, stats } = player
  const avatarSrc = player ? `${HOST}/${PATH.AVATARS}/${avatar}` : "";
  const { timestamp, time, score } = stats.find(s => s.levelName === selectedLevel) ?? DEFAULT_STATS
  const date = timestamp && new Date(timestamp)
  const formattedDate = date && date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="grid grid-cols-[minmax(auto,auto)_minmax(24rem,auto)_minmax(auto,14rem)_minmax(4rem,auto)] bg-white shadow-md shadow-slate-400/50 rounded-2xl py-4 px-10 items-center animate-fadeInFromTop opacity-0"
      style={{ '--animation-delay': `${300 * index}ms` } as React.CSSProperties}
    >
      <span className="text-3xl font-bold text-slate-700 pr-4" title="Puesto">
        {index + 1}
      </span>

      <div className="flex items-center">
        <div className="relative">
          <Avatar className="size-16 border-slate-100 border-4">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback></AvatarFallback>
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

        <div className="flex flex-col ml-3">
          <span className="text-3xl font-bold text-slate-900" title="Nombre del jugador">
            {player?.username || "Desconocido"}
          </span>
          <time className="font-mono -mb-1 text-slate-700" title="Fecha de puntaje">
            {formattedDate}
          </time>
        </div>
      </div>

      <time
        className="font-mono text-xl flex justify-center items-center text-slate-700 text-center"
        title="Duración"
      >
        <TimerIcon size={20} />
        {String(Math.floor(Math.round(time) / 60)).padStart(2, "0")}:{String(Math.round(time) % 60).padStart(2, "0")}
      </time>

      <span className="text-3xl font-bold text-center" title="Puntos">
        {score}
      </span>
    </div>
  )
}
