import { useState } from "react";
import userProfilePic from "../assets/profile-picture.avif";
import { Sidebar9 } from "../components/SidebarUserSettings.tsx";
import { Navbar } from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

const UserProfileSettings: React.FC = () => {
  // Estados para os dados do usuário
  const [profilePic, setProfilePic] = useState<string | null>(userProfilePic);
  const [firstName, setFirstName] = useState("Fulano");
  const [lastName, setLastName] = useState("Silva");
  const [email, setEmail] = useState("fulano@email.com");
  const [country, setCountry] = useState("Brasil");
  const [aboutMe, setAboutMe] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
  );

  // Estado para o item de menu ativo na sidebar
  const [activeMenuItem, setActiveMenuItem] = useState("Meus Dados"); // Mantenha este estado aqui

  const handleTrocarFoto = () => {
    alert("Funcionalidade de trocar foto.");
  };

  const handleExcluirFoto = () => {
    if (window.confirm("Deseja realmente excluir a foto de perfil?")) {
      setProfilePic(null);
      alert("Foto excluída!");
    }
  };

  const handleSalvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Alterações salvas!");
    console.log({ firstName, lastName, email, country, aboutMe });
  };

  return (
    <div className="mt-10">
      <Navbar></Navbar>
      <div className="min-h-screen flex items-center justify-center bg-[#386641] p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl h-[80vh] rounded-lg overflow-hidden">
          <Sidebar9
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
          />

          <div className="flex-1 bg-[#344E41] p-15 rounded-lg shadow-lg overflow-auto flex flex-col justify-center">
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
              <div className="text-lg text-white">Conteúdo de Segurança...</div>
            )}
            {activeMenuItem === "Endereços" && (
              <div className="text-lg text-white">Seus Endereços aqui...</div>
            )}
            {activeMenuItem === "Meus Pedidos" && (
              <div className="text-lg text-white">Histórico de Pedidos...</div>
            )}
            {activeMenuItem === "Notificações" && (
              <div className="text-lg text-white">
                Configurações de Notificações...
              </div>
            )}
            {activeMenuItem === "Excluir conta" && (
              <div className="text-lg text-red-500">
                Opções para Excluir Conta...
              </div>
            )}
            {activeMenuItem === "Suporte" && (
              <div className="text-lg text-white">
                Entre em Contato com o Suporte...
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
