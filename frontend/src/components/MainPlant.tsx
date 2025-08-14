import React from "react";
import { Accordion } from "../components/Accordion";
import aloeImage from "../assets/aloe.webp";

interface MainPlantProps {
  onAddToCartClick: () => void;
}

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

export const MainPlant: React.FC<MainPlantProps> = ({ onAddToCartClick }) => {
  return (
    <div>
      {/* Seção Principal da Planta */}
      <section className="bg-[#386641] p-8 flex flex-col lg:flex-row items-center gap-8 w-screen mt-20">
        {/* Lado Esquerdo - Detalhes da Planta */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-2 text-[#A7C957]">
            {mainPlantData.name}
          </h1>
          <div className="flex gap-8 items-center">
            <p className="text-3xl font-bold text-[#F2E8CF] mb-4">
              {mainPlantData.price}
            </p>
            <p className="text-sm text-[#F2E8CF] mb-4">
              200 pessoas plantaram essa
            </p>
          </div>
          <p className="mb-4 text-[#F2E8CF] w-[40rem]">{mainPlantData.description}</p>

          {/* Ações e Quantidade */}
          <div className="flex items-center space-x-4 mb-8">
            <span className="font-semibold text-[#A7C957]">Quantidade:</span>
            <div className="flex items-center">
              <button className="px-3 py-1 bg-[#A7C957] text-[#386641] rounded-l-full cursor-pointer">
                -
              </button>
              <input
                type="text"
                value="1"
                readOnly
                className="w-12 text-center bg-[#A7C957] text-[#386641] p-1"
              />
              <button className="px-3 py-1 bg-[#A7C957] text-[#386641] rounded-r-full cursor-pointer">
                +
              </button>
            </div>
            <button onClick={onAddToCartClick} className="bg-[#A7C957] text-[#386641] px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-opacity cursor-pointer">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* Lado Central - Imagem da Planta */}
        <div className="flex justify-center flex-shrink-0">
          <img
            src={mainPlantData.imageSrc}
            alt={mainPlantData.name}
            className="max-w-2 lg:max-w-2xs rounded-lg"
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
      {/* Acordeão de Dicas */}
      <div className="p-4 bg-[#386641] w-screen">
        <Accordion items={accordionData} />
      </div>
    </div>
  );
};
