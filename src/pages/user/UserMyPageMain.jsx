import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

import styles from "../../assets/css/user/UserMyPageMain.module.css";

import {useAuth} from "../../contexts/user/AuthProvider";

const UserMyPageMain = () =>{
    const apiUrl = process.env.REACT_APP_API_URL;
    const {name, userId} = useAuth();

    const [bookmark, setBookmark] = useState(0);
    const [isVerified, setIsVerified] = useState(0);
    const [profileImg, setProfileImg] = useState('');


     //북마크 갯수 가져오기
    const getBookmarkcount = ()=>{

        axios({
            method: "get",
            url: `${apiUrl}/api/mypage/bookmarkcount/${userId}`, 
            responseType: "json",
            
          }).then((response) => {
                setBookmark(response.data.apiData.bookmarkcount);
                setIsVerified(response.data.apiData.isVerified);
                setProfileImg(response.data.apiData.userProfileImageUrl);
                
            }).catch((error) => {
                console.error("member정보가져오기 오류:", error);
                alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });
    };

    useEffect(()=>{
        getBookmarkcount();
    },[])


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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>백엔드 개발자 채용</td>
                            <td>(주)함께일해요</td>
                            <td>2025-04-15</td>
                            <td>지원완료</td>
                            <td className={styles.listBtn}><button>상세보기</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}
export default UserMyPageMain;