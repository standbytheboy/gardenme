import React, { useState, useEffect } from 'react';
import CartItem from '../cartItem/CartItem.tsx';
import aloeImage from "../../assets/aloe.webp";

// Interface para o tipo de item no estado do carrinho
interface CartItemType {
  id: string;
  name: string;
  kit: string;
  price: number;
  quantity: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  // Estado para os itens do carrinho
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: '1',
      name: 'Aloevera',
      kit: 'Kit Completo',
      price: 59.99,
      quantity: 2,
      image: aloeImage,
    },
    {
      id: '2',
      name: 'Aloevera',
      kit: 'Kit Completo',
      price: 59.99,
      quantity: 1,
      image: aloeImage,
    },
    {
      id: '3',
      name: 'Aloevera',
      kit: 'Kit Completo',
      price: 59.99,
      quantity: 1,
      image: aloeImage,
    },
    {
      id: '4',
      name: 'Aloevera',
      kit: 'Kit Completo',
      price: 59.99,
      quantity: 1,
      image: aloeImage,
    },
    {
      id: '5',
      name: 'Aloevera',
      kit: 'Kit Completo',
      price: 59.99,
      quantity: 1,
      image: aloeImage,
    },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [discountsApplied, setDiscountsApplied] = useState(0); // Exemplo de desconto
  const [total, setTotal] = useState(0);

  // Efeito para recalcular subtotal, desconto e total sempre que os itens do carrinho mudarem
  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);

    // Lógica de desconto - para o exemplo, vamos simular um desconto fixo
    // No seu layout, o desconto é R$ -59,99. Se o subtotal for R$ 119.98,
    // o desconto de R$ 59.99 o leva a R$ 59.99.
    // Vamos fazer um desconto que "zeraria" alguns itens, como no exemplo
    const simulatedDiscount = newSubtotal > 59.99 ? 59.99 : 0;
    setDiscountsApplied(simulatedDiscount);

    setTotal(newSubtotal - simulatedDiscount);
  }, [cartItems]);

  // Função para mudar a quantidade de um item
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#3E6F52] p-4 md:p-8 flex flex-col items-center">

      <h1 className="w-full max-w-7xl text-4xl font-bold text-[#A7C957] mb-8 self-start">Seu Carrinho</h1>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* Lista de Itens do Carrinho */}
        <div className="flex-1 bg-[#F2E8CF] p-6 rounded-4xl shadow-lg">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:w-96 bg-[#F2E8CF] p-6 rounded-4xl shadow-lg self-start sticky top-8">
          <h2 className="text-xl font-semibold mb-4 text-text-dark">Subtotal</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-text-dark">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Descontos aplicados</span>
            <span className="font-semibold text-discount-red">- R$ {discountsApplied.toFixed(2).replace('.', ',')}</span>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between items-center text-2xl font-bold mb-6 text-text-dark">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <button className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300">
            Continuar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;