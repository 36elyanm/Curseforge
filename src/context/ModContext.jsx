import { createContext, useContext, useState } from 'react';
import { MODS } from '../data/mods';

const ModContext = createContext(null);

export function ModProvider({ children }) {
  // uploaded mods live alongside the seed data
  const [uploadedMods, setUploadedMods] = useState([]);
  // map from mod slug -> File object (in-memory for the session)
  const [fileStore, setFileStore] = useState({});

  const allMods = [...MODS, ...uploadedMods];

  function uploadMod(modMeta, file) {
    const slug = modMeta.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const unique = uploadedMods.some(m => m.slug === slug)
      ? `${slug}-${Date.now()}`
      : slug;

    const newMod = {
      ...modMeta,
      id: Date.now(),
      slug: unique,
      downloads: 0,
      followers: 0,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      featured: false,
      screenshots: 0,
      color: modMeta.color || '#f97316',
      icon: modMeta.icon || '📦',
    };

    setUploadedMods(prev => [newMod, ...prev]);
    if (file) {
      setFileStore(prev => ({ ...prev, [unique]: file }));
    }
    return unique;
  }

  function downloadMod(slug) {
    const file = fileStore[slug];
    if (!file) return false;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  function hasFile(slug) {
    return Boolean(fileStore[slug]);
  }

  return (
    <ModContext.Provider value={{ allMods, uploadMod, downloadMod, hasFile }}>
      {children}
    </ModContext.Provider>
  );
}

export function useMods() {
  return useContext(ModContext);
}
