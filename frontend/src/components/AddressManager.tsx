import React, { useState, useEffect } from "react";
import { Pencil,  Plus, TrashCan } from "akar-icons";
import { Address, AddressFormProps } from "./interfaces";

const AddressForm: React.FC<AddressFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Address, 'id' | 'userId'>>(
    initialData || {
      apelido: "",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-[#A7C957]">{initialData ? "Editar Endereço" : "Adicionar Novo Endereço"}</h3>
      <input
        name="apelido"
        value={formData.apelido}
        onChange={handleChange}
        placeholder="Apelido (ex: Casa, Trabalho)"
        className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
      />
      <div className="flex gap-2">
        <input
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="CEP"
          required
          className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
        />
      </div>
      <input
        name="logradouro"
        value={formData.logradouro}
        onChange={handleChange}
        placeholder="Logradouro"
        required
        className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
      />
      <div className="flex gap-2">
        <input
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Número"
          required
          className="w-1/3 p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
        />
        <input
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
          placeholder="Complemento"
          className="w-2/3 p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
        />
      </div>
      <input
        name="bairro"
        value={formData.bairro}
        onChange={handleChange}
        placeholder="Bairro"
        required
        className="w-full p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
      />
      <div className="flex gap-2">
        <input
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          required
          className="w-2/3 p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
        />
        <input
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          placeholder="Estado"
          required
          className="w-1/3 p-3 rounded-md bg-[#00000030] text-[#FFFFFF] placeholder-[#D4EDC8] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#A7C957] text-[#386641] py-2 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};


const AddressList: React.FC<{
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
}> = ({ addresses, onEdit, onDelete }) => (
  <div className="space-y-4">
    {addresses.length > 0 ? (
      addresses.map((address) => (
        <div key={address.id} className="bg-[#00000050] p-4 rounded-lg shadow-md flex justify-between items-start">
          <div>
            <p className="font-semibold text-white">
              {address.apelido ? `${address.apelido} - ` : ""}
              {address.logradouro}, {address.numero}
            </p>
            <p className="text-sm text-gray-300">
              {address.bairro}, {address.cidade} - {address.estado}
            </p>
            <p className="text-sm text-gray-300">CEP: {address.cep}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(address)}
              className="text-[#A7C957] hover:text-[#D4EDC8] transition-colors"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => onDelete(address.id)}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              <TrashCan size={20} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-300">Nenhum endereço cadastrado. Adicione um novo endereço para continuar.</p>
    )}
  </div>
);


const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");
    if (!userId || !token) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/usuarios/${userId}/enderecos`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          setError("Resposta inesperada do servidor: A lista de endereços não é um array.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.mensagem || "Não foi possível carregar os endereços.");
      }
    } catch {
      setError("Erro na conexão com o servidor. Verifique o URL da API e a conexão de rede 1.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddOrUpdate = async (addressData: Address) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!userId || !token) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (editingAddress) {
        response = await fetch(`/api/enderecos/${editingAddress.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        });
      } else {
        response = await fetch(`/api/usuarios/${userId}/enderecos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        });
      }

      if (response.ok) {
        await fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
      } else {
        const errorData = await response.json();
        setError(errorData.mensagem || "Erro ao salvar o endereço.");
      }
    } catch {
      setError("Erro na conexão com o servidor. Verifique o URL da API e a conexão de rede 2.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!userId || !token) {
      setError("Usuário não autenticado.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este endereço?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/enderecos/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchAddresses();
      } else {
        const errorData = await response.json();
        setError(errorData.mensagem || "Erro ao excluir o endereço.");
      }
    } catch {
      setError("Erro na conexão com o servidor. Verifique o URL da API e a conexão de rede 3.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (loading) {
    return <p className="text-center text-white">Carregando endereços...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#A7C957]">Meus Endereços</h3>
        {/* Botão de adicionar fora do fluxo condicional */}
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddress(null);
          }}
          className="bg-[#A7C957] text-[#386641] py-2 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Endereço
        </button>
      </div>

      {showForm ? (
        <AddressForm
          onSave={handleAddOrUpdate}
          onCancel={handleCancelClick}
          initialData={editingAddress}
        />
      ) : (
        <AddressList addresses={addresses} onEdit={handleEditClick} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AddressManager;