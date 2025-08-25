import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { Carousel } from "../components/carousel/Carousel";
import { MainPlant } from "../components/MainPlant";
import AddedToCartCard from "../components/AddedToCart";
import { Plant } from "../components/types";

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainPlant, setMainPlant] = useState<Plant | null>(null);
  // salvando os dados do produto no localStorage
  const [cart, setCart] = useState<Plant[]>(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Carrega o carrinho do localStorage quando o componente monta
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCartClick = () => {
    if (mainPlant) {
      const updatedCart = [...cart];
      const existingItem = updatedCart.find((item) => item.id === mainPlant.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedCart.push({ ...mainPlant, quantity: 1 });
      }

      setCart(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePlantClick = (plant: Plant) => setMainPlant(plant);

  return (
    <div className="bg-[#A7C957] text-[#386641] min-h-screen">
      <Navbar />
      <main className="container">
        <MainPlant
          plantData={mainPlant}
          onAddToCartClick={handleAddToCartClick}
        />

        {/* Seções do carrossel */}
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

      {isModalOpen && mainPlant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddedToCartCard
              productName={mainPlant.name}
              productPrice={`R$ ${mainPlant.price
                .toFixed(2)
                .replace(".", ",")}`}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
