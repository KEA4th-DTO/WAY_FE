import React from "react";
import { useEffect, useState } from "react";

import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import "../assets/style/noticeDetail.css";

function NoticeDetail({ title, authorNickname, date, body }) {
  const { id } = useParams();
  const [notice, setNotice] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/notices/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error!");
        }
        return response.json();
      })
      .then((data) => setNotice(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [id]);
  return (
    <div className="notice-contatiner">
      <Helmet>
        <title>공지사항</title>
      </Helmet>
      <div className="notice-header">공지사항</div>
      <div className="horizontal-divider"></div>
      <div className="notice-title">
        <span className="noticeDetail-title">{notice.title}</span>
        <span className="noticeDetail-date">작성일 : {notice.date}</span>
        <span className="noticeDetail-nickName">
          작성자 : {notice.authorNickname}
        </span>
      </div>

      <div className="horizontal-divider"></div>
      <div className="notice-body">
        <span className="noticeDetail-body">{notice.body}</span>
      </div>
      <div className="horizontal-divider"></div>
      <button className="btn-list" onClick={() => window.history.back()}>
        목록
      </button>
    </div>
  );
}

export default NoticeDetail;
