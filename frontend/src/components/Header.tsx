import { useState } from "react";
import { Navbar } from "./Navbar";
import GardeningCuate from "../assets/Gardening-cuate.svg";
import Blooming from "../assets/Blooming-amico.svg";
import Personal from "../assets/personalGrowth.svg";
import Reforestation from "../assets/Reforestation-amico.svg";
import ReforestationCuate from "../assets/Reforestation-cuate.svg";
import Seeding from "../assets/Seeding-amico.svg";

export const Header = () => {
  const images = [
    GardeningCuate,
    Blooming,
    Personal,
    Reforestation,
    ReforestationCuate,
    Seeding,
  ];

  const [currentImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  });
  return (
    <div className="bg-[#A7C957]">
      <section className="flex justify-center gap-20 font-sans bg-[#386641] pt-30 pb-20 rounded-bl-[3rem] rounded-br-[3rem]">
        <Navbar></Navbar>
        <div className="left">
          <h1 className="font-black text-4xl w-2xl text-[#A7C957] mt-[4rem]">
            A Natureza na Sua Porta: Plantas e Dicas de Cuidado para seu Lar.
          </h1>
          <p className="text-[#F2E8CF] w-150">
            Descubra a planta perfeita para sua casa ou presenteie com vida.
            Entregamos em toda São Paulo!
          </p>
          <div className="flex">
            <div className="mt-30 mb-10 mr-10">
              <h2 className="data font-black text-4xl text-[#A7C957]">1M+</h2>
              <p className="text-[#F2E8CF]">Compradores</p>
            </div>
            <div className="mt-30">
              <h2 className="data font-black text-4xl text-[#A7C957]">50+</h2>
              <p className="text-[#F2E8CF]">Plantas</p>
            </div>
          </div>
        </div>
        <img
          src={currentImage}
          alt="Imagem de jardinagem"
          className="size-100"
        />
      </section>
    </div>
  );
};
