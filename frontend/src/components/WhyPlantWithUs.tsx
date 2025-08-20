import React from 'react';
import plantingIllustration from '../assets/Blooming-amico.svg'; 
import { ActionBtn } from './ActionBtn';

export const WhyPlantWithUs: React.FC = () => {
  return (
    <section className="bg-[#386641] py-16 px-4 md:px-8 flex items-center justify-center min-h-[600px] md:min-h-[800px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Lado Esquerdo - Ilustração */}
        <div className="md:w-1/2 flex justify-center order-2 md:order-1"> {/* order para mobile primeiro */}
          <img
            src={plantingIllustration}
            alt="Pessoa plantando com ideias e natureza"
            className="w-full max-w-md h-auto object-contain"
          />
        </div>

        {/* Lado Direito - Conteúdo de Texto e Botão */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">
          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#A7C957] mb-4 leading-tight">
            Por que plantar com a gente?
          </h2>

          {/* Descrição */}
          <p className="text-lg md:text-xl text-[#D4EDC8] mb-8 max-w-lg leading-relaxed">
            Sua planta merece o melhor! Acesse nossas dicas exclusivas e garanta que ela cresça
            forte e saudável!
          </p>

          <ActionBtn>Dicas Para Você</ActionBtn>
        </div>
      </div>
    </section>
  );
};

export default WhyPlantWithUs;