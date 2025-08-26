// src/components/CheckoutItem.jsx

import { Plant } from "./interfaces";

const CheckoutItem: React.FC<{
    item: Plant;
    onQuantityChange: (id: number, newQuantity: number) => void;
    onRemove: (id: number, itemName: string) => void;
  }> = ({ item, onQuantityChange, onRemove }) => {
  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-start bg-[#F2E8CF] p-4 rounded-4xl mb-4 relative">
      <img
        src={item.imageSrc}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md mr-4"
      />
      <div className="flex-grow">
        <p className="font-semibold text-lg text-[#386641]">{item.name}</p>
        <p className="text-sm text-gray-500">Kit Completo</p>
        <p className="text-sm text-gray-500 mt-1">
          Previsão de Entrega: 07 - 17/Jul
        </p>
        <div className="flex items-center mt-3">
          <div className="flex items-center bg-[#A7C957] rounded-full p-1 mr-4">
            <button
              onClick={handleDecrease}
              className="bg-[#A7C957] text-[#386641] w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            >
              -
            </button>
            <span className="mx-3 text-lg font-semibold text-[#386641]">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="bg-[#A7C957] text-[#386641] w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
          <div className="text-xl font-bold text-[#386641] whitespace-nowrap">
            R$ {(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id, item.name)}
        className="absolute top-4 right-4 text-sm text-red-500 hover:text-red-700 font-semibold"
      >
        Excluir
      </button>
    </div>
  );
};

export default CheckoutItem;