import { useState } from 'preact/hooks';
import { CopyIcon, MinusIcon, SquareIcon, XIcon } from 'lucide-react';
import { ipcRenderer } from '@/constants';
import AlertToTurnOff from '@/components/AlertToTurnOff';

export default function TopBar() {
  const [isMaximized, setIsMaximized] = useState(true)

  // Fn: Cambiar title del botón de maximizar/restaurar
  const handleMaxiRestore = () => {
    ipcRenderer.send('maximizeRestoreApp')
    ipcRenderer.on('isMaximized', () => { setIsMaximized(true); });
    ipcRenderer.on('isRestored', () => { setIsMaximized(false); });
  }

  return (
    <>
      <header
        id="top-bar"
        className="w-full top-0 left-0 select-none flex justify-end fixed z-50"
      >
        <div className='[&>button]:p-2'>
          <button
            id="minimize-window"
            title="Minimizar"
            className='hover:bg-slate-200/10'
            onClick={() => ipcRenderer.send('minimizeApp')}
          >
            <MinusIcon className='text-white' size='16' />
          </button>
          <button
            id="maximize-window"
            title={isMaximized ? 'Restaurar' : 'Maximizar'}
            className='hover:bg-slate-200/10'
            onClick={handleMaxiRestore}
          >
            {isMaximized
              ? <CopyIcon className='-scale-x-100 text-white' size='16' />
              : <SquareIcon className='text-white' size='16' />
            }
          </button>
          <AlertToTurnOff>
            <button
              id="close-window"
              title="Cerrar"
              className='hover:bg-slate-200/10'
            >
              <XIcon className='text-white' size='16' />
            </button>
          </AlertToTurnOff>
        </div>
      </header>
      <div className='bg-green-700 sticky top-0 w-full h-8 z-30 -mt-8 shadow-lg shadow-green-800/50' />
    </>
  );
}
