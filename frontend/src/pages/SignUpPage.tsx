import { useState } from "react";
import { GoogleContainedFill } from "akar-icons";
import appleLogo from "../assets/apple-logo.svg";
import gardenMeLogo from "../assets/logos/classic-classic.png";
import { useNavigate } from "react-router-dom";
import { ServerResponse } from "src/components/interfaces";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(
        "api/registrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: name,
            sobrenome: lastName,
            email,
            celular: numberPhone,
            senha: password,
          }),
        }
      );

      let data: ServerResponse = { mensagem: "" };
      const text = await response.text();

      // Tenta converter em JSON, mas se falhar, mantém como string
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        if (err instanceof SyntaxError) {
          // Isso é um erro de sintaxe, pode ser o parse do JSON falhando
          console.error("Ocorreu um erro de sintaxe:", err.message);
        } else if (err instanceof Error) {
          console.error("Ocorreu um erro:", err.message);
        }
      }

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        // Se o back-end retornou uma mensagem, mostra, senão mostra texto cru
        alert("Erro: " + (data.mensagem || text));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao fazer cadastro. Tente novamente.");
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
            Cultive sua paixão pela natureza. Crie sua conta e comece sua
            jornada verde!
          </p>
        </div>

        {/* Lado Direito - Formulário de Cadastro */}
        <div className="w-full md:w-1/2 bg-[#344E41] p-6 sm:p-8 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Cadastre-se
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Já tem uma conta?{" "}
              <span
                className="text-[#A7C957] hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Fazer Login
              </span>
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* MUDANÇA: Inputs de nome/sobrenome agora empilham em telas pequenas */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Primeiro Nome"
                  className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              {/* O resto dos inputs já era responsivo com w-full */}
              <input type="email" placeholder="Seu Email" className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="text" placeholder="Seu Celular" className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]" value={numberPhone} onChange={(e) => setNumberPhone(e.target.value)} required />
              <input type="password" placeholder="Crie sua Senha" className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirme sua Senha" className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.30)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              
              <button
                type="submit"
                className="w-full bg-[#A7C957] text-[#344E41] py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Criar Conta
              </button>
            </form>

            <div className="text-center text-gray-300 my-6">
              Ou cadastre-se com
            </div>
            
            {/* MUDANÇA: Botões sociais agora empilham em telas pequenas */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                <GoogleContainedFill
                  strokeWidth={2}
                  size={24}
                  className="mr-2"
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
    </div>
  );
};

export default SignupPage;
