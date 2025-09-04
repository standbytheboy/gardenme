import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from 'swiper';
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Carousel.css";
import { PlantCard } from "../PlantCard";
import { Plant } from "../interfaces";
import { CarouselProps, ProdutoBackend } from "../interfaces";

export const Carousel = ({ onPlantClick, initialSlideIndex = 0 }: CarouselProps) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [plantCardsData, setPlantCardsData] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/produtos");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = (await response.json()) as ProdutoBackend[];
        const plants: Plant[] = data.map((p) => ({
          id: Number(p.id_produto),
          name: p.nome_produto,
          price: Number(p.preco),
          imageSrc: p.imagem_url || "https://via.placeholder.com/150",
          description: p.descricao,
          rating: 4.5,
          quantity: 0
        }));
        setPlantCardsData(plants);
      } catch (err) {
        console.error("Falha ao carregar produtos:", err);
      }
    };
    fetchProducts();
  }, []);

  // useEffect para inicializar e atualizar o Swiper
  // Isso garante que tanto o slide inicial quanto a navegação funcionem de forma confiável
  useEffect(() => {
    if (swiper) {
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();

      // Define o slide inicial corretamente no modo loop
      swiper.slideToLoop(initialSlideIndex, 0);
    }
  }, [swiper, initialSlideIndex, plantCardsData]);

  return (
    <section className="flex justify-center items-center w-full relative py-4 md:py-8 overflow-hidden">
      {/* Seus botões de navegação permanecem os mesmos */}
      <div ref={prevRef} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-2xl md:text-3xl font-bold text-black">‹</div>
      <div ref={nextRef} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-2xl md:text-3xl font-bold text-black">›</div>

      <Swiper
        // 'onSwiper' agora apenas armazena a instância no nosso estado
        onSwiper={setSwiper}
        
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        spaceBetween={30}
        modules={[Navigation]}
        
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        
        className="w-full !px-10"
      >
        {plantCardsData.map((plant) => (
          <SwiperSlide key={plant.id} className="!w-auto">
            <PlantCard plant={plant} onPlantClick={onPlantClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};