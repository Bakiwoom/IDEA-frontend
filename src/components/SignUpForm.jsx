import React, { useState } from "react";
import { useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "axios";

import styles from "../assets/css/user/SignUpForm.module.css";

const apiUrl = process.env.REACT_APP_API_URL;

const SignUpForm = ({userType,fields,onSubmit}) =>{
    
    // 약관 동의사항 항목
    const userCheckboxItems = [
        {name:'allAgree', label:'전체 동의'}
       ,{name:'agreeTerms', label:'(필수) 이용약관 동의'}
       ,{name:'agreePrivacy', label:'(필수) 개인정보 수집 및 이용 동의'}
    ]
   const companyCheckboxItems = [
       {name:'allAgree', label:'전체 동의'}
      ,{name:'agreeTerms', label:'(필수) 이용약관 동의'}
      ,{name:'agreePrivacy', label:'(필수) 개인정보 수집 및 이용 동의'}
      ,{name:'agreeVendorInfo', label:'(필수) 업체 정보 제공 동의'}
    ]

    const checkBoxItems = userType === 'user' ? userCheckboxItems : companyCheckboxItems;
    const [formData, setFormData] = useState({});

    const [idCheck, setIdCheck] = useState('');
    
    useEffect(()=>{
        
    },[]);


    const handleChange = (e)=>{
        const {name,value,files} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name] : files ? files[0] : value 
        }))
    };

    //id 중복체크
    const handleIdCheck = async ()=>{
        const id = formData.id;
        console.log(id)
        if(!id || id.trim() === ''){
            alert("ID를 입력해주세요.")
            return;
        }

        try {
            const response = await axios({
              method: "get",
              url: `${apiUrl}/api/checkId`,
              params: { id: id },
              responseType: "json"
            });
        
            if (response.data.result === "success") {
              setIdCheck({message: "인증완료", type: "success"});
            } else {
              setIdCheck({message: "사용 불가능한 아이디 입니다.", type:"fail"});
            }
        
          } catch (error) {
            console.error("아이디 중복 확인 중 오류:", error);
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
    };

    //id체크여부 글씨class명주기
    const idCheckClass = () =>{
        switch(idCheck.type){
            case 'success' : return styles.successIdCheck;
            case 'fail' : return styles.failIdCheck;
        }
    };

    //이용약관 체크
    const handleChecked = (e)=>{
        const {name, checked} = e.target;

        // 전체동의
        if(name === 'allAgree'){
            const newChecked = ({});

            checkBoxItems.forEach((item)=>{
                newChecked[item.name] = checked;
            });

            //formData에 체크상태 넣기
            setFormData((prev) =>({
                ...prev,
                ...newChecked,
            }));

        }else{
            // 개별항목체크
            setFormData((prev)=>{
                const updateFormData = {
                    ...prev,
                    [name] : checked,
                };

                 const allAgreeChecked = checkBoxItems
                    .filter((item) => item.name !== 'allAgree')
                    .every((item) => updateFormData[item.name] === true);

                    updateFormData['allAgree'] = allAgreeChecked;
                    
                    return updateFormData;
            });
        };

    };

    //받은값들 부모컴포넌트로 보내기위해 값들 묶기
    const handleFormSubmit = (e) =>{
        e.preventDefault();

        if(!idCheck){
            alert("ID 중복체크를 해주세요.")
            return;
        }else if(idCheck.type === 'fail'){
            alert("아이디를 확인해주세요.")
        }

        //빈값 체크
        for (let field of fields){
            const value = formData[field.name];

            //사진파일:null, 입력값:빈문자열 체크
            const isEmpty = field.type === 'file' ? !value : !value || value.trim() === '';

            if (isEmpty && field.name !== 'disabilityType' && field.name !== 'obstacle') {
                alert(`${field.label}을(를) 입력해주세요.`);
                return;
            }
        }

        //체크박스 빈값 확인
        const requiredCheckboxes = checkBoxItems.filter(item => item.name !== 'allAgree');

        for (let checkbox of requiredCheckboxes) {
            if (!formData[checkbox.name]) {
                alert('필수이용약관에 동의해주세요.');
                return;
            }
        }

        const data = new FormData();
        for(let key in formData){
            data.append(key,formData[key]);
        }

        onSubmit(data, userType);
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.fieldsContainer}>
                    {userType === 'user' ? (
                        <h2>개인 회원가입</h2>
                    ) : (
                        <h2>기업 회원가입</h2>
                    )}
                    <form onSubmit={handleFormSubmit}>
                        {Array.isArray(fields) && fields.length > 0 ? (
                            fields.map((field) => (
                                <div className={styles.inputBox} key={field.name}>
                                    <label>{field.name !== 'obstacle' && field.name !== 'disabilityType' ? (
                                        <>
                                            {field.label}
                                            <span className={styles.required}>*</span>
                                        </>
                                        ) : (
                                            field.label
                                        )}
                                    </label>

                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            <option value="" disabled> 장애 유형을 선택해주세요 </option>
                                            {field.options.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.name === 'id' || field.name === 'ph' ? (
                                        <div className={styles.inputWithButtonBox}>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ''}
                                                className={field.type === 'file' ? styles.fileInput : styles.input}
                                                onChange={handleChange}
                                            />
                                            <button type="button" className={styles.checkBtn} onClick={field.name === 'id' ? handleIdCheck : undefined}>
                                                {field.name === 'id' ? '중복체크' : '인증요청'}
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field.type === 'file' ? undefined : formData[field.name] || ''}
                                            className={field.type === 'file' ? styles.fileInput : styles.input}
                                            onChange={handleChange}
                                        />
                                    )}
                                    {field.name === 'id' && idCheck.message && (
                                        <p className={idCheckClass()}>{idCheck.message}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>입력 필드가 없습니다.</p>
                        )}
                        
                        <div className={styles.checkBoxContainer}>
                            <div className={styles.checkboxTitle}>약관</div>
                            <div className={styles.checkboxLine}>
                                {checkBoxItems.map((item)=>{
                                    return(
                                        <div className={styles.checkboxItem}>
                                            <input type="checkbox" name={item.name} checked={formData[item.name] || false} onChange={handleChecked}  />
                                            {item.name === 'allAgree' ? (<strong>{item.label}</strong>) : (item.label)} 
                                        </div>
                                    )
                                })}
                                
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn}>회원가입 완료</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default SignUpForm;