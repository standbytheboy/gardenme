import { useState, useRef, useEffect } from "react";
import userProfilePic from "../assets/profile-picture-placeholder.jpg";
import { getProfilePictureUrl } from "../utils/authUtils";

const UserData = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(
    getProfilePictureUrl() || userProfilePic
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Estados para feedback
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

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
        headers: { Authorization: `Bearer ${tokenDeAutenticacao}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Foto de perfil atualizada com sucesso!");
        localStorage.setItem("userProfilePic", data.caminho);
        setProfilePic(getProfilePictureUrl());
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
    if (!window.confirm("Deseja realmente excluir a foto de perfil?")) return;

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
        setProfilePic(null);
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

  // Função para salvar as alterações dos dados do usuário
  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    const idDoUsuario = localStorage.getItem("userId");
    const tokenDeAutenticacao = localStorage.getItem("userToken");

    if (!idDoUsuario || !tokenDeAutenticacao) {
      setMessage("Usuário não autenticado.");
      setIsError(true);
      setLoading(false);
      return;
    }

    const dadosParaAtualizar = {
      nome: firstName,
      sobrenome: lastName,
      email: email,
      celular: celular,
    };

    try {
      const response = await fetch(`/api/usuarios/${idDoUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenDeAutenticacao}`,
        },
        body: JSON.stringify(dadosParaAtualizar),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Dados atualizados com sucesso!");
        setIsError(false);
      } else {
        setMessage(data.mensagem || "Ocorreu um erro ao atualizar os dados.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Erro de conexão com o servidor. Tente novamente.");
      setIsError(true);
      console.error("Erro ao salvar alterações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const idDoUsuario = localStorage.getItem("userId");
      const tokenDeAutenticacao = localStorage.getItem("userToken");
      if (!idDoUsuario || !tokenDeAutenticacao) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/usuarios/${idDoUsuario}`, {
          headers: { Authorization: `Bearer ${tokenDeAutenticacao}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setFirstName(userData.nome || "");
          setLastName(userData.sobrenome || "");
          setEmail(userData.email || "");
          setCelular(userData.celular || "");
          setIsAdmin(userData.is_admin);
          if (userData.caminho_foto_perfil) {
            localStorage.setItem(
              "userProfilePic",
              userData.caminho_foto_perfil
            );
            setProfilePic(getProfilePictureUrl());
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[100dvh]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

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
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 max-w-[30rem] w-full">
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Seu nome"
            className="flex-1 p-3 rounded-md bg-[#00000030] text-white focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
          />
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Seu sobrenome"
            className="flex-1 p-3 rounded-md bg-[#00000030] text-white focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
        <label htmlFor="email" className="text-lg text-[#A7C957] min-w-[120px]">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="p-3 rounded-md bg-[#00000030] text-white focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
        <label
          htmlFor="celular"
          className="text-lg text-[#A7C957] min-w-[120px]"
        >
          Celular
        </label>
        <input
          type="tel"
          id="celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          placeholder="(11) 99999-9999"
          className="p-3 rounded-md bg-[#00000030] text-white focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full"
        />
      </div>

      {message && (
        <p
          className={`text-center font-semibold ${
            isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default UserData;
