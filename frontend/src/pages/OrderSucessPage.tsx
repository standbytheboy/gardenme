import React from "react";
import successIllustration from "../assets/Reforestation-cuate.svg";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Captura o número do pedido passado pelo CheckoutPage
  const orderNumber = location.state?.orderNumber || "00000";

  return (
    <div>
      <Navbar />
      <div className="min-h-[45rem] bg-[#386641] px-6 py-12 md:px-20 md:py-20 flex flex-col items-center text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-[#A7C957] mb-6 mt-6 md:mt-0">
          Pedido Realizado com Sucesso!
        </h1>

        <p className="text-base md:text-xl text-[#D4EDC8] max-w-3xl leading-relaxed mb-12">
          Agradecemos a sua compra! Seu pedido #
          <span className="font-semibold">{orderNumber}</span> foi confirmado e
          está sendo preparado com todo carinho. Em breve, a natureza estará
          batendo à sua porta.
        </p>

        <div className="mb-12">
          <img
            src={successIllustration}
            alt="Pedido Realizado"
            className="mx-auto w-64 md:w-80"
          />
        </div>

        <p className="text-sm md:text-lg text-[#D4EDC8] max-w-3xl leading-relaxed mb-10">
          Você receberá um e-mail com os detalhes e o acompanhamento da entrega.
          Enquanto isso, explore mais plantas ou prepare o cantinho da sua nova
          amiga verde!
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-lg mb-10">
          <button
            onClick={() => navigate("/perfil")}
            className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full text-base md:text-lg font-semibold hover:opacity-90 transition duration-300 shadow-lg"
          >
            Ver Meus Pedidos
          </button>
          <button
            onClick={() => navigate("/plantas")}
            className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full text-base md:text-lg font-semibold hover:opacity-90 transition duration-300 shadow-lg"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
