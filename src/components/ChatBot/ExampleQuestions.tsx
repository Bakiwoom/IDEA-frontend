import React from 'react';
import styles from './ChatBot.module.css';
import { ExpertQuestion } from './services/ExpertService';

interface ExampleQuestionsProps {
  questions: ExpertQuestion[];
  onClick: (question: ExpertQuestion) => void;
  role?: string;
  setShowSignUpChoice?: (show: boolean) => void;
}

const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ questions, onClick, role, setShowSignUpChoice }) => {
  if (!questions || questions.length === 0) return null;
  return (
    <div className={styles.exampleQuestions}>
      <h3 className={styles.exampleQuestionsTitle}>자주 묻는 질문</h3>
      <div className={styles.questionsList}>
        {questions.map((question) => (
          <button
            key={question.id}
            className={styles.questionButton}
            onClick={() => {
              if (!role) {
                if (question.category === '로그인') {
                  window.location.href = '/user/loginPage';
                } else if (question.category === '회원가입' && setShowSignUpChoice) {
                  setShowSignUpChoice(true);
                }
              } else {
                onClick(question);
              }
            }}
          >
            {question.question}
            {question.category && (
              <span className={styles.questionCategory}>#{question.category}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQuestions; 