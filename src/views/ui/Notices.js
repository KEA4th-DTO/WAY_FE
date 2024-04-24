import React, { useState } from "react";
import NoticePost from "../../components/dashboard/NoticePost";
import SectionTitle from "../../components/dashboard/SectionTitle";
import "../../assets/scss/layout/_noticePost.scss";
const Notices = () => {
  return (
    <div>
      <SectionTitle>
        <h2 className="notices-main">공지사항</h2>
        <hr className="horizontal-divider" />
      </SectionTitle>
      <NoticePost />
    </div>
  );
};

export default Notices;
