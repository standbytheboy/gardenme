import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "./LoginBtn";
import { Search } from "akar-icons";
import Logo from '../assets/logos/green-complete.png';
import profilePlaceholder from '../assets/profile-picture-placeholder.jpg';
import { isLoggedIn, getProfilePictureUrl, logout } from "../utils/authUtils";
import { NavItem, LinkProps } from "./interfaces";


const items: NavItem[] = [
  { name: "Início", link: "/" },
  { name: "Plantas", link: "/plantas" },
  { name: "Carrinho", link: "/carrinho" },
];



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
    <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-[#F2E8CF] w-5 h-5" />
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
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthStatus = () => {
      setUserIsLoggedIn(isLoggedIn());
      setUserProfilePic(getProfilePictureUrl() || profilePlaceholder);
    };

    updateAuthStatus();

    window.addEventListener('storage', updateAuthStatus);

    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  const handleLinkHover = (item: NavItem | null, x: string) => {
    setActiveItem(item);
    setTranslateX(x);
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className="font-sans">
      <nav className="fixed top-0 left-0 z-10 flex justify-between items-center px-5 h-[85px] w-full text-[#5B5968] bg-[#386641]">
        <a onClick={() => navigate('/')}>
          <img src={Logo} alt="Logo" className="mr-6 h-35 w-35 cursor-pointer" />
        </a>
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
          {userIsLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button onClick={handleProfileClick} className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a7c957] hover:border-[#386641] transition-colors cursor-pointer">
                <img src={userProfilePic || profilePlaceholder} alt="Profile" className="w-full h-full object-cover" />
              </button>
              <button onClick={handleLogout} className="text-[#a7c957] font-semibold hover:underline">Sair</button>
            </div>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <div className="w-5"></div>
              <Button onClick={() => navigate('/signup')}>Cadastre-se</Button>
            </>
          )}
        </div>
      </nav>
    </section>
  );
};