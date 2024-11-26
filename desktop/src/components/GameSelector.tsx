import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GAMES } from "@/mocks/games";

export default function GameSelector() {
  const [selectedGame, setSelectedGame] = useState<GameType>(GAMES[0])
  const [selectedLevel, setSelectedLevel] = useState('0')
  const [selectedMode, setSelectedMode] = useState('0')
  const [selectedScale, setSelectedScale] = useState('0')
  
  console.log(selectedLevel, selectedMode, selectedScale);

  return (
    <div className='max-w-4xl mx-auto flex justify-center gap-3 p-5 flex-wrap'>
      <Select defaultValue='0' onValueChange={(i) => {
        setSelectedGame(GAMES[Number(i)]);
        setSelectedLevel('0');
        setSelectedMode('0');
        setSelectedScale('0');
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

      <Tabs defaultValue='0' onValueChange={(value) => setSelectedLevel(value)}>
        <TabsList className='h-auto [&>button]:py-2 [&>button]:px-7 bg-slate-200'>
          {selectedGame?.levels.map((level, i) => (
            <TabsTrigger key={i} value={i.toString()}>
              {level}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {selectedGame?.modes && (
        <Tabs defaultValue='0' onValueChange={(value) => setSelectedMode(value)}>
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
        <Select defaultValue='0' onValueChange={(value) => setSelectedScale(value)}>
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