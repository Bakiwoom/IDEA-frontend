import React, { useState } from "react";
import { useEffect } from "react";

import styles from "../../assets/css/user/UserEdit.module.css";


const UserEditPage = () => {

    const [birth, setBirth] = useState({
        year: "",
        month: "",
        day: ""
    })

    const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleBirthChange = (e) =>{
        const {name, value} = e.target;
        setBirth((prev) =>({
            ...prev,
            [name]: value,
        }))
    }
    console.log(birth)

    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>회원정보수정</p>
                <p className={styles.intro}>회원님의 정보를 수정.확인하실 수 있습니다.</p>
                <div className={styles.inputContainer}>
                    <table>
                        <tr>
                            <th>아이디</th>
                            <td>
                                <input
                                    type="text"
                                    value=""
                                    onChange="" />
                            </td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input
                                    type="text"
                                    
                                     />
                            </td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td className={styles.birthSelectBar}>
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
                            <th>휴대폰번호</th>
                            <td>
                                <input
                                    type="text"
                                    value=""
                                    onChange="" />
                            </td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>
                                <input
                                    type="text"
                                    value=""
                                    onChange="" />
                            </td>
                        </tr>
                        <tr>
                            <th>장애여부</th>
                            <td>
                                <span>인증완료</span>
                            </td>
                        </tr>
                    </table>
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