import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/user/UserMyPageMain.module.css";
import { useAuth } from "../../contexts/user/AuthProvider";
import { useUserMypage } from "../../contexts/user/UsermypageProvider";

const UserMyPageMain = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { name, userId } = useAuth();
    const { getApplications, applicationList, totalCount } = useUserMypage();

    const [bookmark, setBookmark] = useState(0);
    const [isVerified, setIsVerified] = useState(0);
    const [profileImg, setProfileImg] = useState('');
    const navigate = useNavigate();

    const getBookmarkcount = () => {
        if (!userId) return;
        axios.get(`${apiUrl}/api/mypage/bookmarkcount/${userId}`)
            .then((response) => {
                const { bookmarkcount, isVerified, userProfileImageUrl } = response.data.apiData;
                setBookmark(bookmarkcount ?? 0);
                setIsVerified(isVerified ?? 0);
                setProfileImg(userProfileImageUrl ?? '');
            })
            .catch((error) => {
                console.error("member정보가져오기 오류:", error);
                alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });
    };
    const closedApplications = applicationList.filter((item) => item.status === "closed");
    const activeApplications = applicationList.filter((item) => item.status !== "closed");

    useEffect(() => {
        getBookmarkcount();
        getApplications();
    }, [userId]);


    return (
        <div className={styles.container}>
            <div className={styles.topBox}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileFlexBox}>
                        <div className={styles.profileImgBox}>
                            <img src={profileImg || "/default-profile.png"} alt="프로필" />
                        </div>
                        <div className={styles.profileTextBox}>
                            <div className={styles.name}>{name}</div>
                            {isVerified === 1 ? (
                                <div className={styles.stateYes}>장애인 인증완료</div>
                            ) : (
                                <div className={styles.stateNo}>장애인 인증안됨</div>
                            )}
                        </div>
                    </div>
                    <div className={styles.profileItemBox}>
                        <div className={styles.profileItem}>
                            <ul>
                                <li>관심기업</li>
                                <li><span>{bookmark}</span>건</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.numberBox}>
                    <div className={styles.numberTitleBox}>
                        <h3>입사지원 현황</h3>
                    </div>
                    <div className={styles.numberTextBox}>
                        <div className={`${styles.number} ${styles.numberLine}`}>
                            <p className={styles.count}>{activeApplications.length}</p>
                            <p className={styles.numberName}>지원완료</p>
                        </div>
                        <div className={styles.number}>
                            <p className={styles.count}>{closedApplications.length}</p>
                            <p className={styles.numberName}>마감된 공고</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.listBox}>
                <h3>최근 지원현황</h3>
                {Array.isArray(applicationList) && applicationList.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>공고명</th>
                            <th>기업명</th>
                            <th>지원일</th>
                            <th>유형</th>
                            <th> </th>
                        </tr>
                        </thead>
                        <tbody>
                        {applicationList.map((item, index) => (
                            <tr key={index} className={item.status === "closed" ? styles.closedRow : ''}>
                                <td>{item.title || '-'}</td>
                                <td>{item.companyName || '-'}</td>
                                <td>{item.appliedAt || '-'}</td>
                                <td>
                                    {item.jobType || '-'}{" "}
                                    {item.status === "closed" && <span className={styles.closedBadge}>[마감]</span>}
                                </td>
                                <td className={styles.listBtn}>
                                    <button onClick={() => navigate(`/company/job/management/detail/${item.jobId}`)}>
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                ) : (
                    <p className={styles.applicationListNone}>- 지원내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default UserMyPageMain;
