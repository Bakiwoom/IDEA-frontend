import axios from "axios";
import { Route } from "react-router-dom";
import React, { useEffect } from "react";

import styles from '../../assets/css/user/UserApplications.module.css';
import {useUserMypage} from "../../contexts/user/UsermypageProvider";

const UserApplications = () => {

    const {applicationList} = useUserMypage();

    useEffect(()=>{
        console.log(applicationList);
    },[])

    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>지원내역</p>
                <p className={styles.intro}>회원님의 지원내역을 확인할수있습니다.</p>
                <div className={styles.inputContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{width: "13%"}}>공고명</th>
                                <th style={{width: "9%"}}>기업명</th>
                                <th style={{width: "7%"}}>지원일</th>
                                <th style={{width: "20%"}}>AI분석 혜택</th>
                                <th style={{width: "6%"}}>유형</th>
                                <th style={{width: "4%"}}>상세</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 현성오빠 추가부분 */}
                            {/* {applicationList && applicationList.length > 0 ? (<></>):(<></>)} */}
                            <tr className={styles.trTd}>
                                <td className={styles.text}>{applicationList.title}</td>
                                <td className={styles.text}>{applicationList.companyName}</td>
                                <td className={styles.text}>{applicationList.createAt}</td>
                                <td className={styles.aiContents}>
                                    <div>
                                        <p className={styles.BenefitTitle}>내 혜택:</p>
                                        <li>혜택1</li>
                                        <li>혜택2</li>
                                        <p className={styles.BenefitTitle }>기업 혜택:</p>
                                        <li>혜택1</li>
                                        <li>혜택2dddddddddddddddddddddddddddddddddddddddd</li>
                                    </div>
                                </td>
                                <td className={styles.text}>{applicationList.jobType}</td>
                                <td><button className={styles.applicationListBtn}>상세보기</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )

}
export default UserApplications;