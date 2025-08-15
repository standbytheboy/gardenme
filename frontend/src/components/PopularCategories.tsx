import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon, ArrowRight as ArrowRightIcon } from 'akar-icons';
import { ActionBtn } from './ActionBtn';

interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon: IconComponent, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();    

  return (
    <div onClick={() => navigate('/plantas')}
      className="relative bg-[#F2E8CF] rounded-xl p-6 shadow-md flex flex-col items-start text-left cursor-pointer overflow-hidden transform transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ícone no canto superior esquerdo */}
      <div className="absolute top-4 left-4 p-2 rounded-lg bg-gray-200 opacity-0 transition-opacity duration-300"> 
         <IconComponent size={32} className="text-[#386641]" /> 
      </div>
      {/* Conteúdo do Card */}
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <h3 className="text-xl font-bold text-[#386641] mb-2 w-full">{title}</h3>
        <p className="text-sm text-[#386641] m-auto">{description}</p>
      </div>

      {/* Overlay e Ícone de Seta no Hover */}
      <div
        className={`absolute inset-0 bg-[#00000050] flex items-center justify-center transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <ArrowRightIcon size={48} className="text-white" />
      </div>
    </div>
  );
};


export const PopularCategories: React.FC = () => {
  const navigate = useNavigate();    
  const categories = [
    {
      id: 1,
      title: 'Mais Vendidas',
      description: 'Conheça as plantas que estão conquistando corações em São Paulo.',
      icon: EditIcon, 
    },
    {
      id: 2,
      title: 'Melhores Para Iniciantes',
      description: 'Sempre há uma nova folhagem ou flor esperando por você.',
      icon: EditIcon,
    },
    {
      id: 3,
      title: 'Novidades',
      description: 'Plantas resistentes e fáceis de cuidar, perfeitas para quem quem está começando.',
      icon: EditIcon,
    },
    {
      id: 4,
      title: 'Promoções',
      description: 'As plantas mais vendidas pelos melhores preços.',
      icon: EditIcon,
    },
  ];

  return (
    <section className="bg-[#A7C957] py-16 px-4 md:px-8 flex flex-col items-center justify-center min-h-[12rem]">
      
      <h2 className="text-4xl md:text-5xl font-bold text-[#386641] mb-12 text-center">
        Categorias Populares
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            title={category.title}
            description={category.description}
          />
        ))}
      </div>

      <ActionBtn onClick={() => navigate('/plantas')}>Todas as Categorias</ActionBtn>
    </section>
  );
};

export default PopularCategories;