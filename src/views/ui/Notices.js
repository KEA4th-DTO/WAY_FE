import React, { useState } from "react";
import NoticePost from "../../components/dashboard/NoticePost";
import SectionTitle from "../../components/dashboard/SectionTitle";

const Notices = () => {
  return (
    <div>
      <SectionTitle>
        <h2>공지사항</h2>
        <hr/>
      </SectionTitle>
      <NoticePost/>
    </div>
  );
};

export default Notices;
