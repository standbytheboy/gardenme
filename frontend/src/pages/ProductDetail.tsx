import React from 'react';
import { Navbar } from '../components/Navbar';
import { Header } from '../components/Header';
import { Accordion } from '../components/Accordion';
import AddedToCartCard from '../components/AddedToCart.tsx'; 
import Footer from '../components/Footer';

interface AccordionItemData {
  header: string;
  content: string;
}

const myPlantData = {
  id: 1,
  name: "Aloe Vera",
  price: "$19.99",
  // ...outras propriedades da planta
};

const Product: React.FC = () => {
  const accordionData: AccordionItemData[] = [
    { header: "What is TypeScript?", content: "TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript." },
    { header: "Why use TypeScript?", content: "TypeScript helps catch errors early, improves code readability, and provides better tooling." },
    { header: "How to install?", content: "You can install TypeScript globally using npm: `npm install -g typescript`." },
  ];

  return (
    // Adicionamos uma div principal com a cor de fundo para a página inteira
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Componente de navegação, fixo no topo da página */}
      <Navbar />

      {/* O conteúdo principal da página */}
      <main>
        {/* Seção principal de destaque, geralmente com uma imagem grande e um título */}
        <Header />
        <Accordion items={accordionData} /> {/* Pass the 'items' prop here */}
        <AddedToCartCard
        productName={myPlantData.name}
        productPrice={myPlantData.price}
      />
        
        </main>

      {/* Rodapé da página, com informações de contato e links */}
      <Footer />
    </div>
  );
};

export default Product;