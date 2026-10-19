import React, { useState } from 'react';
import { Circle, Purpose } from '../types/index';
import { CAMPUS_OPTIONS, ALL_INTEREST_TOPICS } from '../data/mockData';
import { X, Plus, ShieldCheck, Globe, Lock } from 'lucide-react';

interface CreateCircleModalProps {
  onClose: () => void;
  onCreateCircle: (newCircle: Omit<Circle, 'id' | 'memberCount' | 'createdAt' | 'recentActivity'>) => void;
  currentUserCampus: string;
}

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  onClose,
  onCreateCircle,
  currentUserCampus,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Teknologi & Koding');
  const [selectedTags, setSelectedTags] = useState<string[]>(['AI/ML']);
  const [campusScope, setCampusScope] = useState('Nasional (Semua Kampus)');
  const [targetMajor, setTargetMajor] = useState('Semua Jurusan');
  const [purpose, setPurpose] = useState<Purpose>('study');
  const [isPrivate, setIsPrivate] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [rules, setRules] = useState([
    'Saling menghormati latar belakang dan universitas masing-masing.',
    'Dilarang melakukan spam, promosi joki, atau konten komersial tanpa izin.',
  ]);
  const [newRuleInput, setNewRuleInput] = useState('');

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTagInput.trim())) {
        setSelectedTags([...selectedTags, customTagInput.trim()]);
      }
      setCustomTagInput('');
    }
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setRules([...rules, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (idx: number) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim() || !description.trim()) return;

    onCreateCircle({
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      tags: selectedTags.length > 0 ? selectedTags : ['Komunitas'],
      campusScope,
      targetMajor,
      purpose,
      isPrivate,
      avatarUrl: '',
      bannerBg: 'from-indigo-600 to-blue-700',
      rules,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-circle-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="create-circle-title" className="text-base font-bold text-slate-900">
              Buat Circle Diskusi Baru
            </h3>
            <p className="text-xs text-slate-500">
              Ciptakan ruang belajar dan diskusi minat tanpa hambatan tingkatan jurusan atau kampus.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup form pembuatan circle"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Circle Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Circle <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Flutter & Mobile Architecture Study Group"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Slogan / Tagline Singkat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ringkasan 1 kalimat yang menjelaskan apa yang dibahas..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan Circle, target mahasiswa yang cocok, materi atau proyek yang dikerjakan..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Purpose & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tujuan Utama
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as Purpose)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="study">Belajar & Riset (Study)</option>
                <option value="hackathon">Lomba & Hackathon (Team Up)</option>
                <option value="research">Skripsi & Publikasi Jurnal</option>
                <option value="casual">Diskusi Santai / Networking</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Teknologi & Koding">Teknologi & Koding</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Lomba & Hackathon">Lomba & Hackathon</option>
                <option value="Startup & Bisnis">Startup & Bisnis</option>
                <option value="Akademik & Skripsi">Akademik & Skripsi</option>
              </select>
            </div>
          </div>

          {/* Campus Scope & Target Major */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cakupan Kampus
              </label>
              <select
                value={campusScope}
                onChange={(e) => setCampusScope(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                {CAMPUS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sasaran Jurusan
              </label>
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                placeholder="Semua Jurusan atau spesifik (misal: CS, DKV, Elektro)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Topik Minat & Tagar ({selectedTags.length} dipilih)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ALL_INTEREST_TOPICS.map((topic) => {
                const isSelected = selectedTags.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => handleToggleTag(topic)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    #{topic}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Ketik tag lain lalu tekan Enter..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-800">
                Jadikan Circle Privat (Perlu persetujuan admin untuk bergabung)
              </span>
            </label>
          </div>

          {/* Rules list */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tata Tertib & Norma Circle
            </label>
            <ul className="space-y-1.5 mb-2">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-md">
                  <span className="text-slate-700">{rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRuleInput}
                onChange={(e) => setNewRuleInput(e.target.value)}
                placeholder="Tambahkan aturan baru..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Terbitkan Circle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
