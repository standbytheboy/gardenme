import ShoppingCart from './components/shoppingCart/ShoppingCart';
import Footer from './components/footer/Footer';
import './index.css';

function App() {
  return (
    <div className="App flex flex-col min-h-screen"> {/* Adicione flex-col e min-h-screen para o footer ir pro final */}
      <main className="flex-grow"> {/* Isso fará com que o main ocupe o espaço restante empurrando o footer */}
        <ShoppingCart />
      </main>
      <Footer />
    </div>
  );
}

export default App;