import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "../assets/css/layout/Navbar.module.css";
import { CATEGORY_PAGE } from "../routes/contantsRoutes";
import { DISABLED_JOB_OFFERS_PAGE } from "../pages/PublicDataApi/DisabledJoboffers";
import { DISABLED_JOBSEEKERS_PAGE } from "../pages/PublicDataApi/DisabledJobseekers";
import { WELFARE_SERVICES_PAGE } from "../pages/PublicDataApi/WelfareServices";

const Navbar = () => {
    return(
        <>
            <nav className={styles.nav}>
                <div className={`${styles.container} ${styles.navContainer}`}>
                <button className={styles.menuButton}>☰</button>
                <ul className={styles.navMenu}>
                    <li>
                    <Link 
                        to={CATEGORY_PAGE} 
                        className={`${styles.link} ${window.location.pathname === CATEGORY_PAGE ? styles.active : ''}`}>
                        채용정보
                    </Link>
                    </li>
                    <li>
                    <Link 
                        to={DISABLED_JOB_OFFERS_PAGE} 
                        className={`${styles.link} ${window.location.pathname === DISABLED_JOB_OFFERS_PAGE ? styles.active : ''}`}>
                        구인 실시간 현황
                    </Link>
                    </li>
                    <li>
                    <Link 
                        to={DISABLED_JOBSEEKERS_PAGE} 
                        className={`${styles.link} ${window.location.pathname === DISABLED_JOBSEEKERS_PAGE ? styles.active : ''}`}
                    >
                        장애인 구직자 현황
                    </Link>
                    </li>
                    <li>
                    <Link 
                        to={WELFARE_SERVICES_PAGE} 
                        className={`${styles.link} ${window.location.pathname === WELFARE_SERVICES_PAGE ? styles.active : ''}`}>
                        복지서비스 목록
                    </Link>
                    </li>
                </ul>
                </div>
            </nav>
        </>
    );
}
export default Navbar;