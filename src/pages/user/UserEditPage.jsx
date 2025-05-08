import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {useAuth} from "../../contexts/user/AuthProvider";

import styles from "../../assets/css/user/UserEdit.module.css";


const UserEditPage = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const {userId} = useAuth();

    //수정내역 필드
    const editfields = [
         {name:'profileImg', label:'프로필 이미지', type:'file'}
        ,{name:'id', label:'아이디', type:'text'}
        ,{name:'name', label:'이름', type:'text'}
        ,{name:'ph', label:'휴대폰번호', type:'text'}
        ,{name:'email', label:'이메일', type:'text'}
        ,{name:'isVerified', label:'장애여부', type:'text'}
    ]

    const [birth, setBirth] = useState({
        year: "",
        month: "",
        day: ""
    })

    //회원정보
    const [userVo, setUserVo] = useState({
        profileImg: null,
        id: "",
        name:"",
        ph: "",
        email: "",
        isVerified: "",
    })

    //1.가져오기
    const getUserEdit = ()=>{
        axios({
            method: "get",
            url: `${apiUrl}/api/mypage/getEditUser/${userId}`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: "json",
            
          })
            .then((response) => {
                console.log(response)
                if(response.data.result === 'success'){
                    setUserVo({
                        profileImg: response.data.apiData.userProfileImageUrl,
                        id: response.data.apiData.id,
                        name: response.data.apiData.userName,
                        ph: response.data.apiData.phoneNumber,
                        email: response.data.apiData.email,
                        isVerified: response.data.apiData.isVerified
                    })
                }else{
                    console.log("수정할회원정보 가져오기 실패")
                }

            })
            .catch((error) => {
              console.error("처음 유저정보 가져오기 실패:", error);
              alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });  
    };



    //생년월일
    const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleBirthChange = (e) =>{
        const {name, value} = e.target;
        setBirth((prev) =>({
            ...prev,
            [name]: value,
        }))
    };

    useEffect(()=>{
        getUserEdit();
    },[])

    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>회원정보수정</p>
                <p className={styles.intro}>회원님의 정보를 수정.확인하실 수 있습니다.</p>
                <div className={styles.inputContainer}>
                    <form>
                        <table>
                            <tr>
                                <th className={styles.profileThTd}>프로필 이미지</th>
                                <td className={styles.profileThTd}>
                                    <>
                                        <div className={styles.profilebox}>
                                            {userVo.profileImg === null ? (
                                                <>
                                                    <div htmlFor="profileImg" className={styles.imgBox}>
                                                        이미지 없음
                                                    </div>
                                                    <label htmlFor="profileImg" className={styles.imgbtn}>
                                                        +추가하기
                                                    </label>
                                                </>
                                            ) : (
                                                <>
                                                    <div htmlFor="profileImg" className={styles.imgBox}>
                                                        <img src={userVo.profileImg} alt="프로필 이미지"></img>
                                                    </div>
                                                    <label htmlFor="profileImg" className={styles.imgbtn}>
                                                        +변경하기
                                                    </label>
                                                </>
                                            )}
                                            <input
                                                className={styles.imginput}
                                                type="file"
                                                name='profileImg'
                                                id="profileImg"
                                            />
                                        </div>
                                        
                                    </>
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>아이디</th>
                                <td className={styles.thTd}>
                                    <input
                                        className={styles.txtinput}
                                        type="text"
                                        value={userVo.id}
                                        onChange="" />
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>이름</th>
                                <td className={styles.thTd}>{userVo.name}</td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>생년월일</th>
                                <td className={`${styles.birthSelectBar} ${styles.thTd}`}>
                                    <select name="year" value={birth.year} onChange={handleBirthChange}>
                                        <option value="">년</option>
                                        {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    <select name="month" value={birth.month} onChange={handleBirthChange}>
                                        <option value="">월</option>
                                        {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select name="day" value={birth.day} onChange={handleBirthChange}>
                                        <option value="">일</option>
                                        {days.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>휴대폰번호</th>
                                <td className={styles.thTd}>
                                    <input
                                        className={styles.txtinput}
                                        type="text"
                                        value={userVo.ph}
                                        onChange="" />
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>이메일</th>
                                <td className={styles.thTd}>
                                    <input
                                        className={styles.txtinput}
                                        type="text"
                                        value={userVo.email}
                                        onChange="" />
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>장애여부</th>
                                <td className={styles.thTd}>
                                    {userVo.isVerified === 1 ? (
                                        <span className={styles.isverifiedOk}>인증완료</span>
                                    ) : (
                                        <span className={styles.isverifiedNo}>인증안됨</span>
                                    )}
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div className={styles.buttonBox}>
                    <button className={styles.fixbtn}>수정하기</button>
                    <button className={styles.cancelbtn}>취소</button>
                </div>

            </div>
        </>
    )

}
export default UserEditPage;