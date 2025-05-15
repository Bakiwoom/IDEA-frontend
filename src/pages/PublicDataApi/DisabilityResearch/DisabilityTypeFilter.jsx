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
import AccessibleIcon from '@mui/icons-material/Accessible';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoodIcon from '@mui/icons-material/Mood';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

// 장애유형별 아이콘 및 설명 매핑
const disabilityIcons = {
  '지체장애': { 
    icon: AccessibleIcon, 
    color: '#E74C3C',
    description: '신체의 일부나 기능에 장애가 있는 경우로, 이동이나 일상 활동에 제약이 있습니다.'
  },
  '시각장애': { 
    icon: VisibilityOffIcon, 
    color: '#3498DB',
    description: '시각 기능의 손상이나 저하로 일상생활에 어려움이 있는 상태입니다.'
  },
  '청각장애': { 
    icon: HearingDisabledIcon, 
    color: '#F39C12',
    description: '청력의 손실이나 저하로 의사소통에 어려움이 있는 상태입니다.'
  },
  '언어장애': { 
    icon: AccessibilityNewIcon, 
    color: '#9B59B6',
    description: '말하기나 언어 표현에 어려움이 있는 상태입니다.'
  },
  '지적장애': { 
    icon: PsychologyIcon, 
    color: '#2ECC71',
    description: '지적 기능이 평균 이하이며 적응 행동에 제한이 있는 상태입니다.'
  },
  '자폐성장애': { 
    icon: MoodIcon, 
    color: '#1ABC9C',
    description: '사회적 상호작용과 의사소통에 어려움이 있는 발달장애의 일종입니다.'
  },
  '정신장애': { 
    icon: MoodIcon, 
    color: '#E67E22',
    description: '정신 질환으로 인해 일상생활이나 사회 활동에 어려움이 있는 상태입니다.'
  },
  '뇌병변장애': { 
    icon: MedicalInformationIcon, 
    color: '#C0392B',
    description: '뇌의 기질적 병변으로 인한 신체적, 정신적 장애가 있는 상태입니다.'
  },
  '발달장애': { 
    icon: ChildCareIcon, 
    color: '#16A085',
    description: '발달 과정에서 나타나는 신체적, 정신적 장애로 학습이나 사회 적응에 어려움이 있습니다.'
  },
  '기타': { 
    icon: AllInclusiveIcon, 
    color: '#7F8C8D',
    description: '위 분류에 해당하지 않는 다양한 유형의 장애를 포함합니다.'
  },
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
            <Grid key={index} xs={6} sm={4} md={3} lg={2}>
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
      
      <Grid container spacing={2}>
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
            <Grid key={type} xs={6} sm={4} md={3} lg={2}>
              <Tooltip 
                title={disabilityInfo.description} 
                arrow 
                slots={{ transition: Zoom }}
                enterDelay={500}
              >
                <Card 
                  elevation={isSelected ? 8 : isHovered ? 6 : 3}
                  onClick={() => handleIconClick(type)}
                  onMouseEnter={() => handleCardMouseEnter(type)}
                  onMouseLeave={handleCardMouseLeave}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isHovered || isSelected ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
                    backgroundColor: isSelected ? `${disabilityInfo.color}25` : 
                                   isHovered ? `${disabilityInfo.color}15` : 'background.paper',
                    borderTop: `3px solid ${isSelected ? disabilityInfo.color : 
                                            isHovered ? disabilityInfo.color : 'transparent'}`,
                    borderLeft: isSelected ? `4px solid ${disabilityInfo.color}` : 'none',
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
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: isSelected || isHovered ? 'scale(1.1)' : 'scale(1)'
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