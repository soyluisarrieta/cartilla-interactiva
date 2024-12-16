import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  playerName: string
  serial: string
  children: React.ReactNode;
}

export default function GeneratedToken({ playerName, serial, children }: Props) {
  const [token, setToken] = useState('LKJS123123');
  const [timer, setTimer] = useState(100);
  const endTimeRef = useRef<Date | null>(null);

  const { players } = useLeaderboardStore()
  const profiles = players.filter((p) => p.serial === serial)

  useEffect(() => {
    if (!endTimeRef.current) {
      endTimeRef.current = new Date(Date.now() + timer * 1000);
    }

    const countdown = setInterval(() => {
      const now = new Date();
      const distance = (endTimeRef.current!.getTime() - now.getTime()) / 1000;

      if (distance <= 0) {
        handleRefresh();
      } else {
        setTimer(distance);
      }
    }, 100);

    return () => clearInterval(countdown);
  }, []);

  const handleRefresh = () => {
    setToken(generateToken());
    setTimer(100);
    endTimeRef.current = new Date(Date.now() + 100 * 1000);
  };

  const generateToken = () => {
    // Lógica para generar un nuevo token (puedes personalizar esto)
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="-mt-2">
          <DialogTitle>Token de restauración</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center gap-4 flex-col text-4xl font-medium pt-6 bg-muted rounded overflow-hidden">
          {token}
          <div className="w-full bg-muted-foreground/10 p-2 text-xs text-center flex items-center justify-center" title={profiles.map(({username})=> username).join(' - ')}>
            Se recuperará el perfil de "<span className="max-w-40 inline-block text-ellipsis overflow-hidden whitespace-nowrap font-bold">{playerName}</span>" junto con {profiles.length > 1 ? profiles.length : 'un perfil'} más.
          </div>
        </div>
        <Progress className="h-2" value={timer} />
        <Button onClick={handleRefresh}>Refrescar</Button>
      </DialogContent>
    </Dialog>
  );
}
