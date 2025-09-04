import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutItem from "../components/CheckoutItem";
import pixIcon from "../assets/pix.svg";
import { Plant } from "src/components/types";

interface AddressType {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<Plant[]>([]);
  const [couponCode, setCouponCode] = useState("");

  interface PaymentMethodType {
    type: string;
    details: string;
    icon?: string;
  }

  const [paymentMethod] = useState<PaymentMethodType>({
    type: "Pix",
    details: "Pix",
    icon: pixIcon,
  });

  // Busca endereços do usuário
  const fetchUserAddresses = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!userId || !token) return;

    try {
      const response = await fetch(`/api/usuarios/${userId}/enderecos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Erro ao buscar endereços:", await response.text());
        return;
      }

      const data = await response.json();
      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddress(data[0]); // seleciona o primeiro por padrão
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserAddresses();

    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) setCartItems(JSON.parse(storedCart) as Plant[]);
  }, []);

  // Função para confirmar a compra
  const handleConfirmPurchase = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Você precisa fazer login para finalizar a compra.");
      navigate("/login");
      setIsProcessing(false);
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!selectedAddress) {
        alert("Selecione um endereço para continuar.");
        setIsProcessing(false);
        return;
      }

      const orderPayload = {
        id_usuario: Number(localStorage.getItem("userId")),
        id_endereco: selectedAddress.id,
        id_status: 1,
        preco_total: total,
        valor_frete: shippingCost,
        pagamento_metodo: paymentMethod.type,
        pagamento_status: "pendente",
        codigo_rastreio: null,
        itens: cartItems.map((item) => ({
          id_produto: item.id,
          quantidade: item.quantity,
          preco_unitario: item.price,
        })),
      };

      console.log("Dados do pedido prontos para envio:", orderPayload);

      const response = await fetch("api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          `Erro ao finalizar a compra: ${data.message || "Erro desconhecido"}`
        );
        return;
      }

      console.log("Pedido ID:", data.data.id_pedido);
      alert("Compra finalizada com sucesso!");
      // Limpar o localStorage do carrinho
      localStorage.removeItem("cartItems");
      navigate(`/pedido-sucesso`);
    } catch (error) {
      console.error("Erro de conexão ou ao processar a resposta:", error);
      alert(
        "Erro ao processar a compra. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Lógica de cálculo centralizada
  const { subtotal, shippingCost, discountsApplied, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const calculatedShippingCost = 25.0; // Frete fixo
    const calculatedDiscounts = couponCode === "MEUDESCONTO" ? 10.0 : 0;

    const calculatedTotal =
      calculatedSubtotal + calculatedShippingCost - calculatedDiscounts;

    return {
      subtotal: calculatedSubtotal,
      shippingCost: calculatedShippingCost,
      discountsApplied: calculatedDiscounts,
      total: calculatedTotal,
    };
  }, [cartItems, couponCode]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${name} do carrinho?`)) {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );
    }
  };

  const handleApplyCoupon = () => {
    alert(`Cupom ${couponCode} aplicado!`);
  };

  return (
    <div className="mt-15">
      <div className="min-h-[45rem] bg-[#386641] mt-15 px-20 md:p-20 flex flex-col items-center">
        <Navbar />
        <h1 className="w-full max-w-7xl text-4xl font-bold text-[#A7C957] mb-8 self-start">
          Finalizar Compra
        </h1>

        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-8">
            {/* Seus Endereços */}
            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#386641]">
                  Seus Endereços
                </h2>
                <button
                  onClick={() => navigate("/perfil")}
                  className="bg-transparent text-[#6CAF4B] border border-[#6CAF4B] py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#A7C957] hover:text-[#386641] transition-colors duration-300"
                >
                  Adicionar Endereço
                </button>
              </div>
              {addresses.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="flex items-center p-3 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mr-3"/>
                          <div>
                            <p className="font-semibold text-[#386641]">
                              {addr.logradouro}, {addr.numero}
                            </p>
                            <p className="text-gray-500">{addr.bairro}</p>
                            <p className="text-gray-500">
                              {addr.cidade} - {addr.estado}, {addr.cep}
                            </p>
                          </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nenhum endereço cadastrado</p>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#386641]">
                  Método de Pagamento
                </h2>
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

            {/* Seus Itens */}
            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <h2 className="text-xl font-semibold text-[#386641] mb-4">
                Seus Itens
              </h2>
              {cartItems.map((item) => (
                <CheckoutItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Resumo do Pedido */}
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
              disabled={isProcessing}
              className={`w-full py-3 rounded-full text-lg font-semibold transition duration-300 ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#A7C957] text-[#386641] hover:bg-opacity-90 cursor-pointer"
              }`}
            >
              {isProcessing ? "Processando..." : "Confirmar Compra"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
