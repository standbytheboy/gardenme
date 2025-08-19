import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "./Carousel.css";
import { PlantCard } from "../PlantCard";

interface CarouselProps {
  onPlantClick: (plant: any) => void;
}

export const Carousel = ({ onPlantClick }: CarouselProps) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const plantCardsData = [
    {
      id: 1,
      name: "Samambaia",
      price: "R$ 35",
      imageSrc:
        "https://dl7j1x8aohko6.cloudfront.net/2022/02/Samambaia-de-Boston.webp",
      description:
        "Ideal para ambientes internos com pouca luz. Requer rega regular.",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Cacto",
      price: "R$ 20",
      imageSrc:
        "https://cdn.awsli.com.br/800x800/2446/2446161/produto/167671296/20230919_161338-fotor-20230925192538-jziha1cwc8.jpg",
      description:
        "Planta resistente que armazena água. Perfeita para quem esquece de regar.",
      rating: 5.0,
    },
    {
      id: 3,
      name: "Orquídea",
      price: "R$ 60",
      imageSrc:
        "https://bonfimflores.com.br/wp-content/uploads/2021/07/Orquidea_phalaenopsis_pendente_pink_no_vidro.jpeg",
      description:
        "Conhecida por suas flores deslumbrantes. Precisa de luz indireta e umidade controlada.",
      rating: 4.8,
    },
    {
      id: 4,
      name: "Suculenta",
      price: "R$ 15",
      imageSrc:
        "https://cdn.awsli.com.br/600x700/2429/2429322/produto/243925415/img_20241018_113008-tdwtu0bmzb.jpg",
      description:
        "Variedade de plantas com folhas espessas. Fácil de cuidar e ótima para iniciantes.",
      rating: 4.7,
    },
    {
      id: 5,
      name: "Costela de Adão",
      price: "R$ 80",
      imageSrc:
        "https://cdn.awsli.com.br/600x700/1424/1424687/produto/57836682/7f737449c6.jpg",
      description:
        "Planta tropical com folhas grandes e recortadas. Adiciona um toque de selva urbana.",
      rating: 4.9,
    },
    {
      id: 6,
      name: "Hera",
      price: "R$ 25",
      imageSrc:
        "https://images.tcdn.com.br/img/img_prod/350075/hera_da_algeria_cuia_21_10363_1_20220412114304.jpg",
      description:
        "Planta trepadeira versátil, ideal para pendurar ou cobrir superfícies.",
      rating: 4.3,
    },
    {
      id: 7,
      name: "Lírio da Paz",
      price: "R$ 40",
      imageSrc:
        "https://hmjardins.com.br/tok/wp-content/uploads/2015/06/lirio-da-paz-vaso.jpg",
      description:
        "Planta com flores brancas que simbolizam a paz. Excelente purificador de ar.",
      rating: 4.6,
    },
  ];

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
            {/* Passa a função onPlantClick para o PlantCard */}
            <PlantCard plant={plant} onPlantClick={onPlantClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
