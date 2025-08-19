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
    <div className="min-h-screen flex items-center justify-center bg-[#344E41] p-4 w-[100vw]">
      <div className="flex flex-col justify-center md:flex-row w-full bg-[#344E41] rounded-lg overflow-hidden h-[95vh]">
        {/* Lado Esquerdo - Logo e Mensagem */}
        <div className="bg-[#386641] md:w-1/2 flex flex-col items-center justify-center p-8 text-center h-full mr-[5rem] rounded-4xl">
          <img
            src={gardenMeLogo}
            alt="Garden Me Logo"
            className="w-[35rem] h-[35rem] mb-4"
          />
          <div className="p-4 rounded-full mb-4"></div>
          <p className="text-lg text-gray-200 mt-4">
            A natureza mais perto de você. Faça seu login e cultive sua paixão!
          </p>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="md:w-1/2 bg-[#344E41] p-8 flex flex-col justify-center h-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Não tem uma conta?{" "}
            <span className="text-[#A7C957] hover:underline cursor-pointer" onClick={() => navigate('/signup')}>
              Cadastre-se
            </span>
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Seu Email"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#A7C957] text-[#344E41] py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Fazer Login
              </button>
            </div>
          </form>

          <div className="text-center text-gray-300 my-6">
            Ou faça login com
          </div>

          <div className="flex gap-5">
            <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <GoogleContainedFill
                strokeWidth={2}
                size={30}
                className="mr-[1rem]"
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
  );
};

export default LoginPage;
