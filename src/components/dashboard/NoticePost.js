import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoticeCard from "./NoticeCard";
import post1 from "../../assets/images/users/user.png";
import post2 from "../../assets/images/users/user.png";
import post3 from "../../assets/images/users/user.png";
import post4 from "../../assets/images/users/user.png";
import post5 from "../../assets/images/users/user.png";
import post6 from "../../assets/images/users/user.png";

import "../../assets/scss/layout/_noticePost.scss";

const NoticePost = ({
  profileImage,
  authorName,
  authorNickname,
  title,
  date,
}) => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const navigate = useNavigate();

  const handleNoticeClick = (noticeId) => {
    navigate(`/notices/${noticeId}`);
  };

  useEffect(() => {
    fetch("http://localhost:3001/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [selectedNotice]);

  const getImagePath = (id) => {
    const img = [post1, post2, post3, post4, post5, post6];
    return img[id - 1];
  };

  return (
    <div className="notices">
      {notices.map((notice, key) => (
        <NoticeCard
          key={key}
          onClickAction={() => {
            setSelectedNotice(notice.id);
            handleNoticeClick(notice.id);
          }}
        >
          <div className={`notice__item p${key + 1} d-flex`} key={key}>
            <div className="notice-img">
              <img src={getImagePath(notice.id)} alt={`notice ${notice.id}`} />
            </div>

            <div className="notice-author">
              <span className="notice-name">{notice.authorName}</span>
              <span className="notice-nickname">{notice.authorNickname}</span>
            </div>

            <div className="notice-title">{notice.title}</div>

            <div className="notice-data">
              <p>{notice.date}</p>
            </div>
          </div>
        </NoticeCard>
      ))}
    </div>
  );
};

export default NoticePost;
