import React, { useState } from 'react';
import userProfilePic from '../../assets/profile-picture.avif'; // Certifique-se de que o caminho está correto

const UserProfileSettings: React.FC = () => {
  // Estados para os dados do usuário
  const [profilePic, setProfilePic] = useState<string | null>(userProfilePic); // Ou null se não tiver foto
  const [firstName, setFirstName] = useState('Fulano');
  const [lastName, setLastName] = useState('Silva');
  const [email, setEmail] = useState('fulano@email.com');
  const [country, setCountry] = useState('Brasil');
  const [aboutMe, setAboutMe] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.');

  // Estado para o item de menu ativo (para simular a navegação lateral)
  const [activeMenuItem, setActiveMenuItem] = useState('Meus Dados');

  const handleTrocarFoto = () => {
    alert('Funcionalidade de trocar foto.');
    // Lógica para upload de nova foto
  };

  const handleExcluirFoto = () => {
    if (window.confirm('Deseja realmente excluir a foto de perfil?')) {
      setProfilePic(null); // Remove a foto
      alert('Foto excluída!');
    }
  };

  const handleSalvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Alterações salvas!');
    console.log({ firstName, lastName, email, country, aboutMe });
    // Lógica para salvar os dados em um backend
  };

  return (
    <div className="min-h-screen bg-[#386641] p-4 md:p-8 flex flex-col items-center">

      {/* Conteúdo principal: Menu Lateral e Painel de Dados */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mt-4">
        {/* Menu Lateral - Fundo: #00000030, Texto: #A7C957 */}
        <div className="lg:w-1/4 bg-[#00000030] p-6 rounded-lg shadow-lg">
          <ul className="space-y-4 text-[#A7C957] text-lg">
            {['Meus Dados', 'Segurança', 'Endereços', 'Meus Pedidos', 'Notificações', 'Excluir Conta', 'Suporte'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => setActiveMenuItem(item)}
                  className={`w-full text-left py-2 px-4 rounded-md transition-colors duration-200
                    ${activeMenuItem === item ? 'bg-[#A7C957] text-[#386641] font-semibold' : 'hover:bg-[rgba(255,255,255,0.1)]'}
                  `}
                >
                  {/* Ícone placeholder para cada item */}
                  <span className="inline-block w-6 h-6 mr-3 bg-gray-400 rounded-sm align-middle"></span>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Painel de Conteúdo (Meus Dados) - Fundo: #344E41, Título: #A7C957 */}
        <div className="flex-1 bg-[#344E41] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#A7C957] mb-6">Meus Dados</h2>

          <form onSubmit={handleSalvarAlteracoes} className="space-y-6">
            {/* Foto de Perfil - Label: #A7C957, Borda da foto: #A7C957, Botões: #A7C957 / #386641 / #EF4444 */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <span className="text-lg text-[#A7C957] min-w-[120px]">Foto de perfil</span>
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={profilePic || 'https://via.placeholder.com/100/A7C957/386641?text=FP'} // Placeholder se não houver foto
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

            {/* Nome - Label: #A7C957, Inputs BG: #00000030, Text: #fff, Placeholder: #D4EDC8 */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
              <label htmlFor="firstName" className="text-lg text-[#A7C957] min-w-[120px]">Nome</label>
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

            {/* Endereço de email - Label: #A7C957, Input BG: #00000030, Text: #fff, Placeholder: #D4EDC8 */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
              <label htmlFor="email" className="text-lg text-[#A7C957] min-w-[120px]">Endereço de email</label>
              <input
                type="email"
                id="email"
                className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full flex-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            {/* País - Label: #A7C957, Input BG: #00000030, Text: #fff, Placeholder: #D4EDC8 */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-baseline justify-between">
              <label htmlFor="country" className="text-lg text-[#A7C957] min-w-[120px]">País</label>
              <input
                type="text"
                id="country"
                className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957] max-w-[30rem] w-full flex-none"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Brasil"
              />
            </div>

            {/* Sobre mim - Label: #A7C957, Textarea BG: #00000030, Text: #fff, Placeholder: #D4EDC8 */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start justify-between">
              <label htmlFor="aboutMe" className="text-lg text-[#A7C957] min-w-[120px] mt-2">Sobre mim</label>
              <textarea
                id="aboutMe"
                className="p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#A7C957] focus:outline-none focus:ring-2 focus:ring-[#A7C957] h-32 resize-y max-w-[30rem] w-full flex-none"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="Conte-nos um pouco sobre você..."
              ></textarea>
            </div>

            {/* Botão Salvar alterações - BG: #A7C957, Text: #386641 */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#A7C957] text-[#386641] py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;