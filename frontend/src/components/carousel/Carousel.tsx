import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "./Carousel.css";
import { PlantCard } from "../PlantCard";

export const Carousel = () => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const plantCardsData = [
    { id: 1, name: "Samambaia", price: "R$ 35" },
    { id: 2, name: "Cacto", price: "R$ 20" },
    { id: 3, name: "Orquídea", price: "R$ 60" },
    { id: 4, name: "Suculenta", price: "R$ 15" },
    { id: 5, name: "Costela de Adão", price: "R$ 80" },
    { id: 6, name: "Hera", price: "R$ 25" },
    { id: 7, name: "Lírio da Paz", price: "R$ 40" },
  ];

  return (
    <section className="flex justify-center items-center w-screen text-sm text-gray-900 relative">
      {/* Botões customizados */}
      <div
        ref={prevRef}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-3xl font-bold text-[#386641]"
      >
        ‹
      </div>
      <div
        ref={nextRef}
        className="absolute right-10 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-3xl font-bold text-[#386641]"
      >
        ›
      </div>

      <Swiper
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        loop={true}
        modules={[EffectCoverflow, Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className="pt-[50px] pb-[140px]"
      >
        {plantCardsData.map((plant) => (
          <SwiperSlide
            key={plant.id}
            className="pl-20 rounded-lg w-[300px] h-[250px]"
            style={{ filter: "saturate(1.2)" }}
          >
            <PlantCard plant={plant} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
