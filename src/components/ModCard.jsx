import { Link } from 'react-router-dom';
import { Download, Clock, Users } from 'lucide-react';
import { formatDownloads, timeAgo } from '../data/mods';

export default function ModCard({ mod }) {
  return (
    <Link
      to={`/mod/${mod.slug}`}
      className="group block rounded-lg overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: '#222436',
        border: '1px solid #363a56',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#f97316';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#363a56';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon banner */}
      <div
        className="h-3 w-full"
        style={{ backgroundColor: mod.color }}
      />

      <div className="p-4">
        <div className="flex gap-3 mb-3">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: mod.color + '33', border: `1px solid ${mod.color}55` }}
          >
            {mod.icon}
          </div>

          <div className="min-w-0">
            <h3
              className="font-semibold text-sm leading-tight mb-0.5 truncate transition-colors"
              style={{ color: '#e2e4f0' }}
            >
              {mod.name}
            </h3>
            <p className="text-xs" style={{ color: '#8890b5' }}>
              by <span style={{ color: '#f97316' }}>{mod.author}</span>
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {mod.loaders.slice(0, 2).map(l => (
                <span
                  key={l}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#363a56', color: '#8890b5' }}
                >
                  {l}
                </span>
              ))}
              {mod.gameVersions.length > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#363a56', color: '#8890b5' }}
                >
                  {mod.gameVersions[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs line-clamp-2 mb-3" style={{ color: '#8890b5', lineHeight: '1.5' }}>
          {mod.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {mod.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#1a1b2e', color: '#8890b5', border: '1px solid #363a56' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs" style={{ color: '#8890b5' }}>
          <span className="flex items-center gap-1">
            <Download size={11} />
            {formatDownloads(mod.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {formatDownloads(mod.followers)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(mod.updated)}
          </span>
        </div>
      </div>
    </Link>
  );
}
