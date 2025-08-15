import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Search } from "akar-icons";
import { Button } from "./LoginBtn";
import Logo from '../assets/gardenme-logo.svg'

interface NavItem {
  name: string;
  link?: string; // link principal opcional
  items?: { name: string; link: string }[]; // sub-itens com link
}

const items: NavItem[] = [
  { name: "Início", link: "/" },
  { name: "Plantas", link: "/plantas" },
  { name: "Sobre Nós", link: "/sobre" },
  { name: "Carrinho", link: "/carrinho" },
];

interface LinkProps {
  item: NavItem;
  activeItem: NavItem | null;
  onHover: (item: NavItem | null, x: string) => void;
}

const Link = ({ item, onHover }: LinkProps) => {
  const navigate = useNavigate();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleHover = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      onHover(item, `${rect.x}px`);
    }
  };

  const handleClick = () => {
    if (item.link) navigate(item.link);
  };

  return (
    <a
      className="px-3 flex items-center cursor-pointer w-full h-[72px] text-[15px] text-[#a7c957] hover:text-[#a7c95790]"
      ref={linkRef}
      onMouseEnter={handleHover}
      onClick={handleClick}
    >
      {item.name}
    </a>
  );
};

const SearchLupe = () => (
  <div className="relative mr-20 w-[150rem]">
    <Search strokeWidth={2} size={20} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#F2E8CF]" />
    <input
      type="text"
      placeholder="Pesquisar"
      className="border-none rounded-full h-9 w-full text-[#F2E8CF] bg-[#F2E8CF50] pl-9 text-base
                 focus:outline-none focus:border-2 focus:border-[#386641] placeholder:text-[#F2E8CF]"
    />
  </div>
);

export const Navbar = () => {
  const [translateX, setTranslateX] = useState<string>("0");
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const navigate = useNavigate();

  const handleLinkHover = (item: NavItem | null, x: string) => {
    setActiveItem(item);
    setTranslateX(x);
  };

  return (
    <section className="font-sans">
      <nav className="fixed top-0 left-0 z-10 flex justify-between items-center px-5 h-[85px] w-full text-[#5B5968] bg-[#386641]">
        <img src={Logo} alt="Logo" className="mr-6 h-20 w-20" />
        <div className="flex items-center justify-center w-1/2 font-medium">
          <SearchLupe />
          {items.map((item) => (
            <Link
              key={item.name}
              activeItem={activeItem}
              item={item}
              onHover={handleLinkHover}
            />
          ))}
          <div
            style={{ transform: `translateX(${translateX})` }}
            className={`fixed z-10 top-[82px] left-0 h-0 py-1.5 overflow-hidden grid opacity-0 invisible transition-all duration-300
                        rounded-md bg-[#F2E8CF50] shadow-md shadow-black/10
                        ${activeItem ? "opacity-100 visible h-max" : ""}`}
          >
            {activeItem?.items?.map((sub) => (
              <a
                key={sub.name}
                className="relative z-10 h-10 px-4 flex items-center text-sm whitespace-nowrap hover:text-[#a7c957]"
                onClick={() => navigate(sub.link)}
              >
                {sub.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => navigate('/login')}>Login</Button>
          <div className="w-5"></div>
          <Button onClick={() => navigate('/signup')}>Cadastre-se</Button>
        </div>
      </nav>
    </section>
  );
};
