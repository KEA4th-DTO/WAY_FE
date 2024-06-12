import React, { useEffect, useRef, useState } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import { formatDate_time2 } from '../../utils/changeFormat';

const ChatFromOther = ({ data }) => {
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
    // console.log("content is null");
    return null;
  }

  // 최소 너비 설정
  const minRectangleWidth = 60;
  // 왼쪽과 오른쪽 마진 설정
  const margin = 5;
  // 실제 너비 계산
  const rectangleWidth = Math.max(textWidth + margin * 2, minRectangleWidth);

    return (
     <div className="otherchat-container">
          <div className="otherchat-rectangle" style={{ width: rectangleWidth  + 'px'}}  />
            <span className="otherchat-nickname">{data.writerNickname}</span>
     
            <span className="otherchat-body" ref={textRef}>{data.body}</span>
            <div className="otherchat-time"  style={{left: rectangleWidth - 70 +'px'}}>
          <span>{formatDate_time2(data.createdAt)}</span>
          </div>

        </div>
    );
  }   
  export default ChatFromOther;