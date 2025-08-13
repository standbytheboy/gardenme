import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import ShoppingCart from './components/ShoppingCart';
import CheckoutPage from './components/CheckoutPage';
import OrderSuccessPage from './components/OrderSucessPage';
import UserProfileSettings from './components/UserProfileSettings';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/carrinho" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-sucesso" element={<OrderSuccessPage />} />
        <Route path="/perfil" element={<UserProfileSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;