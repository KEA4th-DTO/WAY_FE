import React from "react";
import "../../assets/scss/layout/_questionCard.scss";

const QuestionCard = ({ children, onClickAction }) => {
  return (
    <div className="card" onClick={onClickAction}>
      {children}
    </div>
  );
};

export default QuestionCard;
