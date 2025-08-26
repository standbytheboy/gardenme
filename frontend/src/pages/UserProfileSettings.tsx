import { useState, useEffect, useRef } from "react";
import AddressManager from "../components/AddressManager.tsx";
import Footer from "../components/Footer.tsx";
import { getProfilePictureUrl, logout } from "../utils/authUtils";
import { Navbar } from "../components/Navbar.tsx";
import { Sidebar9 } from "../components/SidebarUserSettings.tsx";
import { useNavigate } from "react-router-dom";
import userProfilePic from "../assets/profile-picture-placeholder.jpg";
import MyOrders from "../components/MyOrders.tsx";

const UserProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Estados para os dados do usuário
  const [profilePic, setProfilePic] = useState<string | null>(
    getProfilePictureUrl() || userProfilePic
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [aboutMe, setAboutMe] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
  );

  // Estados para a seção de segurança
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Estado para o item de menu ativo na sidebar
  const [activeMenuItem, setActiveMenuItem] = useState("Meus Dados");

  // useEffect para buscar dados do usuário
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
          setFirstName(userData.nome);
          setLastName(userData.sobrenome);
          setEmail(userData.email);
          setIsAdmin(userData.is_admin);

          if (userData.caminho_foto_perfil) {
            localStorage.setItem(
              "userProfilePic",
              userData.caminho_foto_perfil
            );
            setProfilePic(getProfilePictureUrl());
          }
        } else {
          console.error("Erro ao buscar dados do usuário:", response.status);
        }
      } catch (error) {
        console.error("Erro na requisição de dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  // useEffect para atualizar a foto sempre que voltar para a página ou quando localStorage mudar
  useEffect(() => {
    const updatePhoto = () => {
      setProfilePic(getProfilePictureUrl() || userProfilePic);
    };

    window.addEventListener("focus", updatePhoto);
    window.addEventListener("storage", updatePhoto);

    return () => {
      window.removeEventListener("focus", updatePhoto);
      window.removeEventListener("storage", updatePhoto);
    };
  }, []);

  // Função para lidar com a troca de foto (upload)
  const handleTrocarFoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const idDoUsuario = localStorage.getItem("userId");
    const tokenDeAutenticacao = localStorage.getItem("userToken");

    if (!idDoUsuario || !tokenDeAutenticacao) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await fetch(`/api/usuarios/${idDoUsuario}/foto`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenDeAutenticacao}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Foto de perfil atualizada com sucesso!");
        // Salva apenas o caminho do arquivo no localStorage
        localStorage.setItem("userProfilePic", data.caminho);
        setProfilePic(getProfilePictureUrl()); // Usa a função utilitária para pegar a URL com timestamp
      } else {
        alert(
          "Erro ao trocar a foto: " + (data.mensagem || "Erro desconhecido.")
        );
      }
    } catch (error) {
      console.error("Erro na requisição de upload:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  // Função para lidar com a exclusão da foto
  const handleExcluirFoto = async () => {
    if (!window.confirm("Deseja realmente excluir a foto de perfil?")) {
      return;
    }

    const idDoUsuario = localStorage.getItem("userId");
    const tokenDeAutenticacao = localStorage.getItem("userToken");

    if (!idDoUsuario || !tokenDeAutenticacao) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${idDoUsuario}/foto`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenDeAutenticacao}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Foto excluída!");
        localStorage.removeItem("userProfilePic");
        setProfilePic(null); // Limpa a foto de perfil no estado
      } else {
        alert(
          "Erro ao excluir a foto: " + (data.mensagem || "Erro desconhecido.")
        );
      }
    } catch (error) {
      console.error("Erro na requisição de exclusão:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  const handleSalvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Funcionalidade Salvar Alterações não implementada.");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage("");
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setIsError(true);
      setPasswordChangeMessage("As novas senhas não coincidem.");
      return;
    }

    const idDoUsuario = localStorage.getItem("userId");
    const tokenDeAutenticacao = localStorage.getItem("userToken");
    if (!idDoUsuario || !tokenDeAutenticacao) {
      setIsError(true);
      setPasswordChangeMessage(
        "Erro: ID de usuário ou token não encontrado. Por favor, faça login novamente."
      );
      return;
    }
    try {
      const response = await fetch(`/api/usuarios/${idDoUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenDeAutenticacao}`,
        },
        body: JSON.stringify({
          senhaAtual: currentPassword,
          novaSenha: newPassword,
        }),
      });

      const responseText = await response.text();
      console.log("Status da Resposta:", response.status);
      console.log("Corpo completo da resposta (texto):", responseText);

      if (response.ok) {
        setIsError(false);
        setPasswordChangeMessage("Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        try {
          const data = JSON.parse(responseText);
          if (data && data.mensagem) {
            setIsError(true);
            setPasswordChangeMessage(data.mensagem);
          } else {
            setIsError(true);
            setPasswordChangeMessage(
              "Erro ao alterar a senha. Resposta do servidor desconhecida."
            );
          }
        } catch {
          setIsError(true);
          setPasswordChangeMessage(
            `Erro ao alterar a senha. Resposta inesperada do servidor: ${responseText}`
          );
        }
      }
    } catch (error) {
      setIsError(true);
      console.error("Erro na requisição:", error);
      setPasswordChangeMessage(
        "Erro ao conectar com o servidor. Tente novamente."
      );
    }
  };

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

            {activeMenuItem === "Meus Dados" && (
              <form onSubmit={handleSalvarAlteracoes} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className="text-lg text-[#A7C957] min-w-[120px]">
                    Foto de perfil
                  </span>
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={
                        profilePic ||
                        "https://via.placeholder.com/100/A7C957/386641?text=FP"
                      } // Placeholder se não houver foto
                      alt="Foto de perfil"
                      className="w-18 h-18 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={handleTrocarFoto}
                      className="bg-[#A7C957] text-[#386641] py-2 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
                    >
                      Trocar foto
                    </button>
                    {profilePic && ( // Só mostra o botão de excluir se houver foto
                      <button
                        type="button"
                        onClick={handleExcluirFoto}
                        className="bg-transparent text-[#EF4444] border border-[#EF4444] py-2 px-4 rounded-full font-semibold hover:bg-[#EF4444] hover:text-[#A7C957] transition-colors text-sm"
                      >
                        Excluir foto
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
                  <label
                    htmlFor="firstName"
                    className="text-lg text-[#A7C957] min-w-[120px]"
                  >
                    Nome
                  </label>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 max-w-[30rem] flex-none">
                    <input
                      type="text"
                      id="firstName"
                      className="flex-1 p-3 rounded-md bg-[#00000030] w-[50vw] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Fulano"
                    />
                    <input
                      type="text"
                      id="lastName"
                      className="flex-1 p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Silva"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
                  <label
                    htmlFor="email"
                    className="text-lg text-[#A7C957] min-w-[120px]"
                  >
                    Endereço de email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full flex-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
                  <label
                    htmlFor="country"
                    className="text-lg text-[#A7C957] min-w-[120px]"
                  >
                    País
                  </label>
                  <input
                    type="text"
                    id="country"
                    className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full flex-none"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Brasil"
                  />
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start justify-between">
                  <label
                    htmlFor="aboutMe"
                    className="text-lg text-[#A7C957] min-w-[120px] mt-2"
                  >
                    Sobre mim
                  </label>
                  <textarea
                    id="aboutMe"
                    className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957] h-32 resize-y max-w-[30rem] w-full flex-none"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Conte-nos um pouco sobre você..."
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            )}
            {activeMenuItem === "Segurança" && (
              <div className="flex flex-col gap-6">
                <p className="text-lg text-[#F2E8CF]">
                  Altere sua senha para manter sua conta segura.
                </p>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="text-lg text-[#A7C957]"
                    >
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="text-lg text-[#A7C957]"
                    >
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmNewPassword"
                      className="text-lg text-[#A7C957]"
                    >
                      Confirme a Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {passwordChangeMessage && (
                    <p
                      className={`text-lg text-center ${
                        isError ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {passwordChangeMessage}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
                    >
                      Alterar Senha
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeMenuItem === "Endereços" && <AddressManager />}
            {activeMenuItem === "Meus Pedidos" && (
              <MyOrders />
            )}
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
