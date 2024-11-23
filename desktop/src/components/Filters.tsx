import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Filters() {
  return (
    <div className='flex justify-center gap-3 p-5'>
      <Select>
        <SelectTrigger className="max-w-96 p-5">
          <SelectValue placeholder="Selecciona un juego" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1. La Figuras y sus silencio</SelectItem>
          <SelectItem value="2">2. La Blanca y su silencio</SelectItem>
          <SelectItem value="3">3. La Redonda y su Silencio</SelectItem>
        </SelectContent>
      </Select>

      <Tabs defaultValue="easy">
        <TabsList className='h-auto [&>button]:py-2 [&>button]:px-7'>
          <TabsTrigger value="easy">Fácil</TabsTrigger>
          <TabsTrigger value="medium">Medio</TabsTrigger>
          <TabsTrigger value="hard">Dificil</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
