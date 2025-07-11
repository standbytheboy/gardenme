import React from 'react';

interface CartItemProps {
  id: string;
  name: string;
  kit: string;
  price: number;
  quantity: number;
  image: string; // URL da imagem
  onQuantityChange: (id: string, newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  kit,
  price,
  quantity,
  image,
  onQuantityChange,
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
    <div className="flex items-center p-4 mb-4">
      <img src={image} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
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
      <div className="text-xl font-bold text-[#386641] whitespace-nowrap">
        R$ {(price * quantity).toFixed(2).replace('.', ',')}
      </div>
    </div>
  );
};

export default CartItem;