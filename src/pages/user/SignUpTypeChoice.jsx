import { Route } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "../../assets/css/user/SignUpTypeChoice.module.css";
import kakaoIcon from "../../assets/images/kakao.png";
import googleIcon from "../../assets/images/google.svg";
import naverIcon from "../../assets/images/naver.svg";

import { USER_SIGNUP_PAGE,VENDOR_SIGNUP_PAGE, LOGIN_PAGE } from "../../routes/contantsRoutes";


const SignUpTypeChoice = () => {

  const [selectTab, setSelectTab] = useState("user");

  const handleTabClick = (tab) =>{
    setSelectTab(tab);
  }


    return (
      <>
        <div className={styles.container}>
            <div className={styles.signUpContainer}>
                <div className={styles.signUpBox}>
                  <div className={styles.tabs}>
                      <ul>
                        <li className={selectTab === "user" ? styles.activeTab : ""} onClick={()=>handleTabClick("user")}>개인회원</li>
                        <li className={selectTab === "vendor" ? styles.activeTab : ""} onClick={()=>handleTabClick("vendor")}>기업회원</li>
                      </ul>
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
                  <div className={styles.signUpButtonBox}>
                    <button type="button">
                      <Link to={selectTab === "user" ? USER_SIGNUP_PAGE
                                : selectTab === "vendor" ? VENDOR_SIGNUP_PAGE
                                : USER_SIGNUP_PAGE}> 회원가입 하러가기</Link>
                    </button>
                  </div>
                  <div className={styles.loginPageBox}>
                    <Link to={LOGIN_PAGE}><span>이미 계정이 있나요?</span><span className={styles.underLine}>로그인</span></Link>
                  </div>
                </div>
            </div>
            <div className={styles.imgContainer}>
                img
            </div>
            
        </div>
      </>
    );
  };
  
  export default SignUpTypeChoice;