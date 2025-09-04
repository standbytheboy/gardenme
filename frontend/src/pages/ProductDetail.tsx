// standbytheboy/gardenme/gardenme-6f5765d3480b0369b998b7efc2cb92a2c6b1a226/frontend/src/pages/ProductDetail.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { Carousel } from "../components/carousel/Carousel";
import { MainPlant } from "../components/MainPlant";
import AddedToCartCard from "../components/AddedToCart";
import { Plant, ProdutoBackend } from "../components/interfaces";
import { PlantCard } from "../components/PlantCard";

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mainPlant, setMainPlant] = useState<Plant | null>(null);
  const [products, setProducts] = useState<Plant[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Plant[]>([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

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

  const handleCloseModal = () => setIsModalOpen(false);
  const handlePlantClick = (plant: Plant) => setMainPlant(plant);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/produtos");
        if (!response.ok) {
          throw new Error("Erro ao carregar os produtos.");
        }
        
        const data = (await response.json()) as ProdutoBackend[];
        
        const plants: Plant[] = data.map((p) => ({
          id: Number(p.id_produto),
          name: p.nome_produto,
          price: Number(p.preco),
          imageSrc: p.imagem_url || "url_da_imagem_padrao.jpg",
          description: p.descricao,
          rating: 4.5,
          quantity: 0
        }));

        setProducts(plants);
        if (!searchQuery) {
          setMainPlant(plants[0] || null);
        }
      } catch (err) {
        console.error("Falha ao carregar produtos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.description.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

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
        {searchQuery ? (
          <div className="pt-24 px-4 min-h-[80dvh]">
            <h1 className="text-4xl font-bold my-8 mx-4">
              Resultados para "{searchQuery}"
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15rem]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} onPlantClick={handlePlantClick} />
                ))
              ) : (
                <p className="text-center col-span-full">Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <MainPlant
              plantData={mainPlant}
              onAddToCartClick={handleAddToCartClick}
            />

            {/* Seções do carrossel */}
            <section className="py-12 w-screen">
              <h2 className="text-3xl font-bold text-center mb-8">Mais Vendidas</h2>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={4}/>
              <div className="h-10"></div>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={9}/>
            </section>

            <section className="py-12 w-screen">
              <h2 className="text-3xl font-bold text-center mb-8">
                Melhores Para Iniciantes
              </h2>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={13} />
              <div className="h-10"></div>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={17}/>
            </section>

            <section className="py-12 w-screen">
              <h2 className="text-3xl font-bold text-center mb-8">Novidades</h2>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={3}/>
              <div className="h-10"></div>
              <Carousel onPlantClick={handlePlantClick} initialSlideIndex={7}/>
            </section>
          </>
        )}
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