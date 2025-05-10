import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './WelfareServices.module.css';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 6;

interface WelfareServiceList {
    servId: string;      // 서비스 ID
    inqNum: string;      // 조회수
    intrsThemaArray: string;    // 관심주제
    jurMnofNm: string;   // 소관부처명
    jurOrgNm: string;    // 소관조직명
    lifeArray: string;   // 생애주기
    onapPsbltYn: string; // 온라인신청가능여부
    rprsCtadr: string;   // 대표연락처
    servDgst: string;    // 서비스 요약
    servDtlLink: string; // 서비스 상세 링크
    servNm: string;      // 서비스명
    sprtCycNm: string;   // 지원주기명
    srvPvsnNm: string;   // 서비스제공부서명
    svcfrstRegTs: string;// 서비스 최초 등록일시
    trgterIndvdlArray: string;  // 대상자 개인
}

interface WelfareServiceDetail {
    servId: string;      // 서비스 ID
    servNm: string;      // 서비스명
    jurMnofNm: string;   // 소관부처명
    tgtrDtlCn: string;   // 대상자 상세내용
    slctCritCn: string;  // 선정기준 내용
    alwServCn: string;   // 급여서비스 내용
    crtrYr: string;      // 기준년도
    rprsCtadr: string;   // 대표연락처
    wlfareInfoOutlCn: string;   // 복지정보 개요 내용
    sprtCycNm: string;   // 지원주기명
    srvPvsnNm: string;   // 서비스제공부서명
    lifeArray: string;   // 생애주기
    trgterIndvdlArray: string;  // 대상자 개인
    intrsThemaArray: string;    // 관심주제
    applmetList: Array<{        // 신청방법 목록
        servSeCode: string;     // 서비스 구분 코드
        servSeDetailLink: string;    // 서비스 구분 상세 링크
        servSeDetailNm: string;      // 서비스 구분 상세 이름
    }>;
    inqplCtadrList: Array<{    // 문의처 연락처 목록
        servSeCode: string;     // 서비스 구분 코드
        servSeDetailLink: string;    // 서비스 구분 상세 링크
        servSeDetailNm: string;      // 서비스 구분 상세 이름
    }>;
    inqplHmpgReldList: Array<{  // 문의처 홈페이지 관련 목록
        servSeCode: string;     // 서비스 구분 코드
        servSeDetailLink: string;    // 서비스 구분 상세 링크
        servSeDetailNm: string;      // 서비스 구분 상세 이름
    }>;
    basfrmList: Array<{        // 서식 목록
        servSeCode: string;     // 서비스 구분 코드
        servSeDetailLink: string;    // 서비스 구분 상세 링크
        servSeDetailNm: string;      // 서비스 구분 상세 이름
    }>;
    baslawList: Array<{        // 근거법령 목록
        servSeCode: string;     // 서비스 구분 코드
        servSeDetailNm: string;      // 서비스 구분 상세 이름
    }>;
}

const WelfareServices: React.FC = () => {
    const [list, setList] = useState<WelfareServiceList[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<WelfareServiceDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(1); // 10개 단위 그룹
    const [favorites, setFavorites] = useState<string[]>([]);
    const [tab, setTab] = useState('target');

    const detailRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // URL 유효성 검사 함수 추가
    const isValidUrl = (urlString: string): boolean => {
        try {
            const url = new URL(urlString);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    // 링크 렌더링 함수 추가
    const renderLink = (text: string, link?: string) => {
        if (!link || !isValidUrl(link)) {
            return <span className={styles.plainText}>{text}</span>;
        }
        return (
            <div className={styles.linkContainer}>
                <span>{text}</span>
                <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkStyle}
                >
                    바로가기
                </a>
            </div>
        );
    };

    const fetchList = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/api/public/welfare/list`);
            setList(response.data);
        } catch (err) {
            setError('목록을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        if (!window.confirm('최신 데이터를 갱신하시겠습니까? 시간이 다소 걸릴 수 있습니다.')) return;
        
        try {
            setLoading(true);
            setError(null);
            await axios.post(`${API_URL}/api/public/welfare/list/refresh`);
            alert('데이터가 갱신되었습니다!');
            fetchList();
        } catch (err) {
            setError('데이터 갱신에 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (servId: string) => {
        try {
            const response = await axios.get(`${API_URL}/api/public/welfare/detail/${servId}`);
            setSelectedDetail(response.data);
        } catch (err) {
            // 상세 데이터가 없으면 갱신 요청
            try {
                await axios.post(`${API_URL}/api/public/welfare/detail/${servId}/refresh`);
                const response = await axios.get(`${API_URL}/api/public/welfare/detail/${servId}`);
                setSelectedDetail(response.data);
            } catch (refreshErr) {
                console.error(refreshErr);
            }
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'goWelfarePage') {
            setSearch('장애인');
        }
    }, [location.search]);

    // 검색 필터링
    const filteredList = list.filter(item =>
        item.servNm.includes(search) || item.jurMnofNm.includes(search)
    );
    // 페이징 처리
    const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
    const pagedList = filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // 페이지 그룹 계산
    const pagesPerGroup = 10;
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    const startPage = (pageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    useEffect(() => { setPage(1); setPageGroup(1); }, [search]); // 검색 시 1페이지, 1그룹으로 이동

    // 페이지 번호 클릭 시 그룹 이동
    const handlePageClick = (p: number) => {
        setPage(p);
        const newGroup = Math.ceil(p / pagesPerGroup);
        setPageGroup(newGroup);
    };

    // 태그 추출 함수 (예시: lifeArray, intrsThemaArray 등에서 쉼표/슬래시/공백 분리)
    function extractTags(item: WelfareServiceList | WelfareServiceDetail) {
        const tags: string[] = [];
        if (item.lifeArray) tags.push(...item.lifeArray.split(/[ ,/]+/).filter(Boolean));
        if (item.intrsThemaArray) tags.push(...item.intrsThemaArray.split(/[ ,/]+/).filter(Boolean));
        return Array.from(new Set(tags));
    }

    // 찜(즐겨찾기) 상태 관리 (로컬 상태, 실제 서비스에서는 서버 연동 필요)
    const toggleFavorite = (servId: string) => {
        setFavorites(favs => favs.includes(servId) ? favs.filter(id => id !== servId) : [...favs, servId]);
    };

    // 탭 정의
    const tabDefs = [
        { key: 'target', label: '지원대상' },
        { key: 'content', label: '서비스 내용' },
        { key: 'apply', label: '신청방법' },
        { key: 'extra', label: '추가정보' },
    ];

    const handleShowDetail = (servId: string) => {
        fetchDetail(servId);
        setTab('target');
        setTimeout(() => {
            if (detailRef.current) {
                detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleCloseDetail = () => {
        setSelectedDetail(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>중앙부처 복지서비스 목록</h2>
            
            <div className={styles.buttonContainer}>
                <button
                    onClick={refreshData}
                    disabled={loading}
                    className={`${styles.button} ${styles.refreshButton}`}
                >
                    데이터 갱신
                </button>
                <button
                    onClick={fetchList}
                    disabled={loading}
                    className={`${styles.button} ${styles.loadButton}`}
                >
                    목록 불러오기
                </button>
            </div>

            {/* 검색바 */}
            <div className={styles.searchBar}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="서비스명 또는 소관부처명 검색"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    className={search === '장애인' ? styles.filterActive : styles.filterBtn}
                    style={{marginLeft: '0.5rem'}}
                    onClick={() => setSearch(search === '장애인' ? '' : '장애인')}
                >
                    장애인
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {loading && (
                <div className={styles.loading}>데이터를 불러오는 중...</div>
            )}

            {/* 카드형 목록 */}
            <div className={styles.cardGrid}>
                {pagedList.map((item) => (
                    <div
                        key={item.servId}
                        className={styles.card}
                        onClick={() => handleShowDetail(item.servId)}
                    >
                        <div className={styles.cardTags}>
                            {extractTags(item).map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                        <div className={styles.cardFav} onClick={e => { e.stopPropagation(); toggleFavorite(item.servId); }}>
                            {favorites.includes(item.servId) ? <FaStar color="#2563eb" /> : <FaRegStar />}
                        </div>
                        <div className={styles.cardTitle}>{item.servNm}</div>
                        <div className={styles.cardDesc}>{item.servDgst}</div>
                        <div className={styles.cardInfo}><b>담당부처</b> {item.jurMnofNm}</div>
                        <div className={styles.cardInfo}><b>지원주기</b> {item.sprtCycNm || '-'}</div>
                        <div className={styles.cardInfo}><b>문의처</b> {item.rprsCtadr || '-'}</div>
                        <div className={styles.cardBtnRow}>
                            <button
                                className={`${styles.cardBtn} ${styles.primary}`}
                                onClick={e => { e.stopPropagation(); handleShowDetail(item.servId); }}
                            >
                                자세히 보기
                            </button>
                            {item.servDtlLink && (
                                <a
                                    href={item.servDtlLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.cardBtn}
                                    onClick={e => e.stopPropagation()}
                                    style={{ background: '#4f46e5' }}
                                >
                                    신청/상세링크
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                {pagedList.length === 0 && (
                    <div style={{padding:'2rem', textAlign:'center', color:'#888'}}>검색 결과가 없습니다.</div>
                )}
            </div>

            {/* 상세 오버레이 */}
            {selectedDetail && (
                <>
                    <div
                        style={{position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.08)', zIndex:20}}
                        onClick={handleCloseDetail}
                    />
                    <div ref={detailRef} className={styles.detailWrap} style={{position:'relative', zIndex:30}}>
                        <div className={styles.detailTags}>
                            {extractTags(selectedDetail).map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                        <div className={styles.detailFav} onClick={() => toggleFavorite(selectedDetail.servId)}>
                            {favorites.includes(selectedDetail.servId) ? <FaStar color="#2563eb" /> : <FaRegStar />}
                        </div>
                        <div className={styles.detailTitle}>{selectedDetail.servNm}</div>
                        <div className={styles.detailDesc}>
                            <div className={styles.markdown}>
                                <ReactMarkdown>
                                    {selectedDetail.tgtrDtlCn || '-'}
                                </ReactMarkdown>
                            </div>
                        </div>
                        <div className={styles.detailDept}>
                            <b>담당부서</b> {selectedDetail.jurMnofNm || '-'}
                        </div>
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>기준연도</th>
                                    <th>문의처</th>
                                    <th>지원주기</th>
                                    <th>제공유형</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={styles.detailTableRow}>
                                    <td>{selectedDetail.crtrYr || '-'}</td>
                                    <td>{selectedDetail.rprsCtadr || '-'}</td>
                                    <td>{selectedDetail.sprtCycNm || '-'}</td>
                                    <td>{selectedDetail.srvPvsnNm || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.detailBtnRow}>
                            <button className={styles.detailBtn} onClick={handleCloseDetail}>목록</button>
                        </div>
                        <div className={styles.tabs}>
                            {tabDefs.map(t => (
                                <div
                                    key={t.key}
                                    className={`${styles.tab} ${tab === t.key ? styles.active : ''}`}
                                    onClick={() => setTab(t.key)}
                                >
                                    {t.label}
                                </div>
                            ))}
                        </div>
                        <div className={styles.tabPanel}>
                            {tab === 'target' && (
                                <>
                                    <div className={styles.extraSection}>
                                        <h3>지원대상</h3>
                                        <div className={styles.markdown}>
                                            <ReactMarkdown>
                                                {selectedDetail.tgtrDtlCn || '-'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.extraSection}>
                                        <h3>선정기준</h3>
                                        <div className={styles.markdown}>
                                            <ReactMarkdown>
                                                {selectedDetail.slctCritCn || '-'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </>
                            )}
                            {tab === 'content' && (
                                <>
                                    <div className={styles.extraSection}>
                                        <h3>서비스 내용</h3>
                                        <div className={styles.markdown}>
                                            <ReactMarkdown>
                                                {selectedDetail.alwServCn || '-'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </>
                            )}
                            {tab === 'apply' && (
                                <>
                                    <div className={styles.extraSection}>
                                        <h3>신청방법</h3>
                                        <ul className={styles.listStyle}>
                                            {selectedDetail.applmetList?.map((item, index) => (
                                                <li key={index}>
                                                    {renderLink(item.servSeDetailNm, item.servSeDetailLink)}
                                                </li>
                                            )) || '-'}
                                        </ul>
                                    </div>
                                </>
                            )}
                            {tab === 'extra' && (
                                <>
                                    <div className={styles.extraSection}>
                                        <h3>복지정보 개요</h3>
                                        <div className={styles.markdown}>
                                            <ReactMarkdown>
                                                {selectedDetail.wlfareInfoOutlCn || '-'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className={styles.extraSection}>
                                        <h3>관심주제</h3>
                                        <div className={styles.markdown}>
                                            <ReactMarkdown>
                                                {selectedDetail.intrsThemaArray || '-'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className={styles.extraSection}>
                                        <h3>문의처 연락처</h3>
                                        <ul className={styles.listStyle}>
                                            {selectedDetail.inqplCtadrList?.map((item, index) => (
                                                <li key={index}>
                                                    {renderLink(item.servSeDetailNm, item.servSeDetailLink)}
                                                </li>
                                            )) || '-'}
                                        </ul>
                                    </div>

                                    <div className={styles.extraSection}>
                                        <h3>관련 홈페이지</h3>
                                        <ul className={styles.listStyle}>
                                            {selectedDetail.inqplHmpgReldList?.map((item, index) => (
                                                <li key={index}>
                                                    {renderLink(item.servSeDetailNm, item.servSeDetailLink)}
                                                </li>
                                            )) || '-'}
                                        </ul>
                                    </div>

                                    <div className={styles.extraSection}>
                                        <h3>신청 서식</h3>
                                        <ul className={styles.listStyle}>
                                            {selectedDetail.basfrmList?.map((item, index) => (
                                                <li key={index}>
                                                    {renderLink(item.servSeDetailNm, item.servSeDetailLink)}
                                                </li>
                                            )) || '-'}
                                        </ul>
                                    </div>

                                    <div className={styles.extraSection}>
                                        <h3>근거 법령</h3>
                                        <ul className={styles.listStyle}>
                                            {selectedDetail.baslawList?.map((item, index) => (
                                                <li key={index}>
                                                    {item.servSeDetailNm}
                                                </li>
                                            )) || '-'}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* 페이징 */}
            <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={()=>{ handleCloseDetail(); if(pageGroup>1){ setPage((pageGroup-2)*pagesPerGroup+1); setPageGroup(pageGroup-1); }}} disabled={pageGroup===1}>이전</button>
                {pageNumbers.map(num => (
                    <button key={num} className={`${styles.pageBtn} ${page===num?styles.active:''}`} onClick={()=>{ handleCloseDetail(); handlePageClick(num); }}>{num}</button>
                ))}
                <button className={styles.pageBtn} onClick={()=>{ handleCloseDetail(); if(pageGroup<totalGroups){ setPage(pageGroup*pagesPerGroup+1); setPageGroup(pageGroup+1); }}} disabled={pageGroup===totalGroups}>다음</button>
            </div>
        </div>
    );
};

export default WelfareServices; 