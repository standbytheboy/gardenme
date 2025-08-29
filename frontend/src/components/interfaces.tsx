// types.ts

// =================================================================
// ENTIDADES PRINCIPAIS (Dados que vêm do banco ou representam objetos)
// =================================================================

export interface Plant {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  description: string;
  rating: number;
  quantity: number;
}

export interface Tip {
  id_dica: number;
  nome_produto: string;
  titulo_dica: string;
  conteudo_dica: string;
  id_produto: number;
}

export interface Category {
  id_categoria: number;
  nome_categoria: string;
}

export interface Address {
  id: number;
  apelido: string;
  cep: string;
  bairro: string;
  numero: string;
  logradouro: string;
  cidade: string;
  estado: string;
  complemento?: string; 
}

export interface OrderItem {
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  name?: string;
}

export interface Order {
  id_pedido: number;
  preco_total: number;
  criado_em: string;
  id_status: number;
  itens: OrderItem[];
  endereco: Address | null;
}

export interface CartItem {
  id: number; 
  name: string;
  kit: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

// =================================================================
// PROPS DE COMPONENTES (Tipos específicos para props de componentes React)
// =================================================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export interface Sidebar9Props {
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
  isAdmin: boolean;
}

export interface PlantCardProps {
  plant: Plant;
  onPlantClick: (plant: Plant) => void;
}

export interface CarouselProps {
  onPlantClick: (plant: Plant) => void;
  initialSlideIndex?: number;
}

export interface MainPlantProps {
  onAddToCartClick: () => void;
  plantData: Plant | null;
}

export interface CartItemProps extends CartItem {
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number, name: string) => void;
}

export interface AddressFormProps {
  onSave: (address: Address) => void;
  onCancel: () => void;
  initialData?: Address | null;
}

export interface OrderSuccessPageProps {
  orderNumber?: string;
}

// =================================================================
// TIPOS DA API (Estrutura exata de como os dados chegam do backend)
// =================================================================

export interface ProdutoBackend {
  id_produto: string;
  id_categoria: string;
  nome_categoria: string;
  nome_produto: string;
  descricao: string;
  preco: number;
  imagem_url?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ServerResponse {
  mensagem: string;
  
}

// =================================================================
// AUXILIARES
// =================================================================
export interface AddressType {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface PaymentMethodType {
  type: string;
  details: string;
  icon?: string;    
}

export interface AccordionItemProps {
  handleToggle: (index: number) => void;
  active: number | null;
  item: {
    header: string;
    content: string;
  };
  index: number;
}

export interface AccordionProps {
  items: {
    header: string;
    content: string;
  }[];
}

export interface AddedToCartCardProps {
  productName: string;
  productPrice: string | number;
}

export interface NavItem {
  name: string;
  link: string;
  items?: NavItem[]; 
}

export interface LinkProps {
  item: NavItem;
  onHover: (item: NavItem, x: string) => void;
  activeItem?: NavItem | null; 
}

export interface CategoryCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export interface TestimonialCardProps {
  user: string;
  role: string;
  text: string;
  badge: string;
  stars?: number;
}

export interface ProgressBarProps {
  totalIndicators: number;
  currentSlide: number;
}

export interface CartItemType {
  id: number;
  name: string;
  kit: string;
  price: number;
  quantity: number;
  imageSrc: string; 
}