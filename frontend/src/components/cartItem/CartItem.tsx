import React from 'react';

// Interface para definir a estrutura de um item do carrinho
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
    <div className="flex items-center bg-card-bg p-4 rounded-lg shadow-md mb-4">
      <img src={image} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
      <div className="flex-grow">
        <p className="font-semibold text-lg text-text-dark">{name}</p>
        <p className="text-sm text-gray-500">{kit}</p>
      </div>
      <div className="flex items-center bg-light-green rounded-full p-1 mx-4">
        <button
          onClick={handleDecrease}
          className="bg-button-green text-text-light w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
        >
          -
        </button>
        <span className="mx-3 text-lg font-semibold text-text-dark">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="bg-button-green text-text-light w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
        >
          +
        </button>
      </div>
      <div className="text-xl font-bold text-text-dark whitespace-nowrap">
        R$ {(price * quantity).toFixed(2).replace('.', ',')}
      </div>
    </div>
  );
};

export default CartItem;