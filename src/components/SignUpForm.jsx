import React, { useState } from "react";
import { useEffect } from "react";
import { Route } from "react-router-dom";

import styles from "../assets/css/user/SignUpForm.module.css";

const SignUpForm = ({userType,fields,onSubmit}) =>{

    // 약관 동의사항 항목
    const userCheckboxItems = [
        {name:'allAgree', label:'전체 동의'}
       ,{name:'agreeTerms', label:'(필수) 이용약관 동의'}
       ,{name:'agreePrivacy', label:'(필수) 개인정보 수집 및 이용 동의'}
    ]
   const vendorCheckboxItems = [
       {name:'allAgree', label:'전체 동의'}
      ,{name:'agreeTerms', label:'(필수) 이용약관 동의'}
      ,{name:'agreePrivacy', label:'(필수) 개인정보 수집 및 이용 동의'}
      ,{name:'agreeVendorInfo', label:'(필수) 업체 정보 제공 동의'}
    ]

    const checkBoxItems = userType === 'user' ? userCheckboxItems : vendorCheckboxItems;
    const [formData, setFormData] = useState({});
    
    useEffect(()=>{
        console.log(fields);
        console.log(userType);
    },[]);


    const handleChange = (e)=>{
        const {name,value,files} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name] : files ? files[0] : value 
        }))
    };
    const handleChecked = (e)=>{
        const {name, checked} = e.target;

        // 전체동의
        if(name === 'allAgree'){
            const newChecked = ({});

            checkBoxItems.forEach((item)=>{
                newChecked[item.name] = checked;
            });

            //formData에 체크상태 넣기
            setFormData(newChecked);

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

        const data = new FormData();
        for(let key in formData){
            data.append(key,formData[key]);
        }
        onSubmit(data);
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
                                    <label>{field.name !== 'obstacle' ? (
                                        <>
                                            {field.label}
                                            <span className={styles.required}>*</span>
                                        </>
                                        ) : (
                                            field.label
                                        )}
                                    </label>

                                    {field.name === 'id' || field.name === 'ph' ? (
                                        <div className={styles.inputWithButtonBox}>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ''}
                                                className={field.type === 'file' ? styles.fileInput : styles.input}
                                                onChange={handleChange}
                                            />
                                            
                                            <button type="button" className={styles.checkBtn}>
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