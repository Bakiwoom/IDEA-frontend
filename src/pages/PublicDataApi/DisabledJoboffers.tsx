import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DisabledJoboffers.module.css';

const API_URL = process.env.REACT_APP_API_URL;

interface DisabledJoboffer {
    busplaName: string;
    cntctNo: string;
    compAddr: string;
    empType: string;
    enterType: string;
    jobNm: string;
    offerregDt: string;
    regDt: string;
    regagnName: string;
    reqCareer: string;
    reqEduc: string;
    rno: string;
    rnum: string;
    salary: string;
    salaryType: string;
    termDate: string;
    envBothHands: string;
    envEyesight: string;
    envHandwork: string;
    envLiftPower: string;
    envLstnTalk: string;
    envStndWalk: string;
}

// 픽토그램 정보 정의
const pictogramDefs = [
    { key: 'envBothHands', label: '양손 사용', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 12l-2 4m0 0l-2-4m2 4v4m10-8l2 4m0 0l2-4m-2 4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2"/></svg>
    ) },
    { key: 'envEyesight', label: '시력', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
    ) },
    { key: 'envHandwork', label: '손작업', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="7" y="11" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 11V7a3 3 0 1 1 6 0v4" stroke="currentColor" strokeWidth="2"/></svg>
    ) },
    { key: 'envLiftPower', label: '들어올림', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M12 8V4m0 0l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="2"/></svg>
    ) },
    { key: 'envLstnTalk', label: '청취/대화', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="2"/><path d="M12 13v3m0 0l-2-2m2 2l2-2" stroke="currentColor" strokeWidth="2"/></svg>
    ) },
    { key: 'envStndWalk', label: '서기/걷기', icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l-2 4m2-4l2 4" stroke="currentColor" strokeWidth="2"/></svg>
    ) },
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
                            <th className={styles.listCell}>모집기간</th>
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
                                        <td className={`${styles.listCell} ${styles.centerCell}`}>{splitTextWithParenthesis(item.termDate)}</td>
                                    </tr>
                                    {expandedIdx === globalIdx && (
                                        <tr>
                                            <td colSpan={5} className={styles.detail}>
                                                <div style={{display:'flex', flexWrap:'wrap', gap:'2rem'}}>
                                                    <div style={{minWidth:'220px', flex:'1'}}>
                                                        <div><b>연락처:</b> {item.cntctNo || '-'}</div>
                                                        <div><b>입사형태:</b> {item.enterType || '-'}</div>
                                                        <div><b>구인신청일:</b> {item.offerregDt || '-'}</div>
                                                        <div><b>등록일:</b> {item.regDt || '-'}</div>
                                                        <div><b>담당기관:</b> {item.regagnName || '-'}</div>
                                                        <div><b>요구경력:</b> {item.reqCareer || '-'}</div>
                                                        <div><b>요구학력:</b> {item.reqEduc || '-'}</div>
                                                        <div><b>임금:</b> {item.salary || '-'}</div>
                                                        <div><b>임금형태:</b> {item.salaryType || '-'}</div>
                                                    </div>
                                                    <div style={{minWidth:'220px', flex:'1'}}>
                                                        <div className={styles.pictogramRow}>
                                                            {pictogramDefs.map(p => (
                                                                <div key={p.key} className={`${styles.pictogram} ${item[p.key as keyof DisabledJoboffer] ? styles.active : ''}`} style={{position:'relative'}}>
                                                                    {p.icon}
                                                                    <span className={styles.pictogramLabel}>{p.label}</span>
                                                                    <span className={styles.tooltip}>{item[p.key as keyof DisabledJoboffer] || '해당 없음'}</span>
                                                                </div>
                                                            ))}
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