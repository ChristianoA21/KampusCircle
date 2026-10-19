import React, { useState } from 'react';
import { Circle, UserProfile } from '../types/index';
import { Radio, Users, Mic, MicOff, Hand, Volume2, VolumeX, ArrowRight, BookOpen } from 'lucide-react';

interface AudioLoungeViewProps {
  circles: Circle[];
  currentUser: UserProfile;
  onOpenCircleDetail: (circle: Circle) => void;
}

export const AudioLoungeView: React.FC<AudioLoungeViewProps> = ({
  circles,
  currentUser,
  onOpenCircleDetail,
}) => {
  const circlesWithVoice = circles.filter(
    (c) => c.activeVoiceRoom && c.activeVoiceRoom.isActive
  );

  return (
    <div className="space-y-6">
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <Radio className="w-4 h-4" />
            <span>Live Audio Study Lounges</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Ruang Diskusi & Study Session Suara
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Masuk ke ruang audio santai untuk belajar bareng (coworking), bedah soal, konsultasi skripsi, atau brainstorming ide proyek tanpa perlu menyalakan kamera.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-emerald-300">
            <span>{circlesWithVoice.length} Room Aktif Sekarang</span>
            <span>·</span>
            <span>Bebas Gabung Kapan Saja</span>
          </div>
        </div>
      </div>

      {/* Active Audio Lounges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {circlesWithVoice.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Belum ada Voice Lounge yang sedang aktif. Buka salah satu Circle untuk memulai sesi suara!
            </p>
          </div>
        ) : (
          circlesWithVoice.map((circle) => {
            const room = circle.activeVoiceRoom!;
            return (
              <div
                key={circle.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Now</span>
                    </span>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      {room.activeUsersCount} / {room.maxParticipants} peserta
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-500 block mb-1">
                    {circle.name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {room.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {room.topic}
                  </p>

                  {/* Active Speakers avatars */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.participants.map((p) => (
                        <div
                          key={p.id}
                          className={`inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-[11px] font-bold ${
                            p.isSpeaking
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-300 text-slate-800'
                          }`}
                          title={`${p.name} (${p.campus}) - ${p.isSpeaking ? 'Sedang Bicara' : 'Mendengarkan'}`}
                        >
                          {p.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-600 ml-2">
                      <span className="font-semibold text-slate-800">
                        {room.participants.find((p) => p.isSpeaking)?.name || room.participants[0]?.name}
                      </span>{' '}
                      {room.participants.some((p) => p.isSpeaking) ? 'sedang berbicara...' : 'di dalam room'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Cakupan: {circle.campusScope}
                  </div>
                  <button
                    onClick={() => onOpenCircleDetail(circle)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Masuk Lounge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
