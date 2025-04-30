// VendorLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../assets/css/layout/Layout.module.css";

const VendorLayout = () => {
  return (
    <div className={styles.layout}>
      {/* <Header /> */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default VendorLayout;
