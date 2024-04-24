import React from "react";
import "../../assets/scss/layout/_noticeCard.scss";

const NoticeCard = ({ children, onClickAction }) => {
  return (
    <div className="card" onClick={onClickAction}>
      {children}
    </div>
  );
};

export default NoticeCard;
