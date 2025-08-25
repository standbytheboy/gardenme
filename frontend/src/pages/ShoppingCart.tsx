import { useState, useEffect } from "react";
import CartItem from "../components/CartItem.tsx";
import { Navbar } from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import '../App.css'
import { useNavigate } from "react-router-dom";

interface CartItemType {
  id: string;
  name: string;
  kit: string;
  price: number;
  quantity: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discountsApplied] = useState(0);

  useEffect(() => {
    // Carrega o carrinho do localStorage ao iniciar
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Efeito para recalcular sempre que os itens do carrinho mudarem
  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // Simplificado, você pode adicionar a lógica de frete e desconto aqui
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0) // Remove o item se a quantidade for 0
    );
  };
  const navigate = useNavigate(); 

  return (
    <div className="mt-21">
      <Navbar></Navbar>
      <div className="min-h-[12rem] bg-[#386641] p-20 md:p-20 flex flex-col items-center">
        <h1 className="w-full max-w-7xl text-4xl font-bold text-[#A7C957] mb-8 self-start">
          Seu Carrinho
        </h1>

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
            <h2 className="text-xl font-semibold mb-4 text-text-dark">
              Subtotal
            </h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-text-dark">
                R$ {subtotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Descontos aplicados</span>
              <span className="font-semibold text-discount-red">
                - R$ {discountsApplied.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between items-center text-2xl font-bold mb-6 text-text-dark">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 cursor-pointer">
              Continuar Compra
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ShoppingCart;
