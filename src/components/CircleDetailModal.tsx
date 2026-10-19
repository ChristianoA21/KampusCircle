import React, { useState, useEffect, useRef } from 'react';
import { Circle, ForumPost, ChatMessage, UserProfile, VoiceParticipant } from '../types/index';
import {
  X,
  MessageSquare,
  Radio,
  Users,
  Send,
  ThumbsUp,
  CheckCircle2,
  Mic,
  MicOff,
  Hand,
  Volume2,
  VolumeX,
  Plus,
  ShieldCheck,
  Lock,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react';

interface CircleDetailModalProps {
  circle: Circle;
  currentUser: UserProfile;
  isMember: boolean;
  onJoinToggle: (circleId: string) => void;
  onClose: () => void;
  forumPosts: ForumPost[];
  onAddForumPost: (circleId: string, title: string, content: string, tags: string[]) => void;
  onUpvotePost: (postId: string) => void;
  onAddReply: (postId: string, content: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (circleId: string, text: string) => void;
}

export const CircleDetailModal: React.FC<CircleDetailModalProps> = ({
  circle,
  currentUser,
  isMember,
  onJoinToggle,
  onClose,
  forumPosts,
  onAddForumPost,
  onUpvotePost,
  onAddReply,
  chatMessages,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'chat' | 'voice' | 'members'>('forum');

  // New Forum Post State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');

  // Replying state
  const [selectedPostIdForReply, setSelectedPostIdForReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice Lounge Local State
  const [inVoiceRoom, setInVoiceRoom] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>(
    circle.activeVoiceRoom?.participants || []
  );

  // Audio Context for subtle ambient focus sound (real Web Audio API synth!)
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      if (ambientNodeRef.current) {
        try {
          ambientNodeRef.current.stop();
          ambientNodeRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, (audioContextRef.current?.currentTime || 0) + 0.5);
      }
      setTimeout(() => {
        try {
          ambientNodeRef.current?.stop();
          ambientNodeRef.current?.disconnect();
        } catch {
          // ignore
        }
        setIsAmbientPlaying(false);
      }, 500);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Create warm binaural/breeze brown drone for focus
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(174, ctx.currentTime); // 174 Hz solfeggio frequency for calm study
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        ambientNodeRef.current = osc;
        gainNodeRef.current = gain;
        setIsAmbientPlaying(true);
      } catch (err) {
        console.warn('Web Audio not allowed without interaction yet', err);
      }
    }
  };

  const handleJoinVoiceRoom = () => {
    if (!inVoiceRoom) {
      const myParticipant: VoiceParticipant = {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        campus: currentUser.campusName.replace('Universitas ', '').replace('Institut Teknologi ', ''),
        isMuted: isMicMuted,
        isSpeaking: false,
        isHandRaised: false,
        joinedAt: 'Baru saja',
      };
      setVoiceParticipants((prev) => [...prev, myParticipant]);
      setInVoiceRoom(true);
    } else {
      setVoiceParticipants((prev) => prev.filter((p) => p.id !== currentUser.id));
      setInVoiceRoom(false);
      setIsHandRaised(false);
      if (isAmbientPlaying) toggleAmbientSound();
    }
  };

  const handleToggleMic = () => {
    const nextState = !isMicMuted;
    setIsMicMuted(nextState);
    setVoiceParticipants((prev) =>
      prev.map((p) => (p.id === currentUser.id ? { ...p, isMuted: nextState } : p))
    );
  };

  const handleToggleHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    setVoiceParticipants((prev) =>
      prev.map((p) => (p.id === currentUser.id ? { ...p, isHandRaised: nextState } : p))
    );
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(circle.id, chatInput.trim());
    setChatInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const tags = newPostTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onAddForumPost(circle.id, newPostTitle.trim(), newPostContent.trim(), tags.length > 0 ? tags : circle.tags);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setIsCreatingPost(false);
  };

  const handleSendReply = (postId: string) => {
    if (!replyText.trim()) return;
    onAddReply(postId, replyText.trim());
    setReplyText('');
    setSelectedPostIdForReply(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="circle-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{circle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                {circle.isPrivate ? <Lock className="w-3 h-3 text-amber-600" /> : <Globe className="w-3 h-3 text-slate-400" />}
                <span>{circle.campusScope}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{circle.memberCount} anggota</span>
            </div>
            <h2 id="circle-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
              {circle.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 max-w-2xl">
              {circle.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onJoinToggle(circle.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isMember
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isMember ? 'Tergabung' : 'Gabung Circle'}
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup detail Circle"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls (Functional Buttons) */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('forum')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'forum'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Forum Diskusi ({forumPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Chat Room ({chatMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Audio Lounge {circle.activeVoiceRoom?.isActive ? `(${voiceParticipants.length})` : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aturan & Info</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/40">
          
          {/* TAB 1: FORUM DISKUSI */}
          {activeTab === 'forum' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-600">
                  Tanya jawab terstruktur, diskusi paper, dan repositori solusi mahasiswa.
                </p>
                <button
                  onClick={() => setIsCreatingPost(!isCreatingPost)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingPost ? 'Batal' : 'Buat Topik Baru'}</span>
                </button>
              </div>

              {/* Create Post Form */}
              {isCreatingPost && (
                <form onSubmit={handleCreatePost} className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Mulai Diskusi Baru</h4>
                  <input
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Judul pertanyaan atau topik diskusi yang jelas..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <textarea
                    rows={4}
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Jelaskan konteks, kendala yang dialami, atau materi riset yang ingin didiskusikan..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="Tag topik (pisahkan koma, contoh: AI/ML, Python, LoRA)"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPost(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Kirim Topik
                    </button>
                  </div>
                </form>
              )}

              {/* Posts List */}
              {forumPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500">Belum ada thread diskusi di Circle ini.</p>
                  <button
                    onClick={() => setIsCreatingPost(true)}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Mulai thread pertama
                  </button>
                </div>
              ) : (
                forumPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{post.authorName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">{post.authorCampus}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.createdAt}</span>
                      </div>
                      {post.isSolved && (
                        <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terjawab</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-indigo-600 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Upvote & Reply toggles */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpvotePost(post.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                            post.hasUpvoted
                              ? 'bg-indigo-50 text-indigo-600 font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{post.upvotes}</span>
                        </button>

                        <button
                          onClick={() =>
                            setSelectedPostIdForReply(
                              selectedPostIdForReply === post.id ? null : post.id
                            )
                          }
                          className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {post.replies?.length || 0} Tanggapan
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedPostIdForReply(
                            selectedPostIdForReply === post.id ? null : post.id
                          )
                        }
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        {selectedPostIdForReply === post.id ? 'Tutup Balasan' : 'Balas'}
                      </button>
                    </div>

                    {/* Replies Container */}
                    {selectedPostIdForReply === post.id && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        {post.replies && post.replies.length > 0 && (
                          <div className="space-y-2">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="p-3 bg-slate-50 rounded-lg text-xs">
                                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                  <span className="font-semibold text-slate-800">
                                    {reply.authorName} ({reply.authorCampus})
                                  </span>
                                  <span>{reply.createdAt}</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendReply(post.id);
                            }}
                            placeholder="Tulis jawaban atau saran solusimu..."
                            className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleSendReply(post.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                          >
                            Kirim
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: LIVE CHAT ROOM */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[500px] max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Ruang obrolan langsung anggota {circle.name}</span>
                <span className="font-mono text-slate-400">Pesan tersinkronisasi</span>
              </div>

              {/* Chat Messages stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center my-auto">
                    Belum ada obrolan. Sapa teman-teman Circle pertamamu!
                  </p>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                          <span className="font-medium text-slate-700">{msg.senderName}</span>
                          <span>({msg.senderCampus})</span>
                          <span>· {msg.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-md px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-xs'
                              : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pesan untuk seluruh anggota Circle..."
                  className="flex-1 text-xs px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: AUDIO LOUNGE */}
          {activeTab === 'voice' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Lounge Status Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-base font-bold text-slate-900">
                        {circle.activeVoiceRoom?.title || 'Study & Discussion Voice Lounge'}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      {circle.activeVoiceRoom?.topic || 'Ruang audio santai untuk belajar bareng, berdiskusi, dan tanya jawab langsung.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleJoinVoiceRoom}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                        inVoiceRoom
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <Radio className="w-4 h-4" />
                      <span>{inVoiceRoom ? 'Tinggalkan Audio Room' : 'Gabung ke Audio Room'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Participants Grid */}
                <div className="py-6">
                  <h4 className="text-xs font-semibold text-slate-500 mb-4">
                    Peserta Aktif ({voiceParticipants.length} orang)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {voiceParticipants.map((p) => {
                      const isMe = p.id === currentUser.id;
                      return (
                        <div
                          key={p.id}
                          className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${
                            p.isSpeaking
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-400/30'
                              : 'border-slate-200 bg-slate-50/60'
                          }`}
                        >
                          <div className="relative mb-2">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm">
                              {p.name.charAt(0)}
                            </div>
                            {p.isMuted ? (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center">
                                <MicOff className="w-2.5 h-2.5" />
                              </div>
                            ) : p.isSpeaking ? (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Mic className="w-2.5 h-2.5" />
                              </div>
                            ) : null}
                            {p.isHandRaised && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Hand className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-900 truncate w-full">
                            {p.name} {isMe ? '(Kamu)' : ''}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate w-full">
                            {p.campus}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Control Bar (Active when user joins) */}
                {inVoiceRoom && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleMic}
                        className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                          isMicMuted
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isMicMuted ? 'Mikrofon Bisu' : 'Mikrofon Nyala'}</span>
                      </button>

                      <button
                        onClick={handleToggleHand}
                        className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                          isHandRaised
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Hand className="w-3.5 h-3.5" />
                        <span>{isHandRaised ? 'Tangan Diangkat' : 'Angkat Tangan'}</span>
                      </button>
                    </div>

                    {/* Ambient Focus Audio Generator (Web Audio API) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleAmbientSound}
                        className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                          isAmbientPlaying
                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Generator nada fokus santai (174Hz sine study wave)"
                      >
                        {isAmbientPlaying ? (
                          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <VolumeX className="w-3.5 h-3.5" />
                        )}
                        <span>{isAmbientPlaying ? 'Focus Wave: Aktif' : 'Nyalakan Focus Sound'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ATURAN & INFO */}
          {activeTab === 'members' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Tentang Circle</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  {circle.description}
                </p>

                <h4 className="text-sm font-bold text-slate-900 mb-2">Tata Tertib Diskusi</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {circle.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-indigo-600 font-semibold">{idx + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Keanggotaan Terverifikasi</h4>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold">Keamanan Komunitas Mahasiswa</span>
                    <p className="text-blue-700 text-[11px] mt-0.5">
                      Seluruh anggota berinteraksi menggunakan email institusi kampus terverifikasi untuk mencegah spam dan penipuan akademik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
