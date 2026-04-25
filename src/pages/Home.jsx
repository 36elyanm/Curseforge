import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download, Package, Zap, TrendingUp, Star } from 'lucide-react';
import { MODS, CATEGORIES, formatDownloads } from '../data/mods';
import ModCard from '../components/ModCard';

const FEATURED = MODS.filter(m => m.featured);
const POPULAR = [...MODS].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
const RECENT = [...MODS].sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 6);

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
  }

  const totalDownloads = MODS.reduce((s, m) => s + m.downloads, 0);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #1a1b2e 0%, #16213e 50%, #0f3460 100%)',
          borderBottom: '1px solid #2a2d44',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: '#f97316', transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: '#7c3aed', transform: 'translate(50%, 50%)' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}
          >
            <Zap size={12} />
            The #1 Minecraft Mod Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Find &amp; Share{' '}
            <span style={{ color: '#f97316' }}>Minecraft</span>
            {' '}Mods
          </h1>
          <p className="text-lg mb-8" style={{ color: '#8890b5' }}>
            Browse thousands of mods, modpacks, maps, and textures for Minecraft.
            Discover your next adventure.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: '#8890b5' }}
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search mods, modpacks, authors..."
                className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: '#222436',
                  border: '1px solid #363a56',
                  color: '#e2e4f0',
                }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#363a56'}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-white transition-colors"
              style={{ backgroundColor: '#f97316' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ea6b10'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f97316'}
            >
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { icon: Package, label: 'Mods', value: '100K+' },
              { icon: Download, label: 'Downloads', value: formatDownloads(totalDownloads) },
              { icon: Star, label: 'Authors', value: '50K+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-2xl font-bold mb-0.5" style={{ color: '#e2e4f0' }}>
                  <Icon size={20} style={{ color: '#f97316' }} />
                  {value}
                </div>
                <p className="text-xs" style={{ color: '#8890b5' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4" style={{ backgroundColor: '#1a1b2e' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#e2e4f0' }}>Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: '#222436',
                  border: '1px solid #363a56',
                  color: '#8890b5',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#f9731610';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#363a56';
                  e.currentTarget.style.color = '#8890b5';
                  e.currentTarget.style.backgroundColor = '#222436';
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-10 px-4" style={{ backgroundColor: '#1a1b2e' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star size={18} style={{ color: '#f97316' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#e2e4f0' }}>Featured Mods</h2>
            </div>
            <Link
              to="/browse?sort=featured"
              className="text-sm transition-colors"
              style={{ color: '#f97316' }}
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURED.map(mod => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="py-10 px-4" style={{ backgroundColor: '#16172a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} style={{ color: '#f97316' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#e2e4f0' }}>Most Downloaded</h2>
            </div>
            <Link
              to="/browse?sort=downloads"
              className="text-sm"
              style={{ color: '#f97316' }}
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {POPULAR.map(mod => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Updated */}
      <section className="py-10 px-4" style={{ backgroundColor: '#1a1b2e' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap size={18} style={{ color: '#f97316' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#e2e4f0' }}>Recently Updated</h2>
            </div>
            <Link
              to="/browse?sort=updated"
              className="text-sm"
              style={{ color: '#f97316' }}
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {RECENT.map(mod => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: '#16172a' }}>
        <div
          className="max-w-2xl mx-auto p-10 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #f9731620, #7c3aed20)', border: '1px solid #f9731430' }}
        >
          <Zap size={40} className="mx-auto mb-4" style={{ color: '#f97316' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
            Share Your Creation
          </h2>
          <p className="mb-6 text-sm" style={{ color: '#8890b5' }}>
            Upload your mods, modpacks, or resource packs and reach millions of players.
          </p>
          <Link
            to="/browse"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: '#f97316' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ea6b10'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f97316'}
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
