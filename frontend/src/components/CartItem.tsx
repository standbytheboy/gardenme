import React from "react";
import { CartItemProps } from "./interfaces";

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  kit,
  price,
  quantity,
  imageSrc,
  onQuantityChange,
  onRemove,
}) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 mb-4 bg-[#F2E8CF] rounded-2xl">
      <img
        src={imageSrc}
        alt={name}
        className="w-16 h-16 object-cover rounded-md mb-2 sm:mb-0 sm:mr-4"
      />

      <div className="flex-grow mb-2 sm:mb-0">
        <p className="font-semibold text-lg text-[#386641]">{name}</p>
        <p className="text-sm text-gray-500">{kit}</p>
      </div>

      <div className="flex items-center bg-[#A7C957] rounded-2xl p-1 mx-0 sm:mx-4 mb-2 sm:mb-0">
        <button
          onClick={handleDecrease}
          aria-label={`Diminuir quantidade de ${name}`}
          className="text-text-light w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#386641]/20 rounded"
        >
          -
        </button>
        <span className="mx-3 text-lg font-semibold">{quantity}</span>
        <button
          onClick={handleIncrease}
          aria-label={`Aumentar quantidade de ${name}`}
          className="text-text-light w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#386641]/20 rounded"
        >
          +
        </button>
      </div>

      <div className="text-xl font-bold text-[#386641] whitespace-nowrap mr-0 sm:mr-4 mb-2 sm:mb-0">
        R$ {(price * quantity).toFixed(2).replace(".", ",")}
      </div>

      <button
        onClick={() => onRemove(id, name)}
        aria-label={`Remover ${name} do carrinho`}
        className="text-sm text-red-500 hover:text-red-700 font-semibold"
      >
        Excluir
      </button>
    </div>
  );
};

export default CartItem;
