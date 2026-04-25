import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  const sections = [
    {
      title: 'CurseForge',
      links: ['About', 'Blog', 'Careers', 'Press Kit'],
    },
    {
      title: 'Support',
      links: ['FAQ', 'Contact Us', 'Report a Bug', 'Feedback'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
    {
      title: 'Games',
      links: ['Minecraft', 'World of Warcraft', 'The Sims 4', 'Kerbal Space Program'],
    },
  ];

  return (
    <footer style={{ backgroundColor: '#111220', borderTop: '1px solid #2a2d44', marginTop: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-white">
                Curse<span style={{ color: '#f97316' }}>Forge</span>
              </span>
            </Link>
            <p className="text-xs" style={{ color: '#8890b5', lineHeight: '1.6' }}>
              The ultimate destination for Minecraft mods, modpacks, addons, and more.
            </p>
          </div>
          {sections.map(section => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#e2e4f0' }}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link}>
                    <Link
                      to="/browse"
                      className="text-xs transition-colors"
                      style={{ color: '#8890b5' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                      onMouseLeave={e => e.currentTarget.style.color = '#8890b5'}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid #2a2d44', color: '#8890b5' }}
        >
          <span>© 2024 CurseForge. All rights reserved.</span>
          <span>Powered by Overwolf</span>
        </div>
      </div>
    </footer>
  );
}
