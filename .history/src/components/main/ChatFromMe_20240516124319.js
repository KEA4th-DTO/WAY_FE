const ChatFromMe = ({ content }) => {
  return (
    <div>
    <div
        className="frame-rectangle46"
        />
        <div className="frame-frame3">
        <span className="frame-text04">
            <span>{content.nickname}신형만</span>
        </span>
        <span className="frame-text06">
            <span>{content.content}저 위례사는데 같이 봐요!</span>
        </span>
        </div>
        <span className="frame-text08">
        <span>{content.time}</span>
        </span>
    </div>
  );
}   
export default ChatFromMe;