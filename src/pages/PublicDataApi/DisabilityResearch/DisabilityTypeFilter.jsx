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
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; //뇌전증장애
import PsychologyIcon from '@mui/icons-material/Psychology'; // 지적장애
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; //자폐성장애애
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // 정신장애
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'; // 국가유공
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'; // 모든 장애유형

// 장애유형별 아이콘 및 설명 매핑
const disabilityIcons = {
  '지체장애': {icon: AccessibleIcon, color: '#E74C3C', description: '팔, 다리, 척추 등 신체의 일부가 절단, 마비, 변형 등으로 인해 운동기능에 장애가 있는 장애.'},
  '뇌병변장애': {icon: MedicalInformationIcon, color: '#C0392B', description: '뇌의 손상(예: 뇌졸중, 뇌성마비 등)으로 인해 복합적인 신체기능 장애가 발생한 장애.'},
  '시각장애': {icon: VisibilityOffIcon, color: '#3498DB', description: '시력 저하 또는 시야 결손 등으로 시각적 정보 획득에 어려움이 있는 장애.'},
  '청각장애': {icon: HearingDisabledIcon, color: '#F39C12', description: '청력 손실 또는 평형감각 이상으로 소리 인지 및 의사소통에 어려움이 있는 장애.'},
  '언어장애': {icon: RecordVoiceOverIcon, color: '#9B59B6', description: '언어, 음성, 구어 기능의 장애로 의사소통에 제한이 있는 장애.'},
  '안면장애': {icon: SentimentDissatisfiedIcon, color: '#2ECC71', description: '안면부의 결손, 함몰, 비후 등 변형으로 인해 사회적·심리적 어려움이 동반된 장애.'},
  '신장장애': {icon: LocalHospitalIcon, color: '#F39C12', description: '만성 신장질환으로 투석치료를 받거나 신장이식 후 일상생활에 제한이 있는 장애.'},
  '심장장애': {icon: FavoriteBorderIcon, color: '#E67E22', description: '심장기능 이상으로 일상생활이 현저히 제한되는 장애.'},
  '간장애': {icon: BiotechIcon, color: '#1ABC9C', description: '만성·중증의 간기능 이상으로 일상생활이 제한되는 장애.'},
  '호흡기장애': {icon: MasksIcon, color: '#16A085', description: '만성·중증의 호흡기 기능 이상으로 일상생활이 제한되는 장애.'},
  '장루요루장애': {icon: AccessibleForwardIcon, color: '#3498DB', description: '인공적으로 만든 장루(항문)나 요루(요도)로 인해 일상생활에 제한이 있는 장애.'},
  '뇌전증장애': {icon: WarningAmberIcon, color: '#E74C3C', description: '만성·중증의 뇌전증(간질)으로 일상생활이 제한되는 장애.'},
  '지적장애': {icon: PsychologyIcon, color: '#2ECC71', description: '지능지수와 사회성지수가 70 이하로, 일상생활과 사회적응에 어려움이 있는 장애.'},
  '자폐성장애': {icon: EmojiEmotionsIcon, color: '#1ABC9C', description: '사회적 상호작용 및 의사소통에 제한이 있고, 반복적 행동 특성을 보이는 자폐 스펙트럼 장애.'},
  '정신장애': {icon: SupportAgentIcon, color: '#E67E22', description: '조현병, 양극성 장애, 반복성 우울장애 등 정신질환으로 일상생활 및 사회활동에 제한이 있는 장애.'},
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