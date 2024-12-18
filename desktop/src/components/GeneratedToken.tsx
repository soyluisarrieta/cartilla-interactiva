import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SOCKET } from "@/constants";
import { useLeaderboardStore } from "@/store/leaderboardStore";
import { TimerIcon } from 'lucide-react';

interface Props {
  playerName: null | string;
  serial: null | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DURATION = 10 // segundos

export default function GeneratedToken({ playerName, serial, open, onOpenChange }: Props) {  
  const [token, setToken] = useState('LKJS123123');
  const [timer, setTimer] = useState(DURATION);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingRefresh = useRef(false);

  const { players } = useLeaderboardStore();
  const profiles = players.filter((p) => p.serial === serial);

  const generateToken = () => {
    if (document.visibilityState !== 'visible') {
      return token;
    }
    console.log('Token emitido');
    const profileId = profiles.map(p => p.id);
    const generatedToken = Math.random().toString(36).substr(2, 10).toUpperCase();
    SOCKET.emit('generateToken', { token: generatedToken, profiles: profileId });
    return generatedToken;
  };

  const handleRefresh = () => {
    setToken(generateToken());
    setTimer(DURATION);
  };

  const clearExistingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = () => {
    clearExistingInterval();
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          if (document.visibilityState !== 'visible') {
            pendingRefresh.current = true;
            clearExistingInterval();
            return 0;
          }

          handleRefresh();
          return DURATION;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pendingRefresh.current) {
        handleRefresh();
        pendingRefresh.current = false;
        startInterval();
      }
    };

    if (open) {
      handleRefresh();
      startInterval();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearExistingInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [open]);

  return (
    <Dialog open={Boolean(playerName && open)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="-mt-2">
          <DialogTitle>Token de restauración</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center gap-4 flex-col text-4xl font-medium pt-6 bg-muted rounded overflow-hidden relative shadow-sm shadow-primary/50">
          <div className='absolute top-2 right-2 flex justify-center items-center gap-0.5 text-xs opacity-70 cursor-default' title='Duración de token'>
            <TimerIcon size={12} /> {timer}
          </div>
          {token}
          <div className="w-full bg-muted-foreground/10 p-2 text-xs text-center flex items-center justify-center" title={profiles.map(({ username }) => username).join(' - ')}>
            Se recuperará el perfil de "<span className="max-w-40 inline-block text-ellipsis overflow-hidden whitespace-nowrap font-bold">{playerName}</span>" junto con {profiles.length > 1 ? profiles.length : 'un perfil'} más.
          </div>
        </div>
        <Button onClick={handleRefresh}>Refrescar</Button>
      </DialogContent>
    </Dialog>
  );
}
