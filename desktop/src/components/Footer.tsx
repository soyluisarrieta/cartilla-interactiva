import { PATH } from "@/constants";
import { useIPStore } from "@/store/useIPStore";

export default function Footer() {
  const { localIP } = useIPStore();
  return (
    <div className='py-7 bg-slate-100 flex justify-center gap-10 [&>img]:h-16'>
      <img 
        src={`${localIP}/${PATH.LOGOS}/sena.png`} 
        title='Servicio Nacional de Aprendizaje' 
        alt='SENA' 
      />
      <img 
        src={`${localIP}/${PATH.LOGOS}/sennova.png`} 
        title='Sennova' 
        alt='Sennova' 
      />
      <img 
        src={`${localIP}/${PATH.LOGOS}/amazonas-verde.png`} 
        title='Amazonas verde' 
        alt='Amazonas Verde' 
      />
    </div>
  )
}
