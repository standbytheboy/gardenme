import React, {useState} from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { Carousel } from "../components/carousel/Carousel";
import { MainPlant } from "../components/MainPlant";
import AddedToCartCard from '../components/AddedToCart.tsx'; 

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="bg-[#A7C957] text-[#386641] min-h-screen">
      <Navbar />

      <main className="container">
        <MainPlant onAddToCartClick={handleAddToCartClick}></MainPlant>
        {/* Seção de "Mais Vendidas" */}
        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">Mais Vendidas</h2>
          <Carousel></Carousel>
          <div className="h-10"></div>
          <Carousel></Carousel>
        </section>

        {/* Seção de "Melhores Para Iniciantes" */}
        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">
            Melhores Para Iniciantes
          </h2>
          <Carousel></Carousel>
          <div className="h-10"></div>
          <Carousel></Carousel>
        </section>

        {/* Seção de "Novidades" */}
        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">Novidades</h2>
          <Carousel></Carousel>
          <div className="h-10"></div>
          <Carousel></Carousel>
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
