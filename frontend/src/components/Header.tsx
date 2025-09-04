import { useState } from "react";
import GardeningCuate from "../assets/Gardening-cuate.svg";
import Blooming from "../assets/Blooming-amico.svg";
import Personal from "../assets/personalGrowth.svg";
import Reforestation from "../assets/Reforestation-amico.svg";
import ReforestationCuate from "../assets/Reforestation-cuate.svg";
import Seeding from "../assets/Seeding-amico.svg";
import House from "../assets/indoorPlants.svg";

export const Header = () => {
  const images = [
    GardeningCuate,
    Blooming,
    Personal,
    Reforestation,
    ReforestationCuate,
    Seeding,
    House,
  ];

  const [currentImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  });

  return (
    <div className="bg-[#386641] py-[5rem]">
      <section className="flex flex-col lg:flex-row lg:px-30 items-center lg:items-start justify-center lg:justify-between gap-10 lg:gap-20 font-sans bg-[#386641] pt-30 pb-12 px-6 rounded-bl-[3rem] rounded-br-[3rem]">
        {/* Texto */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="font-black text-2xl sm:text-3xl lg:text-4xl text-[#A7C957] mt-6">
            A Natureza na Sua Porta: Plantas e Dicas de Cuidado para seu Lar.
          </h1>
          <p className="text-[#F2E8CF] mt-4 text-base sm:text-lg">
            Descubra a planta perfeita para sua casa ou presenteie com vida.
            Entregamos em toda São Paulo!
          </p>

          {/* Métricas */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-8 mt-10">
            <div>
              <h2 className="font-black text-3xl sm:text-4xl text-[#A7C957]">
                1M+
              </h2>
              <p className="text-[#F2E8CF]">Compradores</p>
            </div>
            <div>
              <h2 className="font-black text-3xl sm:text-4xl text-[#A7C957]">
                50+
              </h2>
              <p className="text-[#F2E8CF]">Plantas</p>
            </div>
          </div>
        </div>

        {/* Imagem */}
        <img
          src={currentImage}
          alt="Imagem de jardinagem"
          className="w-60 sm:w-72 md:w-80 lg:w-[26rem] mt-8 lg:mt-0"
        />
      </section>
    </div>
  );
};
