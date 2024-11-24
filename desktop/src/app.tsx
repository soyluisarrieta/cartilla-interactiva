import GameSelector from "@/components/GameSelector";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";

export function App() {
  return (
    <main className='w-full min-h-screen bg-gradient-to-b from-slate-100 to-white'>
      <TopBar />
      <Header />
      <GameSelector />
    </main>
  )
}
