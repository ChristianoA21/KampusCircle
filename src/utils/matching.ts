export type Purpose = 'all' | 'study' | 'hackathon' | 'research' | 'casual';

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

export interface FilterParams {
  searchQuery?: string;
  selectedCategory?: string;
  selectedCampus?: string;
  selectedPurpose?: Purpose;
  userInterests?: string[];
  userCampus?: string;
}

/**
 * Validates Indonesian academic email addresses or standard education institutions.
 * Typically ends with .ac.id or .edu
 */
export function validateCampusEmail(email: string): { isValid: boolean; institution?: string; error?: string } {
  if (!email || !email.includes('@')) {
    return { isValid: false, error: 'Format email tidak valid.' };
  }

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Format email tidak valid.' };
  }

  const domain = parts[1];
  const isAcId = domain.endsWith('.ac.id');
  const isEdu = domain.endsWith('.edu');

  if (!isAcId && !isEdu) {
    return { 
      isValid: false, 
      error: 'Harus menggunakan email institusi berakhiran .ac.id atau .edu (contoh: nama@ui.ac.id)' 
    };
  }

  // Common Indonesian campus mapping
  const knownCampuses: Record<string, string> = {
    'ui.ac.id': 'Universitas Indonesia',
    'itb.ac.id': 'Institut Teknologi Bandung',
    'ugm.ac.id': 'Universitas Gadjah Mada',
    'its.ac.id': 'Institut Teknologi Sepuluh Nopember',
    'telkomuniversity.ac.id': 'Telkom University',
    'binus.ac.id': 'Universitas Bina Nusantara',
    'unair.ac.id': 'Universitas Airlangga',
    'undip.ac.id': 'Universitas Diponegoro',
    'ub.ac.id': 'Universitas Brawijaya',
    'unpad.ac.id': 'Universitas Padjadjaran',
    'uns.ac.id': 'Universitas Sebelas Maret',
    'ipb.ac.id': 'IPB University',
  };

  const detected = knownCampuses[domain] || `Institusi Kampus (${domain})`;
  return {
    isValid: true,
    institution: detected,
  };
}

/**
 * Calculates circle recommendation affinity score based on user interest overlap,
 * campus affinity, and activity level.
 */
export function calculateCircleAffinityScore(
  circle: Circle,
  userInterests: string[] = [],
  userCampus: string = '',
  selectedPurpose?: Purpose
): number {
  let score = 0;

  // 1. Tag overlap (50 points maximum)
  if (userInterests.length > 0 && circle.tags.length > 0) {
    const normalizedInterests = userInterests.map((t) => t.toLowerCase());
    const matchedCount = circle.tags.filter((tag) =>
      normalizedInterests.includes(tag.toLowerCase())
    ).length;
    score += matchedCount * 20;

    // Bonus if category also directly matches
    if (normalizedInterests.includes(circle.category.toLowerCase())) {
      score += 15;
    }
  }

  // 2. Campus relevance (25 points)
  if (circle.campusScope === 'Nasional (Semua Kampus)') {
    score += 15; // Universal openness
  } else if (userCampus && circle.campusScope.toLowerCase() === userCampus.toLowerCase()) {
    score += 30; // Home campus boost
  }

  // 3. Purpose match (20 points)
  if (selectedPurpose && selectedPurpose !== 'all') {
    if (circle.purpose === selectedPurpose) {
      score += 25;
    }
  }

  // 4. Live voice room presence boost (10 points)
  if (circle.activeVoiceRoom && circle.activeVoiceRoom.isActive) {
    score += 10;
  }

  // 5. Member engagement weight (logarithmic scaling)
  score += Math.min(15, Math.floor(circle.memberCount / 10));

  return score;
}

/**
 * Filter and sort circles based on multi-facet criteria
 */
export function filterAndRankCircles(circles: Circle[], params: FilterParams): Circle[] {
  const {
    searchQuery = '',
    selectedCategory = 'Semua',
    selectedCampus = 'Semua',
    selectedPurpose = 'all',
    userInterests = [],
    userCampus = '',
  } = params;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return circles
    .filter((circle) => {
      // Search query
      if (normalizedQuery) {
        const titleMatch = circle.name.toLowerCase().includes(normalizedQuery);
        const descMatch = circle.description.toLowerCase().includes(normalizedQuery);
        const tagMatch = circle.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
        const campusMatch = circle.campusScope.toLowerCase().includes(normalizedQuery);
        if (!titleMatch && !descMatch && !tagMatch && !campusMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'Semua' && circle.category !== selectedCategory) {
        return false;
      }

      // Campus scope filter
      if (selectedCampus !== 'Semua') {
        if (selectedCampus === 'Nasional') {
          if (circle.campusScope !== 'Nasional (Semua Kampus)') return false;
        } else if (circle.campusScope !== selectedCampus && circle.campusScope !== 'Nasional (Semua Kampus)') {
          return false;
        }
      }

      // Purpose filter
      if (selectedPurpose !== 'all' && circle.purpose !== selectedPurpose) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const scoreB = calculateCircleAffinityScore(b, userInterests, userCampus, selectedPurpose);
      const scoreA = calculateCircleAffinityScore(a, userInterests, userCampus, selectedPurpose);
      return scoreB - scoreA;
    });
}

/**
 * Matchmaking scoring for teammate search listings
 */
export function calculateTeammateMatchScore(
  listing: TeammateListing,
  userSkills: string[] = [],
  userInterests: string[] = []
): { score: number; matchedSkills: string[]; isHighMatch: boolean } {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());
  const normalizedInterests = userInterests.map((i) => i.toLowerCase());

  const matchedSkills = listing.requiredSkills.filter((skill) =>
    normalizedUserSkills.includes(skill.toLowerCase())
  );

  let score = matchedSkills.length * 30;

  // Check if needed roles match interests (e.g. "UI/UX Designer" matches "UI/UX")
  const roleOverlap = listing.neededRoles.filter((role) =>
    normalizedInterests.some((interest) => role.toLowerCase().includes(interest) || interest.includes(role.toLowerCase()))
  );
  score += roleOverlap.length * 20;

  const maxPossible = Math.max(listing.requiredSkills.length * 30 + listing.neededRoles.length * 20, 100);
  const percentage = Math.min(100, Math.round((score / maxPossible) * 100));

  return {
    score: percentage,
    matchedSkills,
    isHighMatch: percentage >= 50,
  };
}

/**
 * Parse Indonesian labels for purpose
 */
export function getPurposeLabel(purpose: Purpose): string {
  switch (purpose) {
    case 'study':
      return 'Belajar & Riset';
    case 'hackathon':
      return 'Lomba & Hackathon';
    case 'research':
      return 'Skripsi & Publikasi';
    case 'casual':
      return 'Diskusi Santai';
    case 'all':
    default:
      return 'Semua Tujuan';
  }
}
