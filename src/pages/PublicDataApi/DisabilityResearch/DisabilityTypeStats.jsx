import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Paper, 
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import { ResponsiveContainer, BarChart } from 'recharts';

// 장애유형별 아이콘 매핑
import AccessibleIcon from '@mui/icons-material/Accessible';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoodIcon from '@mui/icons-material/Mood';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

// 통계 분석 유틸리티 가져오기
import {
  prepareChartData,
  prepareBarChartData,
  formatCombinedStats,
  generateStatsSummary
} from './utils/disabilityStatsAnalyzer';

// 차트 컴포넌트 등록
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// 차트 옵션 설정
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const dataset = context.dataset;
          const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value}명 (${percentage}%)`;
        }
      }
    }
  },
  cutout: '65%'
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.raw}명`;
        }
      }
    }
  },
  scales: {
    y: {
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: true
      }
    }
  }
};

// 장애유형별 아이콘 및 설명 매핑
const disabilityIcons = {
  '지체장애': { icon: AccessibleIcon, color: '#E74C3C', description: '신체의 일부나 기능에 장애가 있는 경우로, 이동이나 일상 활동에 제약이 있습니다.' },
  '시각장애': { icon: VisibilityOffIcon, color: '#3498DB', description: '시각 기능의 손상이나 저하로 일상생활에 어려움이 있는 상태입니다.' },
  '청각장애': { icon: HearingDisabledIcon, color: '#F39C12', description: '청력의 손실이나 저하로 의사소통에 어려움이 있는 상태입니다.' },
  '언어장애': { icon: AccessibilityNewIcon, color: '#9B59B6', description: '말하기나 언어 표현에 어려움이 있는 상태입니다.' },
  '지적장애': { icon: PsychologyIcon, color: '#2ECC71', description: '지적 기능이 평균 이하이며 적응 행동에 제한이 있는 상태입니다.' },
  '자폐성장애': { icon: MoodIcon, color: '#1ABC9C', description: '사회적 상호작용과 의사소통에 어려움이 있는 발달장애의 일종입니다.' },
  '정신장애': { icon: MoodIcon, color: '#E67E22', description: '정신 질환으로 인해 일상생활이나 사회 활동에 어려움이 있는 상태입니다.' },
  '뇌병변장애': { icon: MedicalInformationIcon, color: '#C0392B', description: '뇌의 기질적 병변으로 인한 신체적, 정신적 장애가 있는 상태입니다.' },
  '발달장애': { icon: ChildCareIcon, color: '#16A085', description: '발달 과정에서 나타나는 신체적, 정신적 장애로 학습이나 사회 적응에 어려움이 있습니다.' },
  '기타': { icon: AllInclusiveIcon, color: '#7F8C8D', description: '위 분류에 해당하지 않는 다양한 유형의 장애를 포함합니다.' },
};

// 직종 분포 차트를 위한 향상된 옵션
const jobTypeBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.raw}명`;
        }
      }
    }
  },
  scales: {
    y: {
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: true
      }
    }
  },
  // 바 두께 조정으로 트리맵처럼 보이도록 설정
  barThickness: 30,
  // 히트맵처럼 보이게 하는 추가 설정
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#ffffff'
};

// 히트맵 스타일의 작업공간 준비 함수
const prepareEnhancedBarData = (jobTypeDistribution) => {
  if (!jobTypeDistribution || Object.keys(jobTypeDistribution).length === 0) {
    return null;
  }

  // 직종명과 개수 추출
  const sortedData = Object.entries(jobTypeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const labels = sortedData.map(item => item[0]);
  const values = sortedData.map(item => item[1]);
  
  // 히트맵처럼 색상 강도를 조절하기 위한 값 계산
  const maxValue = Math.max(...values);
  
  // 히트맵 스타일 색상 그라데이션 생성 (값에 따라 색상 강도 조절)
  const backgroundColor = values.map(value => {
    // 값에 따라 색상 강도 조절 (0.3~1.0)
    const opacity = 0.3 + (value / maxValue) * 0.7;
    return `rgba(63, 81, 181, ${opacity})`;
  });
  
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 30
      }
    ]
  };
};

const DisabilityTypeStats = ({ data, onBackClick }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [statsSummary, setStatsSummary] = useState(null);
  
  // 차트 데이터
  const [severityChartData, setSeverityChartData] = useState(null);
  const [regionChartData, setRegionChartData] = useState(null);
  const [ageChartData, setAgeChartData] = useState(null);
  const [jobTypeChartData, setJobTypeChartData] = useState(null);
  const [salaryChartData, setSalaryChartData] = useState(null);
  const [combinedStats, setCombinedStats] = useState([]);
  
  // 장애유형 정보 가져오기
  const disabilityInfo = disabilityIcons[data?.disabilityType] || { 
    icon: AllInclusiveIcon, 
    color: theme.palette.primary.main,
    description: '장애유형에 관한 정보입니다.'
  };
  const IconComponent = disabilityInfo.icon;
  
  useEffect(() => {
    // 로깅 추가: props로 전달된 data 확인
    console.log('[DisabilityTypeStats] Received props - data:', data);
    
    if (data) {
      // 차트 데이터 처리
      const severityColors = ['#4285F4', '#EA4335'];
      const regionColors = ['#27AE60', '#2ECC71', '#1ABC9C', '#16A085', '#3498DB', '#2980B9', '#9B59B6'];
      const ageColors = ['#F39C12', '#F1C40F', '#E67E22', '#D35400', '#E74C3C', '#C0392B'];
      
      setSeverityChartData(prepareChartData(data.severityDistribution, severityColors));
      setRegionChartData(prepareChartData(data.regionDistribution, regionColors));
      setAgeChartData(prepareChartData(data.ageDistribution, ageColors));
      
      // 직종 분포 (Heatmap 스타일의 바 차트로 변경)
      setJobTypeChartData(prepareEnhancedBarData(data.jobTypeDistribution));
      
      setSalaryChartData(prepareBarChartData(data.salaryDistribution, {
        backgroundColor: theme.palette.secondary.main,
        hoverBackgroundColor: theme.palette.secondary.dark
      }));
      
      // 복합 통계 데이터 처리
      setCombinedStats(formatCombinedStats(data.combinedStats));
      
      // 통계 요약 생성
      setStatsSummary(generateStatsSummary(data));
      
      // 로깅 추가: 가공된 statsSummary 확인
      console.log('[DisabilityTypeStats] Processed statsSummary:', generateStatsSummary(data));
      // 로깅 추가: 각 차트 데이터 확인
      console.log('[DisabilityTypeStats] Severity Chart Data:', prepareChartData(data.severityDistribution, severityColors));
      console.log('[DisabilityTypeStats] Region Chart Data:', prepareChartData(data.regionDistribution, regionColors));
      console.log('[DisabilityTypeStats] Age Chart Data:', prepareChartData(data.ageDistribution, ageColors));
      console.log('[DisabilityTypeStats] Job Type Chart Data:', prepareEnhancedBarData(data.jobTypeDistribution));
      console.log('[DisabilityTypeStats] Salary Chart Data:', prepareBarChartData(data.salaryDistribution, {
        backgroundColor: theme.palette.secondary.main,
        hoverBackgroundColor: theme.palette.secondary.dark
      }));
      console.log('[DisabilityTypeStats] Combined Stats:', formatCombinedStats(data.combinedStats));

      setLoading(false);
    }
  }, [data, theme]);
  
  // 로딩 중일 때 스켈레톤 UI 표시
  if (loading || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid xs={12}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* 헤더 및 요약 정보 */}
      <Card elevation={3} sx={{ mb: 3, bgcolor: disabilityInfo.color + '15' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={onBackClick}
              variant="contained"
              size="small"
              sx={{ mr: 2 }}
            >
              뒤로가기
            </Button>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1
            }}>
              <IconComponent 
                fontSize="large" 
                sx={{ 
                  mr: 1, 
                  color: disabilityInfo.color,
                  fontSize: '2rem'
                }} 
              />
              <Typography variant="h5" component="h1" fontWeight="bold">
                {data.disabilityType} 통계 분석
              </Typography>
            </Box>
            <Chip 
              label={`${data.disabilityTypeCount}명 (${data.percentage}%)`} 
              color="primary" 
              sx={{ ml: 2 }} 
            />
            <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
              <IconButton size="small" title="통계 새로고침">
                <RefreshIcon />
              </IconButton>
              <IconButton size="small" title="통계 데이터 내보내기">
                <DownloadIcon />
              </IconButton>
              <IconButton size="small" title="공유하기">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'background.paper',
              mb: 2,
              boxShadow: 1
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {data.disabilityType}란?
            </Typography>
            <Typography variant="body2" paragraph>
              {disabilityInfo.description}
            </Typography>
            <Typography variant="body1">{statsSummary?.summary}</Typography>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label={`전체 인원: ${data.totalCount}명`} variant="outlined" />
            <Chip label={`${data.disabilityType} 인원: ${data.disabilityTypeCount}명`} variant="outlined" />
            <Chip label={`주요 지역: ${statsSummary?.topRegion}`} variant="outlined" />
            <Chip label={`주요 연령대: ${statsSummary?.topAgeGroup}`} variant="outlined" />
            <Chip label={`주요 직종: ${statsSummary?.topJobType}`} variant="outlined" />
            <Chip label={`주요 희망임금: ${statsSummary?.topSalary}`} variant="outlined" />
          </Box>
        </CardContent>
      </Card>
      
      {/* 주요 분포 차트 (첫 번째 줄) */}
      <Grid container spacing={3} mb={3}>
        {/* 중증/경증 분포 */}
        <Grid xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" fontWeight="medium">
                중증/경증 분포
              </Typography>
              <Box height={220}>
                {severityChartData && <Doughnut data={severityChartData} options={doughnutOptions} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 지역별 분포 */}
        <Grid xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" fontWeight="medium">
                지역별 분포 (시/도)
              </Typography>
              <Box height={220}>
                {regionChartData && <Doughnut data={regionChartData} options={doughnutOptions} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 연령대별 분포 */}
      <Grid xs={12} md={6}>
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center" fontWeight="medium">
              연령대별 분포
            </Typography>
            <Box height={220}>
              {ageChartData && <Doughnut data={ageChartData} options={doughnutOptions} />}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* 직종 및 임금 분포 (두 번째 줄) */}
      <Grid container spacing={3} mb={3}>
        {/* 희망직종 분포 - 히트맵 스타일의 바 차트 */}
        <Grid xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" fontWeight="medium">
                희망직종 분포
              </Typography>
              <Box height={300} display="flex" justifyContent="center" alignItems="center">
                {jobTypeChartData ? (
                  <Bar data={jobTypeChartData} options={jobTypeBarOptions} />
                ) : (
                  <Typography>데이터가 없습니다</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 희망임금 분포 */}
        <Grid xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" fontWeight="medium">
                희망임금 분포
              </Typography>
              <Box height={300}>
                {salaryChartData && <Bar data={salaryChartData} options={barOptions} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 복합 분석 결과 */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            다차원 분석 결과 (상위 10개 조합)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            중증도, 지역, 연령대, 직종, 임금을 모두 조합한 상위 10개 그룹의 통계입니다.
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                  <TableCell>조합</TableCell>
                  <TableCell align="center">인원수</TableCell>
                  <TableCell align="right">비율</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedStats.map((stat, index) => (
                  <TableRow key={index} 
                    sx={{ 
                      bgcolor: index === 0 ? `${disabilityInfo.color}10` : 'inherit',
                      '&:hover': { bgcolor: theme.palette.action.hover } 
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontWeight: index === 0 ? 'bold' : 'normal',
                        color: index === 0 ? disabilityInfo.color : 'inherit'
                      }}
                    >
                      {stat.description}
                    </TableCell>
                    <TableCell align="center">{stat.count}명</TableCell>
                    <TableCell align="right">{stat.displayPercentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DisabilityTypeStats; 