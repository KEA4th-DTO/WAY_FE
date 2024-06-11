import React, { useState, useEffect } from 'react';
import "../assets/scss/layout/_chatting.scss";  
import full_checkbox from "../assets/images/icons/full_checkbox.png";
import checkbox from "../assets/images/icons/checkbox.png";
import ChatRoom from '../components/main/ChatRoom';
import ChatContent from '../components/main/ChatContent';

const Chatting= () => {

  // 데이터 가져오기
  const [chatRoom, setChatRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // 추가: 선택된 게시글 상태
  const [checkedItems, setCheckedItems] = useState([]); // 추가: 체크된 아이템 배열
  const [isAllChecked, setIsAllChecked] = useState(false); // 추가: 모든 아이템 선택 상태

  useEffect(() => {
    fetch('http://localhost:3001/chatroom') // API 경로 적어주기
      .then(res => res.json())
      .then(data => {
        setChatRoom(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // 포스트 클릭 시 선택된 포스트 업데이트
  const handleRoomClick = (selectedItem) => {
    setSelectedRoom(selectedItem);
  };

  // 리스트에 있는 체크박스를 토글하는 함수
  const toggleCheckbox = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id)); // 이미 선택된 아이템이면 제거
    } else {
      setCheckedItems([...checkedItems, id]); // 새로운 아이템을 추가
    }
  };

  // 상단 메뉴의 체크박스를 클릭하여 모든 아이템 선택 또는 해제
  const handleAllCheckboxToggle = () => {
    if (isAllChecked) {
      setCheckedItems([]); // 모든 아이템 선택 해제
    } else {
      const allIds = chatRoom.map(item => item.id); // 모든 아이템의 ID 배열
      setCheckedItems(allIds); // 모든 아이템 선택
    }
    setIsAllChecked(!isAllChecked); // 상태 토글
  };

  // '읽음' 버튼 클릭 시 체크된 아이템들의 alarmNum을 0으로 설정하고 체크 해제
  const handleReadClick = () => {
    checkedItems.forEach(id => {
      fetch(`http://localhost:3001/days/${id}`, {
        method: 'PATCH', // 데이터 수정을 위해 PATCH 요청 사용
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alarmNum: 0 }) // alarmNum을 0으로 설정
      })
      .then(res => {
        if (res.ok) {
          setChatRoom(prevState => prevState.map(item => {
            if (item.id === id) {
              return { ...item, alarmNum: 0 }; // 변경된 alarmNum으로 업데이트
            }
            return item;
          }));
        }
      })
      .catch(error => console.error("Error updating data:", error));
    });
    setCheckedItems([]); // 체크 해제
  };

  // '나가기' 버튼 클릭 시 체크된 아이템들을 제거
  const handleLeaveClick = () => {
    checkedItems.forEach(id => {
      fetch(`http://localhost:3001/days/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.ok) {
          setChatRoom(prevState => prevState.filter(item => item.id !== id)); // 해당 아이템 제거
        }
      })
      .catch(error => console.error("Error deleting data:", error));
    });
    setCheckedItems([]); // 체크 해제
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ border: "3px solid red" }} className="frame-container">
        {/* 채팅 상단 메뉴 */}
        <div className="frame1-frame">
          <button style={{ border: "none" }} onClick={handleAllCheckboxToggle}>
            <img src={isAllChecked ? full_checkbox : checkbox} alt="Checkbox2251" className="frame1-checkbox" />
          </button>
          <span className="frame1-text">
            <button style={{ border: "none" }} onClick={handleLeaveClick}>나가기</button>
          </span>
          <span className="frame1-text2">
            <button style={{ border: "none" }} onClick={handleReadClick}>읽음</button>
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
        <div id='list' style={{ border: "3px solid yellow", overflow: "auto", marginTop: "10px", }} className="frame2-frame">
          {chatRoom.map((item) => (
            <div key={item.id}>
              <img
                src={checkedItems.includes(item.id) ? full_checkbox : checkbox} // 체크 여부에 따라 이미지 변경
                alt="Checkbox2251"
                className="frame2-checkbox"
                onClick={() => toggleCheckbox(item.id)} // 클릭 시 토글
              />
              <button style={{ border: "3px solid black" }} onClick={() => handleRoomClick(item)}>
                <ChatRoom data={item} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <div className='frame3-container'>
          <ChatContent data={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
      )}
    </div>
  );
};

export default Chatting;
