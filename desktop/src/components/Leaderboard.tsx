import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATARS_FILES, PATH } from "@/constants";
import { cn } from "@/lib/utils";
import { BEST_SCORES } from "@/mocks/bestScores";
import { PLAYERS } from "@/mocks/players";
import { useIPStore } from "@/store/useIPStore";
import { TimerIcon } from "lucide-react";

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
        const avatarSrc = player ? `${localIP}/${PATH.AVATARS}/${AVATARS_FILES[player.avatarId]}` : "";
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

