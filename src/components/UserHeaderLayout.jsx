import React from "react";
import { Outlet,useLocation } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import UserSidebar from "../pages/user/UserSidebar";

const UserHeaderLayout = () => {

    const location = useLocation();

    let headerType = 'default';

    if(location.pathname.includes('signUpTypeChoicePage')){
        headerType = 'signUpTypeChoicePage';
    }else if(location.pathname.includes('userSignUpPage')){
        headerType = 'userSignUpPage';
    }else if(location.pathname.includes('vendorSignUpPage')){
        headerType = 'vendorSignUpPage';
    }else if(location.pathname.includes('loginPage')){
        headerType = 'loginPage';
    }
    
    const showFullLayout = location.pathname.includes("mypage");

    return(
        <>
            <Header type={headerType} />

            {showFullLayout &&(
                <>
                    <Navbar />
                    <div style={{display:"flex",width:"1200px", margin:"0 auto", minHeight:"calc(100vh - 130px)", boxSizing:"border-box"}}>
                        <UserSidebar />
                        <div style={{ width:"calc(1200px - 170px)", boxSizing:"border-box"}}>
                            <Outlet />
                        </div>
                    </div>
                </>
            )}

            {!showFullLayout && (
                    <Outlet />
                )}
        </>
    );

};

export default UserHeaderLayout;