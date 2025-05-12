import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "../assets/css/layout/Navbar.module.css";
import { CATEGORY_PAGE } from "../routes/contantsRoutes";
import { DISABLED_JOB_OFFERS_PAGE } from "../pages/PublicDataApi/DisabledJoboffers";
import { WELFARE_SERVICES_PAGE } from "../pages/PublicDataApi/WelfareServices";

const Navbar = () => {
    return(
        <>
            <nav className={styles.nav}>
                <div className={`${styles.container} ${styles.navContainer}`}>
                <button className={styles.menuButton}>☰</button>
                <ul className={styles.navMenu}>
                    <li>
                    <Link to={CATEGORY_PAGE} className={styles.active}>
                        채용정보
                    </Link>
                    </li>
                    <li>
                    <Link to={DISABLED_JOB_OFFERS_PAGE} className={styles.active}>
                        구인 실시간 현황
                    </Link>
                    </li>
                    <li>
                    <Link to={WELFARE_SERVICES_PAGE} className={styles.active}>
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