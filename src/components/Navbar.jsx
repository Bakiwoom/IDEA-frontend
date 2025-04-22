import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "../assets/css/layout/Navbar.module.css";
import { CATEGORY_PAGE } from "../routes/contantsRoutes";

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
                    {/* <li>
                        <Link to="#">혜택 시뮬레이션</Link>
                    </li>
                    <li>
                        <Link to="#">맞춤 공고</Link>
                    </li>
                    <li>
                        <Link to="#">혜택 안내</Link>
                    </li>
                    <li>
                        <Link to="#">북마크</Link>
                    </li>
                    <li>
                        <Link to="#">내 혜택 리포트</Link>
                    </li> */}
                    </ul>
                </div>
                </nav>
        </>
    );
}
export default Navbar;