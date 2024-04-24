import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import sky from "../../assets/images/bg/sky.png";   
import close from "../../assets/images/logos/close.png";
import members from "../../assets/images/logos/members.png";

const Frame = ({ data, onClose }) => {
    const memberId = "id_222"; // 임시 사용자 아이디

    const [content, setContent] = useState([]);
    
    useEffect(()=>{
        fetch('http://localhost:3001/chatcontent') //API경로 적어주기
        .then(res => {
            return res.json() //json으로 변환됨
        })
        .then(data => {
            setContent(data);
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleCloseClick = () => {
        onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
      };

  return (
      <div className="frame-frame">
        {/* 상단창 */}
         <div className="frame-frame8">
          <img
            src={close}
            alt="닫기"
            className="frame-sv-gx-button"
            onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
          />
          <div className="frame-line11"></div>
          
          <span className="frame-text24">
            <span>{data.title}</span>
          </span>
          <span className="frame-text22">
            <span>{data.period}</span>
          </span>
          <img
            src={members}
            alt="사람 아이콘"
            className="frame-svg"
          />
         <span className="frame-svg2" >{data.memberNum}</span>
        </div>

        {/* 채팅창 */}
        <div className="frame-frame2">
          <div
            className="frame-rectangle46"
          />
          <div className="frame-frame3">
            <span className="frame-text04">
              <span>{content.nickname}ShinHyungMan</span>
            </span>
            <span className="frame-text06">
              <span>{content.content}저 위례사는데 같이 봐요!</span>
            </span>
          </div>
          <span className="frame-text08">
            <span>{content.time}18:38</span>
          </span>
        </div>

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

        <div className="frame-frame6">
          <div
            className="frame-rectangle462"
          />
          <div className="frame-frame7">
            <span className="frame-text16">
              <span>Crayon</span>
            </span>
            <span className="frame-text18">
              <span>카톡 오픈채팅 주소 드릴테니까 여기로 연락해요!</span>
            </span>
          </div>
          <span className="frame-text20">
            <span>18:40</span>
          </span>
        </div>
        

        {/*  전송창  */}
        <div className="frame-image" />
        <span className="frame-text">
          <span>내용을 입력해주세요.</span>
        </span>
        <div className="frame-frame1">
          <div className="frame-group55">
            <span className="frame-text02">
              <span>전송</span>
            </span>
          </div>
        </div>
    
      
    </div>
  )
}

export default Frame
