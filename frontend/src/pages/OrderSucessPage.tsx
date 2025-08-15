import React from "react";
import successIllustration from "../assets/Reforestation-cuate.svg"; // Substitua pelo caminho da sua imagem real
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface OrderSuccessPageProps {
  orderNumber?: string; // Opcional, caso você queira passar o número do pedido
}


const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderNumber = "12345",
}) => {
  
  const navigate = useNavigate();

  return (
    <div className="mt-21">
      <Navbar></Navbar>
      <div className="min-h-screen bg-[#344E41] text-center flex flex-col items-center justify-center p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#A7C957] mb-6">
          Pedido Realizado com Sucesso!
        </h1>

        <p className="text-lg md:text-xl text-[#D4EDC8] max-w-3xl leading-relaxed mb-12">
          Agradecemos a sua compra! Seu pedido #
          <span className="font-semibold">{orderNumber}</span> foi confirmado e
          está sendo preparado com todo carinho. Em breve, a natureza estará
          batendo à sua porta.
        </p>

        <div className="mb-12">
          <img
            src={successIllustration}
            alt="Pedido Realizado"
            className="mx-auto size-[20rem]"
          />
        </div>

        <p className="text-md md:text-lg text-[#D4EDC8] max-w-3xl leading-relaxed mb-10">
          Você receberá um e-mail com os detalhes e o acompanhamento da entrega.
          Enquanto isso, explore mais plantas ou prepare o cantinho da sua nova
          amiga verde!
        </p>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 w-full max-w-lg">
          <button onClick={() => navigate('/perfil')} className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full text-lg font-semibold hover:opacity-90 transition duration-300 shadow-lg">
            Ver Meus Pedidos
          </button>
          <button onClick={() => navigate('/plantas')} className="cursor-pointer flex-1 bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full text-lg font-semibold hover:opacity-90 transition duration-300 shadow-lg">
            Continuar Comprando
          </button>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default OrderSuccessPage;
