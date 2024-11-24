import { Button } from "@/components/ui/button";
import { useLocalIP } from "@/hooks/useLocalIP";
import { ExternalLinkIcon } from "lucide-react";

export default function Header() {
  const localIP = useLocalIP()
  return (
    <div className='p-10 bg-neutral-100'>
      <h1 className='text-5xl text-center font-bold text-black mb-3'>Panel de control</h1>
      <div className='flex justify-center items-center' title='Conéctate a la misma red wifi y accede a la cartilla.'>
        <Button id='ip-local' variant='outline' className='p-5 text-base'>
          <ExternalLinkIcon className='-mr-0.5' />
          {localIP}
        </Button>
      </div>
    </div>
  )
}
