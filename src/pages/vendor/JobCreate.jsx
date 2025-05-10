import React, { useState } from "react";
import styles from "../../assets/css/vendor/JobCreate.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    department: "",
    jobType: "",
    employmentType: "",
    location: "",
    experienceLevel: "",
    experienceYears: "",
    deadline: "",
    description: "",
    requirements: "",
    preferred: "",
    // 장애유형 ID로 변경
    disabilityTypeName: ""
  });

  const token = localStorage.getItem("token");

  const disabilityOptions = [
    { id: 1, name: "경증남성" },
    { id: 2, name: "경증여성" },
    { id: 3, name: "중증남성" },
    { id: 4, name: "중증여성" },
    { id: 5, name: "선택안함" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      // 장애유형만 숫자로 변환
      [name]: name === "disabilityTypeName" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 필수 체크 예시
    if (!form.title || !form.deadline) {
      alert("공고명과 마감일은 꼭 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const jobId = response.data.jobId;
      if (jobId) {
        alert("공고가 등록되었습니다.");
        navigate(`/company/job/management/detail/${jobId}`);
      } else {
        alert("등록은 됐지만, jobId를 못 받아왔어요.");
        navigate("/company/job/management");
      }
    } catch (error) {
      console.error("공고 등록 오류", error);
      alert("공고 등록에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>공고 등록</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="title" placeholder="공고명" onChange={handleChange} />
        <input type="text" name="department" placeholder="채용 담당 부서" onChange={handleChange} />
        <input type="text" name="jobType" placeholder="직무 유형 (예: 개발자)" onChange={handleChange} />
        <input type="text" name="employmentType" placeholder="고용 형태 (예: 정규직)" onChange={handleChange} />
        <input type="text" name="location" placeholder="근무지 (예: 서울 강남)" onChange={handleChange} />
        <input type="text" name="experienceLevel" placeholder="경력 수준 (신입/경력)" onChange={handleChange} />
        <input type="text" name="experienceYears" placeholder="경력 년수 (예: 2년)" onChange={handleChange} />
        <input type="date" name="deadline" onChange={handleChange} />
        <textarea name="description" placeholder="업무 설명" onChange={handleChange} />
        <textarea name="requirements" placeholder="자격 요건" onChange={handleChange} />
        <textarea name="preferred" placeholder="우대 조건" onChange={handleChange} />

        <select
          name="disabilityTypeName"
          onChange={handleChange}
          value={form.disabilityTypeName}
        >
          <option value="">장애 유형 선택</option>
          {disabilityOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>

        <button type="submit" className={styles.submitButton}>
          등록
        </button>
      </form>
    </div>
  );
};

export default JobCreate;
