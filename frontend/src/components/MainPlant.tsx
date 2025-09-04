import React from "react";
import { MainPlantProps } from "./interfaces";

// Mock de dados para fallback
const defaultMainPlantData = {
  id: 0,
  name: "Nenhuma planta selecionada",
  price: 0,
  imageSrc: "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg",
  description: "...",
  rating: 0,
  quantity: 0,
};

export const MainPlant: React.FC<MainPlantProps> = ({
  onAddToCartClick,
  plantData,
}) => {
  const currentPlant = plantData || defaultMainPlantData;

  return (
    <section className="bg-[#386641] w-full p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 mt-16 lg:mt-20 w-screen">
      
      {/* Lado Esquerdo - Detalhes da Planta (Ordem alterada para melhor visualização no mobile) */}
      <div className="flex justify-center flex-shrink-0 w-full max-w-xs md:max-w-sm lg:w-auto lg:order-2">
        <img
          src={currentPlant.imageSrc}
          alt={currentPlant.name}
          className="w-full h-auto object-cover rounded-lg aspect-[4/5]"
        />
      </div>

      {/* Lado Direito - Imagem da Planta (Ordem alterada para melhor visualização no mobile) */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:order-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#A7C957]">
          {currentPlant.name}
        </h1>

        {/* Informações de Preço e Popularidade */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4">
          <p className="text-3xl md:text-4xl font-bold text-[#F2E8CF]">
            {`R$ ${currentPlant.price.toFixed(2).replace(".", ",")}`}
          </p>
          <p className="text-[#F2E8CF]">
            200 pessoas plantaram essa
          </p>
        </div>

        <p className="text-lg md:text-xl mb-6 text-[#F2E8CF] max-w-lg">
          {currentPlant.description}
        </p>

        {/* Ações e Quantidade */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
          <div className="flex items-center">
            <span className="font-semibold text-[#A7C957] mr-3">Quantidade:</span>
            <div className="flex items-center">
              <button className="px-3 py-1 bg-[#A7C957] text-[#386641] rounded-l-full cursor-pointer">
                -
              </button>
              <input
                type="text"
                value="1"
                readOnly
                className="w-12 text-center bg-[#A7C957] text-[#386641] p-1 focus:outline-none"
              />
              <button className="px-3 py-1 bg-[#A7C957] text-[#386641] rounded-r-full cursor-pointer">
                +
              </button>
            </div>
          </div>
          <button 
            onClick={onAddToCartClick} 
            className="bg-[#A7C957] text-[#386641] px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-opacity cursor-pointer w-full sm:w-auto"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

    </section>
);
};
