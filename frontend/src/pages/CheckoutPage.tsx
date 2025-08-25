import { useState, useEffect } from "react";
import pixIcon from "../assets/pix.svg";
import { Navbar } from "../components/Navbar";
import "../App.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Plant } from "../components/types";

// Interfaces para os dados
interface AddressType {
  name: string;
  details: string;
  cityStateZip: string;
}

interface PaymentMethodType {
  type: string;
  details: string;
  icon?: string;
}

// O OrderItemType agora usa a interface Plant
interface OrderItemType extends Plant {
  deliveryDateRange: string;
}

const CheckoutPage: React.FC = () => {
  const [address] = useState<AddressType>({
    name: "Lucas Morais da Silva",
    details: "Endereço do Usuário Aqui",
    cityStateZip: "Cidade, Estado e Cep",
  });

  const [paymentMethod] = useState<PaymentMethodType>({
    type: "Pix",
    details: "Pix",
    icon: pixIcon,
  });

  // Estado para os itens do carrinho, agora carregados do localStorage
  const [cartItems, setCartItems] = useState<Plant[]>([]);

  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost] = useState(9.99); // Frete fixo para exemplo
  const [discountsApplied] = useState(0); // Removido setDiscountsApplied pois não estava em uso
  const [total, setTotal] = useState(0);

  // Carrega os itens do carrinho do localStorage e calcula os totais
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      const items = JSON.parse(storedCart) as Plant[];
      setCartItems(items);
    }
  }, []);
  
  // Recalcula os totais sempre que o carrinho mudar
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + (item.price as number) * item.quantity,
      0
    );
    setSubtotal(newSubtotal);

    const currentDiscount = 0;
    
    setTotal(newSubtotal + shippingCost - currentDiscount);
  }, [cartItems, shippingCost]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number, itemName: string) => {
    const confirmRemoval = window.confirm(
      `Deseja realmente excluir "${itemName}" do seu pedido?`
    );
    if (confirmRemoval) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  const handleApplyCoupon = () => {
    alert(`Aplicar cupom: ${couponCode}`);
  };

  const navigate = useNavigate();

  const handleConfirmPurchase = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");
    
    if (!userId || !token) {
      alert("Por favor, faça login para finalizar a compra.");
      return;
    }

    const idEndereco = 1; 

    const itemsParaBackend = cartItems.map((item) => ({
      id_produto: item.id,
      quantidade: item.quantity,
      preco_unitario: item.price,
    }));

    try {
      const response = await fetch(`/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_endereco: idEndereco,
          itens: itemsParaBackend,
          pagamento_metodo: paymentMethod.type,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Compra Confirmada!");
        localStorage.removeItem("cartItems");
        navigate(`/pedido-sucesso?orderId=${data.id_pedido}`);
      } else {
        alert(
          `Erro ao finalizar a compra: ${data.mensagem || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  const CheckoutItem: React.FC<{
    item: OrderItemType;
    onQuantityChange: (id: number, newQuantity: number) => void;
    onRemove: (id: number, itemName: string) => void;
  }> = ({ item, onQuantityChange}) => {
    const handleDecrease = () => {
      onQuantityChange(item.id, item.quantity - 1);
    };

    const handleIncrease = () => {
      onQuantityChange(item.id, item.quantity + 1);
    };

    return (
      <div>
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
                R$ {((item.price as number) * item.quantity).toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleRemoveItem(item.id, item.name)}
            className="absolute top-4 right-4 text-sm text-red-500 hover:text-red-700 font-semibold"
          >
            Excluir
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="min-h-screen bg-[#386641] p-4 md:p-8 flex flex-col items-center mt-21">
        <Navbar></Navbar>
        <h1 className="w-full max-w-7xl text-4xl font-bold text-[#A7C957] mb-8 self-start">
          Finalizar Compra
        </h1>

        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#386641]">
                  Seus Endereços
                </h2>
                <button className="bg-transparent text-[#6CAF4B] border border-[#6CAF4B] py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#A7C957] hover:text-[#386641] transition-colors duration-300">
                  Mudar Endereço
                </button>
              </div>
              <p className="text-lg font-medium text-[#386641]">
                {address.name}
              </p>
              <p className="text-gray-600">{address.details}</p>
              <p className="text-gray-600">{address.cityStateZip}</p>
            </div>

            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#386641]">
                  Método de Pagamento
                </h2>
                <button className="bg-transparent text-[#6CAF4B] border border-[#6CAF4B] py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#A7C957] hover:text-[#386641] transition-colors duration-300">
                  Mudar Pagamento
                </button>
              </div>
              <div className="flex items-center">
                {paymentMethod.icon && (
                  <img
                    src={paymentMethod.icon}
                    alt={paymentMethod.type}
                    className="w-6 h-6 mr-3"
                  />
                )}
                <p className="text-lg font-medium text-[#386641]">
                  {paymentMethod.details}
                </p>
              </div>
            </div>

            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <h2 className="text-xl font-semibold text-[#386641] mb-4">
                Seus Itens
              </h2>
              {cartItems.map((item) => (
                <CheckoutItem
                  key={item.id}
                  item={item as unknown as OrderItemType}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
          <div className="lg:w-96 bg-[#F2E8CF] p-6 rounded-4xl self-start sticky top-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-[#386641]">
                Resumo do Pedido
              </h2>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-4">
                <input
                  type="text"
                  placeholder="Cupom de Desconto"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow py-2 px-4 bg-transparent text-[#386641] placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#A7C957] text-[#386641] py-2 px-4 rounded-r-full hover:bg-opacity-90 transition duration-300 text-sm font-semibold whitespace-nowrap"
                >
                  Aplicar
                </button>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-[#386641]">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Frete</span>
                <span className="font-semibold text-[#386641]">
                  R$ {shippingCost.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Descontos aplicados</span>
                <span className="font-semibold text-[#E53E3E]">
                  - R$ {discountsApplied.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="flex justify-between items-center text-2xl font-bold mb-6 text-[#386641]">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <button
              onClick={handleConfirmPurchase}
              className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 cursor-pointer"
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default CheckoutPage;