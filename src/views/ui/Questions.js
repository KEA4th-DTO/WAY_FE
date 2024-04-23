import React, { useState } from "react";
import QuestionList from "../../components/dashboard/QuestionList";
import SectionTitle from "../../components/dashboard/SectionTitle";
import "../../assets/scss/layout/_questionPost.scss";
const Questions = () => {
  return (
    <div>
      <SectionTitle>
        <h2 className="question-main">문의사항</h2>
        <hr className="horizontal-divider" />
      </SectionTitle>
      <QuestionList />
    </div>
  );
};

export default Questions;
