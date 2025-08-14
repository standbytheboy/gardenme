import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Carousel.css"; // Mantenha este para o box-reflect e quaisquer outros estilos customizados

import { PlantCard } from '../PlantCard';

export const Carousel = () => {
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
        <section className="flex justify-center items-center w-screen text-sm text-gray-900">
            <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                loop={true}
                modules={[EffectCoverflow]}
                className="pt-[50px] pb-[140px]" 
            >
                {plantCardsData.map((plant) => (
                    <SwiperSlide
                        key={plant.id}
                        className="rounded-lg w-[300px] h-[250px]"
                        style={{ filter: 'saturate(1.2)' }}
                    >
                        <PlantCard plant={plant} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};