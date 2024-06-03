import React from "react";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import "../assets/style/questionDetail.css?after";

function QuestionDetail({ title, authorNickname, date, body }) {
  const { id } = useParams();
  const [question, setQuestion] = useState([]);

  // useEffect(() => {
  //   fetch(`http://localhost:3001/questions/${id}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network Error!");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => setQuestion(data))
  //     .catch((error) => console.error("Error fetching posts:", error));
  // }, [id]);
  return (
    <div className="question-contatiner">
        <title>문의사항</title>
      <div className="question-header">문의사항</div>
      <div className="horizontal-divider"></div>
      <div className="question-title">
        <span className="questionDetail-title">title</span>
        <span className="questionDetail-date">작성일 : date</span>
        <span className="questionDetail-nickName">
          작성자 : authorNickname
        </span>
      </div>

      <div className="horizontal-divider"></div>
      <div className="question-body">
        <span className="questionDetail-body">body</span>
      </div>
      <div className="horizontal-divider"></div>
      <button className="btn-list" onClick={() => window.history.back()}>
        목록
      </button>
    </div>
  );
}

export default QuestionDetail;
