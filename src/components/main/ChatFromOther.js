const ChatFromMe = ({ content }) => {
    return (
     <div className="frame-frame4">
          <div
            className="frame-rectangle461"
          />
          <div className="frame-frame5">
            <span className="frame-text10">
              <span>{content.nickname}Crayon</span>
            </span>
            <span className="frame-text12">
              <span>{content.content}그러면 제가 지금 위례로 출발 할게요!</span>
            </span>
          </div>
          <span className="frame-text14">
            <span>{content.time}18:40</span>
          </span>
        </div>
    );
  }   
  export default ChatFromMe;