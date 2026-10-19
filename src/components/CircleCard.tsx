import React from 'react';
import { Circle, Purpose } from '../types/index';
import { Users, Radio, Lock, Globe, ArrowRight, BookOpen, Trophy, GraduationCap, Coffee } from 'lucide-react';

interface CircleCardProps {
  circle: Circle;
  isMember: boolean;
  onJoinToggle: (circleId: string) => void;
  onOpenDetail: (circle: Circle) => void;
  onJoinVoiceRoom?: (circle: Circle) => void;
}

export const CircleCard: React.FC<CircleCardProps> = ({
  circle,
  isMember,
  onJoinToggle,
  onOpenDetail,
  onJoinVoiceRoom,
}) => {
  const getPurposeIcon = (p: Purpose) => {
    switch (p) {
      case 'study':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      case 'hackathon':
        return <Trophy className="w-3.5 h-3.5 text-amber-600" />;
      case 'research':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'casual':
      default:
        return <Coffee className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getPurposeText = (p: Purpose) => {
    switch (p) {
      case 'study':
        return 'Belajar & Riset';
      case 'hackathon':
        return 'Lomba & Hackathon';
      case 'research':
        return 'Skripsi & Riset';
      case 'casual':
      default:
        return 'Diskusi Santai';
    }
  };

  return (
    <article className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Unboxed Header Metadata: Category · Purpose · Scope */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-medium text-slate-700">{circle.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            {getPurposeIcon(circle.purpose)}
            <span>{getPurposeText(circle.purpose)}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            {circle.isPrivate ? (
              <Lock className="w-3 h-3 text-amber-600" />
            ) : (
              <Globe className="w-3 h-3 text-slate-400" />
            )}
            <span>{circle.campusScope === 'Nasional (Semua Kampus)' ? 'Nasional' : circle.campusScope}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1 mb-1">
          {circle.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {circle.tagline}
        </p>

        {/* Tags as subtle unboxed typography */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-4">
          {circle.tags.map((tag, idx) => (
            <span key={tag} className="text-slate-600">
              #{tag}{idx < circle.tags.length - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>

        {/* Live Voice Room Spotlight if active */}
        {circle.activeVoiceRoom && circle.activeVoiceRoom.isActive && (
          <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio Study Lounge Live</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums text-emerald-700 font-medium">
                {circle.activeVoiceRoom.activeUsersCount} online
              </span>
            </div>
            <p className="text-xs text-emerald-800 line-clamp-1 mb-2">
              {circle.activeVoiceRoom.title}
            </p>
            {onJoinVoiceRoom && (
              <button
                onClick={() => onJoinVoiceRoom(circle)}
                className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3 h-3" />
                <span>Masuk Lounge Suara</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer: Member count & Action buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{circle.memberCount} anggota</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onJoinToggle(circle.id)}
            aria-label={isMember ? `Tinggalkan ${circle.name}` : `Gabung ${circle.name}`}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isMember
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {isMember ? 'Tergabung' : 'Gabung'}
          </button>

          <button
            onClick={() => onOpenDetail(circle)}
            aria-label={`Buka ${circle.name}`}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Buka</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
