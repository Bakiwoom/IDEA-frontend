/**
 * 장애유형 통계 분석 유틸리티
 * 장애인 구직자 통계 데이터를 가공하여 차트와 분석에 활용할 수 있는 형태로 변환합니다.
 */

// 도넛 차트용 데이터 변환 - 일반 통계
export const prepareChartData = (distribution, colorPalette = null) => {
  console.log('[analyzer] prepareChartData input:', { distribution, colorPalette });
  if (!distribution || Object.keys(distribution).length === 0) {
    return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  }

  // 기본 색상 팔레트
  const defaultColors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', 
    '#46BFBD', '#F7464A', '#AC64AD', '#2C3E50', '#F39C12',
    '#27AE60', '#8E44AD', '#3498DB', '#E74C3C', '#1ABC9C'
  ];

  const colors = colorPalette || defaultColors;
  
  // 분포 데이터를 정렬된 배열로 변환
  const sortedData = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
    .slice(0, 10); // 상위 10개만
  
  const labels = sortedData.map(item => item[0]);
  const values = sortedData.map(item => item[1]);
  const backgroundColors = labels.map((_, i) => colors[i % colors.length]);
  
  const result = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
    }]
  };
  console.log('[analyzer] prepareChartData output:', result);
  return result;
};

// 바 차트용 데이터 변환
export const prepareBarChartData = (distribution, colorPalette = null) => {
  console.log('[analyzer] prepareBarChartData input:', { distribution, colorPalette });
  if (!distribution || Object.keys(distribution).length === 0) {
    return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  }

  // 기본 색상
  const defaultColor = '#4285F4';
  const defaultHoverColor = '#2756B3';
  
  // 분포 데이터를 정렬된 배열로 변환
  const sortedData = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
    .slice(0, 10); // 상위 10개만
  
  const labels = sortedData.map(item => item[0]);
  const values = sortedData.map(item => item[1]);
  
  const result = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colorPalette?.backgroundColor || defaultColor,
      hoverBackgroundColor: colorPalette?.hoverBackgroundColor || defaultHoverColor,
      barThickness: 25,
    }]
  };
  console.log('[analyzer] prepareBarChartData output:', result);
  return result;
};

// 중증도별 분포 계산 (전체 대비 비율)
export const calculateSeverityPercentage = (severityDistribution, totalCount) => {
  console.log('[analyzer] calculateSeverityPercentage input:', { severityDistribution, totalCount });
  if (!severityDistribution || Object.keys(severityDistribution).length === 0) {
    return [];
  }
  
  const result = Object.entries(severityDistribution).map(([severity, count]) => ({
    severity,
    count,
    percentage: Math.round((count / totalCount) * 1000) / 10, // 소수점 첫째자리까지
  }));
  console.log('[analyzer] calculateSeverityPercentage output:', result);
  return result;
};

// 복합 분석 결과 포맷팅
export const formatCombinedStats = (combinedStats) => {
  console.log('[analyzer] formatCombinedStats input:', combinedStats);
  if (!combinedStats || combinedStats.length === 0) {
    return [];
  }
  
  const result = combinedStats.map(stat => ({
    ...stat,
    description: `${stat.severity} / ${stat.region} / ${stat.ageGroup} / ${stat.jobType} / ${stat.salary}`,
    displayPercentage: `${stat.percentOfTotal}%`,
  }));
  console.log('[analyzer] formatCombinedStats output:', result);
  return result;
};

// 통계 요약 생성 (텍스트 형태)
export const generateStatsSummary = (stats) => {
  console.log('[analyzer] generateStatsSummary input:', stats);
  if (!stats) return null;
  
  // 주요 분포에서 가장 많은 항목 추출
  const topRegion = Object.entries(stats.regionDistribution || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '없음';
  
  const topAgeGroup = Object.entries(stats.ageDistribution || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '없음';
  
  const topJobType = Object.entries(stats.jobTypeDistribution || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '없음';
  
  const topSalaryRaw = Object.entries(stats.salaryDistribution || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '없음';

  let topSalaryDetails = {
    original: topSalaryRaw,
    type: null,
    amount: null,
    formattedString: topSalaryRaw === '없음' ? '정보 없음' : topSalaryRaw
  };

  if (topSalaryRaw && topSalaryRaw !== '없음') {
    const match = topSalaryRaw.match(/\((시급|월급)\)\s*([\d,]+)/);
    if (match) {
      topSalaryDetails.type = `(${match[1]})`; // (시급) 또는 (월급)
      const numericAmount = parseInt(match[2].replace(/,/g, ''), 10);
      topSalaryDetails.amount = numericAmount.toLocaleString(); // 천단위 콤마 적용
      topSalaryDetails.formattedString = `${topSalaryDetails.type} ${topSalaryDetails.amount}`;
    }
  }
  
  const severityInfo = calculateSeverityPercentage(stats.severityDistribution, stats.disabilityTypeCount)
    .map(item => `${item.severity}: ${item.count}명 (${item.percentage}%)`)
    .join(', ');
  
  const result = {
    disabilityType: stats.disabilityType,
    totalCount: stats.totalCount,
    typeCount: stats.disabilityTypeCount,
    percentage: stats.percentage,
    severityInfo,
    topRegion,
    topAgeGroup,
    topJobType,
    topSalary: topSalaryDetails.formattedString, // 포맷팅된 전체 문자열 (예: "(시급) 9,860")
    topSalaryDetails: topSalaryDetails, // 상세 객체
    summary: `
      ${stats.disabilityType} 장애인은 전체 ${stats.totalCount}명 중 ${stats.disabilityTypeCount}명으로 ${stats.percentage}%를 차지합니다.
      주로 ${topRegion} 지역의 ${topAgeGroup} 연령층이 많으며, 가장 선호하는 직종은 ${topJobType}이고, 
      희망 임금은 ${topSalaryDetails.formattedString}입니다.
    `.trim().replace(/\s+/g, ' ')
  };
  console.log('[analyzer] generateStatsSummary output:', result);
  return result;
};

export default {
  prepareChartData,
  prepareBarChartData,
  calculateSeverityPercentage,
  formatCombinedStats,
  generateStatsSummary
}; 