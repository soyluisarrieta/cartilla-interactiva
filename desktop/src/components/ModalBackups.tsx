import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { HelpCircle, RectangleEllipsisIcon, SearchIcon } from "lucide-react";
import GeneratedToken from "@/components/GeneratedToken";

interface Props {
  children: React.ReactNode
}

export default function ModalBackups({ children }: Props) {
  const { players } = useLeaderboardStore()
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-screen gap-2 px-0 pl-6 pr-1 pb-1' hideCloseButton>
        <DialogHeader className="flex-row items-center justify-between space-y-0 gap-2 pr-4">
          <DialogTitle className='text-xl grow'>Restauración de perfiles</DialogTitle>
          <label className="w-60 flex items-center relative" htmlFor="searchProfile">
            <SearchIcon className="absolute left-2 opacity-70" size={16} />
            <Input
              id="searchProfile"
              className="pl-8"
              placeholder="Buscar por nombre"
            />
          </label>
          <DialogClose asChild>
            <Button variant='secondary'>Cerrar</Button>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="flex items-center gap-1.5">
          <HelpCircle className="mt-0.5" size={16} /> Usa 'Ver Token' para generar un código temporal de uso único para restaurar los perfiles.
        </DialogDescription>
        <hr className="mt-2" />
        <ScrollArea className="w-full h-[50vh] [&>.scroll-bar]:mr-0 pr-4 -mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-2"></TableHead>
                <TableHead>Nombre de usuario</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map(({ id, username, serial }, index) => (
                <TableRow key={id} className="group">
                  <TableCell className="px-2 text-primary/70">{index + 1}</TableCell>
                  <TableCell className="w-full text-base">{username}</TableCell>
                  <TableCell className="text-right">
                    <GeneratedToken playerName={username} serial={serial}>
                      <Button className="h-auto p-0 group-hover:visible invisible text-xs" size='sm' variant='link'>
                        <RectangleEllipsisIcon /> Ver token
                      </Button>
                    </GeneratedToken>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
