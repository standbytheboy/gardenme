import React, { useEffect, useRef } from 'react';

const StarIcon: React.FC = () => (
    <svg
      className="w-4 h-4 fill-current text-[#A7C957]"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .587l3.692 7.568 8.308 1.207-6.002 5.855 1.416 8.271L12 18.896l-7.414 3.902 1.416-8.271-6.002-5.855 8.308-1.207L12 .587z" />
    </svg>
  );

// (Mantenha a definição do TestimonialCard do passo 1 aqui se não for isolá-lo)
interface TestimonialCardProps {
    user: string;
    role: string;
    stars: number;
    text: string;
    badge: string;
  }

  const TestimonialCard: React.FC<TestimonialCardProps> = ({ user, role, stars, text, badge }) => {
    return (
      <div className="bg-[#386641] rounded-2xl p-6 shadow-lg flex flex-col h-full">
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


export const TestimonialsCarousel: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      user: 'Usuário 1',
      role: 'Estudante de Design',
      stars: 5,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      badge: 'UX/UI Design',
    },
    {
      id: 2,
      user: 'Usuário 2',
      role: 'Estudante de Design',
      stars: 4,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      badge: 'UX/UI Design',
    },
    {
      id: 3,
      user: 'Usuário 3',
      role: 'Estudante de Design',
      stars: 5,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      badge: 'UX/UI Design',
    },
    // Adicione mais depoimentos para que o carrossel funcione
    {
      id: 4,
      user: 'Usuário 4',
      role: 'Amante de Plantas',
      stars: 5,
      text: 'Experiência incrível! As plantas chegaram em perfeito estado e o suporte é excelente.',
      badge: 'Jardinagem',
    },
    {
      id: 5,
      user: 'Usuário 5',
      role: 'Designer Gráfico',
      stars: 4,
      text: 'Adorei a variedade de plantas e a facilidade de navegação no site. Recomendo!',
      badge: 'Web Design',
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const itemWidth = carousel.children[0]?.clientWidth;

        if (!itemWidth) return;

        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        let nextScrollLeft = carousel.scrollLeft + itemWidth;

        // Se o próximo scroll exceder o limite, ou se o scroll atual já estiver no final,
        // volta para o início. Considera uma pequena margem para evitar problemas de arredondamento.
        if (carousel.scrollLeft >= maxScrollLeft - 5 || nextScrollLeft >= maxScrollLeft) {
          nextScrollLeft = 0; // Volta para o início
        }

        carousel.scrollTo({
          left: nextScrollLeft,
          behavior: 'smooth',
        });
      }
    }, 10000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [testimonials.length]); // Dependência adicionada para recalcular se o número de depoimentos mudar

  return (
    <section className="bg-[#A7C957] py-16 px-4 md:px-8 flex flex-col items-center justify-center min-h-screen">
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
        className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[31.333%] gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 w-full max-w-6xl overscroll-x-contain m-auto"
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="snap-center"> {/* Apenas snap-center aqui, a largura é controlada pelo pai (grid) */}
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;