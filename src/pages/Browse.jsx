import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { MODS, CATEGORIES, GAME_VERSIONS, LOADERS, SORT_OPTIONS, formatDownloads, timeAgo } from '../data/mods';
import ModCard from '../components/ModCard';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'featured';
  const version = searchParams.get('version') || '';
  const loader = searchParams.get('loader') || '';

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const filtered = useMemo(() => {
    let list = MODS;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'all') {
      list = list.filter(m => m.category === category);
    }
    if (version) {
      list = list.filter(m => m.gameVersions.includes(version));
    }
    if (loader) {
      list = list.filter(m => m.loaders.includes(loader));
    }
    switch (sort) {
      case 'downloads': return [...list].sort((a, b) => b.downloads - a.downloads);
      case 'newest': return [...list].sort((a, b) => new Date(b.created) - new Date(a.created));
      case 'updated': return [...list].sort((a, b) => new Date(b.updated) - new Date(a.updated));
      case 'name': return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [query, category, sort, version, loader]);

  const activeFilters = [
    category && category !== 'all' && { key: 'category', label: CATEGORIES.find(c => c.id === category)?.name },
    version && { key: 'version', label: version },
    loader && { key: 'loader', label: loader },
    query && { key: 'q', label: `"${query}"` },
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e4f0' }}>Browse Mods</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8890b5' }}>
            {filtered.length} mod{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: showFilters ? '#f9731620' : '#222436',
              border: `1px solid ${showFilters ? '#f97316' : '#363a56'}`,
              color: showFilters ? '#f97316' : '#8890b5',
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
          <SortSelect value={sort} onChange={v => setParam('sort', v)} />
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8890b5' }} />
        <input
          type="text"
          value={query}
          onChange={e => setParam('q', e.target.value)}
          placeholder="Search mods by name, author, or keyword..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            backgroundColor: '#222436',
            border: '1px solid #363a56',
            color: '#e2e4f0',
          }}
          onFocus={e => e.target.style.borderColor = '#f97316'}
          onBlur={e => e.target.style.borderColor = '#363a56'}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setParam('q', '')}
          >
            <X size={15} style={{ color: '#8890b5' }} />
          </button>
        )}
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg mb-4"
          style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}
        >
          <FilterSelect
            label="Category"
            value={category}
            options={CATEGORIES.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
            onChange={v => setParam('category', v === 'all' ? '' : v)}
          />
          <FilterSelect
            label="Game Version"
            value={version}
            options={[{ value: '', label: 'All Versions' }, ...GAME_VERSIONS.map(v => ({ value: v, label: v }))]}
            onChange={v => setParam('version', v)}
          />
          <FilterSelect
            label="Mod Loader"
            value={loader}
            options={[{ value: '', label: 'All Loaders' }, ...LOADERS.map(l => ({ value: l, label: l }))]}
            onChange={v => setParam('loader', v)}
          />
        </div>
      )}

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setParam(f.key, '')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
              style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731440' }}
            >
              {f.label}
              <X size={11} />
            </button>
          ))}
          <button
            onClick={() => setSearchParams({})}
            className="text-xs underline"
            style={{ color: '#8890b5' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setParam('category', cat.id === 'all' ? '' : cat.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all shrink-0"
            style={{
              backgroundColor: (category === cat.id || (cat.id === 'all' && !category))
                ? '#f97316'
                : '#222436',
              color: (category === cat.id || (cat.id === 'all' && !category))
                ? '#ffffff'
                : '#8890b5',
              border: `1px solid ${(category === cat.id || (cat.id === 'all' && !category)) ? '#f97316' : '#363a56'}`,
            }}
          >
            <span className="text-xs">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(mod => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#e2e4f0' }}>No mods found</h3>
          <p className="text-sm mb-4" style={{ color: '#8890b5' }}>
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#f97316' }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function SortSelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm outline-none cursor-pointer"
        style={{
          backgroundColor: '#222436',
          border: '1px solid #363a56',
          color: '#e2e4f0',
        }}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8890b5' }} />
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8890b5' }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            backgroundColor: '#1a1b2e',
            border: '1px solid #363a56',
            color: '#e2e4f0',
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8890b5' }} />
      </div>
    </div>
  );
}
