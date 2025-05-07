import { v4 as uuidv4 } from 'uuid';
import { ExpertCard, userExpertCards, companyExpertCards } from '../expertCardData';

export interface ExpertQuestion {
  id: string;
  question: string;
  expert_type: string;
  category?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  role: 'user' | 'assistant';
  timestamp: Date;
  cards?: any[];
  actionCards?: ExpertCard[];
  exampleQuestions?: ExpertQuestion[];
}

class ExpertService {
  // 역할별 전문가 카드 목록을 반환
  getExpertCardsByRole(role: string): ExpertCard[] {
    return role === 'company' ? companyExpertCards : userExpertCards;
  }

  // 전문가 타입을 백엔드가 인식하는 형식으로 정규화
  normalizeExpertType(expertType: string): string {
    let normalizedType = expertType;
    
    if (['정책', '정책 전문가'].includes(expertType)) {
      normalizedType = '장애인 정책';
    } else if (expertType === '취업 전문가') {
      normalizedType = '장애인 취업';
    } else if (expertType === '복지 전문가') {
      normalizedType = '장애인 복지';
    } else if (expertType === '창업 전문가') {
      normalizedType = '장애인 창업';
    } else if (expertType === '의료 전문가') {
      normalizedType = '장애인 의료';
    } else if (expertType === '교육 전문가') {
      normalizedType = '장애인 교육';
    } else if (expertType === '상담 전문가') {
      normalizedType = '전문 상담';
    }
    
    return normalizedType;
  }

  // 전문가 인사말 반환
  getExpertGreeting(expertType: string, role: string): string {
    if (role === 'company') {
      const companyIntro: Record<string, string> = {
        '고용 정책': '안녕하세요! 장애인 고용 정책 전문가입니다. 채용 지원금, 고용 의무 등 궁금한 점을 물어보세요.',
        '구직자 현황': '안녕하세요! 장애인 구직자 현황 안내 전문가입니다. 지역별, 업종별 구직자 정보를 안내해드립니다.',
        '고용 컨설팅': '안녕하세요! 고용 컨설팅 전문가입니다. 장애인 고용 환경 개선, 컨설팅 안내를 도와드립니다.',
        '지원의향서': '안녕하세요! 지원의향서 관리 전문가입니다. 내 기업에 지원한 구직자 정보를 확인하세요.'
      };
      return companyIntro[expertType] || '안녕하세요! 어떤 도움이 필요하신가요?';
    }
    
    // 개인회원용 인사말
    const expertIntro: Record<string, string> = {
      '장애인 정책': '안녕하세요! 장애인 정책 전문가입니다. 장애인 관련 법률, 제도, 지원금 등 정책에 대해 안내해드립니다.',
      '장애인 취업': '안녕하세요! 장애인 취업 전문가입니다. 취업 준비부터 일자리 매칭까지, 어떤 도움이 필요하신가요?',
      '장애인 복지': '안녕하세요! 장애인 복지 전문가입니다. 장애인 수당, 지원금, 혜택 등 복지 정책에 대해 상세히 안내해드립니다.',
      '장애인 창업': '안녕하세요! 장애인 창업 지원 전문가입니다. 창업 준비부터 지원금 신청까지, 어떤 도움이 필요하신가요?',
      '장애인 의료': '안녕하세요! 장애인 의료 전문가입니다. 의료비 지원, 재활치료, 보조기기 지원 등 의료 관련 혜택에 대해 안내해드립니다.',
      '장애인 교육': '안녕하세요! 장애인 교육 전문가입니다. 교육 지원금, 특수교육, 평생교육 등 교육 관련 혜택에 대해 안내해드립니다.',
      '전문 상담': '안녕하세요! 장애인 전문 상담사입니다. 심리 상담, 진로 상담, 가족 상담 등 어떤 상담이 필요하신가요?'
    };
    return expertIntro[expertType] || '안녕하세요! 어떤 도움이 필요하신가요?';
  }

  // 예시 질문 목록 반환
  getExampleQuestions(expertType: string, role: string): ExpertQuestion[] {
    if (role === 'company') {
      const companyQuestions: Record<string, string[]> = {
        '고용 정책': [
          '장애인 고용 의무 비율이 어떻게 되나요?',
          '장애인 고용장려금 신청 방법을 알려주세요.',
          '장애인 채용 시 정부 지원은 무엇이 있나요?'
        ],
        '구직자 현황': [
          '우리 지역 장애인 구직자 현황을 알려주세요.',
          '동종 업종 구직자 통계를 보고 싶어요.',
          '최근 지원한 구직자 목록을 보여주세요.'
        ],
        '고용 컨설팅': [
          '장애인 고용 환경 개선 컨설팅을 받고 싶어요.',
          '장애인 채용 시 유의사항이 있나요?',
          '고용 컨설팅 신청 방법을 알려주세요.'
        ],
        '지원의향서': [
          '내 기업에 지원한 구직자 목록을 보여주세요.',
          '지원의향서 관리 방법을 안내해 주세요.',
          '지원자별 이력서 확인이 가능한가요?'
        ]
      };
      return (companyQuestions[expertType] || []).map((question, index) => ({
        id: `question-${index}`,
        question,
        expert_type: expertType
      }));
    }
    
    // 개인회원용 예시 질문
    const questions: Record<string, string[]> = {
      '장애인 정책': [
        '장애인 관련 법률은 어떤 것이 있나요?',
        '장애인 정책 지원 제도는 무엇이 있나요?',
        '장애인 권리 보장에 대해 알려주세요'
      ],
      '장애인 취업': [
        '장애인 취업 지원금은 어떻게 신청하나요?',
        '장애인 취업 상담은 어디서 받을 수 있나요?',
        '장애인 일자리 매칭 서비스는 어떻게 이용하나요?'
      ],
      '장애인 복지': [
        '장애인 수당은 얼마나 받을 수 있나요?',
        '장애인 지원금 신청 방법을 알려주세요',
        '장애인 혜택은 어떤 것들이 있나요?'
      ],
      '장애인 창업': [
        '장애인 창업 지원금 신청 방법을 알려주세요',
        '장애인 창업 교육 프로그램은 어디서 받을 수 있나요?',
        '장애인 창업 컨설팅은 어떻게 받을 수 있나요?'
      ],
      '장애인 의료': [
        '장애인 의료비 지원은 어떻게 받을 수 있나요?',
        '재활치료 지원금은 얼마나 받을 수 있나요?',
        '보조기기 지원은 어떻게 신청하나요?'
      ],
      '장애인 교육': [
        '장애인 교육 지원금은 어떻게 신청하나요?',
        '특수교육 프로그램은 어디서 받을 수 있나요?',
        '장애인 평생교육 프로그램을 추천해주세요'
      ],
      '전문 상담': [
        '심리 상담은 어디서 받을 수 있나요?',
        '진로 상담 프로그램을 추천해주세요',
        '가족 상담은 어떻게 받을 수 있나요?'
      ]
    };
    return (questions[expertType] || []).map((question, index) => ({
      id: `question-${index}`,
      question,
      expert_type: expertType
    }));
  }

  // 전문가 선택 시 생성할 메시지 반환
  getExpertWelcomeMessages(expertType: string, role: string): Message[] {
    const normalizedType = this.normalizeExpertType(expertType);
    const greeting = this.getExpertGreeting(normalizedType, role);
    const exampleQuestions = this.getExampleQuestions(normalizedType, role);
    
    const introMessage: Message = {
      id: uuidv4(),
      content: greeting,
      sender: 'bot',
      role: 'assistant',
      timestamp: new Date()
    };
    
    const followUpMessage: Message = {
      id: uuidv4(),
      content: '어떤 도움이 필요하신가요? 아래 예시 질문을 선택하거나 직접 질문해 주세요.',
      sender: 'bot',
      role: 'assistant',
      timestamp: new Date(),
      exampleQuestions
    };
    
    return [introMessage, followUpMessage];
  }
}

export default new ExpertService(); 