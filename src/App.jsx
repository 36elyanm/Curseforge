import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModProvider } from './context/ModContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ModDetail from './pages/ModDetail';
import Upload from './pages/Upload';
import './index.css';

export default function App() {
  return (
    <ModProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#1a1b2e' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/mod/:slug" element={<ModDetail />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ModProvider>
  );
}
