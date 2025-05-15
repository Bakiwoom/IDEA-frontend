import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Alert, CircularProgress, Divider, Grid } from '@mui/material';
import axios from 'axios';

// 컴포넌트 가져오기
import DisabilityTypeFilter from './DisabilityTypeFilter';
import DisabilityTypeStats from './DisabilityTypeStats';

export const DISABILITY_STATS_PAGE = '/public-data/disability-stats';
const API_URL = process.env.REACT_APP_API_URL;

// prop 타입 설정
interface DisabilityStatsPageProps {
  selectedDisabilityType?: string | null;
}

// 데이터 타입 정의
interface DisabilityStatsData {
  disabilityType: string;
  disabilityTypeCount: number;
  totalCount: number;
  percentage: number;
  severityDistribution: Record<string, number>;
  regionDistribution: Record<string, number>;
  ageDistribution: Record<string, number>;
  jobTypeDistribution: Record<string, number>;
  salaryDistribution: Record<string, number>;
  combinedStats: Array<{
    severity: string;
    region: string;
    ageGroup: string;
    jobType: string;
    salary: string;
    count: number;
    percentOfTotal: number;
  }>;
}

const DisabilityStatsPage: React.FC<DisabilityStatsPageProps> = ({ selectedDisabilityType = null }) => {
  // 상태 변수
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(selectedDisabilityType);
  const [statsData, setStatsData] = useState<DisabilityStatsData | null>(null);
  
  // 모든 장애유형 목록 가져오기
  const fetchDisabilityTypes = async (): Promise<void> => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await axios.get(`${API_URL}/api/public/disabled/jobseekers/disability-types`);
      
      if (response.data && Array.isArray(response.data)) {
        setDisabilityTypes(response.data);
        console.log('[DisabilityStatsPage] Fetched disability types:', response.data);
      } else {
        throw new Error('장애유형 목록을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('장애유형 목록 조회 오류:', error);
      setErrorMessage('장애유형 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 특정 장애유형의 통계 데이터 가져오기
  const fetchDisabilityStats = async (disabilityType: string | null): Promise<void> => {
    if (!disabilityType) return;
    
    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await axios.get(`${API_URL}/api/public/disabled/jobseekers/stats/${encodeURIComponent(disabilityType)}`);
      
      if (response.data) {
        setStatsData(response.data);
        console.log('[DisabilityStatsPage] Fetched disability stats for ' + disabilityType + ':', response.data);
      } else {
        throw new Error('통계 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('통계 데이터 조회 오류:', error);
      setErrorMessage('통계 데이터를 불러오는 중 오류가 발생했습니다.');
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };
  
  // 장애유형 선택 처리
  const handleDisabilityTypeSelect = (type: string | null): void => {
    setSelectedType(type);
    fetchDisabilityStats(type);
  };
  
  // 뒤로가기 처리 (선택 해제)
  const handleBack = (): void => {
    setSelectedType(null);
    setStatsData(null);
  };
  
  // 컴포넌트 마운트 시 장애유형 목록 가져오기
  useEffect(() => {
    fetchDisabilityTypes();
    console.log('[DisabilityStatsPage] Initial props selectedDisabilityType:', selectedDisabilityType);
  }, []);

  // selectedDisabilityType props가 변경되면 해당 유형의 통계 로드
  useEffect(() => {
    console.log('[DisabilityStatsPage] selectedDisabilityType prop changed:', selectedDisabilityType);
    if (selectedDisabilityType) {
      setSelectedType(selectedDisabilityType);
      fetchDisabilityStats(selectedDisabilityType);
    }
  }, [selectedDisabilityType]);
  
  // 에러 메시지 표시
  const renderError = () => {
    if (!errorMessage) return null;
    
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {errorMessage}
      </Alert>
    );
  };
  
  // 로딩 인디케이터
  const renderLoading = () => {
    if (!loading) return null;
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* 에러 메시지 */}
        {renderError()}
        
        {/* 로딩 인디케이터 */}
        {renderLoading()}
        
        {/* 페이지 내용 */}
        {!loading && !errorMessage && (
          <Box>
            {/* 장애유형 필터 영역 (항상 표시) */}
            <DisabilityTypeFilter 
              disabilityTypes={disabilityTypes} 
              loading={loading} 
              onSelect={handleDisabilityTypeSelect}
              selectedType={selectedType} 
            />
            
            {/* 선택된 장애유형이 있으면 통계 정보 표시 */}
            {selectedType && statsData && (
              <>
                <Divider sx={{ my: 2 }} />
                <DisabilityTypeStats 
                  data={statsData} 
                  onBackClick={handleBack} 
                />
              </>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DisabilityStatsPage; 