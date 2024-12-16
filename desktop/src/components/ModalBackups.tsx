import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { HelpCircle, RectangleEllipsisIcon, SearchIcon } from "lucide-react";
import GeneratedToken from "@/components/GeneratedToken";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HOST, PATH } from '@/constants';

interface Props {
  children: React.ReactNode
}

export default function ModalBackups({ children }: Props) {
  const { players } = useLeaderboardStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-screen gap-2 px-0 pl-6 pr-1 pb-1' hideCloseButton>
        <DialogHeader className="flex-row items-center justify-between space-y-0 gap-2 pr-4">
          <DialogTitle className='text-xl grow'>Restauración de perfiles</DialogTitle>
          <label className="w-60 flex items-center relative">
            <SearchIcon className="absolute left-2 opacity-70" size={16} />
            <Input
              className="pl-8"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Table className='mb-10'> 
            <TableBody>
              {filteredPlayers.map(({ id, username, serial, avatar }, index) => (
                <TableRow key={id} className="group">
                  <TableCell className="px-2 text-primary/70">{index + 1}</TableCell>
                  <TableCell className='p-0'>
                    <div className="relative inline-block">
                      <Avatar className="size-10 border-white border-4">
                        <AvatarImage src={`${HOST}/${PATH.AVATARS}/${avatar || ''}`} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>
                  <TableCell className="w-full text-base pl-1">
                    {username}
                  </TableCell>
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
