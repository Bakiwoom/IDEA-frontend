import React from "react";

import styles from "../../assets/css/user/UserMyPageMain.module.css";

const UserMyPageMain = () =>{
    return(
        <>
        <div className={styles.container}>
            <div className={styles.topBox}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileFlexBox}>
                        <div className={styles.profileImgBox}>
                            <img></img>
                        </div>
                        <div className={styles.profileTextBox}>
                            <div className={styles.name}>진소영</div>
                            <div className={styles.state}>장애인 인증완료</div>
                        </div>
                    </div>
                    <div className={styles.profileItemBox}>
                        <div className={styles.profileItem}>
                            <ul>
                                <li>관심기업</li>
                                <li><span>1</span>건</li>
                            </ul>
                        </div>
                        <div className={styles.profileItem}>
                            <ul>
                                <li>관심기업2</li>
                                <li><span>0</span>건</li>
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
                            <p className={styles.count}>0</p>
                            <p className={styles.numberName}>지원완료</p>
                        </div>
                        <div className={styles.number}>
                            <p className={styles.count}>0</p>
                            <p className={styles.numberName}>지원취소</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.listBox}>
                <h3>최근 지원현황</h3>
                <table>
                    <thead>
                        <tr>
                            <th>공고명</th>
                            <th>기업명</th>
                            <th>지원일</th>
                            <th>상태</th>
                            <th>상세</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>백엔드 개발자 채용</td>
                            <td>함께일해요(주)</td>
                            <td>2025-04-15</td>
                            <td>서류접수중</td>
                            <td><button>상세보기</button></td>
                        </tr>
                        <tr>
                            <td>백엔드 개발자 채용</td>
                            <td>함께일해요(주)</td>
                            <td>2025-04-15</td>
                            <td>서류접수중</td>
                            <td><button>상세보기</button></td>
                        </tr>
                        <tr>
                            <td>백엔드 개발자 채용</td>
                            <td>함께일해요(주)</td>
                            <td>2025-04-15</td>
                            <td>서류접수중</td>
                            <td><button>상세보기</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}
export default UserMyPageMain;