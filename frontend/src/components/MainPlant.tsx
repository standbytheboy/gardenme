import React from "react";
import { Accordion } from "../components/Accordion";
import { MainPlantProps } from "./interfaces";

// Mock de dados para fallback
const defaultMainPlantData = {
  id: 0,
  name: "Nenhuma planta selecionada",
  price: 0,
  imageSrc: "url_da_imagem_padrao.jpg",
  description: "...",
  rating: 0,
  quantity: 0,
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

export const MainPlant: React.FC<MainPlantProps> = ({
  onAddToCartClick,
  plantData,
}) => {
  const currentPlant = plantData || defaultMainPlantData;

  return (
    <div>
      {/* Seção Principal da Planta */}
      <section className="bg-[#386641] p-16 px-[10rem] flex flex-col lg:flex-row justify-between items-center gap-8 w-screen mt-20">
        {/* Lado Esquerdo - Detalhes da Planta */}
        <div className="flex-1 text-center lg:text-left max-w-min">
          <h1 className="text-5xl font-bold mb-8 text-[#A7C957] w-min-[10rem]">
            {currentPlant.name}
          </h1>
          <div className="flex gap-8 items-center w-100">
            <p className="text-4xl font-bold text-[#F2E8CF] mb-4">
              {` R$ ${currentPlant.price.toFixed(2)
                .replace(".", ",")}`}
            </p>
            <p className=" text-[#F2E8CF] mb-4">
              200 pessoas plantaram essa
            </p>
          </div>
          <p className="text-xl mb-4 text-[#F2E8CF] w-[30rem]">{currentPlant.description}</p>

          {/* Ações e Quantidade */}
          <div className="flex items-center space-x-4 mb-8 w-150">
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
            src={currentPlant.imageSrc}
            alt={currentPlant.name}
            className="w-[20rem] h-[25rem] object-cover rounded-lg"
          />
        </div>

      </section>
      {/* Acordeão de Dicas */}
      <div className="p-4 bg-[#386641] w-screen">
        <Accordion items={accordionData} />
      </div>
    </div>
  );
};
