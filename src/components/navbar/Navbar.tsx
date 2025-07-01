import { useRef, useState } from "react";
import "./Navbar.css";
import { Search } from "akar-icons";

// Define the shape of a single navigation item
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
      className={item?.name === activeItem?.name ? "active" : ""}
      ref={linkRef}
      onMouseEnter={handleHover}
    >
      {item.name}
    </a>
  );
};

const SearchLupe = () => (
  <div className="navbar-search">
    <Search strokeWidth={2} size={20} className="lupa" />
    <input type="text" placeholder="Pesquisar" />
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
    <section className="page navbar-page">
      <nav className="navbar">
        <img src="" alt="Logo" /> {/* Added alt attribute for accessibility */}
        <div className="navbar-menu">
          <SearchLupe />
          {items.map((item) => (
            <Link
              key={item.name} // Added a unique key for list rendering
              activeItem={activeItem}
              item={item}
              onHover={handleLinkHover}
            />
          ))}
          <div
            style={{
              translate: `${translateX} 0`,
            }}
            className={`navbar-dropdown ${activeItem ? "visible" : ""}`}
          >
            {activeItem?.items?.map((link) => (
              <a key={link}>{link}</a>
            ))}
        </div>
          </div>
          <button className="btn">Login</button>
          <button className="btn">Cadastre-se</button>
      </nav>
    </section>
  );
};
