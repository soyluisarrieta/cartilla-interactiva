import Floating from "@/components/Floating";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function App() {
  return (
    <ScrollArea className="w-full h-screen min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <TopBar />
      <Header />
      <Leaderboard />
      <Floating />
      <Footer />
    </ScrollArea>
  )
}
