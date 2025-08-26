import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "./Carousel.css";
import { PlantCard } from "../PlantCard";
import { Plant } from "../interfaces";
import { CarouselProps, ProdutoBackend } from "../interfaces";

export const Carousel = ({ onPlantClick }: CarouselProps) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

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
          imageSrc: p.imagem_url || "https://via.placeholder.com/300x250",
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

  return (
    <section className="flex justify-center items-center w-screen text-sm text-gray-900 relative">
      {/* Botões customizados */}
      <div
        ref={prevRef}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-3xl font-bold text-black"
      >
        ‹
      </div>
      <div
        ref={nextRef}
        className="absolute right-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-3xl font-bold text-black"
      >
        ›
      </div>

      <Swiper
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        loop={true}
        modules={[EffectCoverflow, Navigation]}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== "boolean") {
            const navigation = swiper.params.navigation;
            if (navigation) {
              navigation.prevEl = prevRef.current;
              navigation.nextEl = nextRef.current;
            }
          }
        }}
        className="pt-[50px] pb-[140px]"
      >
        {plantCardsData.map((plant) => (
          <SwiperSlide
            key={plant.id}
            className="pl-20 rounded-lg w-[300px] h-[250px]"
            style={{ filter: "saturate(1.2)" }}
          >
            <PlantCard plant={plant} onPlantClick={onPlantClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
