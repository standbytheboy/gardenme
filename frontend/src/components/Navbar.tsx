import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./LoginBtn";
import { Search, ThreeLineHorizontal } from "akar-icons";
import Logo from "../assets/logos/green-complete.png";
import profilePlaceholder from "../assets/profile-picture-placeholder.jpg";
import { isLoggedIn, getProfilePictureUrl, logout } from "../utils/authUtils";

interface NavItem {
  name: string;
  link?: string;
  items?: { name: string; link: string }[];
}

const items: NavItem[] = [
  { name: "Início", link: "/" },
  { name: "Plantas", link: "/plantas" },
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
      className="px-3 flex items-center cursor-pointer h-[60px] text-[15px] text-[#a7c957] hover:text-[#a7c95790]"
      ref={linkRef}
      onMouseEnter={handleHover}
      onClick={handleClick}
    >
      {item.name}
    </a>
  );
};

const SearchLupe = () => (
  <div className="relative w-full sm:w-64 lg:w-80 mr-0 lg:mr-8">
    <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-[#F2E8CF] w-5 h-5" />
    <input
      type="text"
      placeholder="Pesquisar"
      className="border-none rounded-full h-9 w-full text-[#F2E8CF] bg-[#F2E8CF50] pl-9 text-sm sm:text-base
                 focus:outline-none focus:border-2 focus:border-[#386641] placeholder:text-[#F2E8CF]"
    />
  </div>
);

export const Navbar = () => {
  const [translateX, setTranslateX] = useState<string>("0");
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthStatus = () => {
      setUserIsLoggedIn(isLoggedIn());
      setUserProfilePic(getProfilePictureUrl() || profilePlaceholder);
    };

    updateAuthStatus();
    window.addEventListener("storage", updateAuthStatus);

    return () => {
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, []);

  const handleLinkHover = (item: NavItem | null, x: string) => {
    setActiveItem(item);
    setTranslateX(x);
  };

  const handleProfileClick = () => navigate("/perfil");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="font-sans">
      <nav className="fixed top-0 left-0 z-20 flex justify-between items-center px-4 sm:px-6 h-[70px] w-full bg-[#386641]">
        {/* Logo */}
        <a onClick={() => navigate("/")}>
          <img
            src={Logo}
            alt="Logo"
            className="h-20 w-20 sm:h-30 sm:w-30 cursor-pointer"
          />
        </a>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          <SearchLupe />
          {items.map((item) => (
            <Link
              key={item.name}
              activeItem={activeItem}
              item={item}
              onHover={handleLinkHover}
            />
          ))}
          {/* Dropdown (se houver submenu) */}
          <div
            style={{ transform: `translateX(${translateX})` }}
            className={`fixed z-10 top-[70px] left-0 h-0 py-1.5 overflow-hidden grid opacity-0 invisible transition-all duration-300
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

        {/* Botões de usuário */}
        <div className="hidden lg:flex items-center gap-4">
          {userIsLoggedIn ? (
            <>
              <button
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a7c957] hover:border-[#F2E8CF] transition-colors"
              >
                <img
                  src={userProfilePic || profilePlaceholder}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={handleLogout}
                className="text-[#a7c957] font-semibold hover:underline"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>Cadastre-se</Button>
            </>
          )}
        </div>

        {/* Menu mobile */}
        <button
          className="lg:hidden text-[#a7c957]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <ThreeLineHorizontal size={28} />
        </button>
      </nav>

      {/* Drawer Mobile */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[70px] left-0 w-full bg-[#386641] flex flex-col items-center gap-4 py-6 shadow-lg z-10">
          <SearchLupe />
          {items.map((item) => (
            <a
              key={item.name}
              className="text-[#a7c957] text-lg hover:text-[#a7c95790]"
              onClick={() => {
                navigate(item.link || "/");
                setMenuOpen(false);
              }}
            >
              {item.name}
            </a>
          ))}
          {userIsLoggedIn ? (
            <div className="flex flex-col items-center gap-3 mt-4">
              <button
                onClick={handleProfileClick}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#a7c957]"
              >
                <img
                  src={userProfilePic || profilePlaceholder}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={handleLogout}
                className="text-[#a7c957] font-semibold hover:underline"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>Cadastre-se</Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
