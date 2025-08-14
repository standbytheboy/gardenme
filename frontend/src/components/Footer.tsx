import React from 'react';
import { LinkedinBoxFill, InstagramFill, XFill } from 'akar-icons';
import Logo from "../assets/gardenme-logo.svg"

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#335A42] text-[#FFFFFF] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center lg:items-start gap-8">
        {/* Coluna do Logo e Redes Sociais */}
        <div className="flex flex-col items-start md:items-start mb-8 md:mb-0">
          <div className="flex items-center mb-4">
            {/* Logo BG: #D4EDC8, Logo Text: #3E6F52 */}
              <img src={Logo} alt="Logo GardenMe" width="150px"/>
          </div>
          <div className="flex space-x-3 mr-40">
            {/* Ícones do LinkedIn: Borda #D4EDC8, Hover BG #D4EDC8, Hover Text #3E6F52 */}
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-[#A7C957] flex items-center justify-center hover:bg-[#D4EDC8] hover:text-[#3E6F52] transition-colors duration-200">
              <InstagramFill strokeWidth={2} size={20} color='#A7C957' />
            </a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-[#A7C957] flex items-center justify-center hover:bg-[#D4EDC8] hover:text-[#3E6F52] transition-colors duration-200">
              <XFill strokeWidth={2} size={20} color='#A7C957' />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-[#A7C957] flex items-center justify-center hover:bg-[#D4EDC8] hover:text-[#3E6F52] transition-colors duration-200">
              <LinkedinBoxFill strokeWidth={2} size={20} color='#A7C957' />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 lg:gap-24 flex-grow w-full md:w-auto">
          {/* Plantas */}
          <div>
            <h3 className="text-[#A7C957] font-bold text-lg mb-4 whitespace-nowrap">Plantas</h3>
            <ul className="space-y-2">
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Todas as Plantas</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Categorias</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Novidades</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Promoções</a></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="text-[#A7C957] font-bold text-lg mb-4 whitespace-nowrap">Ajuda</h3>
            <ul className="space-y-2">
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Dicas e Cuidados</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Guia para Iniciantes</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Perguntas Frequentes</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Privacidade</a></li>
              <li className="hover:text-[#D4EDC8] text-[#A7C957] transition-colors"><a href="#">Pagamento</a></li>
            </ul>
          </div>

          {/* Contatos */}
          <div>
            <h3 className="text-[#A7C957] font-bold text-lg mb-4 whitespace-nowrap">Contatos</h3>
            <ul className="text-[#A7C957] space-y-2">
              <li>(11) 91234-5678</li>
              <li>(11) 91234-5678</li>
              <li>email@email.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;