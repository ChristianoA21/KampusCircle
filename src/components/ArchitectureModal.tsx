import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  Server,
  FileCode,
  Shield,
  Smartphone,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'api' | 'security' | 'guide'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaJson = `{
  "users": {
    "usr_id": {
      "name": "Christiano Anugerah",
      "email": "christiano@ui.ac.id",
      "isEmailVerified": true,
      "campusName": "Universitas Indonesia",
      "campusDomain": "ui.ac.id",
      "major": "Ilmu Komputer",
      "batchYear": 2023,
      "interests": ["AI/ML", "UI/UX", "Lomba/Hackathon"],
      "skills": ["React", "Python", "PyTorch", "Figma"],
      "joinedCircles": ["circle_101", "circle_102"],
      "createdAt": "2026-01-15T08:00:00Z"
    }
  },
  "circles": {
    "circle_101": {
      "name": "AI & Machine Learning Explorers",
      "slug": "ai-ml-explorers",
      "category": "AI & Data Science",
      "tags": ["AI/ML", "Python", "PyTorch"],
      "campusScope": "Nasional (Semua Kampus)",
      "targetMajor": "Semua Jurusan",
      "purpose": "study",
      "isPrivate": false,
      "memberCount": 342,
      "createdAt": "2026-01-15T08:00:00Z"
    }
  },
  "threads": {
    "thread_201": {
      "circleId": "circle_101",
      "authorId": "usr_id",
      "title": "Optimasi Fine-Tuning LoRA pada GPU VRAM 8GB",
      "content": "Tips meminimalkan VRAM dengan 4-bit quantization (QLoRA)...",
      "tags": ["AI/ML", "LoRA", "PyTorch"],
      "upvotes": 28,
      "repliesCount": 5,
      "isSolved": false,
      "createdAt": "2026-03-01T10:00:00Z"
    }
  },
  "voice_sessions": {
    "session_301": {
      "circleId": "circle_101",
      "title": "Study Lounge: Deep Dive Attention Mechanism",
      "rtcRoomId": "livekit_room_ai_ml_101",
      "activeSpeakersCount": 4,
      "isActive": true,
      "startedAt": "2026-03-01T12:30:00Z"
    }
  },
  "teammate_listings": {
    "listing_401": {
      "title": "Cari UI/UX Designer untuk Gemastik XVI",
      "projectName": "Aplikasi Bantu Komunikasi Tuna Rungu",
      "neededRoles": ["UI/UX Designer", "Frontend Developer"],
      "requiredSkills": ["Figma", "React", "Tailwind CSS"],
      "deadline": "2026-05-01",
      "authorId": "usr_id"
    }
  }
}`;

  const securityRulesSnippet = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fungsi validasi email kampus resmi (.ac.id)
    function isVerifiedCampusStudent() {
      return request.auth != null &&
        request.auth.token.email.matches('.*\\\\.ac\\\\.id$');
    }

    // Koleksi Profil Mahasiswa
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Koleksi Circles
    match /circles/{circleId} {
      allow read: if resource.data.isPrivate == false ||
        (request.auth != null && request.auth.uid in resource.data.memberUids);
      allow create: if isVerifiedCampusStudent();
      allow update: if request.auth != null && 
        (resource.data.creatorId == request.auth.uid || request.auth.uid in resource.data.adminUids);
    }

    // Forum Diskusi & Chat Room
    match /circles/{circleId}/posts/{postId} {
      allow read: if true;
      allow create: if isVerifiedCampusStudent();
      allow update: if request.auth != null && (resource.data.authorId == request.auth.uid || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes']));
    }
  }
}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="architecture-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h2 id="architecture-modal-title" className="text-base font-bold text-slate-900">
                Arsitektur Sistem & Spesifikasi Teknis KampusCircle
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spesifikasi lengkap bagi Software Engineer & Mobile Developer (Full-Stack Blueprint).
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup spesifikasi arsitektur"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" />
            Diagram & UI Flow
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 inline mr-1.5" />
            Database Schema (JSON/ERD)
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5 inline mr-1.5" />
            API & WebSocket Spec
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 inline mr-1.5" />
            Security & Auth (.ac.id)
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 inline mr-1.5" />
            Panduan Mobile (Flutter/RN)
          </button>
        </div>

        {/* Tab Panes */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 text-xs">
          
          {/* TAB 1: DIAGRAM & UI FLOW */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">1. Arsitektur Komponen Sistem</h4>
                <div className="space-y-3 font-mono text-[11px] bg-slate-900 text-slate-100 p-4 rounded-xl leading-relaxed">
                  <div>[Client Tier]: React SPA / Vite + React Native Mobile App (Tailwind / NativeWind)</div>
                  <div className="text-slate-400">       │ HTTP / REST & WebSockets (WSS)</div>
                  <div>[API Gateway]: Express / NestJS Node.js Backend or Firebase Cloud Functions</div>
                  <div className="text-slate-400">       ├── [Auth & Identity]: Kampus Email Verification (.ac.id OTP / SSO)</div>
                  <div className="text-slate-400">       ├── [Persistence]: Cloud Firestore / Supabase PostgreSQL</div>
                  <div className="text-slate-400">       ├── [Realtime Chat]: WebSockets / Supabase Realtime / Firebase RTDB</div>
                  <div className="text-slate-400">       └── [Audio Lounge]: WebRTC SFU Server (LiveKit / Agora Voice Engine)</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">2. User Flow & Journey</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <span className="font-semibold text-slate-900">Onboarding & Verifikasi Kampus:</span>
                      <p className="text-slate-600 mt-0.5">
                        Mahasiswa mendaftar dengan email resmi (.ac.id). Sistem mengirimkan kode OTP untuk memverifikasi keaktifan status mahasiswa dan menambahkan institusi ke profil.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <span className="font-semibold text-slate-900">Pemilihan Topik & Rekomendasi Dynamic:</span>
                      <p className="text-slate-600 mt-0.5">
                        Mahasiswa memilih topik minat (AI/ML, Skripsi, Hackathon). Algoritma menghitung skor afinitas (Tag Overlap × 20 + Campus Affinity + Live Lounge Boost) dan menampilkan Circles paling relevan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <span className="font-semibold text-slate-900">Kolaborasi Multi-Room (Forum, Chat, Audio):</span>
                      <p className="text-slate-600 mt-0.5">
                        Mahasiswa berdiskusi via forum Q&A terstruktur, berinteraksi di chat real-time, atau bergabung ke Audio Study Lounge dengan kontrol mikrofon dan generator fokus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">4</span>
                    <div>
                      <span className="font-semibold text-slate-900">Matchmaking Rekan Tim Lomba:</span>
                      <p className="text-slate-600 mt-0.5">
                        Mahasiswa mencari atau mempublikasikan kebutuhan anggota tim untuk hackathon / PKM / skripsi berdasar kecocokan keahlian komplementer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Firestore NoSQL Schema / Supabase JSON</span>
                <button
                  onClick={() => handleCopy('schema', schemaJson)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'schema' ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-96">
                {schemaJson}
              </pre>
            </div>
          )}

          {/* TAB 3: API & WEBSOCKET SPEC */}
          {activeTab === 'api' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Daftar Endpoint RESTful API</h4>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-600 mr-2">GET</span>
                      <span className="text-slate-800">/api/circles?category=&campus=&purpose=</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">Mendapatkan daftar Circle terfilter</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-600 mr-2">POST</span>
                      <span className="text-slate-800">/api/circles</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">Membuat Circle baru</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-600 mr-2">GET</span>
                      <span className="text-slate-800">/api/circles/:id/forum/threads</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">Mengambil thread diskusi</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-600 mr-2">POST</span>
                      <span className="text-slate-800">/api/auth/verify-campus-email</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">Validasi domain .ac.id & kirim OTP</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-600 mr-2">POST</span>
                      <span className="text-slate-800">/api/voice/token</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">Generate WebRTC token untuk Audio Lounge</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 pt-3 border-t border-slate-100">Protokol Realtime WebSocket (WSS)</h4>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] space-y-1">
                  <div>{'// Join Circle Chat Channel'}</div>
                  <div className="text-indigo-400">{'client.emit("circle:join", { circleId: "c1", userId: "usr_me" })'}</div>
                  <div>{'// Send Chat message'}</div>
                  <div className="text-emerald-400">{'client.emit("chat:send", { circleId: "c1", text: "Halo semuanya!" })'}</div>
                  <div>{'// Voice Lounge signaling'}</div>
                  <div className="text-amber-400">{'client.emit("voice:toggle_mute", { isMuted: false })'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & AUTH */}
          {activeTab === 'security' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Firestore Security Rules (.ac.id RBAC)</span>
                <button
                  onClick={() => handleCopy('security', securityRulesSnippet)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  {copiedKey === 'security' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'security' ? 'Tersalin' : 'Salin Rules'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-sky-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-96">
                {securityRulesSnippet}
              </pre>
            </div>
          )}

          {/* TAB 5: MOBILE PANDUAN */}
          {activeTab === 'guide' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Implementasi Lintas Platform (Mobile App)</h4>
                <p className="text-slate-600 leading-relaxed">
                  Arsitektur KampusCircle dirancang modular sehingga antarmuka dan logic dapat diimplementasikan ke Flutter atau React Native dengan kode backend yang sama:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-indigo-700 block">Pilihan A: React Native + Expo</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>NativeWind v4 untuk Tailwind styling yang konsisten dengan web.</li>
                      <li>LiveKit React Native SDK untuk Audio Lounge WebRTC.</li>
                      <li>Firebase JS SDK v10 atau Supabase client.</li>
                      <li>Zustand / TanStack Query untuk state caching.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-sky-700 block">Pilihan B: Flutter / Dart</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>BLoC / Riverpod untuk arsitektur state management yang rapi.</li>
                      <li>livekit_client untuk room audio multi-user.</li>
                      <li>cloud_firestore & firebase_auth resmi.</li>
                      <li>GoRouter untuk declarative deep linking ke Circle spesifik.</li>
                    </ul>
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
