import LeaderboardItem from "@/components/LeaderboardItem";
import { BEST_SCORES } from "@/mocks/bestScores";

export default function Leaderboard() {
  const sortedScores: BestScoreType[] = BEST_SCORES.sort((a, b) => b.points - a.points);
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 mb-5">
      <div className="flex justify-between py-1 px-10 gap-4 text-slate-700">
        <span>Puesto</span>
        <span className="w-96">Nombre del jugador</span>
        <span className="pr-3">Duración</span>
        <span>Puntaje</span>
      </div>

      {sortedScores.map((score, index) => (
        <LeaderboardItem key={score.playerId} {...{ score, index }} />
      ))}
    </div>
  )
}
