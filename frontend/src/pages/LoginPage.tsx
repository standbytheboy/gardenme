import { useState } from "react";
import { GoogleContainedFill } from "akar-icons";
import appleLogo from "../assets/apple-logo.svg";
import gardenMeLogo from "../assets/logos/classic-classic.png";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userId', data.idDoUsuario)
        navigate("/");
      } else {
        if (data || data.error === 'Credenciais inválidas') {
          alert("Credenciais incorretas. Por favor, verifique seu email e senha.");
        } else {
          alert("Erro ao fazer login. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    // Container principal que centraliza o conteúdo
    <div className="min-h-screen flex items-center justify-center bg-[#344E41] p-4">
      {/* MUDANÇA: Container do card principal. Removido h-[95vh] para altura automática.
          'max-w-6xl' limita a largura em telas muito grandes. */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-[#344E41] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Lado Esquerdo - Logo e Mensagem */}
        <div className="bg-[#386641] md:w-1/2 flex flex-col items-center justify-center p-8 text-center">
          
          {/* MUDANÇA CRÍTICA: Tamanho da imagem agora é responsivo */}
          <img
            src={gardenMeLogo}
            alt="Garden Me Logo"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
          />
          <p className="text-lg text-gray-200 mt-4 max-w-sm">
            A natureza mais perto de você. Faça seu login e cultive sua paixão!
          </p>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full md:w-1/2 bg-[#344E41] p-6 sm:p-8 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Login
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Não tem uma conta?{" "}
              <span
                className="text-[#A7C957] hover:underline cursor-pointer"
                onClick={() => navigate('/signup')}
              >
                Cadastre-se
              </span>
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Seu Email"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#A7C957] text-[#344E41] py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Fazer Login
              </button>
            </form>

            <div className="text-center text-gray-300 my-6">
              Ou faça login com
            </div>

            {/* MUDANÇA: Botões sociais agora empilham em telas pequenas */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <GoogleContainedFill
                  strokeWidth={2}
                  size={24}
                  className="mr-2"
                />
                Google
              </button>
              <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <img src={appleLogo} alt="Apple" className="w-5 h-5 mr-2" />
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;