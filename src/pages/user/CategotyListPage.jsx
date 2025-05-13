import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "../../assets/css/user/CategotyListPage.module.css";
import Nav from "../../components/Navbar";

import { useAuth } from "../../contexts/user/AuthProvider";


const CategoryListPage = () => {

    const { authUser, memberId, role, userId } = useAuth();
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    const [selectedCategory, setSelectedCategory] = useState("장애인");
    const [listVo, setListVo] = useState([]);
    const [bookmarkList, setBookmarkList] = useState([]);

    //좋아요
    const [isLiked, setIsLiked] = useState('');

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listVo.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(listVo.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleClickCategory = (item) => {
        setSelectedCategory(item);
    }

    //공고글 가져오기
    const getList = () => {
        axios({
            method: "get",
            url: `${apiUrl}/api/disability`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: "json",

        })
            .then((response) => {
                setListVo(response.data.apiData);
            })
            .catch((error) => {
                console.error("disabilityPage리스트 가져오기 실패:", error);
                alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });
    };

    //북마크 리스트 가져오기
    const getBookmarkList = () => {

        if (!userId || userId === '') return;

        axios({
            method: "get",
            url: `${apiUrl}/api/disability/bookmarkList/${userId}`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: "json",

        })
            .then((response) => {
                setBookmarkList(response.data.apiData);
            })
            .catch((error) => {
                console.error("bookmarkList 가져오기 실패:", error);
                alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });
    }

    //좋아요 등록
    const handleHeart = (jobId) => {

        if (role === 'company') {
            alert('기업회원은 사용불가능한 기능입니다.');
            return;
        }

        if (!memberId) {
            alert('로그인이 필요한 기능입니다.')
            return;
        }
        //북마크 여부 체크
        const isBookmarked = bookmarkList.some(bookmark => bookmark.jobId === jobId);

        //삭제
        if (isBookmarked) {
            axios({
                method: "delete",
                url: `${apiUrl}/api/disability/bookmark/${jobId}/${userId}`,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                responseType: "json",
            })
                .then(() => {
                    // 북마크 리스트에서 해당 공고 제거
                    setBookmarkList((prevBookmarkList) =>
                        prevBookmarkList.filter(bookmark => bookmark.jobId !== jobId)
                    );
                })
                .catch((error) => {
                    console.error("북마크 삭제 실패:", error);
                    alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
                });
            //등록
        } else {
            axios({
                method: "post",
                url: `${apiUrl}/api/disability/bookmark/${jobId}/${userId}`,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                responseType: "json",

            })
                .then((response) => {
                    setBookmarkList((prevBookmarkList) => {
                        // 기존 북마크 리스트에 새로 등록된 jobId를 추가
                        const updatedBookmarkList = [...prevBookmarkList, { jobId }];
                        return updatedBookmarkList;
                    });
                })
                .catch((error) => {
                    console.error("북마크 등록 실패:", error);
                    alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
                });
        }
    }


    useEffect(() => {

        //공고글 list가져오기
        getList();
        //북마크글 가져오기
        getBookmarkList();

    }, []);


    return (
        <>
            <Nav />
            {/* <div className={styles.categotyContainer}>
                <ul>
                    <li className={selectedCategory === '장애인' ? styles.selected : ''} onClick={()=>handleClickCategory("장애인")}>장애인 채용</li>
                </ul>
            </div> */}
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>장애인 채용공고</h2>
                <div className={styles.itemBoxContainer}>
                    {listVo.map((item, index) => (
                        <div className={styles.itemBox} key={item.jobId} onClick={() => navigate(`/company/job/management/detail/${item.jobId}`)} style={{ cursor: 'pointer' }}>
                            <img
                                src={item.companyLogo || "/images/nologo.png"}
                                className={styles.logoImg}
                                alt="업체로고"
                            ></img>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemCompany}>{item.companyName}</p>
                            <div className={styles.spanBox}>
                                <span className={styles.iconSpan}><i>📍</i>{item.location}</span>
                                <span className={styles.iconSpan}><i>🏢</i>{item.experienceLevel}</span>
                                <span className={styles.disavility}>{item.disabilityTypeName}</span>
                            </div>
                            <div className={styles.dayBox}>
                                <span className={styles.itemEndday}>~ {item.deadline.slice(5)}</span>
                                <span className={`${styles.heartIcon} ${role === 'company' ? '' : styles.iconHover} ${bookmarkList.some(bookmark => bookmark.jobId === item.jobId) ? styles.redHeart : ''}`} onClick={(e) => { e.stopPropagation(); handleHeart(item.jobId); }}>
                                    {bookmarkList.some(bookmark => bookmark.jobId === item.jobId)
                                        ? '♥' : '♡'
                                    }
                                </span>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
            <div className={styles.pagination}>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={currentPage === number ? styles.activePage : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </>
    );
}
export default CategoryListPage;