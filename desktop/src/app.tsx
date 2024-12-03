import Floating from "@/components/Floating";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function App() {
  return (
    <ScrollArea className="w-full h-screen min-h-screen bg-gradient-to-b from-slate-100 to-white bg-red-500">
      <TopBar />
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <Header />
        <Leaderboard />
        <Floating />
        <Footer />
      </div>
    </ScrollArea>
  )
}
