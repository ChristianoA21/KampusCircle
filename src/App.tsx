/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { InterestPicker } from './components/InterestPicker';
import { CircleCard } from './components/CircleCard';
import { CircleDetailModal } from './components/CircleDetailModal';
import { CreateCircleModal } from './components/CreateCircleModal';
import { TeammateFinder } from './components/TeammateFinder';
import { AudioLoungeView } from './components/AudioLoungeView';
import { ProfileModal } from './components/ProfileModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import {
  INITIAL_USER,
  INITIAL_CIRCLES,
  INITIAL_FORUM_POSTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_TEAMMATE_LISTINGS,
  CAMPUS_OPTIONS,
} from './data/mockData';
import { Circle, ForumPost, ChatMessage, TeammateListing, UserProfile, Purpose } from './types/index';
import { filterAndRankCircles } from './utils/matching';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Compass,
  Radio,
  Users,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  Trophy,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'circles' | 'teammates' | 'lounge' | 'architecture'>('circles');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [teammateListings, setTeammateListings] = useState<TeammateListing[]>(INITIAL_TEAMMATE_LISTINGS);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedCampus, setSelectedCampus] = useState('Semua');
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose>('all');

  // Modals state
  const [selectedCircleForDetail, setSelectedCircleForDetail] = useState<Circle | null>(null);
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Categories list
  const categoryFilters = [
    'Semua',
    'Teknologi & Koding',
    'AI & Data Science',
    'Design & Creative',
    'Lomba & Hackathon',
    'Startup & Bisnis',
    'Akademik & Skripsi',
  ];

  // Dynamic ranking & filtering of Circles
  const rankedCircles = useMemo(() => {
    return filterAndRankCircles(circles, {
      searchQuery,
      selectedCategory,
      selectedCampus,
      selectedPurpose,
      userInterests: currentUser.interests,
      userCampus: currentUser.campusName,
    });
  }, [circles, searchQuery, selectedCategory, selectedCampus, selectedPurpose, currentUser.interests, currentUser.campusName]);

  // Active live voice lounges count
  const activeVoiceCount = useMemo(() => {
    return circles.filter((c) => c.activeVoiceRoom && c.activeVoiceRoom.isActive).length;
  }, [circles]);

  // User interest toggle handler
  const handleToggleInterest = (topic: string) => {
    setCurrentUser((prev) => {
      const exists = prev.interests.includes(topic);
      const nextInterests = exists
        ? prev.interests.filter((t) => t !== topic)
        : [...prev.interests, topic];
      return { ...prev, interests: nextInterests };
    });
  };

  // Join or leave Circle
  const handleJoinCircleToggle = (circleId: string) => {
    const isJoined = currentUser.joinedCircles.includes(circleId);
    setCurrentUser((prev) => ({
      ...prev,
      joinedCircles: isJoined
        ? prev.joinedCircles.filter((id) => id !== circleId)
        : [...prev.joinedCircles, circleId],
    }));

    setCircles((prev) =>
      prev.map((c) => {
        if (c.id === circleId) {
          return {
            ...c,
            memberCount: isJoined ? c.memberCount - 1 : c.memberCount + 1,
          };
        }
        return c;
      })
    );

    if (selectedCircleForDetail && selectedCircleForDetail.id === circleId) {
      setSelectedCircleForDetail((prev) =>
        prev
          ? {
              ...prev,
              memberCount: isJoined ? prev.memberCount - 1 : prev.memberCount + 1,
            }
          : null
      );
    }
  };

  // Create new Circle
  const handleCreateCircle = (newCircleData: Omit<Circle, 'id' | 'memberCount' | 'createdAt' | 'recentActivity'>) => {
    const newId = `c_${Date.now()}`;
    const newCircle: Circle = {
      ...newCircleData,
      id: newId,
      memberCount: 1,
      createdAt: 'Baru saja',
      recentActivity: 'Baru saja dibuat',
    };
    setCircles((prev) => [newCircle, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      joinedCircles: [...prev.joinedCircles, newId],
    }));
  };

  // Add forum post to circle
  const handleAddForumPost = (circleId: string, title: string, content: string, tags: string[]) => {
    const newPost: ForumPost = {
      id: `fp_${Date.now()}`,
      circleId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorCampus: currentUser.campusName,
      title,
      content,
      tags,
      upvotes: 1,
      hasUpvoted: true,
      repliesCount: 0,
      createdAt: 'Baru saja',
      isSolved: false,
      replies: [],
    };
    setForumPosts((prev) => [newPost, ...prev]);
  };

  // Upvote forum post
  const handleUpvotePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasUpvoted = p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUpvoted,
          };
        }
        return p;
      })
    );
  };

  // Reply to forum post
  const handleAddReply = (postId: string, content: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newReply = {
            id: `fr_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorAvatar: currentUser.avatarUrl,
            authorCampus: currentUser.campusName,
            content,
            createdAt: 'Baru saja',
            upvotes: 0,
          };
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...(p.replies || []), newReply],
          };
        }
        return p;
      })
    );
  };

  // Send Chat message
  const handleSendMessage = (circleId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      circleId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      senderCampus: currentUser.campusName.replace('Universitas ', '').replace('Institut Teknologi ', ''),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [circleId]: [...(prev[circleId] || []), newMsg],
    }));

    // Simulated peer reply after 2 seconds for active discussion vibe
    setTimeout(() => {
      const peerMsg: ChatMessage = {
        id: `m_${Date.now() + 1}`,
        circleId,
        senderId: 'usr_peer',
        senderName: 'Rian Pratama',
        senderAvatar: '',
        senderCampus: 'UI',
        text: 'Menarik! Mari kita ulas lebih detail saat sesi audio lounge nanti malam.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => ({
        ...prev,
        [circleId]: [...(prev[circleId] || []), peerMsg],
      }));
    }, 2000);
  };

  // Create Teammate Listing
  const handleCreateTeammateListing = (
    listing: Omit<TeammateListing, 'id' | 'createdAt' | 'applicantsCount'>
  ) => {
    const newListing: TeammateListing = {
      ...listing,
      id: `tl_${Date.now()}`,
      createdAt: 'Baru saja',
      applicantsCount: 0,
    };
    setTeammateListings((prev) => [newListing, ...prev]);
  };

  // Apply to Teammate Listing
  const handleApplyToListing = (listingId: string) => {
    setTeammateListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, applicantsCount: l.applicantsCount + 1 } : l))
    );
  };

  // Update profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenCreateCircle={() => setIsCreateCircleOpen(true)}
        onOpenVerificationModal={() => setIsProfileModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeVoiceCount={activeVoiceCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: CIRCLES DIRECTORY & DISCOVERY */}
        {activeTab === 'circles' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="max-w-3xl relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Komunitas Kolaborasi & Diskusi Mahasiswa Lintas Kampus</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                  Diskusi Ilmu & Garap Proyek Bareng Mahasiswa Sefrekuensi
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
                  Temukan teman belajar, bedah paper riset, konsultasi skripsi, hingga rekan tim hackathon tanpa sekat tingkatan angkatan atau batasan universitas.
                </p>

                {/* Search Bar in Hero */}
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari Circle berdasar topik (AI/ML, Skripsi, UI/UX, Python, Gemastik)..."
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-400 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setIsCreateCircleOpen(true)}
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Circle Baru</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Circle mesh pattern */}
              <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            </div>

            {/* Interest Topics Interactive Selector */}
            <InterestPicker
              userInterests={currentUser.interests}
              onToggleInterest={handleToggleInterest}
              onResetInterests={() => setCurrentUser((p) => ({ ...p, interests: ['AI/ML', 'UI/UX'] }))}
              matchedCirclesCount={rankedCircles.length}
            />

            {/* Filter and Facet Controls Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Categories Segmented Control (Functional Buttons) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sub-Filters: Campus & Purpose Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto w-full lg:w-auto">
                  {/* Purpose Filter */}
                  <select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value as Purpose)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
                    aria-label="Filter berdasarkan tujuan"
                  >
                    <option value="all">Semua Tujuan</option>
                    <option value="study">Belajar & Riset</option>
                    <option value="hackathon">Lomba & Hackathon</option>
                    <option value="research">Skripsi & Publikasi</option>
                    <option value="casual">Diskusi Santai</option>
                  </select>

                  {/* Campus Filter */}
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500 max-w-[200px]"
                    aria-label="Filter berdasarkan kampus"
                  >
                    <option value="Semua">Semua Kampus</option>
                    <option value="Nasional">Nasional (Multi-Kampus)</option>
                    {CAMPUS_OPTIONS.filter((c) => c !== 'Nasional (Semua Kampus)').map((c) => (
                      <option key={c} value={c}>
                        {c.replace('Universitas ', '').replace('Institut Teknologi ', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Circles Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rankedCircles.length === 0 ? (
                <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">
                    Tidak ditemukan Circle yang sesuai dengan filter pencarian ini.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSelectedCampus('Semua');
                      setSelectedPurpose('all');
                    }}
                    className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Reset Filter Pencarian
                  </button>
                </div>
              ) : (
                rankedCircles.map((circle) => {
                  const isMember = currentUser.joinedCircles.includes(circle.id);
                  return (
                    <CircleCard
                      key={circle.id}
                      circle={circle}
                      isMember={isMember}
                      onJoinToggle={handleJoinCircleToggle}
                      onOpenDetail={(c) => setSelectedCircleForDetail(c)}
                      onJoinVoiceRoom={(c) => setSelectedCircleForDetail(c)}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: TEAMMATE FINDER */}
        {activeTab === 'teammates' && (
          <TeammateFinder
            listings={teammateListings}
            currentUser={currentUser}
            onCreateListing={handleCreateTeammateListing}
            onApplyToListing={handleApplyToListing}
          />
        )}

        {/* VIEW 3: AUDIO STUDY LOUNGE */}
        {activeTab === 'lounge' && (
          <AudioLoungeView
            circles={circles}
            currentUser={currentUser}
            onOpenCircleDetail={(circle) => setSelectedCircleForDetail(circle)}
          />
        )}

        {/* VIEW 4: ARCHITECTURE & API BLUEPRINT */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Arsitektur Sistem & Spesifikasi Lengkap KampusCircle
                </h2>
                <p className="text-xs text-slate-500">
                  Desain konseptual, struktur basis data, skema API, dan panduan implementasi.
                </p>
              </div>
              <button
                onClick={() => setIsArchitectureModalOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
              >
                Buka Layar Penuh
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <ArchitectureModal onClose={() => setActiveTab('circles')} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">KampusCircle</span>
            <span aria-hidden="true">·</span>
            <span>Platform Komunitas & Riset Kolaboratif Mahasiswa Indonesia</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Dokumentasi Arsitektur & ERD
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-400">Verifikasi Resmi .ac.id</span>
          </div>
        </div>
      </footer>

      {/* MODAL: Circle Detail View (Forum, Chat, Audio Lounge, Members) */}
      {selectedCircleForDetail && (
        <CircleDetailModal
          circle={selectedCircleForDetail}
          currentUser={currentUser}
          isMember={currentUser.joinedCircles.includes(selectedCircleForDetail.id)}
          onJoinToggle={handleJoinCircleToggle}
          onClose={() => setSelectedCircleForDetail(null)}
          forumPosts={forumPosts.filter((p) => p.circleId === selectedCircleForDetail.id)}
          onAddForumPost={handleAddForumPost}
          onUpvotePost={handleUpvotePost}
          onAddReply={handleAddReply}
          chatMessages={chatMessages[selectedCircleForDetail.id] || []}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* MODAL: Create Circle */}
      {isCreateCircleOpen && (
        <CreateCircleModal
          onClose={() => setIsCreateCircleOpen(false)}
          onCreateCircle={handleCreateCircle}
          currentUserCampus={currentUser.campusName}
        />
      )}

      {/* MODAL: User Profile & Campus Verification */}
      {isProfileModalOpen && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* MODAL: Architecture Full View */}
      {isArchitectureModalOpen && (
        <ArchitectureModal onClose={() => setIsArchitectureModalOpen(false)} />
      )}
    </div>
  );
}
