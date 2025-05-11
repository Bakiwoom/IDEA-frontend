import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {useAuth} from "../../contexts/user/AuthProvider";
import { USER_MYPAGE_MAIN } from "../../routes/contantsRoutes"
import styles from "../../assets/css/user/UserEdit.module.css";
import {useNavigate } from "react-router-dom";


const UserEditPage = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const {userId, memberId} = useAuth();

    const [birth, setBirth] = useState({
        year: "",
        month: "",
        day: ""
    })

    //회원정보
    const [userVo, setUserVo] = useState({
        profileImg: null,
        previewURL:null,
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
                if(response.data.result === 'success'){
                    setUserVo({
                        profileImg: response.data.apiData.userProfileImageUrl,
                        previewURL: null,
                        id: response.data.apiData.id,
                        name: response.data.apiData.userName,
                        ph: response.data.apiData.phoneNumber,
                        email: response.data.apiData.email,
                        isVerified: response.data.apiData.isVerified
                    })

                    const birthDateStr = response.data.apiData.birthDate;
                    if (birthDateStr && birthDateStr.split('-').length === 3) {
                        const [year, month, day] = birthDateStr.split('-');
                    
                        setBirth({
                            year: year,
                            month: month,
                            day: day
                        });
                    }

                }else{
                    console.log("수정할회원정보 가져오기 실패")
                }

            })
            .catch((error) => {
              console.error("처음 유저정보 가져오기 실패:", error);
              alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });  
    };

    //수정할정보 모으기
    const handleUserChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        const files = e.target.files;

        if(files && files.length > 0){
            const file = files[0]
            const previewURL = URL.createObjectURL(file);

            setUserVo((prev)=>({
                ...prev,
                previewURL: previewURL,
                profileImg:file,
            }));
        }else{
            setUserVo((prev)=>({...prev, [name]:value}));
        }

    }
    const handleEditSubmit = (e)=>{
        e.preventDefault();

        const formData = new FormData();
        const fullBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;

        formData.append('memberId',memberId);
        formData.append('userProfile',userVo.profileImg);
        formData.append('id', userVo.id);
        formData.append('userName', userVo.name);
        formData.append('birthDate', fullBirth);
        formData.append('phoneNumber', userVo.ph);
        formData.append('email', userVo.email);

        axios({
            method: "post",
            url: `${apiUrl}/api/mypage/postEditUser`,
            data: formData,
            responseType: "json",
            
          })
            .then((response) => {
                if(response.data.result === 'success'){
                    alert("회원정보수정이 완료되었습니다.");
                    navigate(USER_MYPAGE_MAIN);
                }else{
                    alert('회원정보수정 실패');
                }
            })
            .catch((error) => {
              console.error("수정할 회원정보 보내기 실패:", error);
              alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            }); 
    }

    //취소버튼
    const handleBack = ()=>{
        alert('변경된 내용은 저장되지 않습니다.');
        navigate(USER_MYPAGE_MAIN);
    }


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
                    <form onSubmit={handleEditSubmit}>
                        <table>
                            <tr>
                                <th className={styles.profileThTd}>프로필 이미지</th>
                                <td className={styles.profileThTd}>
                                    <>
                                        <div className={styles.profilebox}>
                                            {userVo.profileImg === null && userVo.previewURL === null ? (
                                                <>
                                                    <div htmlFor="profileImg" className={styles.imgBox}>
                                                        이미지 없음
                                                    </div>
                                                    <label htmlFor="profileImg" className={styles.imgbtn}>
                                                        +추가하기
                                                    </label>
                                                </>
                                            ) : userVo.previewURL ? (
                                                <>
                                                    <div htmlFor="profileImg" className={styles.imgBox}>
                                                        <img src={userVo.previewURL} alt="프로필 이미지"></img>
                                                    </div>
                                                    <label htmlFor="profileImg" className={styles.imgbtn}>
                                                        +변경하기
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
                                                onChange={handleUserChange}
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
                                        onChange={handleUserChange}
                                        className={styles.txtinput}
                                        type="text"
                                        name="id"
                                        value={userVo.id}
                                    />
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
                                        <option key={y} value={String(y)}>{y}</option>
                                        ))}
                                    </select>
                                    <select name="month" value={birth.month} onChange={handleBirthChange}>
                                        <option value="">월</option>
                                        {months.map((m) => (
                                        <option key={m} value={String(m).padStart(2, '0')}>{m}</option>
                                        ))}
                                    </select>
                                    <select name="day" value={birth.day} onChange={handleBirthChange}>
                                        <option value="">일</option>
                                        {days.map((d) => (
                                        <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>휴대폰번호</th>
                                <td className={styles.thTd}>
                                    <input
                                        className={styles.txtinput}
                                        onChange={handleUserChange}
                                        name="ph"
                                        type="text"
                                        value={userVo.ph}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={styles.thTd}>이메일</th>
                                <td className={styles.thTd}>
                                    <input
                                        className={styles.txtinput}
                                        onChange={handleUserChange}
                                        name="email"
                                        type="text"
                                        value={userVo.email}
                                    />
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
                        <div className={styles.buttonBox}>
                            <button type="submit" className={styles.fixbtn}>수정하기</button>
                            <button onClick={handleBack} type="button" className={styles.cancelbtn}>취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}
export default UserEditPage;