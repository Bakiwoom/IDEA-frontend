import React, { useState } from "react";

import styles from "../../assets/css/user/CategotyListPage.module.css";
import Nav from "../../components/Navbar";

const CategoryListPage = () =>{

    const [selectedCategory, setSelectedCategory] = useState("장애인");

    const handleClickCategory = (item) =>{
        setSelectedCategory(item);
    }

    return(
        <>
            <Nav />
            <div className={styles.categotyContainer}>
                <ul>
                    <li className={selectedCategory === '장애인' ? styles.selected : ''} onClick={()=>handleClickCategory("장애인")}>장애인 채용</li>
                </ul>
            </div>
            <div className={styles.container}>
                <div className={styles.itemBoxContainer}>
                    <div className={styles.itemBox}>
                        내용
                    </div>
                </div>
                
            </div>
        </>
    );
}
export default CategoryListPage;