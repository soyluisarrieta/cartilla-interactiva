import GameSelector from "@/components/GameSelector";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PLAYERS } from "@/mocks/players";

export function App() {
  const connectedUsers = PLAYERS.filter(({isOnline}) => isOnline)
  const isPlural = connectedUsers.length !== 1 && 's'
  return (
    <ScrollArea className="w-full h-screen min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <TopBar />
      <Header />
      <GameSelector />
      <Leaderboard />
      <span className='fixed bottom-2 right-2 text-lg bg-white/70 filter backdrop-blur-sm py-1 px-5 rounded-full' title='Usuarios conectados'>
        <span className='font-bold'>{connectedUsers.length}</span> conectado{isPlural}
      </span>
    </ScrollArea>
  )
}
