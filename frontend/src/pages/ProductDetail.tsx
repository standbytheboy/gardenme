import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { Carousel } from "../components/carousel/Carousel";
import { MainPlant } from "../components/MainPlant";
import AddedToCartCard from "../components/AddedToCart.tsx";

// Defina uma interface para o objeto de planta para maior segurança de tipo
interface Plant {
  id: number;
  name: string;
  price: string;
  imageSrc: string;
  description: string;
  rating: number;
}

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Adiciona o novo estado para a planta principal.
  const [mainPlant, setMainPlant] = useState<Plant | null>(null);

  const handleAddToCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Nova função para lidar com o clique em uma planta do carrossel
  const handlePlantClick = (plant: Plant) => {
    setMainPlant(plant);
  };

  return (
    <div className="bg-[#A7C957] text-[#386641] min-h-screen">
      <Navbar />

      <main className="container">
        {/* Passa a planta selecionada para o MainPlant */}
        <MainPlant plantData={mainPlant} onAddToCartClick={handleAddToCartClick} />
        {/* Passa a função de clique para o Carousel */}
        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">Mais Vendidas</h2>
          <Carousel onPlantClick={handlePlantClick} />
          <div className="h-10"></div>
          <Carousel onPlantClick={handlePlantClick} />
        </section>

        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">
            Melhores Para Iniciantes
          </h2>
          <Carousel onPlantClick={handlePlantClick} />
          <div className="h-10"></div>
          <Carousel onPlantClick={handlePlantClick} />
        </section>

        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">Novidades</h2>
          <Carousel onPlantClick={handlePlantClick} />
          <div className="h-10"></div>
          <Carousel onPlantClick={handlePlantClick} />
        </section>
      </main>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddedToCartCard
              productName={"Aloevera"}
              productPrice={"R$ 59,99"}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductPage;