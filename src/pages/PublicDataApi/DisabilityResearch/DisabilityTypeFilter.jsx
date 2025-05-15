import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Skeleton, 
  Tooltip, 
  Zoom,
  Chip,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccessibleIcon from '@mui/icons-material/Accessible'; // 지체장애 - 휠체어
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // 뇌병변장애
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // 시각장애 - 전맹
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled'; // 청각장애 - 청각기관
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'; // 언어장애
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'; // 안면장애
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; //신장장애
import FavoriteBorderIcon from '@mui/icons-material/Favorite'; // 심장장애
import BiotechIcon from '@mui/icons-material/Biotech'; // 간장애
import MasksIcon from '@mui/icons-material/Masks'; // 호흡기장애
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'; //장루/요루장애
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; //간질장애
import PsychologyIcon from '@mui/icons-material/Psychology'; // 지적장애
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; //자폐성장애애
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // 정신장애
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'; // 국가유공
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'; // 모든 장애유형

// 장애유형별 아이콘 및 설명 매핑
const disabilityIcons = {
  '지체장애': {icon: AccessibleIcon, color: '#E74C3C', description: '사지나 척추 등의 신체 일부에 구조적·기능적 손상이 있어 이동이나 일상생활에 제한이 있는 장애입니다.'},
  '뇌병변장애': {icon: MedicalInformationIcon, color: '#C0392B', description: '뇌 손상(예: 뇌성마비 등)으로 인한 운동기능 및 신체 조절 기능에 장애가 있는 상태입니다.'},
  '시각장애': {icon: VisibilityOffIcon, color: '#3498DB', description: '시각의 손상이나 기능 저하로 인해 물체 인식, 이동, 의사소통 등에 제약이 있는 장애입니다.'},
  '청각장애': {icon: HearingDisabledIcon, color: '#F39C12', description: '청력의 손실 또는 저하로 인해 음성 정보 수신 및 의사소통에 어려움이 있는 상태입니다.'},
  '언어장애': {icon: RecordVoiceOverIcon, color: '#9B59B6', description: '말소리 생성 또는 언어 표현 능력에 이상이 있어 의사소통에 제한이 있는 장애입니다.'},
  '안면장애': {icon: SentimentDissatisfiedIcon, color: '#2ECC71', description: '안면 부위의 변형이나 기능 이상으로 인해 심리적·사회적 어려움이 수반되는 장애입니다.'},
  '신장장애': {icon: LocalHospitalIcon, color: '#F39C12', description: '만성적인 신장 기능의 손상으로 투석 등 지속적인 치료가 필요한 상태입니다.'},
  '심장장애': {icon: FavoriteBorderIcon, color: '#E67E22', description: '선천적 또는 후천적 심장 질환으로 심장 기능이 저하되어 신체활동에 제약이 있는 장애입니다.'},
  '간장애': {icon: BiotechIcon, color: '#1ABC9C', description: '만성 간질환 또는 간 기능 저하로 인해 일상생활과 건강 유지에 어려움이 있는 상태입니다.'},
  '호흡기장애': {icon: MasksIcon, color: '#16A085', description: '폐나 기도의 만성적 질환으로 인해 호흡에 제한이 있는 상태입니다.'},
  '장루/요루장애': {icon: AccessibleForwardIcon, color: '#3498DB', description: '배변 또는 배뇨를 위해 인공적인 개구부(장루, 요루)를 지닌 상태로 위생관리와 일상에 제약이 따릅니다.'},
  '간질장애': {icon: WarningAmberIcon, color: '#E74C3C', description: '만성적인 신경계 질환으로, 반복적인 발작(경련)을 특징으로 하는 장애입니다.'},
  '지적장애': {icon: PsychologyIcon, color: '#2ECC71', description: '인지능력과 적응행동 발달이 현저히 낮아 교육 및 일상생활에 지속적인 지원이 필요한 상태입니다.'},
  '자폐성장애': {icon: EmojiEmotionsIcon, color: '#1ABC9C', description: '사회적 상호작용, 의사소통, 행동 양상에서 발달적 차이를 보이는 신경발달장애입니다.'},
  '정신장애': {icon: SupportAgentIcon, color: '#E67E22', description: '조현병, 우울증 등 정신질환으로 인해 일상생활이나 사회적 기능에 제한이 있는 상태입니다.'},
  '국가유공': {icon: MilitaryTechIcon, color: '#9B59B6', description: '전상(戰傷) 등으로 장애를 입고 국가유공자로 등록된 분들로, 장애유형 분류와는 별개의 보훈대상입니다.'},
};

const DisabilityTypeFilter = ({ disabilityTypes, loading, onSelect, selectedType }) => {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // 아이콘 클릭 핸들러
  const handleIconClick = (type) => {
    if (onSelect) {
      onSelect(type);
    }
  };
  
  // 로깅 추가: props로 전달된 disabilityTypes와 selectedType 확인
  console.log('[DisabilityTypeFilter] Received props - disabilityTypes:', disabilityTypes, 'selectedType:', selectedType, 'loading:', loading);
  
  // 마우스 호버 핸들러
  const handleCardMouseEnter = (type) => {
    setHoveredCard(type);
  };
  
  const handleCardMouseLeave = () => {
    setHoveredCard(null);
  };
  
  // 로딩 중일 때 스켈레톤 UI 표시
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">장애유형별 통계 분석</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          데이터를 불러오는 중입니다...
        </Typography>
        <Grid container spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 6,
                sm: 4,
                md: 3,
                lg: 2
              }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          장애유형별 통계 분석
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          아래 장애유형 아이콘을 클릭하면 해당 유형의 상세 통계 정보를 확인할 수 있습니다.
          {selectedType ? (
            <strong> 현재 선택: {selectedType}</strong>
          ) : (
            " 마우스를 올려 각 장애유형에 대한 간략한 설명을 볼 수 있습니다."
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={`등록된 장애유형: ${disabilityTypes.length}개`} 
            color="primary" 
            variant="outlined" 
          />
          {selectedType && (
            <Chip 
              label={`선택된 장애유형: ${selectedType}`} 
              color="primary" 
              onDelete={() => onSelect(null)}
            />
          )}
        </Box>
      </Box>
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 8, lg: 8 }} justifyContent="center">
        {disabilityTypes.map((type) => {
          // 장애유형에 맞는 정보 가져오기
          const disabilityInfo = disabilityIcons[type] || {
            icon: AllInclusiveIcon,
            color: theme.palette.primary.main,
            description: '장애유형에 관한 정보입니다.'
          };
          
          const IconComponent = disabilityInfo.icon;
          const isHovered = hoveredCard === type;
          const isSelected = selectedType === type;
          
          return (
            <Grid
              key={type}
              sx={{ position: 'relative' }}
              size={{
                xs: 2,
                sm: 2,
                md: 1,
                lg: 1
              }}>
              <Tooltip 
                title={disabilityInfo.description} 
                arrow 
                slots={{ transition: Zoom }}
                enterDelay={500}
              >
                <Card 
                  elevation={isSelected ? 12 : isHovered ? 10 : 3}
                  onClick={() => handleIconClick(type)}
                  onMouseEnter={() => handleCardMouseEnter(type)}
                  onMouseLeave={handleCardMouseLeave}
                  sx={{ 
                    position: 'relative',
                    zIndex: isHovered || isSelected ? 10 : 1,
                    cursor: 'pointer',
                    transition: 'all 1.3s ease',
                    transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: isSelected ? `${disabilityInfo.color}25` : 
                                   isHovered ? `${disabilityInfo.color}15` : 'background.paper',
                    borderTop: `3px solid ${isSelected ? disabilityInfo.color : 
                                            isHovered ? disabilityInfo.color : 'transparent'}`,
                    borderLeft: isSelected ? `4px solid ${disabilityInfo.color}` : 'none',
                    boxSizing: 'border-box',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        mb: 2,
                        bgcolor: isSelected ? disabilityInfo.color : 
                                 isHovered ? disabilityInfo.color : `${disabilityInfo.color}80`,
                        color: 'white'
                      }}
                    >
                      <IconComponent fontSize="large" />
                    </Avatar>
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{
                        fontWeight: isSelected ? 'bold' : isHovered ? 'bold' : 'medium',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        color: isSelected ? disabilityInfo.color : 
                               isHovered ? disabilityInfo.color : 'text.primary'
                      }}
                    >
                      {type}
                    </Typography>
                    {(isHovered || isSelected) && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          mt: 1, 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}  
                      >
                        {isSelected ? '선택됨' : '클릭하여 통계 보기'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DisabilityTypeFilter; 