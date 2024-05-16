import React, { useEffect, useRef, useState } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";

const ChatFromMe = ({ content }) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [content]);

  console.log(textWidth);

  if (!content) {
    console.log("content is null");
    return null;
  }

  return (
    <div className="mychat-container">
      <div className="mychat-rectangle" style={{ width: textWidth + 30 + 'px'}} />
      <div className="mychat-frame" style={{width: textWidth + 30 + 'px'}}>
        <span className="mychat-text" ref={textRef}>
          <span>{content.content}</span>
        </span>
      </div>
      <div className="mychat-time" style={{right: textWidth + 35 + 'px'}}>
        <span>{content.time}</span>
      </div>
    </div>
  );
};  

export default ChatFromMe;