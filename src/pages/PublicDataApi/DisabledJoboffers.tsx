import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DisabledJoboffers.module.css';
import { format, differenceInDays, parse, isValid } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL;

interface DisabledJoboffer {
    // 기본 정보
    busplaName: string;    // 사업장명
    jobNm: string;        // 모집직종
    empType: string;      // 고용형태
    compAddr: string;     // 사업장주소
    termDate: string;     // 모집기간
    
    // 상세 정보
    cntctNo: string;      // 연락처
    enterType: string;    // 입사형태
    offerregDt: string;   // 구인신청일자
    regDt: string;        // 등록일
    regagnName: string;   // 담당기관
    reqCareer: string;    // 요구경력
    reqEduc: string;      // 요구학력
    salary: string;       // 임금
    salaryType: string;   // 임금형태

    // 작업환경 정보
    envBothHands: string; // 작업환경_양손사용
    envEyesight: string;  // 작업환경_시력
    envHandwork: string;  // 작업환경_손작업
    envLiftPower: string; // 작업환경_드는힘
    envLstnTalk: string;  // 작업환경_듣고 말하기
    envStndWalk: string;  // 작업환경_서거나 걷기
}


// 픽토그램 정보 정의
const pictogramDefs = [
    { 
        key: 'envBothHands', 
        label: '양손 사용', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 12l-2 4m0 0l-2-4m2 4v4m10-8l2 4m0 0l2-4m-2 4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2"/></svg>
        )
    },
    { 
        key: 'envEyesight', 
        label: '시력', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
        )
    },
    { 
        key: 'envHandwork', 
        label: '손작업', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="7" y="11" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 11V7a3 3 0 1 1 6 0v4" stroke="currentColor" strokeWidth="2"/></svg>
        )
    },
    { 
        key: 'envLiftPower', 
        label: '들어올림', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M12 8V4m0 0l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="2"/></svg>
        )
    },
    { 
        key: 'envLstnTalk', 
        label: '청취/대화', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="2"/><path d="M12 13v3m0 0l-2-2m2 2l2-2" stroke="currentColor" strokeWidth="2"/></svg>
        )
    },
    { 
        key: 'envStndWalk', 
        label: '서기/걷기', 
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l-2 4m2-4l2 4" stroke="currentColor" strokeWidth="2"/></svg>
        )
    },
];

const PAGE_SIZE = 10;

// 괄호로 텍스트 분리 및 줄바꿈+작은글씨 처리 함수 (개선)
function splitTextWithParenthesis(text: string) {
    if (!text) return '-';
    // 괄호가 있으면 분리
    const match = text.match(/^(.*?)(\(.*\))$/);
    if (match) {
        return <><span>{match[1].trim()}</span><span className={styles.subText}>{match[2]}</span></>;
    }
    // 괄호가 없고 18자 이상이면 앞 18자/나머지 분리
    if (text.length > 18) {
        return <><span>{text.slice(0, 18)}</span><span className={styles.subText}>{text.slice(18)}</span></>;
    }
    return text;
}

// 날짜 변환 및 남은 일수 계산 함수
const calculateDaysLeft = (termDateStr: string) => {
    // "2025-05-02~2025-05-30" 형식의 날짜에서 종료일 추출
    const endDate = termDateStr.split('~')[1];
    if (!endDate) return null;
    
    const date = parse(endDate.trim(), 'yyyy-MM-dd', new Date());
    if (!isValid(date)) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = differenceInDays(date, today);
    return daysLeft;
};

// 남은 기간 라벨 컴포넌트
const DaysLeftLabel: React.FC<{ daysLeft: number }> = ({ daysLeft }) => {
    let labelStyle = '';
    let text = '';

    if (daysLeft < 0) {
        return null; // 마감된 경우 라벨 표시 안함
    } else if (daysLeft === 0) {
        labelStyle = styles.todayLabel;
        text = '오늘마감';
    } else if (daysLeft < 10) {
        labelStyle = styles.urgentLabel;
        text = `D-${daysLeft}`;
    } else {
        labelStyle = styles.normalLabel;
        text = `D-${daysLeft}`;
    }

    return <span className={labelStyle}>{text}</span>;
};

// 날짜 표시 컴포넌트
const FormattedDate: React.FC<{ termDate: string }> = ({ termDate }) => {
    const daysLeft = calculateDaysLeft(termDate);
    const endDate = termDate.split('~')[1]?.trim() || termDate; // 종료일만 표시

    return (
        <div className={styles.dateContainer}>
            <span className={styles.endDate}>{endDate}</span>
            {daysLeft !== null && daysLeft >= 0 && <DaysLeftLabel daysLeft={daysLeft} />}
        </div>
    );
};

const DisabledJoboffers: React.FC = () => {
    const [data, setData] = useState<DisabledJoboffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/api/public/disabled/job-offers`);
            setData(response.data);
        } catch (err) {
            setError('데이터를 불러오는데 실패했습니다.');
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
            await axios.post(`${API_URL}/api/public/disabled/job-offers/refresh`);
            alert('데이터가 갱신되었습니다!');
            fetchData();
        } catch (err) {
            setError('데이터 갱신에 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 페이징 처리
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // 상세보기 토글
    const handleExpand = (idx: number) => {
        setExpandedIdx(expandedIdx === idx ? null : idx);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>장애인 구인 실시간 현황</h2>
            
            <div className={styles.buttonContainer}>
                <button
                    onClick={refreshData}
                    disabled={loading}
                    className={`${styles.button} ${styles.refreshButton}`}
                >
                    데이터 갱신
                </button>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className={`${styles.button} ${styles.loadButton}`}
                >
                    데이터 불러오기
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

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.listHeader}>
                            <th className={styles.listCell}>사업장명</th>
                            <th className={styles.listCell}>모집직종</th>
                            <th className={styles.listCell}>고용형태</th>
                            <th className={styles.listCell}>사업장 위치</th>
                            <th className={styles.listCell}>마감일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.map((item, idx) => {
                            const globalIdx = (page - 1) * PAGE_SIZE + idx;
                            return (
                                <React.Fragment key={globalIdx}>
                                    <tr className={styles.listRow} onClick={() => handleExpand(globalIdx)}>
                                        <td className={styles.listCell}>{splitTextWithParenthesis(item.busplaName)}</td>
                                        <td className={styles.listCell}>{splitTextWithParenthesis(item.jobNm)}</td>
                                        <td className={`${styles.listCell} ${styles.centerCell}`}>{splitTextWithParenthesis(item.empType)}</td>
                                        <td className={styles.listCell}>{splitTextWithParenthesis(item.compAddr)}</td>
                                        <td className={`${styles.listCell} ${styles.centerCell}`}>
                                            <FormattedDate termDate={item.termDate} />
                                        </td>
                                    </tr>
                                    {expandedIdx === globalIdx && (
                                        <tr>
                                            <td colSpan={5} className={styles.detail}>
                                                <div>
                                                    <div className={styles.detailGrid}>
                                                        <div className={styles.detailSection}>
                                                            <h3>기본 정보</h3>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>연락처:</span>
                                                                <span className={styles.detailValue}>{item.cntctNo || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>입사형태:</span>
                                                                <span className={styles.detailValue}>{item.enterType || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>구인신청일:</span>
                                                                <span className={styles.detailValue}>{item.offerregDt || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>등록일:</span>
                                                                <span className={styles.detailValue}>{item.regDt || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>담당기관:</span>
                                                                <span className={styles.detailValue}>{item.regagnName || '-'}</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.detailSection}>
                                                            <h3>근무 조건</h3>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>요구경력:</span>
                                                                <span className={styles.detailValue}>{item.reqCareer || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>요구학력:</span>
                                                                <span className={styles.detailValue}>{item.reqEduc || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>임금:</span>
                                                                <span className={styles.detailValue}>{item.salary || '-'}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailLabel}>임금형태:</span>
                                                                <span className={styles.detailValue}>{item.salaryType || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.detailSection}>
                                                        <h3>작업환경 정보</h3>
                                                        <div className={styles.pictogramRow}>
                                                            {pictogramDefs.map(p => {
                                                                const envValue = item[p.key as keyof DisabledJoboffer];
                                                                return (
                                                                    <div key={p.key} className={`${styles.pictogram} ${envValue ? styles.active : ''}`}>
                                                                        {p.icon}
                                                                        <span className={styles.pictogramLabel}>{p.label}</span>
                                                                        {envValue && (
                                                                            <span className={styles.tooltip}>
                                                                                {envValue}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* 페이징 */}
            <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={()=>setPage(page-1)} disabled={page===1}>이전</button>
                {Array.from({length: totalPages}, (_,i)=>(
                    <button key={i} className={`${styles.pageBtn} ${page===i+1?styles.active:''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
                ))}
                <button className={styles.pageBtn} onClick={()=>setPage(page+1)} disabled={page===totalPages}>다음</button>
            </div>
        </div>
    );
};

export default DisabledJoboffers; 