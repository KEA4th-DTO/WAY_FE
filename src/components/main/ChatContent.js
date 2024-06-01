import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import close from "../../assets/images/logos/close.png";
import members from "../../assets/images/logos/members.png";
import ChatFromMe from './ChatFromMe';  
import ChatFromOther from './ChatFromOther';

const ChatContent = ({ onClose }) => {
    const memberId = "id_222"; // 임시 사용자 아이디
    const nickname = "ShinHyungMan"; // 임시 사용자 닉네임
    const [chat, setChat] = useState([]);
    const [newChatContent, setNewChatContent] = useState(""); // 새로 입력한 채팅 내용


    // useEffect(()=>{
    //     fetch('http://localhost:3001/chatcontent') //API경로 적어주기
    //     .then(res => {
    //         return res.json() //json으로 변환됨
    //     })
    //     .then(data => {
    //         setChat(data);
    //     })
    //     .catch(error => console.error("Error fetching data:", error));
    // }, []);

    const handleCloseClick = () => {
        onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
      };


  //   const handleSubmit = () => {
  //     // 서버로 새로운 채팅 내용을 POST 요청으로 보냄
  //     fetch('http://localhost:3001/chatcontent', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //             memberId: memberId,
  //             nickname: nickname,
  //             content: newChatContent,
  //             time: new Date().toLocaleTimeString(), // 현재 시간을 채팅 시간으로 설정
  //         }),
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //         console.log('Success:', data);
  //         // 채팅 내용을 전송한 후 입력창을 초기화
  //         setNewChatContent("");
  //     })
  //     .catch((error) => {
  //         console.error('Error:', error);
  //     });
  // };

  return (
      <div style={{border:"3px solid red"}}  className="frame">
        {/* 상단창 */}
         <div className="top-window">
          <img
            src={close}
            alt="닫기"
            className="close-button"
            // onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
          />
          <div className="frame-line"></div>
          
          <span className="top-title">
            <span>title</span>
          </span>
          <span className="top-period">
            <span>period</span>
          </span>
          <img
            src={members}
            alt="사람 아이콘"
            className="members-icon"
          />
         <span className="top-member-num" >memberNum</span>
        </div>

        {/* 채팅창 */}
        <div id="list" className='chat-container' style={{ border: "3px solid yellow", overflow: "auto", marginTop: "10%" }}>
          {/* {chat.map((item) => (
            <div key={item.id}>
              {item.memberId === memberId ? <ChatFromMe content={item} /> : <ChatFromOther content={item} />}
            </div>
          ))} */}
        </div>
    
        {/*  전송창  */}
        <div className="send-window" />
        <input
                type="text"
                value={newChatContent}
                // onChange={(e) => setNewChatContent(e.target.value)}
                className='send-text'
                placeholder="메시지를 입력하세요."
            />
        <div className="send-frame1">
          <div className="send-group">
            <span className="send-text02">
            {/* <button onClick={handleSubmit}>전송</button> */}
            </span>
          </div>
        </div>
    
      
    </div>
  )
}

export default ChatContent;