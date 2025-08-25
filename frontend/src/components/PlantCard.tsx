import { Plant } from "./types";

interface PlantCardProps {
  plant: Plant;
  onPlantClick: (plant: Plant) => void;
}

export function PlantCard({ plant, onPlantClick }: PlantCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // evita disparar onPlantClick ao clicar no botão

    // Pega o carrinho atual do localStorage
    const storedCart = localStorage.getItem("cartItems");
    const cart: Plant[] = storedCart ? JSON.parse(storedCart) : [];

    // Verifica se o produto já está no carrinho
    const existingItem = cart.find((item) => item.id === plant.id);

    if (existingItem) {
      existingItem.quantity += 1; // aumenta a quantidade
    } else {
      cart.push({ ...plant, quantity: 1 }); // adiciona novo item
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    alert(`${plant.name} adicionado ao carrinho!`);
  };

  return (
    <div
      className="flex flex-col w-[470px] h-[255px] rounded-lg shadow-sm dark:bg-[#386641] p-5 mx-4 cursor-pointer"
      onClick={() => onPlantClick(plant)}
    >
      <div className="flex justify-between items-center h-full">
        <div>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{plant.name}</h5>
          <p className="text-[#A7C957] w-[280px] line-clamp-4">{plant.description}</p>
          {/* Rating stars... */}
        </div>
        <img className="rounded-lg w-[120px] h-[120px] object-fill" src={plant.imageSrc} alt="product image" />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{`R$ ${plant.price.toFixed(2)}`}</span>
        <button
          onClick={handleAddToCart}
          className="text-[#386641] font-bold bg-[#A7C957] hover:opacity-90 rounded-lg text-sm px-5 py-2.5"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
