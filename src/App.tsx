import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AIProvider } from './context/AIContext';
import Navigation from './components/zexalva/Navigation';
import CartDrawer from './components/zexalva/CartDrawer';
import Footer from './components/zexalva/Footer';
import AIAssistant from './components/zexalva/AIAssistant';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';

const kelas = {
  kerangka: 'min-h-screen bg-[#f5f4f2] text-black',
};

function App() {
  return (
    <Router>
      <CartProvider>
        <AIProvider>
          {/* // 🔧 editable: ubah warna latar utama dan warna teks global sesuai identitas brand */}
          <div className={kelas.kerangka}>
            <Navigation />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
            <AIAssistant />
          </div>
        </AIProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
