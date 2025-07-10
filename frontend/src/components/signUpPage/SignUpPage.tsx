import React, { useState } from 'react';

// Assumindo que você tem um logo para o Garden Me
// import gardenMeLogo from '../assets/garden-me-logo.png'; // Ajuste o caminho conforme necessário

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Lógica para criar a conta
    console.log('Nome:', name);
    console.log('Email:', email);
    console.log('Senha:', password);
    alert('Criar Conta (Lógica não implementada)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#344E41] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-[#344E41] rounded-lg overflow-hidden shadow-2xl">
        {/* Lado Esquerdo - Logo e Mensagem */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8 text-center text-white">
          {/* Placeholder para o logo. Se você tiver um SVG ou imagem: */}
          {/* <img src={gardenMeLogo} alt="Garden Me Logo" className="w-32 h-32 mb-4" /> */}
          <div className="bg-[#344E41] p-4 rounded-full mb-4"> {/* Cor de fundo do logo: #344E41 */}
            <span className="text-[#A7C957] text-6xl font-bold">G</span> {/* Cor do G: A7C957 */}
          </div>
          <h2 className="text-4xl font-bold mb-2 text-[#A7C957]">Garden Me</h2> {/* Cor do texto: A7C957 */}
          <p className="text-lg text-gray-200 mt-4">
            Cultive sua paixão pela natureza. Crie sua conta e comece sua jornada verde!
          </p>
        </div>

        {/* Lado Direito - Formulário de Cadastro */}
        <div className="md:w-1/2 bg-[#344E41] p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Cadastre-se</h2>
          <p className="text-gray-300 text-center mb-6">
            Já tem uma conta? <a href="/login" className="text-[#A7C957] hover:underline">Fazer Login</a>
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Seu Nome Completo"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.18)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Seu Email"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.18)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Crie sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.18)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirme sua Senha"
                className="w-full p-3 rounded-md bg-[rgba(0,0,0,0.18)] text-white placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
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

          <div className="text-center text-gray-300 my-6">Ou cadastre-se com</div>

          <div className="flex flex-col space-y-4">
            <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              {/* Ícone Google - use um SVG real ou biblioteca de ícones */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="w-5 h-5 mr-2" />
              Google
            </button>
            <button className="w-full flex items-center justify-center p-3 rounded-md border border-gray-500 text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              {/* Ícone Apple - use um SVG real ou biblioteca de ícones */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5 mr-2" />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;