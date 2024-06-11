import React, { useEffect, useRef, useState } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import { formatDate_time } from '../../utils/changeFormat';

const ChatFromMe = ({ data }) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  const formattedTime = new Date(data.createdAt).toLocaleString('ko-KR');

  console.log("data", data);
  useEffect(() => {
    if (textRef.current && textWidth === 0) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [textWidth]);

  if (!data) {
    console.log("content is null");
    return null;
  }

  return (
    <div className="mychat-container">
      <div className="mychat-rectangle" style={{ width: textWidth + 30 + 'px'}} />
      <div className="mychat-frame" style={{width: textWidth + 30 + 'px'}}>
        <span className="mychat-text" ref={textRef}>
          <span>{data.body}</span>
        </span>
      </div>
      <div className="mychat-time" style={{right: textWidth + 35 + 'px'}}>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};  

export default ChatFromMe;