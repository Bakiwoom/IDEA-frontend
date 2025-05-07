export interface ExpertCard {
  id: string;
  title: string;
  expert_type: string;
  description: string;
  icon: string;
}

export const userExpertCards: ExpertCard[] = [
  {
    id: 'policy',
    title: '정책 전문가',
    expert_type: '장애인 정책',
    description: '정부, 지자체의 장애인 관련 법률 및 제도 안내',
    icon: '📜'
  },
  {
    id: 'employment',
    title: '취업 전문가',
    expert_type: '장애인 취업',
    description: '공공기관 및 민간기업 취업 정보 제공',
    icon: '💼'
  },
  {
    id: 'welfare',
    title: '복지 전문가',
    expert_type: '장애인 복지',
    description: '장애인 복지 서비스 및 혜택 안내',
    icon: '🏥'
  },
  {
    id: 'startup',
    title: '창업 전문가',
    expert_type: '장애인 창업',
    description: '장애인 창업 지원 제도 및 프로그램 안내',
    icon: '🚀'
  },
  {
    id: 'medical',
    title: '의료 전문가',
    expert_type: '장애인 의료',
    description: '장애 유형별 진료 및 의료 지원 정보',
    icon: '⚕️'
  },
  {
    id: 'education',
    title: '교육 전문가',
    expert_type: '장애인 교육',
    description: '장애인 교육 프로그램 및 지원 제도 안내',
    icon: '📚'
  },
  {
    id: 'counseling',
    title: '상담 전문가',
    expert_type: '전문 상담',
    description: '장애인 심리 상담 및 가족 상담 프로그램',
    icon: '💬'
  }
];

export const companyExpertCards: ExpertCard[] = [
  { id: 'employment_policy', title: '장애인 채용 정책 전문가', expert_type: '고용 정책', description: '장애인 고용 관련 법률, 제도, 지원금 안내', icon: '📑' },
  { id: 'job_seekers', title: '장애인 구직자 현황', expert_type: '구직자 현황', description: '장애인 구직자 통계 및 현황 정보', icon: '📊' },
  { id: 'consulting', title: '고용 컨설팅', expert_type: '고용 컨설팅', description: '장애인 고용 환경 개선, 컨설팅 안내', icon: '💼' },
  { id: 'application_manage', title: '지원의향서 관리', expert_type: '지원의향서', description: '내 기업에 지원한 구직자 관리', icon: '📂' },
];

export function getExpertCardsByRole(role: string): ExpertCard[] {
  return role === 'company' ? companyExpertCards : userExpertCards;
} 