import GameSelector from "@/components/GameSelector";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";

export function App() {
  return (
    <main className='w-full min-h-screen'>
      <TopBar />
      <Header />
      <GameSelector />
    </main>
  )
}
