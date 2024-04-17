import React from 'react';
import "../../assets/scss/layout/_questionCard.scss";

const QuestionCard = ({ children }) => {
    return <div className="card">{children}</div>;
};

export default QuestionCard;
