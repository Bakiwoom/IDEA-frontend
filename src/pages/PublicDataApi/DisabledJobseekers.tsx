import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DisabledJobseekers.module.css';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAlert } from '../../components/Alert/AlertContext';
import { useConfirm } from '../../components/Alert/ConfirmContext';
import Nav from '../../components/Navbar';
import { Modal, Box } from '@mui/material';
import DisabilityStatsPage from './DisabilityResearch/DisabilityStatsPage';
export const DISABLED_JOBSEEKERS_PAGE = '/public-data/disabled-jobseekers';

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 12;

// 기본 장애유형 목록
const DEFAULT_DISABILITY_TYPES = [
  '지체장애', '뇌병변장애', '시각장애', '청각장애', '언어장애', 
  '지적장애', '자폐성장애', '정신장애', '신장장애', '심장장애', 
  '호흡기장애', '간장애', '안면장애', '장루·요루장애', '뇌전증장애'
];

interface DisabledJobseeker {
  id: string;
  구직등록일: string;
  기관분류: string;
  연령: number;
  연번: number;
  장애유형: string;
  중증여부: string;
  희망임금: string;
  희망지역: string;
  희망직종: string;
}

interface PaginatedResponse {
  content: DisabledJobseeker[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const DisabledJobseekers: React.FC = () => {
  const [jobseekers, setJobseekers] = useState<DisabledJobseeker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageGroup, setPageGroup] = useState(1); // 10개 단위 그룹
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false); // 필터 접기/펼치기 상태
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);
  const { showAlert } = useAlert();
  const { confirm } = useConfirm();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedDisabilityType, setSelectedDisabilityType] = useState<string | null>(null);

  // 데이터 불러오기
  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 검색어와 필터 파라미터 구성
      const params: any = {
        page,
        size: PAGE_SIZE
      };
      
      if (search) {
        params.search = search;
      }
      
      if (activeFilters.length > 0) {
        params.disabilityTypes = activeFilters.join(',');
      }
      
      const response = await axios.get<PaginatedResponse>(`${API_URL}/api/public/disabled/jobseekers`, { params });
      
      // 응답 데이터 처리
      if (response.data && response.data.content) {
        setJobseekers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        
        // 장애유형 목록 업데이트 (최초 1회만)
        if (disabilityTypes.length === 0) {
          fetchDisabilityTypes();
        }
      } else {
        setJobseekers([]);
        setTotalPages(1);
        setTotalItems(0);
        setError('데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      setError('목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 장애유형 목록 가져오기
  const fetchDisabilityTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/disabled/jobseekers/disability-types`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setDisabilityTypes(response.data);
      } else {
        // API 응답이 비어있는 경우 기본 목록 사용
        setDisabilityTypes(DEFAULT_DISABILITY_TYPES);
      }
    } catch (err) {
      console.error("장애유형 목록을 가져오는데 실패했습니다:", err);
      // 오류 발생 시 기본 목록 사용
      setDisabilityTypes(DEFAULT_DISABILITY_TYPES);
    }
  };

  // 데이터 갱신
  const refreshData = async () => {
    confirm('최신 데이터를 갱신하시겠습니까? 시간이 다소 걸릴 수 있습니다.', async () => {
      try {
        setLoading(true);
        setError(null);
        await axios.post(`${API_URL}/api/public/disabled/jobseekers/refresh`);
        showAlert('데이터가 갱신되었습니다!', 'success', 3000);
        // 첫 페이지로 이동
        setPage(1);
        setPageGroup(1);
        fetchList();
      } catch (err) {
        setError('데이터 갱신에 실패했습니다.');
        showAlert('데이터 갱신에 실패했습니다.', 'error', 3000);
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  };

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchList();
  }, [page, search, activeFilters]);

  // 페이지 그룹 계산
  const pagesPerGroup = 10;
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 페이지 변경 함수 - 페이지 번호 클릭 시에만 상단 스크롤
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지 그룹 변경 함수 - 스크롤 이동 없음
  const changePageGroup = (delta: number) => {
    const newGroup = pageGroup + delta;
    if (newGroup >= 1 && newGroup <= totalGroups) {
      setPageGroup(newGroup);
      setPage((newGroup - 1) * pagesPerGroup + 1);
    }
  };
  
  // 첫 페이지/마지막 페이지 이동 함수 - 스크롤 이동 없음
  const goToFirstPage = () => {
    setPageGroup(1);
    setPage(1);
  };
  
  const goToLastPage = () => {
    setPageGroup(totalGroups);
    setPage(totalPages);
  };

  // 찜(즐겨찾기) 상태 관리
  const toggleFavorite = (id: string) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setPageGroup(1);
    fetchList();
  };

  // 장애유형 필터 토글 함수
  const toggleFilter = (type: string) => {
    setActiveFilters(prevFilters => {
      if (prevFilters.includes(type)) {
        return prevFilters.filter(f => f !== type);
      } else {
        return [...prevFilters, type];
      }
    });
    // 필터 변경 시 첫 페이지로 이동
    setPage(1);
    setPageGroup(1);
  };

  // 장애유형별 심볼 반환 함수
  const getDisabilitySymbol = (type: string) => {
    // 장애유형에 따라 다른 심볼 반환
    switch (type) {
      case '지체장애':
        return '🦿';
      case '뇌병변장애':
        return '🧠';
      case '시각장애':
        return '👁️';
      case '청각장애':
        return '👂';
      case '언어장애':
        return '🗣️';
      case '지적장애':
        return '🧩';
      case '자폐성장애':
        return '🔄';
      case '정신장애':
        return '🧠';
      case '신장장애':
        return '🫀';
      case '심장장애':
        return '❤️';
      case '호흡기장애':
        return '🫁';
      case '간장애':
        return '🫓';
      case '안면장애':
        return '😶';
      case '장루·요루장애':
        return '🚾';
      case '뇌전증장애':
        return '⚡';
      default:
        return '♿';
    }
  };

  // 모든 필터 초기화
  const resetFilters = () => {
    setActiveFilters([]);
  };

  // 희망임금을 포맷팅하는 함수
  const formatSalary = (salary: string) => {
    if (!salary) return '-';
    
    // 숫자 부분 추출 및 콤마 추가
    const numericPart = salary.match(/\d+/);
    if (numericPart) {
      const amount = parseInt(numericPart[0], 10);
      const formattedAmount = amount.toLocaleString('ko-KR');
      
      // 금액 단위 판단 (원, 만원 등)
      if (salary.includes('만원')) {
        return `${formattedAmount} 만원`;
      } else {
        return `${formattedAmount} 원`;
      }
    }
    
    return salary;
  };

  // 필터 토글 함수
  const toggleFilterSection = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  // 장애유형 통계 모달 열기 함수
  const openStatsModal = (type: string) => {
    setSelectedDisabilityType(type);
    setIsStatsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeStatsModal = () => {
    setIsStatsModalOpen(false);
    setSelectedDisabilityType(null);
  };

  // 장애유형 필터 버튼 클릭 처리
  const handleDisabilityButtonClick = (type: string) => {
    // 필터 토글
    toggleFilter(type);
    
    // 해당 유형을 선택하고 통계 모달 열기
    openStatsModal(type);
  };

  return (
    <>
        <Nav />
        <div className={styles.container}>
        <h2 className={styles.title}>장애인 구직자 현황</h2>
        <div className={styles.buttonContainer}>
            <button
            onClick={refreshData}
            disabled={loading}
            className={`${styles.button} ${styles.refreshButton}`}
            >
            데이터 갱신
            </button>
            <button
            onClick={() => fetchList()}
            disabled={loading}
            className={`${styles.button} ${styles.loadButton}`}
            >
            목록 불러오기
            </button>
        </div>
        <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
            className={styles.searchInput}
            type="text"
            placeholder="희망직종, 지역, 중증여부 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>검색</button>
        </form>

        <div className={styles.filterContainer}>
          <div 
            className={styles.filterTitle} 
            onClick={toggleFilterSection}
            role="button"
            tabIndex={0}
          >
            <span>장애유형 필터 {isFilterExpanded ? <FiChevronUp /> : <FiChevronDown />}</span>
            {activeFilters.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 버블링 방지
                  resetFilters();
                }} 
                className={styles.resetButton}
              >
                초기화
              </button>
            )}
          </div>
          
          {isFilterExpanded && (
            <div className={styles.filterSymbols}>
              {disabilityTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleDisabilityButtonClick(type)}
                  className={`${styles.symbolButton} ${
                    activeFilters.includes(type) ? styles.activeSymbol : ''
                  }`}
                  title={type}
                >
                  <span className={styles.symbol}>{getDisabilitySymbol(type)}</span>
                  <span className={styles.symbolText}>
                    {type}
                    {activeFilters.includes(type) && (
                      <span className={styles.viewStats}>통계 보기</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {loading && <div className={styles.loading}>데이터를 불러오는 중...</div>}

        <div className={styles.cardGrid}>
            {jobseekers.length > 0 ? (
              jobseekers.map((item) => (
                <div key={item.id} className={styles.card}>
                    <div className={styles.cardTags}>
                    <span className={styles.tag}>{item.장애유형}</span>
                    {item.중증여부 === '중증' ? (
                        <span className={`${styles.tag} ${styles.severeTag}`}>{item.중증여부}</span>
                    ) : (
                        <span className={`${styles.tag} ${styles.mildTag}`}>{item.중증여부}</span>
                    )}
                    {item.희망임금?.includes('월급') && <span className={styles.tag}>월급</span>}
                    {item.희망임금?.includes('시급') && <span className={styles.tag}>시급</span>}
                    {item.희망임금?.includes('일급') && <span className={styles.tag}>일급</span>}
                    {item.희망임금?.includes('연봉') && <span className={styles.tag}>연봉</span>}
                    </div>
                    <div className={styles.cardFav} onClick={() => toggleFavorite(item.id)}>
                    {favorites.includes(item.id) ? <FaStar color="#2563eb" /> : <FaRegStar />}
                    </div>
                    <div className={styles.cardTitle}>{item.희망직종 || '직종 미상'}</div>
                    <div className={styles.cardDesc}>
                    <b>희망지역:</b> {item.희망지역 || '-'}<br />
                    <b>희망임금:</b> {formatSalary(item.희망임금) || '-'}<br />
                    <b>연령:</b> {item.연령 || '-'}세<br />
                    <b>등록일:</b> {item.구직등록일 || '-'}
                    </div>
                    <div className={styles.cardInfo}><b>기관분류</b> {item.기관분류 || '-'}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>검색 결과가 없습니다.</div>
            )}
        </div>

        {/* 페이징 */}
        <div className={styles.pagination}>
            <button 
                className={styles.pageBtn} 
                onClick={goToFirstPage} 
                disabled={page === 1}
            >
                &laquo;
            </button>
            <button 
                className={styles.pageBtn} 
                onClick={() => changePageGroup(-1)} 
                disabled={pageGroup === 1}
            >
                이전
            </button>
            {pageNumbers.map(num => (
                <button
                    key={num}
                    className={`${styles.pageBtn} ${page === num ? styles.active : ''}`}
                    onClick={() => handlePageChange(num)}
                >
                    {num}
                </button>
            ))}
            <button 
                className={styles.pageBtn} 
                onClick={() => changePageGroup(1)} 
                disabled={pageGroup === totalGroups}
            >
                다음
            </button>
            <button 
                className={styles.pageBtn} 
                onClick={goToLastPage} 
                disabled={page === totalPages}
            >
                &raquo;
            </button>
        </div>
        </div>

        {/* 장애유형 통계 모달 */}
        <Modal
          open={isStatsModalOpen}
          onClose={closeStatsModal}
          aria-labelledby="statistics-modal-title"
          aria-describedby="statistics-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1200px',
            height: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            overflowY: 'auto'
          }}>
            {selectedDisabilityType && (
              <DisabilityStatsPage selectedDisabilityType={selectedDisabilityType} />
            )}
          </Box>
        </Modal>
    </>
  );
};

export default DisabledJobseekers; 