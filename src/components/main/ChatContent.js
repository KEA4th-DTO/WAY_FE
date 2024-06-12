import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_chatcontent.scss";
import close from "../../assets/images/logos/close.png";
import members from "../../assets/images/logos/members.png";
import ChatFromMe from './ChatFromMe';  
import ChatFromOther from './ChatFromOther';

const ChatContent = ({ postId, title, period, nickname, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [commentNum, setCommentNum] = useState(0);
  const [commentState, setCommentState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // 추가된 상태 변수
  const [userProfileimg, setUserprofileimg] = useState(false);

  const token = localStorage.getItem("accessToken");
  const Server_IP = process.env.REACT_APP_Server_IP;
  const userNickname = localStorage.getItem("userNickname");

  const handleCloseClick = () => {
    onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
  };

      // 수정창에서 신고버튼 클릭 시
    // const handleReportClick = () => {
    //   setReportMode(true);
    // };

    useEffect(() => {
      ClickComment();
    }, [postId]);

    const ClickComment = async () => {
      try {
        if (!postId) return;
        const url = `${Server_IP}/post-service/comment/list/${postId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        if (data.isSuccess) {
          setComments(data.result.commentResultDtoList);
          // console.log('채팅:', data.result.commentResultDtoList);
        } else {
          console.error("Error in API response:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


useEffect(() => {
  if (userNickname) {
    // console.log('유저 닉네임', userNickname);
    const url = `${Server_IP}/member-service/profile/${userNickname}`;
      fetch(url, {
          method: 'GET',
          headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(res => {
          if (!res.ok) {
              throw new Error('Network response was not ok ' + res.statusText);
          }
          return res.json();
      })
      .then(data => {
          if (data.isSuccess) {
            // console.log('사진', data.result.profileImageUrl);
              setUserprofileimg(data.result.profileImageUrl);
          } else {
              console.error("Error in API response:", data.message);
          }
      })
      .catch(error => console.error("Error fetching data:", error));
  }
}, [userNickname]);

    const SaveComment = async () => {
      try {
        if (commentBody.trim() === '' || isSubmitting) {
          return;
        }
        setIsSubmitting(true);  // 제출 시작
        const url = `${Server_IP}/post-service/comment/${postId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ body: commentBody })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        if (data.isSuccess) {
            // console.log('댓글이 생성되었습니다:', data.result);
            setCommentBody(''); // Clear the comment input
            setCommentNum(commentNum + 1);
            ClickComment();
            // alert('댓글이 생성되었습니다.');
        } else {
            console.error("Error in API response:", data.message);
        }
        setIsSubmitting(false);  // 제출 완료

      } catch (error) {
          console.error("Error posting comment:", error);
          setIsSubmitting(false);  // 오류 발생 시 제출 상태 초기화

      }
    };

  
  return (
      <div  className="chatcontent-frame">
        {/* 상단창 */}
         <div className="top-window">
          <img
            src={close}
            alt="닫기"
            className="close-button"
            onClick={handleCloseClick}
          />
          <div className="frame-line"></div>
          
          <span className="top-title">
            <span>{title}</span>
          </span>
          <span className="top-period">
            <span>{period}</span>
          </span>
          <img
            src={members}
            alt="사람 아이콘"
            className="members-icon"
          />
         <span className="top-nickname" >{nickname}</span>
        </div>

        {/* 채팅창 */}
        <div id="list" className='chat-container' style={{ overflow: "auto", marginTop: "10%" }}>
          {comments.map((item) => (
            <div key={item.id}>
              {item.isOwned ? <ChatFromMe data={item}/> : <ChatFromOther data={item} />}
            </div>
          ))}
        </div>
    
        {/*  전송창  */}
        <div className="send-window" />
        <input
            type="text"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className='send-text'
            placeholder="메시지를 입력하세요."
         />
          <button className="send-button" onClick={SaveComment} disabled={isSubmitting}>
          <span> {isSubmitting ? '전송 중' : '전송'}</span>
          </button>
    </div>
  )
}

export default ChatContent;