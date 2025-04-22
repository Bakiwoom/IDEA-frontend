import React from "react";
import { Outlet,useLocation } from "react-router-dom";
import Header from "./Header";

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
    console.log(headerType)

    return(
        <>
            <Header type={headerType} />
            <Outlet />
        </>
    );

};

export default UserHeaderLayout;