import { Route } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const VendorSignUpPage = () =>{

    const companyFields = [
        {name:'id', label:'아이디', type:'text', placeholder:'아이디를 입력해주세요.'}
       ,{name:'pw', label:'비밀번호', type:'password', placeholder:'비밀번호를 입력해주세요.'}
       ,{name:'companyName', label:'기업명', type:'text', placeholder:'기업명을 입력해주세요.'}
       ,{name:'businessNumber', label:'사업자 번호', type:'text', placeholder:'사업자번호를 입력해주세요.'}
       ,{name:'businessImg', label:'사업자등록증', type:'file',}
    ];
   
    //회원가입하기
    const handleSubmit = (data, userType) =>{
        console.log(userType)

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
            console.log("회원가입 성공:", response.data);
        })
        .catch((error) => {
            console.error("회원가입 실패:", error);
        });
    };




    return(
        <>
            <SignUpForm
                userType="company"
                fields={companyFields}
                onSubmit={handleSubmit}
            />
        </>
    )
}
export default VendorSignUpPage;