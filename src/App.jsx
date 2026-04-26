import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModProvider } from './context/ModContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ModDetail from './pages/ModDetail';
import Upload from './pages/Upload';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#1a1b2e', color: '#f97316', minHeight: '100vh' }}>
          <h1 style={{ color: '#f43f5e', marginBottom: '16px' }}>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#e2e4f0', fontSize: '13px' }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
