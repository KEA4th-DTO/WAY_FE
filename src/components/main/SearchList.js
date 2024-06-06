import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_search.scss";
import { formatDate_time } from '../../utils/changeFormat';

const SearchList = ({ data }) => { 
  if (!data) return null;

  return (
    <div className="searchlist-con">
    <div className="searchlist-frame">
      <div className="searchlist-title">
        <span className="searchlist-title-text">
          {data.title}
        </span>
      </div>
      <span className="searchlist-body">
        {data.bodyPreview}
      </span>
    </div>
    <img
      src={data.thumbnailImageUrl}
      alt="게시글 썸네일 이미지"
      className="searchlist-thumbnail"
    />
    <div className="searchlist-date">
      <span className="searchlist-date-text">
        {formatDate_time(data.createdAt)}
      </span>
    </div>
    </div>

  );
}   
export default SearchList;