// frontend/src/pages/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Category } from 'src/components/interfaces';

const ProductManagement: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');

  // Busca as categorias da API para preencher o select
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('userToken');

    if (!token) {
      setMessage('Erro: Você não está autenticado.');
      return;
    }

    const productData = {
      nome_produto: productName,
      preco: parseFloat(price),
      descricao: description,
      id_categoria: parseInt(category),
      imagem_url: imageUrl,
    };

    // --- DEBUG ---
    console.log("Enviando para a API:", JSON.stringify(productData, null, 2));

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      // --- DEBUG: Pegar a resposta como TEXTO primeiro ---
      const responseText = await response.text();
      console.log("Resposta Bruta do Servidor (Texto):", responseText);
      console.log("Status da Resposta:", response.status, response.statusText);

      // Agora, tente fazer o parse do texto para JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // Se o parse falhar, o erro real está no responseText que logamos acima
        setMessage('Erro: A resposta do servidor não é um JSON válido. Verifique o console do navegador para ver a resposta bruta.');
        console.error("Erro de parse JSON:", jsonError);
        return; // Interrompe a execução
      }

      if (response.ok) {
        setMessage('Produto cadastrado com sucesso!');
        setProductName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImageUrl('');
      } else {
        setMessage(`Erro: ${data.mensagem || 'Não foi possível cadastrar o produto.'}`);
      }
    } catch (error) {
      setMessage('Erro de conexão. Verifique o console para mais detalhes.');
      console.error('Erro na requisição fetch:', error);
    }
  };

  return (
    <div className="bg-[#A7C957]">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#386641] pt-24 pb-12">
        <div className="bg-[#F2E8CF] p-8 rounded-2xl shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-[#386641] mb-6 text-center">
            Cadastro de Produto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-[#386641] font-semibold mb-2">Nome do Produto</label>
              <input
                id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                className="w-full p-3 rounded-md bg-white text-[#386641] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-[#386641] font-semibold mb-2">Descrição</label>
              <textarea
                id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md bg-white text-[#386641] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                rows={4}
                required
              ></textarea>
            </div>
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <label htmlFor="price" className="block text-[#386641] font-semibold mb-2">Preço (R$)</label>
                <input
                  id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-[#386641] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                  required
                />
              </div>
              <div className='w-1/2'>
                <label htmlFor="category" className="block text-[#386641] font-semibold mb-2">Categoria</label>
                <select
                  id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-[#386641] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
                  required
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nome_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-[#386641] font-semibold mb-2">URL da Imagem</label>
              <input
                id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 rounded-md bg-white text-[#386641] focus:outline-none focus:ring-2 focus:ring-[#A7C957]"
              />
            </div>
            {message && <p className="text-center text-red-500">{message}</p>}
            <div>
              <button
                type="submit"
                className="w-full bg-[#A7C957] text-[#386641] py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300"
              >
                Cadastrar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductManagement;