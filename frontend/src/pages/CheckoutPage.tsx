import { useState, useEffect } from "react";
import aloeImage from "../assets/aloe.webp";
import pixIcon from "../assets/pix.svg";
import { Navbar } from "../components/Navbar";
import "../App.css";
import Footer from "../components/Footer";

// Interfaces para os dados
interface AddressType {
  name: string;
  details: string;
  cityStateZip: string;
}

interface PaymentMethodType {
  type: string;
  details: string; // Ex: 'Pix'
  icon?: string; // URL ou importação de um ícone
}

interface OrderItemType {
  id: string;
  name: string;
  kit: string;
  price: number;
  quantity: number;
  image: string;
  deliveryDateRange: string; // Ex: '07 - 17/Jul'
}

const CheckoutPage: React.FC = () => {
  // Estado para os dados mockados
  const [address, setAddress] = useState<AddressType>({
    name: "Lucas Morais da Silva",
    details: "Endereço do Usuário Aqui",
    cityStateZip: "Cidade, Estado e Cep",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>({
    type: "Pix",
    details: "Pix", // Poderia ser o CPF/CNPJ para PIX ou outros detalhes
    icon: pixIcon,
  });

  const [orderItems, setOrderItems] = useState<OrderItemType[]>([
    {
      id: "1",
      name: "Aloevera",
      kit: "Kit Completo",
      price: 59.99,
      quantity: 2,
      image: aloeImage,
      deliveryDateRange: "07 - 17/Jul",
    },
    {
      id: "2",
      name: "Aloevera",
      kit: "Kit Completo",
      price: 59.99,
      quantity: 2,
      image: aloeImage,
      deliveryDateRange: "07 - 17/Jul",
    },
    {
      id: "3",
      name: "Aloevera",
      kit: "Kit Completo",
      price: 59.99,
      quantity: 2,
      image: aloeImage,
      deliveryDateRange: "07 - 17/Jul",
    },
    {
      id: "4",
      name: "Aloevera",
      kit: "Kit Completo",
      price: 59.99,
      quantity: 2,
      image: aloeImage,
      deliveryDateRange: "07 - 17/Jul",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(9.99); // Frete fixo para exemplo
  const [discountsApplied, setDiscountsApplied] = useState(0);
  const [total, setTotal] = useState(0);

  // Efeito para recalcular subtotal, desconto, frete e total
  useEffect(() => {
    const newSubtotal = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);

    // Lógica de desconto - Simular desconto de 59.99 como na imagem
    const currentDiscount = 59.99; // Assume que 59.99 é um desconto fixo
    setDiscountsApplied(currentDiscount);

    setTotal(newSubtotal + shippingCost - currentDiscount);
  }, [orderItems, shippingCost, discountsApplied]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setOrderItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
          .filter((item) => item.quantity > 0) // Remove item se a quantidade chegar a 0
    );
  };

  // --- MODIFICAÇÃO AQUI: Adicionando a verificação de exclusão ---
  const handleRemoveItem = (id: string, itemName: string) => {
    const confirmRemoval = window.confirm(
      `Deseja realmente excluir "${itemName}" do seu pedido?`
    );
    if (confirmRemoval) {
      setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };
  // ----------------------------------------------------------------

  const handleApplyCoupon = () => {
    // Lógica para aplicar cupom
    alert(`Aplicar cupom: ${couponCode}`);
  };

  const handleConfirmPurchase = () => {
    alert("Compra Confirmada!");
    // Lógica para finalizar a compra (enviar para API, etc.)
  };

  // Reutilizando parte da lógica do CartItem mas adaptando para a tela de checkout
  const CheckoutItem: React.FC<{
    item: OrderItemType;
    onQuantityChange: (id: string, newQuantity: number) => void;
    onRemove: (id: string, itemName: string) => void; // Atualizado para passar o nome do item
  }> = ({ item, onQuantityChange, onRemove }) => {
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
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div className="flex-grow">
            <p className="font-semibold text-lg text-[#386641]">{item.name}</p>
            <p className="text-sm text-gray-500">{item.kit}</p>
            <p className="text-sm text-gray-500 mt-1">
              Previsão de Entrega: {item.deliveryDateRange}
            </p>
            <div className="flex items-center mt-3">
              {/* Botões de quantidade: BG #D4EDC8, Botões internos BG #6CAF4B, Texto #FFFFFF, Quantidade #333333 */}
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
              {/* Preço total do item: #333333 */}
              <div className="text-xl font-bold text-[#386641] whitespace-nowrap">
                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>
          {/* Botão Excluir - CHAMANDO COM O NOME DO ITEM AGORA */}
          <button
            onClick={() => onRemove(item.id, item.name)} // Passando item.name para a função onRemove
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
      <div className="min-h-screen bg-[#3E6F52] p-4 md:p-8 flex flex-col items-center mt-21">
        <Navbar></Navbar>
        {/* Título da Página */}
        <h1 className="w-full max-w-7xl text-4xl font-bold text-[#A7C957] mb-8 self-start">
          Finalizar Compra
        </h1>

        {/* Conteúdo principal: Endereços, Pagamento, Itens, Resumo */}
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          {/* Coluna da Esquerda (Endereço, Pagamento, Itens) */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Seus Endereços */}
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

            {/* Método de Pagamento */}
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

            {/* Itens do Pedido */}
            <div className="bg-[#F2E8CF] p-6 rounded-4xl">
              <h2 className="text-xl font-semibold text-[#386641] mb-4">
                Seus Itens
              </h2>
              {orderItems.map((item) => (
                <CheckoutItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Coluna da Direita (Resumo do Pedido) */}
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
              className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300"
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
