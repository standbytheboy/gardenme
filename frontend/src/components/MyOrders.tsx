// src/components/MyOrders.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  name?: string;
}

interface AddressType {
  id_endereco: number;
  apelido: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Order {
  id_pedido: number;
  preco_total: number;
  criado_em: string;
  id_status: number;
  itens: OrderItem[];
  endereco: AddressType | null;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch("/api/meus-pedidos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensagem || "Erro ao carregar pedidos.");
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p className="text-center text-white">Carregando pedidos...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (orders.length === 0) return <p className="text-center text-gray-300">Você ainda não tem pedidos.</p>;

  return (
    <div className="flex flex-col h-[80vh] rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-[#A7C957]">Histórico de Pedidos</h3>

      {orders.map((order) => (
        <div key={order.id_pedido} className="bg-[#00000050] p-4 rounded-lg shadow-md">
          <p className="font-semibold text-white">Pedido #{order.id_pedido}</p>
          <p className="text-sm text-gray-300">
            Data: {new Date(order.criado_em).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300">Total: R$ {order.preco_total.toFixed(2).replace('.', ',')}</p>
          <p className="text-sm text-gray-300">Status: {order.id_status}</p>

          {order.endereco && (
            <div className="mt-2 p-2 bg-[#38664120] rounded">
              <p className="font-semibold text-[#386641]">{order.endereco.apelido}</p>
              <p className="text-gray-300">
                {order.endereco.logradouro}, {order.endereco.numero} - {order.endereco.bairro}
              </p>
              <p className="text-gray-300">
                {order.endereco.cidade} - {order.endereco.estado}, CEP: {order.endereco.cep}
              </p>
            </div>
          )}

          {order.itens.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-[#A7C957]">Itens:</p>
              <ul className="list-disc list-inside text-gray-300">
                {order.itens.map((item) => (
                  <li key={item.id_produto}>
                    {item.name ? item.name : `Produto #${item.id_produto}`} - {item.quantidade}x - R$ {item.preco_unitario.toFixed(2).replace('.', ',')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;