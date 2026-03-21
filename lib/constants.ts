import { TermCategory } from './types';

export const ALL_CATEGORIES: { value: TermCategory; label: string; emoji: string }[] = [
  { value: '면적', label: '면적', emoji: '📐' },
  { value: '가격', label: '가격', emoji: '💰' },
  { value: '거래', label: '거래', emoji: '🤝' },
  { value: '임대', label: '임대', emoji: '🏠' },
  { value: '금융', label: '금융', emoji: '🏦' },
  { value: '청약', label: '청약', emoji: '📋' },
  { value: '법', label: '법/권리', emoji: '⚖️' },
  { value: '경매', label: '경매', emoji: '🔨' },
  { value: '정비사업', label: '정비사업', emoji: '🏗️' },
  { value: '세금', label: '세금', emoji: '📊' },
  { value: '플랫폼', label: '플랫폼/슬랭', emoji: '💬' },
  { value: '규제', label: '규제', emoji: '🚫' },
];

export const INITIAL_KEYWORDS = [
  '전세',
  'LTV',
  '재개발',
  '전용면적',
  '등기부등본',
  '청약',
  '깡통전세',
];

export const BEGINNER_FLOWS: { title: string; ids: string[] }[] = [
  {
    title: '전세 기초',
    ids: ['jeonse', 'deposit', 'jeonse-insurance', 'can-jeonse'],
  },
  {
    title: '대출 기초',
    ids: ['mortgage-loan', 'ltv', 'dti', 'dsr'],
  },
  {
    title: '면적 이해',
    ids: ['exclusive-area', 'supply-area', 'exclusive-rate', 'pyeong'],
  },
  {
    title: '등기/권리 기초',
    ids: ['registry-document', 'opposing-power', 'fixed-date', 'jeonse-insurance'],
  },
];
