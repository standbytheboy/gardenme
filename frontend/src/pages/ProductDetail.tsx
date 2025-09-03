import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { Carousel } from "../components/carousel/Carousel";
import { MainPlant } from "../components/MainPlant";
import AddedToCartCard from "../components/AddedToCart";
import { Plant, ProdutoBackend } from "../components/interfaces";

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handlePlantClick = (plant: Plant) => setMainPlant(plant);
  const [mainPlant, setMainPlant] = useState<Plant | null>(null);
  
  // Estado do carrinho persistido
  const [cart, setCart] = useState<Plant[]>(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Atualiza localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCartClick = () => {
    if (!mainPlant) return;

    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === mainPlant.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...mainPlant, quantity: 1 });
    }

    setCart(updatedCart);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchFirstProduct = async () => {
      try {
        const response = await fetch("/api/produtos/primeiro");
        if (!response.ok) {
          throw new Error("Erro ao carregar o produto em destaque.");
        }
        
        const productBackend = (await response.json()) as ProdutoBackend;
        
        const plant: Plant = {
          id: Number(productBackend.id_produto),
          name: productBackend.nome_produto,
          price: Number(productBackend.preco),
          imageSrc: productBackend.imagem_url || "url_da_imagem_padrao.jpg",
          description: productBackend.descricao,
          rating: 4.5,
          quantity: 0
        };

        setMainPlant(plant); // Atualiza o estado com os dados recebidos
      } catch  {
        console.error("Falha ao carregar produto");
      } finally {
        setIsLoading(false); // Termina o carregamento, com sucesso ou erro
      }
    };

    fetchFirstProduct();
  }, []);
  if (isLoading) {
    return (
    <div className="flex justify-center items-center h-[100dvh] bg-[#386641]">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  }

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
          <Carousel onPlantClick={handlePlantClick} initialSlideIndex={4}/>
        </section>

        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">
            Melhores Para Iniciantes
          </h2>
          <Carousel onPlantClick={handlePlantClick} initialSlideIndex={8} />
          <div className="h-10"></div>
          <Carousel onPlantClick={handlePlantClick} initialSlideIndex={12}/>
        </section>

        <section className="py-12 w-screen">
          <h2 className="text-3xl font-bold text-center mb-8">Novidades</h2>
          <Carousel onPlantClick={handlePlantClick} initialSlideIndex={3}/>
          <div className="h-10"></div>
          <Carousel onPlantClick={handlePlantClick} initialSlideIndex={7}/>
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
