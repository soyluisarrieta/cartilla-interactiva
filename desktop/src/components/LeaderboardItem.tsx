import { motion } from "framer-motion";
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
  const { avatar, isOnline, stats } = player;
  const avatarSrc = `${HOST}/${PATH.AVATARS}/${avatar || ''}`;
  const { timestamp, time, score } = stats.find(s => s.levelName === 'unique' || s.levelName === selectedLevel) ?? DEFAULT_STATS;
  const date = timestamp ? new Date(timestamp) : null;
  const formattedDate = date ? date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 0.95 }}
      transition={{ delay: 0.3 * index, duration: 0.15 }}
      exit={{ opacity: 0, y: 20, transition: { delay: 0.1 * index, duration: 0.1 } }}
      className={cn(
        "grid grid-cols-[minmax(auto,auto)_minmax(24rem,auto)_minmax(auto,14rem)_minmax(4rem,auto)] py-2 px-10 items-center rounded-2xl",
        (time || score) && (
          index === 0 ? 'bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-200 mb-0.5 py-5 !scale-100' :
          index === 1 ? 'bg-gradient-to-tr from-slate-300/80 to-slate-50 shadow-lg shadow-slate-500/50 py-5' :
          index === 2 && 'bg-gradient-to-tr from-amber-600/70 to-orange-300/70 shadow-lg shadow-orange-900/30 mb-2 py-5'
        )
      )}
    >
      <span className="text-3xl font-bold text-slate-700 pr-4" title="Puesto">
        {index + 1}
      </span>

      <div className="flex items-center">
        <div className="relative">
          <Avatar className="size-16 border-white border-4">
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

        <div className={cn(
            "flex flex-col ml-3",
            (!time || !score) && "opacity-60"
          )}
        >
          <span 
            className="text-3xl font-bold text-slate-900"
            title="Nombre del jugador"
          >
            {player?.username || "Desconocido"}
          </span>
          <time className="font-mono -mb-1 text-slate-700" title="Fecha de puntaje">
            {formattedDate}
          </time>
        </div>
      </div>

      <time
        className={cn("font-mono text-xl flex justify-center items-center text-slate-700 text-center",
        !time && 'opacity-0 pointer-events-none'
      )}
        title="Duración"
      >
        <TimerIcon size={20} />
        {String(Math.floor(Math.round(time) / 60)).padStart(2, "0")}:{String(Math.round(time) % 60).padStart(2, "0")}
      </time>

      <span className={cn(
        "text-3xl font-bold text-center",
        !score && 'opacity-25'
      )} 
        title="Puntos"
      >
        {score}
      </span>
    </motion.div>
  )
}
