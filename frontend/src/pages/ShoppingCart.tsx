import { useState, useEffect } from "react";
import CartItem from "../components/CartItem.tsx";
import { Navbar } from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import "../App.css";
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
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discountsApplied] = useState(0);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const navigate = useNavigate();

  return (
    <section className="bg-[#386641] min-h-screen flex flex-col mt-15">
      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto mt-20 px-4 sm:px-8 md:px-12 lg:px-20">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#A7C957] mb-6 sm:mb-8">
          Seu Carrinho
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Lista de Itens */}
          <div className="flex-1 bg-[#F2E8CF] p-4 sm:p-6 rounded-3xl shadow-lg">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                Seu carrinho está vazio.
              </p>
            )}
          </div>

          {/* Resumo */}
          <div className="lg:w-96 bg-[#F2E8CF] p-4 sm:p-6 rounded-3xl shadow-lg self-start sticky top-24">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-text-dark">
              Resumo do Pedido
            </h2>
            <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-text-dark">
                R$ {subtotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
              <span className="text-gray-600">Descontos aplicados</span>
              <span className="font-semibold text-discount-red">
                - R$ {discountsApplied.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between items-center text-xl sm:text-2xl font-bold mb-6 text-text-dark">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-opacity-90 transition duration-300 cursor-pointer"
            >
              Continuar Compra
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default ShoppingCart;
