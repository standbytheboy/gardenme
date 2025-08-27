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

export interface Category {
  id_categoria: number;
  nome_categoria: string;
}

export interface Address {
  id: number;
  nickname: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string; // Opcional
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  name?: string; // Pode ser útil para exibir no histórico
}

export interface Order {
  id: number;
  totalPrice: number;
  createdAt: string; // Data de criação
  statusId: number;
  items: OrderItem[];
  shippingAddress: Address | null;
}

export interface CartItem {
  id: string; // Pode ser um ID composto (productId-kitId)
  name: string;
  kit: string;
  price: number;
  quantity: number;
  image: string;
}

// =================================================================
// PROPS DE COMPONENTES (Tipos específicos para props de componentes React)
// =================================================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  // Outras props comuns como type, disabled, etc.
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
  onQuantityChange: (id: string, newQuantity: number) => void;
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
  // outros campos que a API pode retornar
}