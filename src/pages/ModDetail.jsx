import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download, Clock, Users, Tag, Star,
  ExternalLink, AlertCircle, Package, ArrowLeft, CheckCircle
} from 'lucide-react';
import { CATEGORIES, formatDownloads, timeAgo } from '../data/mods';
import { useMods } from '../context/ModContext';
import ModCard from '../components/ModCard';

export default function ModDetail() {
  const { slug } = useParams();
  const { allMods, downloadMod, hasFile } = useMods();
  const [downloaded, setDownloaded] = useState(false);
  const mod = allMods.find(m => m.slug === slug);

  if (!mod) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: '#f97316' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: '#e2e4f0' }}>Mod not found</h2>
        <Link to="/browse" className="text-sm" style={{ color: '#f97316' }}>← Back to Browse</Link>
      </div>
    );
  }

  const related = allMods.filter(m => m.category === mod.category && m.id !== mod.id).slice(0, 4);
  const category = CATEGORIES.find(c => c.id === mod.category);

  return (
    <div style={{ backgroundColor: '#1a1b2e', minHeight: '100vh' }}>
      {/* Banner */}
      <div
        className="h-32 relative"
        style={{ background: `linear-gradient(135deg, ${mod.color}33 0%, ${mod.color}11 100%)`, borderBottom: '1px solid #2a2d44' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-4">
          <Link
            to="/browse"
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: '#8890b5' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
            onMouseLeave={e => e.currentTarget.style.color = '#8890b5'}
          >
            <ArrowLeft size={14} />
            Back to Browse
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Mod header */}
        <div
          className="flex flex-col md:flex-row gap-6 p-6 -mt-0 rounded-b-2xl mb-6"
          style={{ backgroundColor: '#222436', border: '1px solid #363a56', borderTop: 'none' }}
        >
          {/* Icon */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shrink-0"
            style={{ backgroundColor: mod.color + '22', border: `2px solid ${mod.color}55` }}
          >
            {mod.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 justify-between">
              <div>
                {mod.featured && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded mb-1"
                    style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731440' }}
                  >
                    <Star size={10} fill="#f97316" /> Featured
                  </span>
                )}
                <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>{mod.name}</h1>
                <p className="text-sm mt-0.5" style={{ color: '#8890b5' }}>
                  by{' '}
                  <Link to={`/browse?q=${mod.author}`} style={{ color: '#f97316' }}>
                    {mod.author}
                  </Link>
                  {category && (
                    <>
                      {' '}·{' '}
                      <Link to={`/browse?category=${mod.category}`} style={{ color: '#8890b5' }}>
                        {category.icon} {category.name}
                      </Link>
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={() => {
                  const ok = downloadMod(mod.slug);
                  if (ok) { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500); }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors shrink-0"
                style={{ backgroundColor: downloaded ? '#22c55e' : hasFile(mod.slug) ? '#f97316' : '#363a56' }}
                title={hasFile(mod.slug) ? 'Download mod file' : 'No file uploaded yet'}
              >
                {downloaded ? <CheckCircle size={15} /> : <Download size={15} />}
                {downloaded ? 'Downloaded!' : hasFile(mod.slug) ? 'Download' : 'No File'}
              </button>
            </div>

            <p className="text-sm mt-3" style={{ color: '#a0a8c8' }}>{mod.description}</p>

            {/* Loader / version badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {mod.loaders.map(l => (
                <span
                  key={l}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#363a56', color: '#e2e4f0' }}
                >
                  {l}
                </span>
              ))}
              {mod.gameVersions.slice(0, 4).map(v => (
                <span
                  key={v}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
                >
                  {v}
                </span>
              ))}
              {mod.gameVersions.length > 4 && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
                >
                  +{mod.gameVersions.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Description */}
            <Section title="About">
              <p className="text-sm leading-relaxed" style={{ color: '#a0a8c8' }}>
                {mod.longDescription}
              </p>
            </Section>

            {/* Tags */}
            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {mod.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/browse?q=${encodeURIComponent(tag)}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors"
                    style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#363a56'; e.currentTarget.style.color = '#8890b5'; }}
                  >
                    <Tag size={12} />
                    {tag}
                  </Link>
                ))}
              </div>
            </Section>

            {/* Screenshots placeholder */}
            <Section title={`Screenshots (${mod.screenshots})`}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: Math.min(mod.screenshots, 6) }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: '#1a1b2e',
                      border: '1px solid #363a56',
                      background: `linear-gradient(135deg, ${mod.color}22, ${mod.color}08)`,
                    }}
                  >
                    <span className="text-2xl opacity-30">{mod.icon}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}
            >
              <h3 className="text-sm font-semibold" style={{ color: '#e2e4f0' }}>Statistics</h3>
              {[
                { icon: Download, label: 'Total Downloads', value: formatDownloads(mod.downloads) },
                { icon: Users, label: 'Followers', value: formatDownloads(mod.followers) },
                { icon: Clock, label: 'Last Updated', value: timeAgo(mod.updated) },
                { icon: Clock, label: 'Created', value: new Date(mod.created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs flex items-center gap-1.5" style={{ color: '#8890b5' }}>
                    <Icon size={12} />
                    {label}
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#e2e4f0' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Project info */}
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}
            >
              <h3 className="text-sm font-semibold" style={{ color: '#e2e4f0' }}>Project Info</h3>
              {[
                { label: 'Version', value: mod.version },
                { label: 'License', value: mod.license },
                { label: 'Category', value: `${category?.icon} ${category?.name}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-xs shrink-0" style={{ color: '#8890b5' }}>{label}</span>
                  <span className="text-xs font-medium text-right" style={{ color: '#e2e4f0' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              className="p-4 rounded-lg space-y-2"
              style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}
            >
              <button
                onClick={() => {
                  const ok = downloadMod(mod.slug);
                  if (ok) { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500); }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                style={{ backgroundColor: downloaded ? '#22c55e' : hasFile(mod.slug) ? '#f97316' : '#4b5563' }}
                title={hasFile(mod.slug) ? 'Download mod file' : 'No file uploaded yet'}
              >
                {downloaded ? <CheckCircle size={14} /> : <Download size={14} />}
                {downloaded ? 'Downloaded!' : hasFile(mod.slug) ? 'Download Latest' : 'No File Uploaded'}
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#363a56'; e.currentTarget.style.color = '#8890b5'; }}
              >
                <Star size={14} />
                Follow
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#363a56'; e.currentTarget.style.color = '#8890b5'; }}
              >
                <ExternalLink size={14} />
                Source Code
              </button>
            </div>
          </div>
        </div>

        {/* Related mods */}
        {related.length > 0 && (
          <div className="pb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#e2e4f0' }}>
                More in {category?.icon} {category?.name}
              </h2>
              <Link to={`/browse?category=${mod.category}`} style={{ color: '#f97316', fontSize: '14px' }}>
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(m => <ModCard key={m.id} mod={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      className="p-5 rounded-lg"
      style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2e4f0' }}>{title}</h3>
      {children}
    </div>
  );
}
