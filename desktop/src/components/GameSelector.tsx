import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOCKET } from "@/constants";
import { DICT_LEVELS, GAMES } from "@/mocks/games";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { useEffect } from "react";

export default function GameSelector() {
  const { 
    selectors,
    setGameSelector, 
    setLevelSelector, 
    setModeSelector, 
    setScaleSelector, 
    resetSelectors,
  } = useLeaderboardStore()

  const selectedGame = GAMES[selectors.game]

  useEffect(()=>{
    if (selectors.reseted) { return }
    SOCKET.emit('getLeaderboard', { game: {id: "g1-the-figures-and-their-silences"} });
  }, [selectors])

  return (
    <div className='max-w-4xl mx-auto flex justify-center gap-3 p-5 flex-wrap'>
      <Select defaultValue='0' onValueChange={(i) => {
        resetSelectors()
        setGameSelector(Number(i))
      }}>
        <SelectTrigger className="max-w-96 p-5 bg-white border-slate-400">
          <SelectValue placeholder="Selecciona un juego" />
        </SelectTrigger>
        <SelectContent>
          {GAMES.map(({ name }, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i + 1}. {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tabs defaultValue='0' onValueChange={(i) => setLevelSelector(Number(i))}>
        <TabsList className='h-auto [&>button]:py-2 [&>button]:px-7 bg-slate-200'>
          {selectedGame?.levels.map((level, i) => (
            <TabsTrigger key={i} value={i.toString()}>
              {DICT_LEVELS[level as keyof typeof DICT_LEVELS]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {selectedGame?.modes && (
        <Tabs defaultValue='0' onValueChange={(i) => setModeSelector(Number(i))}>
          <TabsList className='h-auto [&>button]:py-2 [&>button]:px-7 bg-slate-200'>
            {selectedGame.modes.map((mode, i) => (
              <TabsTrigger key={i} value={i.toString()}>
                {mode}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {selectedGame?.scales && (
        <Select defaultValue='0' onValueChange={(i) => setScaleSelector(Number(i))}>
          <SelectTrigger className="w-auto p-5 bg-white border-slate-400">
            <SelectValue placeholder="Selecciona una escala" />
          </SelectTrigger>
          <SelectContent>
            {selectedGame.scales.map((scale, i) => (
              <SelectItem key={i} value={i.toString()}>
                {scale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}