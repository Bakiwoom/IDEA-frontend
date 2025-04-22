import { Route } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";

const VendorSignUpPage = () =>{

    const vendorFields = [
        {name:'id', label:'아이디', type:'text', placeholder:'아이디를 입력해주세요.'}
       ,{name:'Pw', label:'비밀번호', type:'password', placeholder:'비밀번호를 입력해주세요.'}
       ,{name:'businessNumber', label:'사업자 번호', type:'text', placeholder:'사업자번호를 입력해주세요.'}
       ,{name:'businessImg', label:'사업자등록증', type:'file',}
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
                userType="vendor"
                fields={vendorFields}
                onSubmit={handleSubmit}
            />
        </>
    )
}
export default VendorSignUpPage;