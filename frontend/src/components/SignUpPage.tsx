import { useState } from "react";
import { GoogleContainedFill } from "akar-icons";
import appleLogo from "../assets/apple-logo.svg";
import gardenMeLogo from '../assets/gardenme-logo.svg';

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // Lógica para criar a conta
    alert("Criar Conta (Lógica não implementada)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#344E41] p-4 w-[100vw]">
      <div className="flex flex-col md:flex-row w-full bg-[#344E41] rounded-lg overflow-hidden h-[95vh]">
        {/* Lado Esquerdo - Logo e Mensagem */}
        <div className="bg-[#386641] md:w-1/2 flex flex-col items-center justify-center p-8 text-center h-full mr-[5rem] rounded-4xl">
          <img src={gardenMeLogo} alt="Garden Me Logo" className="w-90 h-90 mb-4" />
          <div className="p-4 rounded-full mb-4">
          </div>
          <p className="text-lg text-gray-200 mt-4">
            Cultive sua paixão pela natureza. Crie sua conta e comece sua
            jornada verde!
          </p>
        </div>

        {/* Lado Direito - Formulário de Cadastro */}
        <div className="md:w-1/2 bg-[#344E41] p-8 flex flex-col justify-center h-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Cadastre-se
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Já tem uma conta?{" "}
            <a href="/login" className="text-[#A7C957] hover:underline">
              Fazer Login
            </a>
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Seu Nome Completo"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Crie sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirme sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#A7C957] text-[#344E41] py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Criar Conta
              </button>
            </div>
          </form>

          <div className="text-center text-gray-300 my-6">
            Ou cadastre-se com
          </div>

          <div className="flex gap-5">
            <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
              <GoogleContainedFill
                strokeWidth={2}
                size={30}
                className="mr-[1rem]"
              />
              Google
            </button>
            <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
              <img src={appleLogo} alt="Apple" className="w-5 h-5 mr-2" />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
