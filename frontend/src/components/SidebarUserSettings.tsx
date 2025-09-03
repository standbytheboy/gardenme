import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Importar o novo ícone
import { Person, LockOff, Location, Cart, Question, MoreHorizontalFill, Cross as CloseIcon, TrashCan, Plant, ProductHuntFill } from 'akar-icons';
import { Sidebar9Props } from "./interfaces";

const navItems = [
  { name: "Meus Dados", icon: Person, link: null },
  { name: "Dicas", icon: Plant, link: null },
  { name: "Segurança", icon: LockOff, link: null },
  { name: "Endereços", icon: Location, link: null },
  { name: "Meus Pedidos", icon: Cart, link: null },
  { name: "Excluir conta", icon: TrashCan, link: null },
  { name: "Suporte", icon: Question, link: null }
];

// menu específico para administradores
const adminNavItem = {
  name: "Cadastrar Produto",
  icon: ProductHuntFill,
  link: "/admin/produtos",
};

export const Sidebar9: React.FC<Sidebar9Props> = ({ activeMenuItem, setActiveMenuItem, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (item: { name: string, link: string | null }) => {
    if (item.link) {
      navigate(item.link);
    } else {
      setActiveMenuItem(item.name);
    }
  };

  return (
    <aside
      className={`rounded-2xl bg-[#00000050] backdrop-blur-md transition-all duration-450 ease-in-out h-full flex justify-center items-center ${isOpen ? "w-60" : "w-20"}`}
      style={{ transitionProperty: 'width' }}
    >
      <div className="h-full overflow-hidden">
        <header className="flex items-center h-16 rounded-t-lg px-1.5">
          <button
            type="button"
            className="w-11 h-[72px] grid place-items-center text-[#A7C957] bg-transparent cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <CloseIcon size={20} /> : <MoreHorizontalFill size={20} />}
          </button>
        </header>
        <nav className="grid px-1.5 gap-0.5">
          {/* Renderiza os itens de menu padrão */}
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`group flex items-center h-11 font-sans text-sm capitalize leading-none px-3 rounded-lg opacity-70 transition-all duration-300 ease-in-out text-[#A7C957] ${isOpen ? 'w-full' : 'w-11'} ${activeMenuItem === item.name ? 'bg-[#ffffff50] bg-opacity-10 opacity-100 font-semibold' : 'hover:bg-[#ffffff20] hover:bg-opacity-10 hover:opacity-100'}`}
            >
              <item.icon size={20} className="flex-shrink-0 mr-5" />
              <p className={`py-7 flex-grow-0 flex-shrink-0 whitespace-nowrap overflow-hidden transition-opacity duration-250 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {item.name}
              </p>
            </button>
          ))}
          
          {/* O link de admin só aparece se a prop isAdmin for verdadeira */}
          {isAdmin && (
             <button
              key={adminNavItem.name}
              type="button"
              onClick={() => handleItemClick(adminNavItem)}
              className={`group flex items-center h-11 font-sans text-sm capitalize leading-none px-3 rounded-lg opacity-70 transition-all duration-300 ease-in-out text-[#A7C957] ${isOpen ? 'w-full' : 'w-11'} hover:bg-[#ffffff20] hover:bg-opacity-10 hover:opacity-100`}
            >
              <adminNavItem.icon size={20} className="flex-shrink-0 mr-5" />
              <p className={`flex-grow-0 flex-shrink-0 whitespace-nowrap overflow-hidden transition-opacity duration-250 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {adminNavItem.name}
              </p>
            </button>
          )}

        </nav>
      </div>
    </aside>
  );
};