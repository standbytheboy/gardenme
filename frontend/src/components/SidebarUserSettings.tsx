import { useState } from "react";
// Certifique-se de que a importação de akar-icons está correta (akar-icons-react é o mais comum para React)
import { Person, LockOff, Location, Cart, Question, MoreHorizontalFill, Cross as CloseIcon, TrashCan, Plant } from 'akar-icons'; // Ou 'akar-icons-react' se for o caso


const navItems = [
  { name: "Meus Dados", icon: Person },
  { name: "Dicas", icon: Plant },
  { name: "Segurança", icon: LockOff },
  { name: "Endereços", icon: Location },
  { name: "Meus Pedidos", icon: Cart },
  { name: "Excluir conta", icon: TrashCan },
  { name: "Suporte", icon: Question }
];

// O componente Sidebar9 agora recebe props para controlar seu alinhamento e a cor do texto do menu
interface Sidebar9Props {
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
}

export const Sidebar9: React.FC<Sidebar9Props> = ({ activeMenuItem, setActiveMenuItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`rounded-2xl bg-[#00000050] backdrop-blur-md transition-all duration-450 ease-in-out h-full flex justify-center items-center
        ${isOpen ? "w-50" : "w-20"} 
      `}
      style={{ transitionProperty: 'width' }}
    >
      <div className="h-full overflow-hidden">
        <header className="flex items-center h-16 rounded-t-lg px-1.5">
          <button
            type="button"
            className="w-11 h-[72px] grid place-items-center text-[#A7C957] bg-transparent cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <CloseIcon size={20} className="text-[#A7C957]" />
            ) : (
              <MoreHorizontalFill size={20} className="text-[#A7C957]" />
            )}
          </button>
          {/* <img src="/path/to/your/logo.png" alt="Logo" className={`h-[18px] transition-opacity duration-250 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} /> */}
        </header>
        <nav className="grid px-1.5 gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveMenuItem(item.name)} // Atualiza o estado no pai
              className={`group flex items-center h-11 font-sans text-sm capitalize leading-none px-3 rounded-lg opacity-70 transition-all duration-300 ease-in-out text-[#A7C957]
                ${isOpen ? 'w-full' : 'w-11'} 
                ${activeMenuItem === item.name ? 'bg-[#ffffff50] bg-opacity-10 opacity-100 font-semibold' : 'hover:bg-[#ffffff20] hover:bg-opacity-10 hover:opacity-100'}
              `}
            >
              <item.icon size={20} className="flex-shrink-0 mr-5" />

              <p
                className={`flex-grow-0 flex-shrink-0 whitespace-nowrap overflow-hidden transition-opacity duration-250 ease-in-out
                  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  ${!isOpen ? 'group-hover:opacity-100 group-hover:bg-black group-hover:bg-opacity-20 group-hover:backdrop-blur-md group-hover:px-3 group-hover:py-2 group-hover:rounded-md group-hover:translate-x-2.5' : ''}
                `}
              >
                {item.name}
              </p>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};