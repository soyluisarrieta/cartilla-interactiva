import { HOST, PATH } from "@/constants";

export default function Footer() {
  return (
    <div className='py-7 bg-slate-100 flex justify-center gap-10 [&>img]:h-16'>
      <img 
        src={`${HOST}/${PATH.LOGOS}/sena.png`} 
        title='Servicio Nacional de Aprendizaje' 
        alt='SENA' 
      />
      <img 
        src={`${HOST}/${PATH.LOGOS}/sennova.png`} 
        title='Sennova' 
        alt='Sennova' 
      />
      <img 
        src={`${HOST}/${PATH.LOGOS}/amazonas-verde.png`} 
        title='Amazonas verde' 
        alt='Amazonas Verde' 
      />
    </div>
  )
}
