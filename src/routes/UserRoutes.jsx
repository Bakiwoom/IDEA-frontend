import { Routes, Route } from 'react-router-dom';
import UserHeaderLayout from '../components/UserHeaderLayout';
import Layout from "../components/Layout";

import SignUpTypeChoice from '../pages/user/SignUpTypeChoice';
import UserSignUpPage from '../pages/user/UserSignUpPage';
import VendorSignUpPage from '../pages/user/VendorSignUpPage';
import LoginPage from '../pages/user/LoginPage';
import UserMyPageMain from '../pages/user/UserMyPageMain';
import CategoryListPage from '../pages/user/CategotyListPage';
import UserEditPage from '../pages/user/UserEditPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/categoryListPage' element={<CategoryListPage />} />
      </Route>

      <Route element={<UserHeaderLayout />}>

        <Route path='/signUpTypeChoicePage' element={<SignUpTypeChoice />} />
        <Route path='/userSignUpPage' element={<UserSignUpPage />} />
        <Route path='/vendorSignUpPage' element={<VendorSignUpPage />} />
        <Route path='/loginPage' element={<LoginPage />} />
        <Route path='/mypage/userMyPageMain' element={<UserMyPageMain />} />
        <Route path='/mypage/userEditPage' element={<UserEditPage />} />
        

      </Route>
    </Routes>
  );
};

export default UserRoutes;