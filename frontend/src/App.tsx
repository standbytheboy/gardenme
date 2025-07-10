import OrderSuccessPage from './components/orderSucessPage/OrderSucessPage.tsx'; // Importe o novo componente
import './index.css';

function App() {
  return (
    <div className="App">
      <OrderSuccessPage orderNumber="123456789" /> {/* Passe um número de pedido opcional */}
    </div>
  );
}

export default App;