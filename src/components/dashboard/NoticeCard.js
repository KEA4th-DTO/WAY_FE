import React from 'react';
import "../../assets/scss/layout/_noticeCard.scss";

const NoticeCard = ({ children }) => {
    return <div className="card">{children}</div>;
};

export default NoticeCard;
