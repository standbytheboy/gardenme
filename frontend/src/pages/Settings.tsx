import React from 'react';
import { Navbar } from '../components/Navbar';
import { Header } from '../components/Header';
import Footer from '../components/Footer';

const Purchase: React.FC = () => {
  return (
    // Adicionamos uma div principal com a cor de fundo para a página inteira
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Componente de navegação, fixo no topo da página */}
      <Navbar />

      {/* O conteúdo principal da página */}
      <main>
        {/* Seção principal de destaque, geralmente com uma imagem grande e um título */}
        <Header />

        
        </main>

      {/* Rodapé da página, com informações de contato e links */}
      <Footer />
    </div>
  );
};

export default Purchase;