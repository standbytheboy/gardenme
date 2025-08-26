import { useState, useRef, useEffect } from "react";
import userProfilePic from "../assets/profile-picture-placeholder.jpg";
import { getProfilePictureUrl } from "../utils/authUtils";


const UserData = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Estados para os dados do usuário
    const [profilePic, setProfilePic] = useState<string | null>(getProfilePictureUrl() || userProfilePic);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("Brasil");
    const [isAdmin, setIsAdmin] = useState(false);
    
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

  return (
    <form onSubmit={handleSalvarAlteracoes} className="space-y-6">
        {isAdmin && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
            <span className="text-lg text-[#A7C957] min-w-[120px]">Status</span>
            <div className="max-w-[30rem] w-full flex-none">
                <span className="bg-yellow-500 text-black py-1 px-3 rounded-full font-bold text-sm">
                Administrador
                </span>
            </div>
            </div>
        )}
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
        <label htmlFor="email" className="text-lg text-[#A7C957] min-w-[120px]">
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

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Salvar alterações
        </button>
      </div>
    </form>
  );
};

export default UserData;
