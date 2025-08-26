import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import UserProfileSettings from './pages/UserProfileSettings';
import Homepage from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSucessPage';
import './index.css';
import Product from './pages/ProductDetail';
import ProductManagement from './pages/ProductManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/plantas" element={<Product />} />
        <Route path="/carrinho" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-sucesso" element={<OrderSuccessPage />} />
        <Route path="/perfil" element={<UserProfileSettings />} />
        <Route path="/admin/produtos" element={<ProductManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;