import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, Zap } from 'lucide-react';

export default function Header() {
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header style={{ backgroundColor: '#111220', borderBottom: '1px solid #2a2d44' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white">
              Curse<span style={{ color: '#f97316' }}>Forge</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {[
              { label: 'Games', href: '/browse' },
              { label: 'Browse', href: '/browse' },
              { label: 'Modpacks', href: '/browse?category=modpacks' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors"
                style={{ color: '#8890b5' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e2e4f0'}
                onMouseLeave={e => e.currentTarget.style.color = '#8890b5'}
              >
                {label}
                <ChevronDown size={14} />
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8890b5' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search mods..."
                className="w-full pl-9 pr-4 py-2 rounded-md text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#2a2d44',
                  border: '1px solid #363a56',
                  color: '#e2e4f0',
                }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#363a56'}
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              to="/browse"
              className="hidden md:block px-4 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ color: '#8890b5' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2e4f0'}
              onMouseLeave={e => e.currentTarget.style.color = '#8890b5'}
            >
              Sign In
            </Link>
            <Link
              to="/browse"
              className="hidden md:block px-4 py-1.5 rounded text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#f97316' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ea6b10'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f97316'}
            >
              Get App
            </Link>
            <button
              className="md:hidden p-2 rounded"
              style={{ color: '#e2e4f0' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4" style={{ borderTop: '1px solid #2a2d44' }}>
            <form onSubmit={handleSearch} className="mt-3 mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8890b5' }} />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search mods..."
                  className="w-full pl-9 pr-4 py-2 rounded-md text-sm outline-none"
                  style={{ backgroundColor: '#2a2d44', border: '1px solid #363a56', color: '#e2e4f0' }}
                />
              </div>
            </form>
            {['Browse', 'Games', 'Modpacks', 'Sign In'].map(item => (
              <Link
                key={item}
                to="/browse"
                className="block px-3 py-2 text-sm"
                style={{ color: '#8890b5' }}
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
