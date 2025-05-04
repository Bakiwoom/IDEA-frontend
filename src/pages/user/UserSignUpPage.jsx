import { Route } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";
import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const UserSignUpPage = () => {

    const userFields = [
        {name:'name', label:'이름', type:'text', placeholder:'이름을 입력해주세요.'}
       ,{name:'id', label:'아이디', type:'text', placeholder:'아이디를 입력해주세요.'}
       ,{name:'pw', label:'비밀번호', type:'password', placeholder:'비밀번호를 입력해주세요.'}
       ,{name:'ph', label:'전화번호', type:'tel', placeholder:'핸드폰번호를 입력해주세요.'}
       ,{name:'email', label:'이메일', type:'email', placeholder:'이메일을 입력해주세요.'}
       ,{name:'obstacle', label:'장애인 증명서', type:'file'}
   ];
   
    const handleSubmit = (data, userType) =>{
        // data값 console로 확인
        for (let [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }
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