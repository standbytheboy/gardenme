import { useState, useEffect } from "react";
import CartItem from "../components/CartItem.tsx";
import { Navbar } from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { CartItemType } from "src/components/interfaces.tsx";

const ShoppingCart: React.FC = () => {
  // ... (toda a sua lógica de state e funções permanece a mesma)
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

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems((prev) => {
      const updatedItems = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleRemoveItem = (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${name} do carrinho?`)) {
      setCartItems((prev) => {
        const updatedItems = prev.filter((item) => item.id !== id);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };

  const navigate = useNavigate();


  return (
    // A classe mt-21 provavelmente corresponde à altura do seu Navbar. Se o Navbar for responsivo,
    // talvez essa margem também precise ser.
    <div className="mt-21">
      <Navbar />
      <div className="min-h-[70vh] bg-[#386641] px-4 py-16 md:px-8 lg:px-16 lg:py-12 flex flex-col items-center">
        
        <h1 className="w-full max-w-7xl text-3xl sm:text-4xl font-bold text-[#A7C957] mb-8 self-start">
          Seu Carrinho
        </h1>

        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-[#F2E8CF] p-4 sm:p-6 rounded-4xl shadow-lg">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  kit={item.kit || ""}
                  price={item.price}
                  quantity={item.quantity}
                  imageSrc={item.imageSrc || ""}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 py-8">Seu carrinho está vazio.</p>
            )}
          </div>
          <div className="lg:w-96 bg-[#F2E8CF] p-6 rounded-4xl shadow-lg self-start lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-4 text-text-dark">
              Resumo do Pedido
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
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 cursor-pointer"
            >
              Continuar Compra
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;