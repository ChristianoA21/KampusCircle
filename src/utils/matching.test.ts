import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCampusEmail,
  calculateCircleAffinityScore,
  filterAndRankCircles,
  calculateTeammateMatchScore,
} from './matching.ts';
import type { Circle, TeammateListing } from './matching.ts';

test('validateCampusEmail identifies valid Indonesian campus domains', () => {
  const resultUI = validateCampusEmail('budi.santoso@ui.ac.id');
  assert.equal(resultUI.isValid, true);
  assert.equal(resultUI.institution, 'Universitas Indonesia');

  const resultITB = validateCampusEmail('siti.nur@itb.ac.id');
  assert.equal(resultITB.isValid, true);
  assert.equal(resultITB.institution, 'Institut Teknologi Bandung');

  const resultEdu = validateCampusEmail('alex@harvard.edu');
  assert.equal(resultEdu.isValid, true);

  const resultGmail = validateCampusEmail('random.user@gmail.com');
  assert.equal(resultGmail.isValid, false);
  assert.match(resultGmail.error || '', /ac\.id/);
});

test('calculateCircleAffinityScore prioritizes matching interests and home campus', () => {
  const mockCircle1: Circle = {
    id: 'c1',
    name: 'AI Researchers Club',
    slug: 'ai-researchers',
    tagline: 'Deep Learning & LLM research',
    description: 'Diskusi paper terbaru seputar AI/ML',
    category: 'AI & Data Science',
    tags: ['AI/ML', 'Python', 'PyTorch'],
    campusScope: 'Universitas Indonesia',
    targetMajor: 'Semua Jurusan',
    purpose: 'research',
    isPrivate: false,
    memberCount: 84,
    avatarUrl: '',
    bannerBg: '',
    createdAt: '2026-01-10',
    recentActivity: '5 menit lalu',
    rules: [],
  };

  const mockCircle2: Circle = {
    id: 'c2',
    name: 'Music & Jamming',
    slug: 'music-jamming',
    tagline: 'Jamming bareng',
    description: 'Komunitas musik',
    category: 'Hobi & Seni',
    tags: ['Music', 'Gitar'],
    campusScope: 'Institut Teknologi Bandung',
    targetMajor: 'Semua Jurusan',
    purpose: 'casual',
    isPrivate: false,
    memberCount: 20,
    avatarUrl: '',
    bannerBg: '',
    createdAt: '2026-02-01',
    recentActivity: '2 jam lalu',
    rules: [],
  };

  const scoreUserAI = calculateCircleAffinityScore(mockCircle1, ['AI/ML', 'Python'], 'Universitas Indonesia', 'research');
  const scoreUserMusic = calculateCircleAffinityScore(mockCircle2, ['AI/ML', 'Python'], 'Universitas Indonesia', 'research');

  assert.ok(scoreUserAI > scoreUserMusic, 'AI Circle should score substantially higher for an AI researcher');
});

test('filterAndRankCircles filters by search query and category correctly', () => {
  const circles: Circle[] = [
    {
      id: 'c1',
      name: 'UI/UX Design Guild',
      slug: 'uiux-guild',
      tagline: 'Figma and Design Systems',
      description: 'Belajar prototyping',
      category: 'Design & Creative',
      tags: ['UI/UX', 'Figma'],
      campusScope: 'Nasional (Semua Kampus)',
      targetMajor: 'Semua Jurusan',
      purpose: 'study',
      isPrivate: false,
      memberCount: 120,
      avatarUrl: '',
      bannerBg: '',
      createdAt: '2026-01-01',
      recentActivity: '1 jam lalu',
      rules: [],
    },
    {
      id: 'c2',
      name: 'Hackathon Hunters',
      slug: 'hackathon-hunters',
      tagline: 'Win national hackathons',
      description: 'Mencari rekan lomba',
      category: 'Lomba & Kompetisi',
      tags: ['Hackathon', 'Web Dev'],
      campusScope: 'Nasional (Semua Kampus)',
      targetMajor: 'Semua Jurusan',
      purpose: 'hackathon',
      isPrivate: false,
      memberCount: 65,
      avatarUrl: '',
      bannerBg: '',
      createdAt: '2026-01-05',
      recentActivity: 'Baru saja',
      rules: [],
    },
  ];

  const searchFigma = filterAndRankCircles(circles, { searchQuery: 'Figma' });
  assert.equal(searchFigma.length, 1);
  assert.equal(searchFigma[0].id, 'c1');

  const filterHackathon = filterAndRankCircles(circles, { selectedPurpose: 'hackathon' });
  assert.equal(filterHackathon.length, 1);
  assert.equal(filterHackathon[0].id, 'c2');
});

test('calculateTeammateMatchScore calculates skill and role overlap accurately', () => {
  const listing: TeammateListing = {
    id: 't1',
    title: 'Cari Frontend Dev & UI/UX untuk Gemastik 2026',
    projectName: 'Aplikasi Bantu Tuna Rungu',
    competitionOrType: 'Gemastik UX Design & Software Development',
    description: 'Kami butuh designer yang paham Tailwind & Figma',
    neededRoles: ['UI/UX Designer', 'Frontend Developer'],
    requiredSkills: ['Figma', 'React', 'Tailwind CSS'],
    targetCampus: 'Nasional',
    authorId: 'u1',
    authorName: 'Dimas',
    authorAvatar: '',
    authorCampus: 'ITB',
    authorMajor: 'Teknik Informatika',
    deadline: '2026-05-01',
    openSpots: 2,
    contactMethod: 'Telegram @dimas_itb',
    createdAt: '2026-03-01',
    applicantsCount: 3,
  };

  const userSkills = ['React', 'Tailwind CSS', 'Figma'];
  const userInterests = ['UI/UX', 'Hackathon'];

  const match = calculateTeammateMatchScore(listing, userSkills, userInterests);
  assert.equal(match.isHighMatch, true);
  assert.equal(match.matchedSkills.length, 3);
});
