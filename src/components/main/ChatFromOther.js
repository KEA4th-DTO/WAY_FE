import React, { useEffect, useRef, useState } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import { formatDate_time2 } from '../../utils/changeFormat';

const ChatFromMe = ({ data }) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current && textWidth === 0) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [textWidth]);

  useEffect(() => {
    const handleResize = () => {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    };
    handleResize(); // 초기 로드 시 호출하여 초기 textWidth 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data.body]);

  if (!data) {
    console.log("content is null");
    return null;
  }

    return (
     <div className="otherchat-container">
          <div className="otherchat-rectangle" style={{ width: textWidth + 10 + 'px'}} />
            <span className="otherchat-nickname" ref={textRef}>{data.writerNickname}</span>
     
            <span className="otherchat-body">{data.body}</span>
            <div className="otherchat-time" style={{left: textWidth - 60 + 'px'}}>
          <span>{formatDate_time2(data.createdAt)}</span>
          </div>

        </div>
    );
  }   
  export default ChatFromMe;