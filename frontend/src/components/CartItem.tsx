import React from 'react';
import { CartItemProps } from './interfaces';

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  kit,
  price,
  quantity,
  imageSrc,
  onQuantityChange,
  onRemove
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
    <div className="flex items-center p-4 mb-4 bg-[#F2E8CF] rounded-2xl">
  <img src={imageSrc} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
  <div className="flex-grow">
    <p className="font-semibold text-lg text-[#386641]">{name}</p>
    <p className="text-sm text-gray-500">{kit}</p>
  </div>
  <div className="flex items-center bg-[#A7C957] rounded-2xl p-1 mx-4">
    <button
      onClick={handleDecrease}
      className="text-text-light w-8 h-8 flex items-center justify-center text-xl font-bold"
    >
      -
    </button>
    <span className="mx-3 text-lg font-semibold">{quantity}</span>
    <button
      onClick={handleIncrease}
      className="text-text-light w-8 h-8 flex items-center justify-center text-xl font-bold"
    >
      +
    </button>
  </div>
  <div className="text-xl font-bold text-[#386641] whitespace-nowrap mr-4">
    R$ {(price * quantity).toFixed(2).replace('.', ',')}
  </div>
  <button
    onClick={() => onRemove(id, name)}
    className="text-sm text-red-500 hover:text-red-700 font-semibold"
  >
    Excluir
  </button>
</div>
  );
};

export default CartItem;