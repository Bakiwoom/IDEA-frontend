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
                <h2 className={styles.pageTitle}>장애인 채용공고</h2>
                <div className={styles.itemBoxContainer}>
                    <div className={styles.itemBox}>
                        <img src="http://localhost:3000/images/%EC%82%BC%EC%84%B1%EB%A1%9C%EA%B3%A0.png" className={styles.logoImg} alt="업체로고"></img>
                        <h3 className={styles.itemTitle}>[쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용</h3>
                        <p className={styles.itemCompany}>쿠팡풀필먼트서비스(주)</p>
                        <div className={styles.spanBox}>
                            <span><i>📍</i>경기/인천</span>
                            <span><i>🏢</i>신입/경력</span>
                        </div>
                        <div className={styles.dayBox}>
                            <span className={styles.itemEndday}>~05/20</span>
                            <span className={styles.heartIcon}>♡</span>
                        </div>
                    </div>
                    <div className={styles.itemBox}>
                        <img src="http://localhost:3000/images/%EC%82%BC%EC%84%B1%EB%A1%9C%EA%B3%A0.png" className={styles.logoImg} alt="업체로고"></img>
                        <h3 className={styles.itemTitle}>[쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용</h3>
                        <p className={styles.itemCompany}>쿠팡풀필먼트서비스(주)</p>
                        <div className={styles.spanBox}>
                            <span><i>📍</i>경기/인천</span>
                            <span><i>🏢</i>신입/경력</span>
                        </div>
                        <div className={styles.dayBox}>
                            <span className={styles.itemEndday}>~05/20</span>
                            <span className={styles.heartIcon}>♡</span>
                        </div>
                    </div>
                    <div className={styles.itemBox}>
                        <img src="http://localhost:3000/images/%EC%82%BC%EC%84%B1%EB%A1%9C%EA%B3%A0.png" className={styles.logoImg} alt="업체로고"></img>
                        <h3 className={styles.itemTitle}>[쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용</h3>
                        <p className={styles.itemCompany}>쿠팡풀필먼트서비스(주)</p>
                        <div className={styles.spanBox}>
                            <span><i>📍</i>경기/인천</span>
                            <span><i>🏢</i>신입/경력</span>
                        </div>
                        <div className={styles.dayBox}>
                            <span className={styles.itemEndday}>~05/20</span>
                            <span className={styles.heartIcon}>♡</span>
                        </div>
                    </div>
                    <div className={styles.itemBox}>
                        <img src="http://localhost:3000/images/%EC%82%BC%EC%84%B1%EB%A1%9C%EA%B3%A0.png" className={styles.logoImg} alt="업체로고"></img>
                        <h3 className={styles.itemTitle}>[쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용</h3>
                        <p className={styles.itemCompany}>쿠팡풀필먼트서비스(주)</p>
                        <div className={styles.spanBox}>
                            <span><i>📍</i>경기/인천</span>
                            <span><i>🏢</i>신입/경력</span>
                        </div>
                        <div className={styles.dayBox}>
                            <span className={styles.itemEndday}>~05/20</span>
                            <span className={styles.heartIcon}>♡</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
}
export default CategoryListPage;