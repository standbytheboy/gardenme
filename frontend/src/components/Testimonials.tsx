import React, { useEffect, useRef, useState } from "react";
import { TestimonialCardProps, ProgressBarProps } from "./interfaces";

const StarIcon: React.FC = () => (
  <svg
    className="w-4 h-4 fill-current text-[#A7C957]"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .587l3.692 7.568 8.308 1.207-6.002 5.855 1.416 8.271L12 18.896l-7.414 3.902 1.416-8.271-6.002-5.855 8.308-1.207L12 .587z" />
  </svg>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  user,
  role,
  text,
  badge,
}) => {
  return (
    <div className="bg-[#386641] rounded-2xl p-6 shadow-lg flex flex-col h-full min-h-[30rem]">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#D4EDC8] mr-4 flex items-center justify-center text-[#386641] font-semibold text-lg">
          {user.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-white">{user}</p>
          <p className="text-sm text-gray-300">{role}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <p className="text-base text-gray-200 mb-6 flex-grow">{text}</p>
      <span className="inline-block bg-[#A7C957] text-[#386641] text-xs font-semibold px-3 py-1 rounded-full self-start whitespace-nowrap">
        {badge}
      </span>
    </div>
  );
};


const ProgressBar: React.FC<ProgressBarProps> = ({
  totalIndicators,
  currentSlide,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Quando o slide muda, atualiza a chave para forçar a reanimação.
    setAnimationKey(prevKey => prevKey + 1);
  }, [currentSlide]);

   return (
    <div className="flex justify-center mt-8 space-x-2 w-full max-w-sm mx-auto">
      {Array.from({ length: totalIndicators }).map((_, index) => (
        <div
          key={index}
          className={`h-1 flex-grow rounded-full transition-all duration-300 ${
            currentSlide % totalIndicators === index ? "bg-[#A7C957]" : "bg-[#386641]"
          }`}
        >
          {currentSlide % totalIndicators === index && (
            <div
              // Use a nova chave que muda a cada atualização de slide.
              key={animationKey}
              className="h-full bg-[#386641] rounded-full animate-progress"
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export const TestimonialsCarousel: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      user: "Usuário 1",
      role: "Amante de Plantas",
      stars: 5,
      text: "Experiência incrível! As plantas chegaram em perfeito estado e o suporte é excelente.",
      badge: "Jardinagem",
    },
    {
      id: 2,
      user: "Usuário 2",
      role: "Designer Gráfico",
      stars: 4,
      text: "Adorei a variedade de plantas e a facilidade de navegação no site. Recomendo!",
      badge: "Web Design",
    },
    {
      id: 3,
      user: "Usuário 3",
      role: "Amante de Plantas",
      stars: 5,
      text: "Experiência incrível! As plantas chegaram em perfeito estado e o suporte é excelente.",
      badge: "Jardinagem",
    },
    {
      id: 4,
      user: "Usuário 4",
      role: "Designer Gráfico",
      stars: 4,
      text: "Adorei a variedade de plantas e a facilidade de navegação no site. Recomendo!",
      badge: "Web Design",
    },
    {
      id: 5,
      user: "Usuário 5",
      role: "Amante de Plantas",
      stars: 5,
      text: "Experiência incrível! As plantas chegaram em perfeito estado e o suporte é excelente.",
      badge: "Jardinagem",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const itemWidth = carousel.children[0]?.clientWidth;
        if (!itemWidth) return;
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        let nextScrollLeft = carousel.scrollLeft + itemWidth;

        // Atualiza o estado para a barra de progresso
        setCurrentSlide((prevSlide) => (prevSlide + 1));

         if (carousel.scrollLeft >= maxScrollLeft - 5 || nextScrollLeft >= maxScrollLeft) {
          nextScrollLeft = 0;
        }
        carousel.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="bg-[#A7C957] py-16 px-4 md:px-8 flex flex-col items-center justify-center min-h-[12rem]">
      {/* Título da Seção */}
      <h2 className="text-4xl md:text-5xl font-bold text-[#386641] mb-2 text-center">
        Quem compra, ama!
      </h2>
      <p className="text-lg text-[#386641] mb-12 text-center">
        Veja o que nossos clientes de São Paulo dizem sobre nós.
      </p>

      {/* Carrossel de Depoimentos */}
      <div
        ref={carouselRef}
        className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[31.333%] gap-8 overflow-x-hidden snap-x snap-mandatory scrollbar-hide py-4 w-full max-w-6xl overscroll-x-contain m-auto"
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="snap-center">
            {" "}
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
      <ProgressBar totalIndicators={3} currentSlide={currentSlide} />
    </section>
  );
};

export default TestimonialsCarousel;
