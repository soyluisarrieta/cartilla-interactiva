import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ipcRenderer } from "@/constants";
import { Unplug } from "lucide-react";

interface Props {
  children: React.ReactNode
}

export default function AlertToTurnOff({ children }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className='gap-2'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl'>¿Deseas desconectar la cartilla?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Los jugadores dejarán de tener acceso hasta que vuelvas a que vuelvas a iniciar la cartilla.
        </AlertDialogDescription>
        <AlertDialogFooter className=''>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction onClick={()=> ipcRenderer.send('closeApp')}>
            <Unplug className='text-slate-200' strokeWidth={1.9} /> Desconectar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
