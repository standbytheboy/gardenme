import { useState } from "react";

const SecuritySettings = () => {
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [isError, setIsError] = useState(false);

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

  return (
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
  );
};

export default SecuritySettings;