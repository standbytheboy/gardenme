import { useState, useEffect } from "react";
import AddressManager from "../components/AddressManager.tsx";
import Footer from "../components/Footer.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { Sidebar9 } from "../components/SidebarUserSettings.tsx";
import { useNavigate } from "react-router-dom";
import MyOrders from "../components/MyOrders.tsx";
import SecuritySettings from "../components/SecuritySettings.tsx";
import { logout } from "../utils/authUtils";
import UserData from "../components/UserData.tsx";
import PlantTips from "../components/PlantTips.tsx";
import { Menu, X } from "lucide-react"; // Ícones para o botão de menu

const UserProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Meus Dados");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar a sidebar no mobile

  useEffect(() => {
    const fetchUserData = async () => {
      const idDoUsuario = localStorage.getItem("userId");
      const tokenDeAutenticacao = localStorage.getItem("userToken");

      if (!idDoUsuario || !tokenDeAutenticacao) {
        console.error("Usuário não autenticado.");
        return;
      }

      try {
        const response = await fetch(`/api/usuarios/${idDoUsuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenDeAutenticacao}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.is_admin);
        } else {
          console.error("Erro ao buscar dados do usuário:", response.status);
        }
      } catch (error) {
        console.error("Erro na requisição de dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

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
        logout();
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-[#386641] pt-16 md:pt-20">
        <div className="container mx-auto p-4 md:p-8">
          {/* Container principal que mantém o seu tamanho personalizado */}
          <div className="relative flex flex-col lg:flex-row gap-8 w-full pt-12 max-w-7xl mx-auto min-h-[80vh]">
            {/* Botão de Menu para Mobile (permanece igual) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden absolute top-2 right-2 z-30 p-2 bg-[#00000050] rounded-full text-white"
              aria-label="Abrir menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
              className={`
            absolute lg:static h-[77vh] z-20 
            transition-transform duration-300 ease-in-out
            w-64 md:w-72  /* Adicione uma largura fixa para a sidebar no modo mobile */
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:w-auto lg:translate-x-0  /* Reseta a largura e a posição em telas grandes */
          `}
            >
              <Sidebar9
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={(item) => {
                  setActiveMenuItem(item);
                  setIsSidebarOpen(false); // Fecha a sidebar ao selecionar um item no mobile
                }}
                isAdmin={isAdmin}
              />
            </div>

            {/* Overlay para fechar a sidebar ao clicar fora */}
            {isSidebarOpen && (
              <div
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-10 lg:hidden"
              ></div>
            )}

            {/* Conteúdo Principal */}
            <div className="flex-1 bg-[#00000050] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg overflow-y-auto">
              {/* O conteúdo renderizado condicionalmente permanece o mesmo */}
              {activeMenuItem === "Meus Dados" && <UserData />}
              {activeMenuItem === "Dicas" && <PlantTips />}
              {activeMenuItem === "Segurança" && <SecuritySettings />}
              {activeMenuItem === "Endereços" && <AddressManager />}
              {activeMenuItem === "Meus Pedidos" && <MyOrders />}
              {activeMenuItem === "Excluir conta" && (
                <div className="flex flex-col gap-6 items-center justify-center h-full text-center">
                  <p className="text-lg text-red-400">
                    Atenção: A exclusão da sua conta é uma ação permanente e não
                    pode ser desfeita.
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
                    Precisa de ajuda? Preencha o formulário abaixo.
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
                          placeholder="Ex: Problema com pedido..."
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
      </main>
      <Footer />
    </div>
  );
};

export default UserProfileSettings;
