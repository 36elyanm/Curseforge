import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload as UploadIcon, X, CheckCircle, AlertCircle,
  FileText, Tag, Layers, ChevronDown, Package
} from 'lucide-react';
import { CATEGORIES, GAME_VERSIONS, LOADERS } from '../data/mods';
import { useMods } from '../context/ModContext';

const ICONS = ['📦', '⚙️', '🔮', '🌺', '⚒️', '🌲', '🐉', '🌾', '🍳', '💾', '🔬', '📖', '🪨', '🗺️', '✨', '🏗️'];
const COLORS = [
  '#f97316', '#7c3aed', '#0ea5e9', '#22c55e', '#ec4899',
  '#eab308', '#84cc16', '#06b6d4', '#f43f5e', '#a78bfa',
  '#d97706', '#0284c7', '#065f46', '#6366f1', '#94a3b8',
];

const STEPS = ['Basic Info', 'Details', 'Files', 'Review'];

export default function Upload() {
  const { uploadMod } = useMods();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [resultSlug, setResultSlug] = useState('');

  const [form, setForm] = useState({
    name: '',
    author: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    gameVersions: [],
    loaders: [],
    version: '',
    license: 'MIT',
    icon: '📦',
    color: '#f97316',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function toggleArr(key, val) {
    setForm(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validateStep(s) {
    const errs = {};
    if (s === 0) {
      if (!form.name.trim()) errs.name = 'Required';
      if (!form.author.trim()) errs.author = 'Required';
      if (!form.description.trim()) errs.description = 'Required';
    }
    if (s === 1) {
      if (!form.category) errs.category = 'Pick a category';
      if (form.gameVersions.length === 0) errs.gameVersions = 'Select at least one version';
      if (form.loaders.length === 0) errs.loaders = 'Select at least one loader';
      if (!form.version.trim()) errs.version = 'Required';
    }
    if (s === 2) {
      if (!file) errs.file = 'A .jar file is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  function back() {
    setStep(s => s - 1);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setErrors(prev => ({ ...prev, file: undefined })); }
  }

  function handleFileSelect(e) {
    const f = e.target.files[0];
    if (f) { setFile(f); setErrors(prev => ({ ...prev, file: undefined })); }
  }

  function handleSubmit() {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const slug = uploadMod({ ...form, tags }, file);
    setResultSlug(slug);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#22c55e20', border: '2px solid #22c55e' }}>
          <CheckCircle size={32} style={{ color: '#22c55e' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#e2e4f0' }}>Mod Published!</h2>
        <p className="text-sm mb-6" style={{ color: '#8890b5' }}>
          <span style={{ color: '#f97316', fontWeight: 600 }}>{form.name}</span> is now live and available for download.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/mod/${resultSlug}`)}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
            style={{ backgroundColor: '#f97316' }}
          >
            View Mod Page
          </button>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm({ name: '', author: '', description: '', longDescription: '', category: '', tags: '', gameVersions: [], loaders: [], version: '', license: 'MIT', icon: '📦', color: '#f97316' }); setFile(null); }}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm"
            style={{ backgroundColor: '#222436', border: '1px solid #363a56', color: '#8890b5' }}
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e2e4f0' }}>Submit a Mod</h1>
        <p className="text-sm" style={{ color: '#8890b5' }}>Share your creation with millions of players.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2"
              disabled={i > step}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                style={{
                  backgroundColor: i < step ? '#22c55e' : i === step ? '#f97316' : '#363a56',
                  color: i <= step ? '#fff' : '#8890b5',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: i === step ? '#e2e4f0' : '#8890b5' }}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-3"
                style={{ backgroundColor: i < step ? '#22c55e' : '#363a56' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-xl p-6 mb-4" style={{ backgroundColor: '#222436', border: '1px solid #363a56' }}>
        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <SectionTitle icon={FileText}>Basic Information</SectionTitle>

            <Field label="Mod Name" error={errors.name} required>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Twilight Forest"
                className="cf-input"
                style={inputStyle(errors.name)}
                onFocus={e => e.target.style.borderColor = errors.name ? '#f43f5e' : '#f97316'}
                onBlur={e => e.target.style.borderColor = errors.name ? '#f43f5e' : '#363a56'}
              />
            </Field>

            <Field label="Author / Team" error={errors.author} required>
              <input
                type="text"
                value={form.author}
                onChange={e => set('author', e.target.value)}
                placeholder="Your username or team name"
                style={inputStyle(errors.author)}
                onFocus={e => e.target.style.borderColor = errors.author ? '#f43f5e' : '#f97316'}
                onBlur={e => e.target.style.borderColor = errors.author ? '#f43f5e' : '#363a56'}
              />
            </Field>

            <Field label="Short Description" error={errors.description} required>
              <input
                type="text"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="One-line summary shown on mod cards"
                maxLength={140}
                style={inputStyle(errors.description)}
                onFocus={e => e.target.style.borderColor = errors.description ? '#f43f5e' : '#f97316'}
                onBlur={e => e.target.style.borderColor = errors.description ? '#f43f5e' : '#363a56'}
              />
              <p className="text-xs mt-1 text-right" style={{ color: '#8890b5' }}>{form.description.length}/140</p>
            </Field>

            <Field label="Full Description">
              <textarea
                value={form.longDescription}
                onChange={e => set('longDescription', e.target.value)}
                placeholder="Describe features, requirements, and how to use the mod..."
                rows={5}
                style={{ ...inputStyle(), resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#363a56'}
              />
            </Field>

            {/* Icon & color picker */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Icon">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ICONS.map(ic => (
                    <button
                      key={ic}
                      onClick={() => set('icon', ic)}
                      className="w-9 h-9 rounded-lg text-lg transition-all"
                      style={{
                        backgroundColor: form.icon === ic ? '#f9731620' : '#1a1b2e',
                        border: `2px solid ${form.icon === ic ? '#f97316' : '#363a56'}`,
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex flex-wrap gap-2 mt-1">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => set('color', c)}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{
                        backgroundColor: c,
                        outline: form.color === c ? `3px solid ${c}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* Step 1 — Details */}
        {step === 1 && (
          <div className="space-y-5">
            <SectionTitle icon={Tag}>Categorisation &amp; Versions</SectionTitle>

            <Field label="Category" error={errors.category} required>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  style={{ ...inputStyle(errors.category), appearance: 'none', paddingRight: '2rem' }}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = errors.category ? '#f43f5e' : '#363a56'}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8890b5' }} />
              </div>
            </Field>

            <Field label="Tags" hint="Comma-separated, e.g. Magic, Wands, RPG">
              <input
                type="text"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="Magic, Wands, Research"
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#363a56'}
              />
            </Field>

            <Field label="Game Versions" error={errors.gameVersions} required>
              <div className="flex flex-wrap gap-2 mt-1">
                {GAME_VERSIONS.map(v => (
                  <button
                    key={v}
                    onClick={() => toggleArr('gameVersions', v)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: form.gameVersions.includes(v) ? '#f9731620' : '#1a1b2e',
                      border: `1px solid ${form.gameVersions.includes(v) ? '#f97316' : '#363a56'}`,
                      color: form.gameVersions.includes(v) ? '#f97316' : '#8890b5',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {errors.gameVersions && <p className="text-xs mt-1" style={{ color: '#f43f5e' }}>{errors.gameVersions}</p>}
            </Field>

            <Field label="Mod Loaders" error={errors.loaders} required>
              <div className="flex flex-wrap gap-2 mt-1">
                {LOADERS.map(l => (
                  <button
                    key={l}
                    onClick={() => toggleArr('loaders', l)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: form.loaders.includes(l) ? '#f9731620' : '#1a1b2e',
                      border: `1px solid ${form.loaders.includes(l) ? '#f97316' : '#363a56'}`,
                      color: form.loaders.includes(l) ? '#f97316' : '#8890b5',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {errors.loaders && <p className="text-xs mt-1" style={{ color: '#f43f5e' }}>{errors.loaders}</p>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Mod Version" error={errors.version} required>
                <input
                  type="text"
                  value={form.version}
                  onChange={e => set('version', e.target.value)}
                  placeholder="e.g. 1.0.0"
                  style={inputStyle(errors.version)}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = errors.version ? '#f43f5e' : '#363a56'}
                />
              </Field>
              <Field label="License">
                <div className="relative">
                  <select
                    value={form.license}
                    onChange={e => set('license', e.target.value)}
                    style={{ ...inputStyle(), appearance: 'none', paddingRight: '2rem' }}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#363a56'}
                  >
                    {['MIT', 'Apache-2.0', 'GPL-3.0', 'LGPL-3.0', 'All Rights Reserved', 'Other'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8890b5' }} />
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* Step 2 — Files */}
        {step === 2 && (
          <div className="space-y-5">
            <SectionTitle icon={Layers}>Upload Files</SectionTitle>

            <Field label="Mod File (.jar)" error={errors.file} required>
              <div
                className="relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer"
                style={{
                  borderColor: dragOver ? '#f97316' : errors.file ? '#f43f5e' : '#363a56',
                  backgroundColor: dragOver ? '#f9731610' : '#1a1b2e',
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".jar,.zip" onChange={handleFileSelect} className="hidden" />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#22c55e20', border: '1px solid #22c55e44' }}
                    >
                      <CheckCircle size={20} style={{ color: '#22c55e' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: '#e2e4f0' }}>{file.name}</p>
                      <p className="text-xs" style={{ color: '#8890b5' }}>{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="ml-2 p-1 rounded"
                      style={{ color: '#8890b5' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadIcon size={32} className="mx-auto mb-3" style={{ color: '#8890b5' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: '#e2e4f0' }}>
                      Drag & drop your .jar file here
                    </p>
                    <p className="text-xs" style={{ color: '#8890b5' }}>or click to browse</p>
                  </>
                )}
              </div>
              {errors.file && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#f43f5e' }}>
                  <AlertCircle size={11} /> {errors.file}
                </p>
              )}
            </Field>

            <div
              className="flex items-start gap-3 p-3 rounded-lg text-xs"
              style={{ backgroundColor: '#f9731610', border: '1px solid #f9731430', color: '#8890b5' }}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#f97316' }} />
              <span>Files are stored in your browser session only. They will be cleared on page refresh. This is a demo — no server upload occurs.</span>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="space-y-4">
            <SectionTitle icon={Package}>Review &amp; Publish</SectionTitle>

            {/* Preview card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #363a56' }}
            >
              <div className="h-2" style={{ backgroundColor: form.color }} />
              <div className="p-4 flex gap-3" style={{ backgroundColor: '#1a1b2e' }}>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: form.color + '33', border: `1px solid ${form.color}55` }}
                >
                  {form.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#e2e4f0' }}>{form.name || 'Untitled Mod'}</p>
                  <p className="text-xs" style={{ color: '#8890b5' }}>by <span style={{ color: '#f97316' }}>{form.author}</span></p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: '#8890b5' }}>{form.description}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Category', value: CATEGORIES.find(c => c.id === form.category)?.name || '—' },
                { label: 'Version', value: form.version || '—' },
                { label: 'Game Versions', value: form.gameVersions.join(', ') || '—' },
                { label: 'Loaders', value: form.loaders.join(', ') || '—' },
                { label: 'License', value: form.license },
                { label: 'File', value: file ? file.name : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #2a2d44' }}>
                  <span style={{ color: '#8890b5' }}>{label}</span>
                  <span style={{ color: '#e2e4f0' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          style={{ backgroundColor: '#222436', border: '1px solid #363a56', color: '#8890b5' }}
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#f97316' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ea6b10'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f97316'}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#22c55e' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#16a34a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#22c55e'}
          >
            Publish Mod
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon size={16} style={{ color: '#f97316' }} />
      <h2 className="text-sm font-semibold" style={{ color: '#e2e4f0' }}>{children}</h2>
    </div>
  );
}

function Field({ label, children, error, hint, required }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8890b5' }}>
        {label}
        {required && <span style={{ color: '#f97316' }}> *</span>}
        {hint && <span className="ml-1 font-normal" style={{ color: '#4b5280' }}>— {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#f43f5e' }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function inputStyle(error) {
  return {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#1a1b2e',
    border: `1px solid ${error ? '#f43f5e' : '#363a56'}`,
    color: '#e2e4f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
  };
}
