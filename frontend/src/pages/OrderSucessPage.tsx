import React from "react";
import successIllustration from "../assets/Reforestation-cuate.svg";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Uma boa prática seria obter o ID do pedido da URL (parâmetros) em vez do state,
  // pois o state se perde se o usuário recarregar a página. Mas para o layout, isso não interfere.
  const orderNumber = location.state?.orderNumber || "00000";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-[#386641] px-4 py-64 sm:px-8 md:px-16 flex flex-col justify-center items-center text-center">
        
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#A7C957] mb-4">
            Pedido Realizado com Sucesso!
          </h1>

          <p className="text-lg md:text-xl text-[#D4EDC8] leading-relaxed mb-8">
            Agradecemos a sua compra! Seu pedido #
            <span className="font-semibold">{orderNumber}</span> foi confirmado e
            está sendo preparado.
          </p>

          <div className="mb-8">
            <img
              src={successIllustration}
              alt="Ilustração de uma pessoa regando uma planta"
              className="mx-auto w-60 md:w-80"
            />
          </div>

          <p className="md:text-lg text-[#D4EDC8] leading-relaxed mb-10">
            Você receberá um e-mail com todos os detalhes. Enquanto isso, que tal
            explorar mais um pouco?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
            <button
              onClick={() => navigate("/perfil")}
              className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition duration-300 shadow-lg"
            >
              Ver Meus Pedidos
            </button>
            <button
              onClick={() => navigate("/plantas")}
              className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition duration-300 shadow-lg"
            >
              Continuar Comprando
            </button>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;