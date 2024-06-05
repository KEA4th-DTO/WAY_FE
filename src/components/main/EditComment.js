import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_comment.scss";
import comment_more from "../../assets/images/logos/comment_more.png";
import like from "../../assets/images/logos/like.png";
import { formatDate_time } from '../../utils/changeFormat';

const EditComment = ({ comment, writerProfileImageUrl, onsave }) => {
    const [body, setBody] = useState('');
    const commentId = comment.commentId;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    const Server_IP = process.env.REACT_APP_Server_IP;
      
    useEffect(() => {
      // Component mount 시 post로부터 초기값을 설정
      setBody(comment.body);
  }, [comment]);

 console.log(comment);

    const saveEditClick = async () => {
        try {
            const requestBody = {
                body: body
            };

            const url = `${Server_IP}/post-service/comment/${commentId}`;
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
                console.log('Success:', data);
                alert('댓글이 성공적으로 수정되었습니다.');
                onsave();
            } else {
                console.error('Error:', data);
                alert('댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('댓글 수정 중 오류가 발생했습니다.');
        }
    };

    return(
    <div className="comment-con">
        <div className="floating-history-comment-frame02">
              <div className="comment-save">
                <button onClick={saveEditClick} className="comment-edit-save">
                    <span>
                    저장
                    </span>
                </button>
              </div>
             
              <div className="comment-writer">
              <img
                  src={writerProfileImageUrl}
                  alt="댓글 작성자 프로필이미지"
                  className="comment-writer-profileimg"
                />
                <span className="comment-writer-nickname">
                  {userNickname}
                </span>
              </div>
              <span className="comment-content">
            <input 
              style={{ width: "350px"}} 
              type="text" 
              defaultValue={comment.body}
              onChange={(e) => setBody(e.target.value)} 
                />
              </span>
              <span className="comment-content-time">
                {formatDate_time(comment.createdAt)}
              </span>
            </div> 
    </div>
    );
    
};

export default EditComment;