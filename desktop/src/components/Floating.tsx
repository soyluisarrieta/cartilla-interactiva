import { Button } from "@/components/ui/button"
import { ipcRenderer } from "@/constants"
import { PLAYERS } from "@/mocks/players"
import { DatabaseBackupIcon, PowerIcon } from "lucide-react"

export default function Floating() {
  const connectedUsers = PLAYERS.filter(({isOnline}) => isOnline)
  const isPlural = connectedUsers.length !== 1 && 's'
  return (
    <>
      <div className='max-w-40 fixed bottom-2 left-2 flex flex-col gap-y-4 p-2 bg-white/70 filter backdrop-blur-sm rounded'>
        <Button
          className='scale-125 p-5 bg-white/70 filter backdrop-blur-sm'
          variant='outline'
          size='icon'
          title='Recuperación de perfiles'
        >
          <DatabaseBackupIcon className='text-slate-900' strokeWidth={1.5} />
        </Button>
        <Button
          className='scale-125 p-5 bg-white/70 filter backdrop-blur-sm'
          variant='outline'
          size='icon'
          title='Desconectar cartilla'
          onClick={() => ipcRenderer.send('closeApp')}
        >
          <PowerIcon className='text-slate-900' strokeWidth={1.9} />
        </Button>
      </div>

      <span className='fixed bottom-2 right-2 text-lg bg-white/70 filter backdrop-blur-sm py-1 px-5 rounded-full' title='Usuarios conectados'>
        <span className='font-bold'>{connectedUsers.length}</span> conectado{isPlural}
      </span>
    </>
  )
}
