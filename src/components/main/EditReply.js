import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_reply.scss";
import comment_more from "../../assets/images/logos/comment_more.png";
import like from "../../assets/images/logos/like.png";
import { formatDate_time } from '../../utils/changeFormat';

const EditReply = ({ reply, userProfileimg, onsave }) => {
    const [body, setBody] = useState('');
    const replyId = reply.replyId;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    const Server_IP = process.env.REACT_APP_Server_IP;
      
    useEffect(() => {
      // Component mount 시 post로부터 초기값을 설정
      setBody(reply.body);
    }, [reply]);

    // console.log(reply);

    const saveEditClick = async () => {
        try {
            const requestBody = {
                body: body
            };

            const url = `${Server_IP}/post-service/reply/${replyId}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
    
            if (response.ok) {
                // console.log('Success:', data);
                alert('답글이 성공적으로 수정되었습니다.');
                onsave();
            } else {
                console.error('Error:', data);
                alert('답글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('답글 수정 중 오류가 발생했습니다.');
        }
    };

    return(
    <div className="reply-con">
        <div className="reply-frame">
              <div className="reply-save">
                <button onClick={saveEditClick} className="reply-edit-save">
                    <span>
                    저장
                    </span>
                </button>
              </div>
             
              <div className="reply-writer">
              <img
                  src={userProfileimg}
                  alt="댓글 작성자 프로필이미지"
                  className="reply-writer-profileimg"
                />
                <span className="reply-writer-nickname">
                  {userNickname}
                </span>
              </div>
              <span className="reply-content">
            <input 
              style={{ width: "300px"}} 
              type="text" 
              defaultValue={reply.body}
              onChange={(e) => setBody(e.target.value)} 
                />
              </span>
             
            </div> 
    </div>
    );
    
};

export default EditReply;