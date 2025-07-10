import Footer from './components/footer/Footer';
import CheckoutPage from './components/checkoutPage/CheckoutPage'; // Importe o novo componente
import './index.css';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <main className="flex-grow">
        <CheckoutPage /> {/* Renderize a tela de finalizar compra */}
      </main>
      <Footer />
    </div>
  );
}

export default App;