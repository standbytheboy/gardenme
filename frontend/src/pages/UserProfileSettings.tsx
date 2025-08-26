import { useState } from "react";
import AddressManager from "../components/AddressManager.tsx";
import Footer from "../components/Footer.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { Sidebar9 } from "../components/SidebarUserSettings.tsx";
import { useNavigate } from "react-router-dom";
import MyOrders from "../components/MyOrders.tsx";
import SecuritySettings from "../components/SecuritySettings.tsx";
import { logout } from "../utils/authUtils";
import UserData from "../components/UserData.tsx";


const UserProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin] = useState(false);
  // Estado para o item de menu ativo na sidebar
  const [activeMenuItem, setActiveMenuItem] = useState("Meus Dados");

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
      )
    ) {
      return;
    }

    const idDoUsuario = localStorage.getItem("userId");
    const tokenDeAutenticacao = localStorage.getItem("userToken");

    if (!idDoUsuario || !tokenDeAutenticacao) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${idDoUsuario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenDeAutenticacao}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "Conta excluída com sucesso! Você será redirecionado para a página inicial."
        );
        logout(); // Usa a função de utilidade para limpar e notificar
        navigate("/");
      } else {
        alert(
          "Erro ao excluir a conta: " + (data.mensagem || "Erro desconhecido.")
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  return (
    <div className="mt-10">
      <Navbar></Navbar>
      <div className="min-h-screen flex items-center justify-center bg-[#386641] p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl h-[80vh] rounded-lg overflow-hidden">
          <Sidebar9
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
            isAdmin={isAdmin}
          />

          <div className="flex-1 bg-[#00000050] p-4 px-20 rounded-lg shadow-lg overflow-auto flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#A7C957] mb-6">
              {activeMenuItem}
            </h2>

            {activeMenuItem === "Meus Dados" && (<UserData />)}
            {activeMenuItem === "Segurança" && (<SecuritySettings />)}
            {activeMenuItem === "Endereços" && <AddressManager />}
            {activeMenuItem === "Meus Pedidos" && (<MyOrders />)}
            {activeMenuItem === "Excluir conta" && (
              <div className="flex flex-col gap-6 items-center">
                <p className="text-lg text-red-400 text-center">
                  Atenção: A exclusão da sua conta é uma ação permanente e não
                  pode ser desfeita. Todos os seus dados, pedidos e informações
                  serão perdidos.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  Confirmar Exclusão da Conta
                </button>
              </div>
            )}
            {activeMenuItem === "Suporte" && (
              <div className="flex flex-col gap-6">
                <p className="text-lg text-[#F2E8CF]">
                  Precisa de ajuda? Preencha o formulário abaixo para entrar em
                  contato com nossa equipe.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Mensagem enviada com sucesso!");
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-lg text-[#A7C957] mb-2"
                      >
                        Assunto
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                        placeholder="Ex: Problema com pedido, Dúvida sobre planta, etc."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-lg text-[#A7C957] mb-2"
                      >
                        Sua Mensagem
                      </label>
                      <textarea
                        id="message"
                        className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957] h-32 resize-y"
                        placeholder="Descreva seu problema ou dúvida..."
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
                      >
                        Enviar Mensagem
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UserProfileSettings;
