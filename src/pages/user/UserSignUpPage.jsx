import {  Route } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";
import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LOGIN_PAGE } from '../../routes/contantsRoutes';

const apiUrl = process.env.REACT_APP_API_URL;

const UserSignUpPage = () => {

    const navigate = useNavigate();
    
    const userFields = [
        {name:'name', label:'이름', type:'text', placeholder:'이름을 입력해주세요.'}
       ,{name:'id', label:'아이디', type:'text', placeholder:'아이디를 입력해주세요.'}
       ,{name:'pw', label:'비밀번호', type:'password', placeholder:'비밀번호를 입력해주세요.'}
       ,{name:'ph', label:'전화번호', type:'tel', placeholder:'핸드폰번호를 입력해주세요.'}
       ,{name:'email', label:'이메일', type:'email', placeholder:'이메일을 입력해주세요.'}
       ,{name:'disabilityType', label:'장애유형', type:'select', options: ["없음","경증", "중증"]}
       ,{name:'obstacle', label:'장애인 증명서', type:'file'}
   ];
   
   //회원가입하기
    const handleSubmit = (data, userType) =>{
        
        const formData = new FormData();

        for (let [key, value] of data.entries()) {
             console.log(`${key}:`, value);
            formData.append(key,value);
        }
        formData.append("role", userType);

        axios.post(`${apiUrl}/api/signup`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((response) => {
            if(response.data.result === 'success'){
                alert('회원가입이 완료되었습니다.');
                navigate(LOGIN_PAGE);
            }else{
                alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
            }

        })
        .catch((error) => {
            console.error("회원가입 실패:", error);
        });
    };

    



    

    return(
        <>
            <SignUpForm
                userType="user"
                fields={userFields}
                onSubmit={handleSubmit}
            />
        </>
    );
};
export default UserSignUpPage;