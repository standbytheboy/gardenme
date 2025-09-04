import { Plant } from "./interfaces";
import { PlantCardProps } from "./interfaces";

export function PlantCard({ plant, onPlantClick }: PlantCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const storedCart = localStorage.getItem("cartItems");
    const cart: Plant[] = storedCart ? JSON.parse(storedCart) : [];
    const existingItem = cart.find((item) => item.id === plant.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...plant, quantity: 1 });
    }
    localStorage.setItem("cartItems", JSON.stringify(cart));
    alert(`${plant.name} adicionado ao carrinho!`);
  };

  return (
    // MUDANÇA 1: Adicionado o container com a classe 'card-container'
    // Este container terá seu tamanho ajustado pela media query
    <div className="card-container">
      {/* MUDANÇA 2: O card original está aqui, com a classe 'scalable-card' */}
      <div
        className="scalable-card flex flex-col w-[470px] h-[255px] rounded-lg shadow-sm bg-[#386641] p-5 cursor-pointer"
        onClick={() => onPlantClick(plant)}
      >
        {/* O restante do seu design original está 100% preservado aqui dentro */}
        <a href="#">
          <div className="flex justify-between items-center h-full">
            <div>
              <h5 className="text-xl font-semibold tracking-tight text-white">{plant.name}</h5>
              <p className="text-[#A7C957] w-[280px] line-clamp-4">{plant.description}</p>
            </div>
            <img className="rounded-lg w-[120px] h-[120px] object-fill flex-shrink-0" src={plant.imageSrc} alt="product image" />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-white">{`R$ ${plant.price.toFixed(2)}`}</span>
            <button
              onClick={handleAddToCart}
              className="text-[#386641] font-bold bg-[#A7C957] hover:opacity-90 rounded-lg text-sm px-5 py-2.5"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </a>
      </div>
    </div>
  );
}