import React, { useState, useEffect } from 'react';
import "../assets/scss/layout/_chatting.scss";  
import sky from "../assets/images/bg/sky.png";
import user6 from "../assets/images/users/user6.png";
import full_checkbox from "../assets/images/icons/full_checkbox.png";
import checkbox from "../assets/images/icons/checkbox.png";
import ChatRoom from '../components/main/ChatRoom';
import ChatContent from '../components/main/ChatContent';

const Chatting= () => {

  //데이터 가져오기
  const [chatRoom, setChatRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // 추가: 선택된 게시글 상태

  
  useEffect(()=>{
      fetch('http://localhost:3001/chatroom') //API경로 적어주기
      .then(res => {
          return res.json() //json으로 변환됨
      })
      .then(data => {
          setChatRoom(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // 포스트 클릭 시 선택된 포스트 업데이트
  const handleRoomClick = (selectedItem) => {
    setSelectedRoom(selectedItem);
  };

  // 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    setSelectedRoom(null); // 선택된 포스트 초기화
  };

  return (
    <div style={{position:"relative"}}>
    <div className="frame-container">
    {/* 채팅 상단 메뉴 */}
    <div className="frame1-frame">
      <button style={{border:"none"}}>
        <img src={checkbox} alt="Checkbox2251" className="frame1-checkbox" />
      </button>
      <span className="frame1-text">
        <button style={{border:"none"}}>나가기</button>
      </span>
      <span className="frame1-text2">
        <button style={{border:"none"}}>읽음</button>
      </span>
      </div>

     {/* 채팅 제목 */}
      <div className="chatting">
        <span className="text">
          채팅
        </span>
        <div className="alarm">
          <span className="text">
            15
          </span>
        </div>
    </div>

      {/* 대화방 */}
      
      <div style={{ overflow: "auto"}} className="frame2-frame">
        {chatRoom.map((item, index) => (
        <div key={index}>
          <img
            src={checkbox}
            alt="Checkbox2251"
            className="frame2-checkbox"
          />
          <button style={{border:"none"}} onClick={() => handleRoomClick(item)}>
            <ChatRoom data={item} />
          </button>
        </div>
      ))}
      </div>
      
    </div>
    
    {selectedRoom && (
        <div className='frame3-container'>
          <ChatContent data={selectedRoom} onClose={handleBackClick} /> 
        </div>
      )}    
    </div>
  );
};

export default Chatting;
