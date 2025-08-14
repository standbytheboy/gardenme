import React from 'react';

// 1. Defina a interface para as props do AddedToCartCard
interface AddedToCartCardProps {
  productName: string; // Propriedade para o nome do produto
  productPrice: string; // Propriedade para o preço do produto
}

// 2. Use a interface na função do componente
const AddedToCartCard = ({ productName, productPrice }: AddedToCartCardProps) => {
  return (
    <div className="w-[360px] h-[150px] bg-[#A7C957] rounded-xl shadow-lg shadow-black/10 mx-auto px-2 backdrop-blur-md z-50">
      <div className="inline-flex flex-nowrap items-center w-full">
        <div className="w-1/5">
          <div className="bg-[#] w-12 h-12 rounded-full text-center p-3 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 576 512"
              fill="#000"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
            </svg>
          </div>
        </div>

        <div className="w-4/5">
          <div className="inline-flex flex-nowrap items-baseline w-full">
            <span className="w-[95%] text-base font-semibold text-gray-800 pt-5 pl-2.5">
              Adicionado ao Carrinho!
            </span>
            <span className="w-[5%] text-right pr-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="15"
                width="15"
                viewBox="0 0 384 512"
                className="cursor-pointer fill-black/20 transition-all duration-300 ease-in-out hover:fill-black/60"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
              </svg>
            </span>
          </div>
          {/* Usando a prop productName aqui */}
          <div className="text-sm text-gray-700 pt-2.5 pl-2.5 hover:cursor-pointer hover:underline">
            {productName}
          </div>
          {/* Usando a prop productPrice aqui */}
          <div className="text-sm font-semibold text-gray-700 pb-2.5 pl-2.5">
            {productPrice}
          </div>
          <button className="relative transition-all duration-300 ease-in-out shadow-lg shadow-black/20 py-2 px-5 bg-[#386641] rounded-full flex items-center justify-center text-white gap-2.5 font-bold border-2outline-none overflow-hidden text-base cursor-pointer h-[35px] group">
            Ver Carrinho
            <svg
              className="w-6 h-6 transition-all duration-300 ease-in-out group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="absolute w-[100px] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent top-0 -left-full opacity-60 group-hover:animate-shine"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddedToCartCard;