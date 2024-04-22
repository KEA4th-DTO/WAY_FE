import React, { useState } from "react";
import QuestionPost from "../../components/dashboard/QuestionPost";
import SectionTitle from "../../components/dashboard/SectionTitle";

const Questions = () => {
  return (
    <div>
      <SectionTitle>
        <h2>문의사항</h2>
        <hr className="horizontal-divider" />
      </SectionTitle>
      <QuestionPost />
    </div>
  );
};

export default Questions;
