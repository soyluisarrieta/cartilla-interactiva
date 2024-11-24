import GameSelector from "@/components/GameSelector";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function App() {
  return (
    <ScrollArea className="w-full h-screen min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <TopBar />
      <Header />
      <GameSelector />
    </ScrollArea>
  )
}
