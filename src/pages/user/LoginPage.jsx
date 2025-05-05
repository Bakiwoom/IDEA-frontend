import React, { useState } from "react";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from '../../assets/css/user/LoginPage.module.css';
import kakaoIcon from "../../assets/images/kakao.png";
import googleIcon from "../../assets/images/google.svg";
import naverIcon from "../../assets/images/naver.svg";

import {SIGNUP_PAGE} from '../../routes/contantsRoutes';
const apiUrl = process.env.REACT_APP_API_URL;

const LoginPage = () => {

    const navigate = useNavigate();

    const [selectTab, setSelectTab] = useState("user");
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    // tab (userType)
    const handleClick = (tab)=>{
        setSelectTab(tab);
    };

    //로그인
    const handleLogin = (e) => {
        e.preventDefault();

        const loginVo = {
            id: id,
            pw: pw
        }

        axios({
            method: "post",
            url: `${apiUrl}/api/login`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            data: loginVo,
            responseType: "json",
            
          })
            .then((response) => {
              console.log(response);

              if(response.data.result === 'success'){
                const token = response.headers['authorization']?.split(" ")[1];

                localStorage.setItem('token', token);
                localStorage.setItem('authUser', JSON.stringify({memberId: response.data.apiData.memberId}));

                navigate('/');
              }else{
                alert('아이디,비밀번호를 다시 확인해주세요.');
              }
      
            })
            .catch((error) => {
              console.error("로그인 오류:", error);
              alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });
    }


    return(
        <>
            <form onSubmit={handleLogin}>
                <div className={styles.loginPageCotainer}>
                    <div className={styles.loginBox}>
                        <div className={styles.tabsBox}>
                            <ul>
                                <li className={selectTab === 'user' ? styles.activeTab : ''} onClick={()=>handleClick('user')}>개인회원</li>
                                <li className={selectTab === 'company' ? styles.activeTab : ''} onClick={()=>handleClick('company')}>기업회원</li>
                            </ul>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="text" name="id" placeholder="아이디를 입력해주세요" value={id} onChange={(e)=>setId(e.target.value)} ></input>
                            <input type="password" name="pw" placeholder="비밀번호를 입력해주세요" value={pw} onChange={(e)=>setPw(e.target.value)}></input>
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