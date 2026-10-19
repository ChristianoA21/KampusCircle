import React, { useState } from 'react';
import { TeammateListing, UserProfile } from '../types/index';
import { calculateTeammateMatchScore } from '../utils/matching';
import {
  Users,
  Search,
  Plus,
  Calendar,
  Sparkles,
  Send,
  CheckCircle2,
  X,
  Target,
  MessageCircle,
} from 'lucide-react';

interface TeammateFinderProps {
  listings: TeammateListing[];
  currentUser: UserProfile;
  onCreateListing: (listing: Omit<TeammateListing, 'id' | 'createdAt' | 'applicantsCount'>) => void;
  onApplyToListing: (listingId: string, message: string) => void;
}

export const TeammateFinder: React.FC<TeammateFinderProps> = ({
  listings,
  currentUser,
  onCreateListing,
  onApplyToListing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua');
  const [selectedListingForApply, setSelectedListingForApply] = useState<TeammateListing | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [appliedListingIds, setAppliedListingIds] = useState<string[]>([]);
  const [isCreatingListing, setIsCreatingListing] = useState(false);

  // New Listing State
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [competitionOrType, setCompetitionOrType] = useState('Gemastik / Hackathon');
  const [description, setDescription] = useState('');
  const [neededRolesText, setNeededRolesText] = useState('UI/UX Designer, Frontend Developer');
  const [requiredSkillsText, setRequiredSkillsText] = useState('Figma, React, Tailwind CSS');
  const [deadline, setDeadline] = useState('30 April 2026');
  const [openSpots, setOpenSpots] = useState(2);
  const [contactMethod, setContactMethod] = useState(`Telegram @${currentUser.name.toLowerCase().replace(/\s+/g, '')}`);

  const rolesFilterList = ['Semua', 'UI/UX Designer', 'Frontend Developer', 'Machine Learning Engineer', 'Python Developer', 'Study Partner', 'Product Researcher'];

  const filteredListings = listings.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchProject = item.projectName.toLowerCase().includes(q);
      const matchComp = item.competitionOrType.toLowerCase().includes(q);
      const matchSkills = item.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchProject && !matchComp && !matchSkills) return false;
    }

    if (selectedRole !== 'Semua') {
      const roleMatch = item.neededRoles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));
      if (!roleMatch) return false;
    }

    return true;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForApply) return;
    onApplyToListing(selectedListingForApply.id, applyMessage);
    setAppliedListingIds((prev) => [...prev, selectedListingForApply.id]);
    setApplyMessage('');
    setSelectedListingForApply(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectName.trim()) return;

    onCreateListing({
      title: title.trim(),
      projectName: projectName.trim(),
      competitionOrType: competitionOrType.trim(),
      description: description.trim(),
      neededRoles: neededRolesText.split(',').map((r) => r.trim()).filter(Boolean),
      requiredSkills: requiredSkillsText.split(',').map((s) => s.trim()).filter(Boolean),
      targetCampus: 'Nasional (Semua Kampus)',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorCampus: currentUser.campusName,
      authorMajor: currentUser.major,
      deadline,
      openSpots: Number(openSpots) || 1,
      contactMethod,
    });

    setTitle('');
    setProjectName('');
    setDescription('');
    setIsCreatingListing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-4 h-4" />
            <span>Matchmaking & Peer Finder Mahasiswa</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Temukan Rekan Tim Lomba, Riset & Side Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Cari partner berkomitmen dengan keahlian komplementer tanpa terhalang tembok kampus atau tingkatan angkatan.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreatingListing(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Pasang Rekrutmen Tim</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Cocokkan skillmu dengan {listings.length} peluang tim terbuka
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lomba, skill (Figma, Python, React), nama..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Roles Filter Bar (Functional buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {rolesFilterList.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedRole === role
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredListings.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-xs text-slate-500">
              Tidak ditemukan lowongan rekan tim yang cocok dengan kriteria pencarian ini.
            </p>
          </div>
        ) : (
          filteredListings.map((listing) => {
            const matchInfo = calculateTeammateMatchScore(listing, currentUser.skills, currentUser.interests);
            const isApplied = appliedListingIds.includes(listing.id);

            return (
              <article
                key={listing.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Author & Event */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{listing.authorName}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{listing.authorCampus.replace('Universitas ', '').replace('Institut Teknologi ', '')}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="text-slate-400">{listing.createdAt}</span>
                    </div>

                    {/* Dynamic Match Score Meter */}
                    <div
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        matchInfo.isHighMatch
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                      title={`Tingkat kecocokan profil kamu: ${matchInfo.score}%`}
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span className="font-mono tabular-nums">{matchInfo.score}% Match</span>
                    </div>
                  </div>

                  {/* Title & Project */}
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {listing.title}
                  </h3>
                  <div className="text-xs text-indigo-700 font-medium mb-3">
                    Proyek: {listing.projectName} ({listing.competitionOrType})
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {listing.description}
                  </p>

                  {/* Roles needed & Required Skills */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Peran yang Dicari:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {listing.neededRoles.map((role) => (
                          <span
                            key={role}
                            className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-xs font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Keahlian Dibutuhkan:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-slate-600">
                        {listing.requiredSkills.map((skill) => {
                          const isMatched = matchInfo.matchedSkills.some(
                            (ms) => ms.toLowerCase() === skill.toLowerCase()
                          );
                          return (
                            <span
                              key={skill}
                              className={`text-xs ${
                                isMatched
                                  ? 'text-emerald-700 font-semibold'
                                  : 'text-slate-600'
                              }`}
                            >
                              {skill}{isMatched ? ' ✓' : ''} ·
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: {listing.deadline}</span>
                    </span>
                    <span>· {listing.openSpots} slot kosong</span>
                  </div>

                  <div>
                    {isApplied ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terkirim</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedListingForApply(listing)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Hubungi / Lamar</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal: Apply / Hubungi Rekan Tim */}
      {selectedListingForApply && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kirim Pesan Minat Bergabung
                </h3>
                <p className="text-xs text-slate-500">
                  Kepada: {selectedListingForApply.authorName} ({selectedListingForApply.authorCampus})
                </p>
              </div>
              <button
                onClick={() => setSelectedListingForApply(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900">
                <span className="font-semibold block">Posisi: {selectedListingForApply.title}</span>
                <span className="text-[11px] text-indigo-700">Kontak Resmi: {selectedListingForApply.contactMethod}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pesan Perkenalan & Portofolio Singkat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder={`Halo ${selectedListingForApply.authorName}, saya ${currentUser.name} dari ${currentUser.campusName} (${currentUser.major}). Saya tertarik mengisi peran karena memiliki keahlian di ${currentUser.skills.slice(0, 3).join(', ')}...`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedListingForApply(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Kirim Lamaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Teammate Recruitment */}
      {isCreatingListing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl w-full max-w-xl p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pasang Lowongan Rekrutmen Tim
                </h3>
                <p className="text-xs text-slate-500">
                  Cari rekan tim mahasiswa untuk lomba atau proyek riset.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingListing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Rekrutmen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Butuh 1 UI/UX Designer & 1 Frontend Dev untuk Gemastik 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Proyek / Ide <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Contoh: Platform AI Pembelajaran Tuna Rungu"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Kompetisi / Kategori
                  </label>
                  <input
                    type="text"
                    value={competitionOrType}
                    onChange={(e) => setCompetitionOrType(e.target.value)}
                    placeholder="Contoh: Gemastik XVI UX Design"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Proyek & Kebutuhan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan progres ide saat ini, komitmen jam kerja mingguan, dan ekspektasi kontribusi..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peran Dibutuhkan (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={neededRolesText}
                    onChange={(e) => setNeededRolesText(e.target.value)}
                    placeholder="UI/UX Designer, Frontend Developer"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keahlian Teknis (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={requiredSkillsText}
                    onChange={(e) => setRequiredSkillsText(e.target.value)}
                    placeholder="Figma, React, Tailwind CSS"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batas Pendaftaran / Deadline
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Contoh: 30 April 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Rekan Dibutuhkan
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={openSpots}
                    onChange={(e) => setOpenSpots(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kontak Lanjutan (Telegram / WhatsApp / Email)
                </label>
                <input
                  type="text"
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Terbitkan Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
