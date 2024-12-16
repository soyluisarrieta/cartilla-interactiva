import AlertToTurnOff from "@/components/AlertToTurnOff"
import ModalBackups from "@/components/ModalBackups"
import { Button } from "@/components/ui/button"
import { useLeaderboardStore } from "@/store/leaderboardStore"
import { DatabaseBackupIcon, PowerIcon } from "lucide-react"

export default function Floating() {
  const { players } = useLeaderboardStore()
  const connectedUsers = players.filter(({ isOnline }) => isOnline)
  const isPlural = connectedUsers.length !== 1 && 's'
  return (
    <div className='h-0 sticky bottom-0 left-0 flex justify-between items-end p-2'>
      <div className='flex flex-col gap-y-2 p-2 bg-white/70 filter backdrop-blur-sm rounded'>
        <ModalBackups>
          <Button
            className='p-5 bg-white/70 filter backdrop-blur-sm'
            variant='outline'
            size='icon'
            title='Recuperación de perfiles'
          >
            <DatabaseBackupIcon className='text-slate-900' strokeWidth={1.5} />
          </Button>
        </ModalBackups>
        
        <AlertToTurnOff>
          <Button
            className='p-5 bg-white/70 filter backdrop-blur-sm'
            variant='outline'
            size='icon'
            title='Desconectar cartilla'
          >
            <PowerIcon className='text-slate-900' strokeWidth={1.9} />
          </Button>
        </AlertToTurnOff>
      </div>

      <span className='text-lg bg-white/70 filter backdrop-blur-sm py-1 px-5 rounded-full' title='Usuarios conectados'>
        <span className='font-bold'>{connectedUsers.length}</span> conectado{isPlural}
      </span>
    </div>
  )
}
