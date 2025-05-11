import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/css/user/UserApplications.module.css';
import { useUserMypage } from "../../contexts/user/UsermypageProvider";

const UserApplications = () => {
    const { applicationList, getApplications } = useUserMypage();
    const navigate = useNavigate();

    useEffect(() => {
        if (!applicationList || applicationList.length === 0) {
            getApplications();
        }
    }, []);

    return (
        <div className={styles.container}>
            <p className={styles.title}>지원내역</p>
            <p className={styles.intro}>회원님의 지원내역을 확인할 수 있습니다.</p>
            <div className={styles.inputContainer}>
                <table>
                    <thead>
                    <tr>
                        <th style={{ width: "13%" }}>공고명</th>
                        <th style={{ width: "9%" }}>기업명</th>
                        <th style={{ width: "7%" }}>지원일</th>
                        <th style={{ width: "20%" }}>AI분석 혜택</th>
                        <th style={{ width: "6%" }}>유형</th>
                        <th style={{ width: "4%" }}>상세</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applicationList && applicationList.length > 0 ? (
                        applicationList.map((item, index) => (
                            <tr key={index} className={styles.trTd}>
                                <td className={styles.text}>{item.title || item.jobTitle || '-'}</td>
                                <td className={styles.text}>{item.companyName || '-'}</td>
                                <td className={styles.text}>{item.appliedAt || '-'}</td>
                                <td className={styles.aiContents}>
                                    <div>
                                        <p className={styles.BenefitTitle}>내 혜택:</p>
                                        <li>혜택1</li>
                                        <li>혜택2</li>
                                        <p className={styles.BenefitTitle}>기업 혜택:</p>
                                        <li>혜택1</li>
                                        <li>혜택2</li>
                                    </div>
                                </td>
                                <td className={styles.text}>{item.jobType || '-'}</td>
                                <td>
                                    <button
                                        className={styles.applicationListBtn}
                                        onClick={() => navigate(`/company/job/management/detail/${item.jobId}`)}
                                    >
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className={styles.text}>
                                지원 내역이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserApplications;
