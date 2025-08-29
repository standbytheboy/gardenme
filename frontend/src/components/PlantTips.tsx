// frontend/src/components/PlantTips.tsx
import React, { useState, useEffect } from 'react';
import { Tip } from './interfaces';

const PlantTips: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/dicas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTips(data);
      setLoading(false);
    };
    fetchTips();
  }, []);

  if (loading) return <p>Carregando suas dicas...</p>;

  return (
    <div className='text-[#F2E8CF]'>
      {tips.length > 0 ? (
        tips.map(tip => (
          <div key={tip.id_dica}>
            <h3>{tip.titulo_dica}</h3>
            <p>{tip.conteudo_dica}</p>
          </div>
        ))
      ) : (
        <p>Nenhuma dica encontrada para as plantas que você comprou.</p>
      )}
    </div>
  );
};

export default PlantTips;