import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_search.scss";
import img from "../../assets/images/bg/bg5.png";
import user3 from "../../assets/images/users/user3.jpg";

const SearchList = ({ data }) => { 
  return (
    <div>
    <div className="group98-history-post1"></div>
    <div className="group98-group3">
      <div className="group98-group4">
        <span className="group98-text04">
          <span>{data.title}</span>
        </span>
      </div>
      <span className="group98-text06">
        <span>{data.hashTag}</span>
      </span>
    </div>
    <img
      src={img}
      alt="게시글 썸네일 이미지"
      className="group98-image1"
    />
    <div className="group98-post">
      <span className="group98-text12">
        <span>{data.memberId}</span>
      </span>
      <div
        className="group98-svg02"
      />
      <span className="group98-text10">
        <span>{data.nickname}</span>
      <div
        className="group98-svg03"
      />
      </span>
      <span className="group98-text08">
        <span>{data.createdAt}</span>
      </span>
     
      <img
        src={user3}
        alt="작성자 프로필이미지"
        className="group98-profileimage"
      />
    </div>
    </div>
  );
}   
export default SearchList;