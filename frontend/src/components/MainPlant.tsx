import React from 'react';
import { Accordion } from "../components/Accordion";
import aloeImage from "../assets/aloe.webp"; // Imagem da Aloe Vera

// Mock de dados para a planta principal e para os cards de "Mais Vendidas", "Iniciantes" e "Novidades"
const mainPlantData = {
  id: 1,
  name: "Aloevera",
  price: "R$ 59,99",
  description:
    "Também conhecida como babosa, é uma planta suculenta amplamente utilizada por suas propriedades medicinais, cosméticas e terapêuticas.",
  // Suponha que você tenha uma propriedade de imagem na interface da planta
  imageSrc: aloeImage,
};

const accordionData = [
  {
    header: "Dicas e Cuidados Especiais",
    content: "Conteúdo de dicas e cuidados...",
  },
  {
    header: "Informações Técnicas",
    content: "Conteúdo de informações técnicas...",
  },
];

export const MainPlant: React.FC = () => {
  return (
    <div>
      {/* Seção Principal da Planta */}
      <section className="bg-[#A7C957] rounded-lg p-8 flex flex-col lg:flex-row items-center gap-8">
        {/* Lado Esquerdo - Detalhes da Planta */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-2">{mainPlantData.name}</h1>
          <p className="text-sm text-gray-700 mb-4">
            200 pessoas plantaram essa
          </p>
          <p className="text-3xl font-bold text-[#386641] mb-4">
            {mainPlantData.price}
          </p>
          <p className="mb-4">{mainPlantData.description}</p>

          {/* Ações e Quantidade */}
          <div className="flex items-center space-x-4 mb-8">
            <span className="font-semibold">Quantidade:</span>
            <div className="flex items-center">
              <button className="px-3 py-1 bg-[#386641] text-white rounded-l-full">
                -
              </button>
              <input
                type="text"
                value="1"
                readOnly
                className="w-12 text-center bg-white border-y border-[#386641] text-[#386641] p-1"
              />
              <button className="px-3 py-1 bg-[#386641] text-white rounded-r-full">
                +
              </button>
            </div>
            <button className="bg-[#386641] text-[#F2E8CF] px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-opacity">
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Acordeão de Dicas */}
          <div className="bg-white/50 rounded-lg p-4">
            <Accordion items={accordionData} />
          </div>
        </div>

        {/* Lado Central - Imagem da Planta */}
        <div className="flex justify-center flex-shrink-0">
          <img
            src={mainPlantData.imageSrc}
            alt={mainPlantData.name}
            className="max-w-xs lg:max-w-sm rounded-lg"
          />
        </div>

        {/* Lado Direito - Botões de Características */}
        <div className="flex flex-col items-stretch space-y-4 flex-shrink-0">
          <button className="bg-[#F2E8CF] text-[#386641] font-semibold py-3 px-6 rounded-full hover:bg-opacity-80 transition-colors">
            Umidade
          </button>
          <button className="bg-[#F2E8CF] text-[#386641] font-semibold py-3 px-6 rounded-full hover:bg-opacity-80 transition-colors">
            Tamanho
          </button>
          <button className="bg-[#F2E8CF] text-[#386641] font-semibold py-3 px-6 rounded-full hover:bg-opacity-80 transition-colors">
            Luz
          </button>
          <button className="bg-[#F2E8CF] text-[#386641] font-semibold py-3 px-6 rounded-full hover:bg-opacity-80 transition-colors">
            Adubação
          </button>
        </div>
      </section>
    </div>
  );
};
