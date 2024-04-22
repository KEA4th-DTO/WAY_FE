import React from "react";

import { Helmet } from "react-helmet";

function Question({ title, authorNickname, date, body }) {
  return (
    <div className="question-contatiner">
      <Helmet>
        <title>문의사항</title>
      </Helmet>
      <div className="question-header">문의사항</div>
      <div className="question-title">
        <span>{title}</span>
        <span>{date}</span>
        <span>{authorNickname}</span>
      </div>

      <div className="horizontal-divider"></div>
      <div className="question-body">
        <span>{body}</span>
      </div>
      <div className="horizontal-divider"></div>
      <button className="btn-list">목록</button>
    </div>
  );
}

export default Question;
