import React, { useState } from "react";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from '../../assets/css/user/LoginPage.module.css';
import kakaoIcon from "../../assets/images/kakao.png";
import googleIcon from "../../assets/images/google.svg";
import naverIcon from "../../assets/images/naver.svg";

import {SIGNUP_PAGE} from '../../routes/contantsRoutes';

const LoginPage = () => {

    const [selectTab, setSelectTab] = useState("user");
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    // tab (userType)
    const handleClick = (tab)=>{
        setSelectTab(tab);
    };


    return(
        <>
            <form>
                <div className={styles.loginPageCotainer}>
                    <div className={styles.loginBox}>
                        <div className={styles.tabsBox}>
                            <ul>
                                <li className={selectTab === 'user' ? styles.activeTab : ''} onClick={()=>handleClick('user')}>개인회원</li>
                                <li className={selectTab === 'vendor' ? styles.activeTab : ''} onClick={()=>handleClick('vendor')}>기업회원</li>
                            </ul>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="text" name="id" placeholder="아이디를 입력해주세요" value={id} onChange={(e)=>setId(e.target.value)} ></input>
                            <input type="text" name="pw" placeholder="비밀번호를 입력해주세요" value={pw} onChange={(e)=>setPw(e.target.value)}></input>
                        </div>
                        <div className={styles.formBtnBox}>
                            <button className={styles.formBtn}>로그인</button>
                        </div>
                        <div className={styles.socialChoose}>
                            <div className={styles.socialText}>소셜 계정으로 간편 로그인</div>
                        </div>
                        <div className={styles.socialIconBox}>
                            <div className={styles.socialIconCircle}>
                            <img src={kakaoIcon} />
                            </div>
                            <div className={styles.socialIconCircle}>
                            <img src={googleIcon} />
                            </div>
                            <div className={styles.socialIconCircle}>
                            <img src={naverIcon} />
                            </div>
                        </div>
                        <div className={styles.loginPageBox}>
                            <Link to={SIGNUP_PAGE} ><span>계정이 없으신가요?</span><span className={styles.underLine}>회원가입 하러가기</span></Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
export default LoginPage;