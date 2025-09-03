import { Tip } from "./interfaces";
import React, { useEffect, useState } from "react";

const PlantTips: React.FC = () => {
  const [dicasPorProduto, setDicasPorProduto] = useState<Record<string, Tip[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDicas = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Você precisa estar logado para ver suas dicas.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/minhas-dicas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar as dicas.");
        }

        const data: Tip[] = await response.json();
        
        // Agrupa as dicas por nome do produto
        const groupedDicas = data.reduce((acc, dica) => {
          const { nome_produto } = dica;
          if (!acc[nome_produto]) {
            acc[nome_produto] = [];
          }
          acc[nome_produto].push(dica);
          return acc;
        }, {} as Record<string, Tip[]>);

        setDicasPorProduto(groupedDicas);

      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDicas();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-[100dvh]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (Object.keys(dicasPorProduto).length === 0) return <p className="text-center text-gray-300">Você ainda não possui dicas para as plantas que comprou.</p>;

  return (
    <div className="flex flex-col h-[60vh] rounded-lg p-6 space-y-6">
      {Object.entries(dicasPorProduto).map(([nomeProduto, dicas]) => (
        <div key={nomeProduto} className="bg-[#00000050] p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-[#A7C957] mb-2">{nomeProduto}</h4>
          <ul className="space-y-2 list-disc list-inside">
            {dicas.map((dica) => (
              <li key={dica.id_dica} className="text-gray-300">
                <strong className="font-semibold text-white">{dica.titulo_dica}:</strong> {dica.conteudo_dica}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlantTips;