import React from 'react';
import { UserProfile } from '../types/index';
import { Sparkles, ShieldCheck, Plus, Radio, Users } from 'lucide-react';

interface NavbarProps {
  activeTab: 'circles' | 'teammates' | 'lounge' | 'architecture';
  setActiveTab: (tab: 'circles' | 'teammates' | 'lounge' | 'architecture') => void;
  currentUser: UserProfile;
  onOpenCreateCircle: () => void;
  onOpenVerificationModal: () => void;
  onOpenProfileModal: () => void;
  activeVoiceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreateCircle,
  onOpenVerificationModal,
  onOpenProfileModal,
  activeVoiceCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('circles')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Kembali ke beranda KampusCircle"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              KC
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                KampusCircle
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600" aria-label="Navigasi Utama">
          <button
            onClick={() => setActiveTab('circles')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'circles'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Jelajahi Circles</span>
          </button>

          <button
            onClick={() => setActiveTab('teammates')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'teammates'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Cari Rekan Tim</span>
          </button>

          <button
            onClick={() => setActiveTab('lounge')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'lounge'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Audio Lounge</span>
            {activeVoiceCount > 0 && (
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-semibold">
                {activeVoiceCount} live
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Arsitektur & API</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Verified Campus Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateCircle}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Circle</span>
          </button>

          {/* User profile / Campus verification trigger */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all text-left"
            title="Lihat Profil Mahasiswa"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs ring-2 ring-white shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1 truncate max-w-[140px]">
                <span>{currentUser.name}</span>
                {currentUser.isEmailVerified && (
                  <span title="Email Kampus Terverifikasi">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                {currentUser.campusName.replace('Universitas ', '').replace('Institut Teknologi ', '')} · {currentUser.major}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="flex md:hidden border-t border-slate-200 bg-white px-2 py-1 justify-around text-xs">
        <button
          onClick={() => setActiveTab('circles')}
          className={`py-1.5 px-2 font-medium ${activeTab === 'circles' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Circles
        </button>
        <button
          onClick={() => setActiveTab('teammates')}
          className={`py-1.5 px-2 font-medium ${activeTab === 'teammates' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Rekan Tim
        </button>
        <button
          onClick={() => setActiveTab('lounge')}
          className={`py-1.5 px-2 font-medium ${activeTab === 'lounge' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Lounge ({activeVoiceCount})
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-1.5 px-2 font-medium ${activeTab === 'architecture' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Arsitektur
        </button>
      </div>
    </header>
  );
};
