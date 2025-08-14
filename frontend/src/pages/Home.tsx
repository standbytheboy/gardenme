import React from 'react';
import { Navbar } from '../components/Navbar';
import { Header } from '../components/Header';
import PopularCategories from '../components/PopularCategories';
import WhyPlantWithUs from '../components/WhyPlantWithUs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

// O componente Home é a "casca" que organiza os outros componentes
const Home: React.FC = () => {
  return (
    // Adicionamos uma div principal com a cor de fundo para a página inteira
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Componente de navegação, fixo no topo da página */}
      <Navbar />

      {/* O conteúdo principal da página */}
      <main>
        {/* Seção principal de destaque, geralmente com uma imagem grande e um título */}
        <Header />

        {/* Seção para mostrar categorias populares de produtos ou serviços */}
        <PopularCategories />

        {/* Seção para destacar os diferenciais do seu negócio */}
        <WhyPlantWithUs />

        {/* Seção com depoimentos de clientes para construir confiança */}
        <Testimonials />
      </main>

      {/* Rodapé da página, com informações de contato e links */}
      <Footer />
    </div>
  );
};

export default Home;