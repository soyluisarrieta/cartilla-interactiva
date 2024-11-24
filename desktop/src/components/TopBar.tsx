import { useState } from 'preact/hooks';
import { CopyIcon, MinusIcon, SquareIcon, XIcon } from 'lucide-react';

const { ipcRenderer } = require('electron');

export default function TopBar() {
  const [isMaximized, setIsMaximized] = useState(true)
  
  // Fn: Cambiar title del botón de maximizar/restaurar
  const handleMaxiRestore = () => {    
    ipcRenderer.send('maximizeRestoreApp')
    ipcRenderer.on('isMaximized', () => { setIsMaximized(true); });
    ipcRenderer.on('isRestored', () => { setIsMaximized(false); });
  }

  return (
    <header 
      id="top-bar" 
      className="w-full absolute top-0 left-0 select-none flex justify-end"
    >
      <div className='[&>button]:p-2'>
        <button 
          id="minimize-window" 
          title="Minimizar"
          className='hover:bg-slate-700'
          onClick={() => ipcRenderer.send('minimizeApp')}
        >
          <MinusIcon className='text-white' size='16' />
        </button>
        <button 
          id="maximize-window" 
          title={isMaximized ? 'Restaurar' : 'Maximizar'}
          className='hover:bg-slate-700'
          onClick={handleMaxiRestore}
        >
          {isMaximized 
              ? <CopyIcon className='-scale-x-100 text-white' size='16' />
              : <SquareIcon className='text-white' size='16' />
          }
        </button>
        <button 
          id="close-window" 
          title="Cerrar"
          className='hover:bg-slate-700'
          onClick={() => ipcRenderer.send('closeApp')}
        >
          <XIcon className='text-white' size='16' />
        </button>
      </div>
    </header>
  );
}
