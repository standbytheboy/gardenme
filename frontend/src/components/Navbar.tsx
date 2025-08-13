import { useRef, useState } from "react";
import { Search } from "akar-icons";
import { Button } from "./LoginBtn";

interface NavItem {
  name: string;
  items?: string[]; // Optional array of strings for sub-items
}

const items: NavItem[] = [
  {
    name: "Home",
  },
  {
    name: "Plantas",
    items: ["Todas As Plantas", "Categorias", "Novidades", "Promoções"],
  },
  {
    name: "Sobre Nós",
  },
  {
    name: "Carrinho",
  },
];

// Define props for the Link component
interface LinkProps {
  item: NavItem;
  activeItem: NavItem | null; // activeItem can be a NavItem or null
  onHover: (item: NavItem | null, x: string) => void; // Function prop
}

const Link = ({ item, activeItem, onHover }: LinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null); // Specify the ref type

  const handleHover = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      onHover(item, `${rect.x}px`);
    }
  };

  return (
    <a
      className={`
        px-3 flex items-center cursor-pointer w-full h-[72px] text-[15px]
        text-[#a7c957] hover:text-[#a7c95790]
        ${item?.name === activeItem?.name ? "text-[#a7c95790]" : ""}
      `}
      ref={linkRef}
      onMouseEnter={handleHover}
    >
      {item.name}
    </a>
  );
};

const SearchLupe = () => (
  <div className="relative mr-20 w-[150rem]"> {/* Adjusted width for better proportion, original 150rem is very large */}
    <Search strokeWidth={2} size={20} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#F2E8CF]" />
    <input
      type="text"
      placeholder="Pesquisar"
      className="
        border-none rounded-full h-9 w-full text-[#F2E8CF] bg-[#F2E8CF50] pl-9 text-base
        focus:outline-none focus:border-2 focus:border-[#386641]
        placeholder:text-[#F2E8CF]
      "
    />
  </div>
);

export const Navbar = () => {
  const [translateX, setTranslateX] = useState<string>("0");
  const [activeItem, setActiveItem] = useState<NavItem | null>(null); // Specify state type

  const handleLinkHover = (item: NavItem | null, x: string) => {
    setActiveItem(item);
    setTranslateX(x);
  };

  return (
    <section className="font-sans">
      <nav
        className="
          fixed top-0 left-0 z-10 flex justify-between items-center
          px-5 h-[85px] w-full text-[#5B5968]
          bg-[#386641]
        "
      >
        <img src="" alt="Logo" className="mr-6 h-9 w-9" />
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
            style={{
              transform: `translateX(${translateX})`, // Use transform for translate
            }}
            className={`
              fixed z-10 top-[82px] left-0 h-0 py-1.5 overflow-hidden grid opacity-0 invisible transition-all duration-300
              rounded-md bg-[#F2E8CF50] shadow-md shadow-black/10
              ${activeItem ? "opacity-100 visible h-max" : ""}
              after:content-[''] after:absolute after:inset-0 after:top-[-12px]
            `}
          >
            {activeItem?.items?.map((link) => (
              <a key={link} className="relative z-10 h-10 text-sm whitespace-nowrap">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button>
            Login
          </Button>
          <Button>
            Cadastre-se
          </Button>
        </div>
      </nav>
    </section>
  );
};