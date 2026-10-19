export type Purpose = 'all' | 'study' | 'hackathon' | 'research' | 'casual';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  campusName: string;
  campusEmail: string;
  major: string;
  batchYear: number;
  avatarUrl: string;
  bio: string;
  interests: string[];
  skills: string[];
  joinedCircles: string[];
  badges: string[];
}

export interface CircleMember {
  userId: string;
  name: string;
  avatarUrl: string;
  campus: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCampus: string;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface ForumPost {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCampus: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean;
  repliesCount: number;
  replies?: ForumReply[];
  createdAt: string;
  isSolved?: boolean;
}

export interface ChatMessage {
  id: string;
  circleId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderCampus: string;
  senderRole?: 'admin' | 'moderator' | 'member';
  text: string;
  timestamp: string;
  replyTo?: string;
  likes?: number;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  campus: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  joinedAt: string;
}

export interface VoiceRoom {
  id: string;
  circleId: string;
  title: string;
  topic: string;
  activeUsersCount: number;
  maxParticipants: number;
  participants: VoiceParticipant[];
  isActive: boolean;
}

export interface Circle {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  campusScope: string;
  targetMajor: string;
  purpose: Purpose;
  isPrivate: boolean;
  memberCount: number;
  avatarUrl: string;
  bannerBg: string;
  createdAt: string;
  activeVoiceRoom?: VoiceRoom;
  recentActivity: string;
  rules: string[];
}

export interface TeammateListing {
  id: string;
  title: string;
  projectName: string;
  competitionOrType: string;
  description: string;
  neededRoles: string[];
  requiredSkills: string[];
  targetCampus?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCampus: string;
  authorMajor: string;
  deadline: string;
  openSpots: number;
  contactMethod: string;
  createdAt: string;
  applicantsCount: number;
}
