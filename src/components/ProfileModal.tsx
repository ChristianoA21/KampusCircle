import React, { useState } from 'react';
import { UserProfile } from '../types/index';
import { validateCampusEmail } from '../utils/matching';
import {
  X,
  ShieldCheck,
  GraduationCap,
  Mail,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface ProfileModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  onClose,
  onUpdateProfile,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [campusEmailInput, setCampusEmailInput] = useState(currentUser.campusEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile Edit fields
  const [bio, setBio] = useState(currentUser.bio);
  const [skillsText, setSkillsText] = useState(currentUser.skills.join(', '));
  const [major, setMajor] = useState(currentUser.major);
  const [batchYear, setBatchYear] = useState(currentUser.batchYear);

  const handleStartVerification = () => {
    const val = validateCampusEmail(campusEmailInput);
    if (!val.isValid) {
      setVerificationError(val.error || 'Email kampus tidak valid');
      return;
    }

    setVerificationError(null);
    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    setIsVerifying(true);
  };

  const handleConfirmCode = () => {
    if (verificationCode === simulatedCode || verificationCode === '123456') {
      const val = validateCampusEmail(campusEmailInput);
      onUpdateProfile({
        campusEmail: campusEmailInput,
        campusName: val.institution || currentUser.campusName,
        isEmailVerified: true,
        badges: Array.from(new Set([...currentUser.badges, `Verified Mahasiswa ${val.institution?.replace('Universitas ', '').replace('Institut Teknologi ', '')}`])),
      });
      setIsVerifying(false);
      setSimulatedCode(null);
      setSuccessMessage('Email institusi kampus berhasil diverifikasi! Lencana verifikasi kini aktif.');
    } else {
      setVerificationError('Kode OTP tidak cocok. Silakan periksa kembali simulasi kode.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      bio,
      major,
      batchYear: Number(batchYear) || currentUser.batchYear,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setSuccessMessage('Profil berhasil diperbarui!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 id="profile-modal-title" className="text-base font-bold text-slate-900">
              Profil Mahasiswa Terverifikasi
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal profil"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* User ID Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-5 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white font-bold text-lg flex items-center justify-center ring-1 ring-white/20">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{currentUser.name}</span>
                    {currentUser.isEmailVerified && (
                      <span title="Email Kampus Terverifikasi">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300">
                    {currentUser.campusName} · {currentUser.major} ({currentUser.batchYear})
                  </div>
                  <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
                    {currentUser.campusEmail}
                  </div>
                </div>
              </div>

              {currentUser.isEmailVerified ? (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Terverifikasi .ac.id</span>
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  Belum Verifikasi
                </span>
              )}
            </div>

            {/* Badges list */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2 relative z-10">
              {currentUser.badges.map((b) => (
                <span
                  key={b}
                  className="bg-white/10 text-white/90 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Academic Email Verification Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Verifikasi Email Institusi (.ac.id)</h4>
                <p className="text-[11px] text-slate-500">
                  Mendapatkan lencana resmi mahasiswa dan akses ke Circle privat internal universitas.
                </p>
              </div>
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>

            {!isVerifying ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={campusEmailInput}
                  onChange={(e) => setCampusEmailInput(e.target.value)}
                  placeholder="nama@ui.ac.id atau nama@itb.ac.id"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleStartVerification}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs shrink-0"
                >
                  Kirim OTP
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-white p-3 rounded-lg border border-indigo-200">
                <div className="p-2 bg-indigo-50 rounded text-indigo-900 text-[11px]">
                  <strong>Simulasi OTP AI Studio:</strong> Masukkan kode{' '}
                  <span className="font-mono font-bold text-indigo-700">{simulatedCode}</span> ke input berikut:
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6 digit OTP"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono tracking-widest text-center"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmCode}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs"
                  >
                    Verifikasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVerifying(false)}
                    className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {verificationError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{verificationError}</span>
              </p>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-xs">Informasi Profil</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jurusan</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tahun Angkatan</label>
                <input
                  type="number"
                  value={batchYear}
                  onChange={(e) => setBatchYear(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bio Singkat</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Daftar Keahlian / Skills (pisahkan koma)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Python, Figma, Tailwind CSS..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
