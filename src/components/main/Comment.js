import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_comment.scss";
import comment_more from "../../assets/images/logos/comment_more.png";
import { formatDate_time } from '../../utils/changeFormat';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";
import EditComment from "./EditComment";
import Report from "./Report";
import reply from "../../assets/images/logos/comment.png";
import Reply from "./Reply";
import basic_profile from "../../assets/images/users/basic_profile.png";

const Comment = ({ data, onDelete, userProfileimg }) => {
  // console.log('댓정보: ', data);
  const token = localStorage.getItem("accessToken");
  const userNickname = localStorage.getItem("userNickname");
  const Server_IP = process.env.REACT_APP_Server_IP;

  const [likeNum, setLikeNum] = useState(data.likeCounts);
  const [liked, setLiked] = useState(data.isLiked);
  const [replyBody, setReplyBody] = useState('');
  const [replyNum, setReplyNum] = useState(data.replyCounts);

  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [replyState, setReplyState] = useState(false);
  const [createReplyState, setCreateReplyState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // 추가된 상태 변수

  const commentId = data.commentId;
  const [replys, setReplys] = useState([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [body, setBody] = useState(data.body);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (commentId) {
      const url = `${Server_IP}/post-service/comment/${commentId}`;

      fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
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
          setBody(data.result.body);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
    }
  }, [userNickname, token, editMode]);

  const handleLikeClick = () => {
    // 좋아요 로직 추가
    const url = `${Server_IP}/post-service/comment/like/${commentId}`;
    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
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
            setLikeNum(data.result.commentLikesCount);
            alert(data.message);
            setLiked(!liked);
            // console.log("Successfully liked post:", data);
        } else {
            console.error("Error liking post:", data.message);
        }
    })
    .catch(error => console.error("Error unliking post:", error));
    };

  const handleEditClick = () => {
    setEditMode(true);
};

 // 수정창에서 저장버튼 클릭 시
  const handleSaveClick = () => {
    setEditMode(false);
  };

  // 수정창에서 신고버튼 클릭 시
  const handleReportClick = () => {
    setReportMode(true);
  };

  // 뒤로가기 버튼 클릭 처리
  const handleBackClick = () => {
    setReportMode(false);
  };

  const handleReplyClick = () => {
    setCreateReplyState(true);
  };

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm("정말로 댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      const url = `${Server_IP}/post-service/comment/${commentId}`;
      fetch(url, {
        method: 'DELETE',
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
          // console.log("Successfully deleted post:", data);
          onDelete(commentId);
        } else {
          console.error("Error deleting post:", data.message);
        }
      })
      .catch(error => console.error("Error deleting post:", error));
    }
  };

  const ClickComment = async () => {
    try {
      if (!commentId) return;
      const url = `${Server_IP}/post-service/reply/list/${commentId}`;
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
        setReplys(data.result.replyResultDtoList);
        // console.log('답글:', data.result.replyResultDtoList);
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (deletedId) => {
    setReplys(replys.filter(item => item.replyId !== deletedId));
    setReplyNum(replyNum - 1);
  };

  const SaveReply = async () => {
    try {
      if (replyBody.trim() === '' || isSubmitting) {
        return;
      }
      setIsSubmitting(true);  // 제출 시작

      const url = `${Server_IP}/post-service/reply/${commentId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ body: replyBody })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        if (data.isSuccess) {
            alert('답글이 생성되었습니다.');
            // console.log('답글이 생성되었습니다:', data.result);
            setReplyBody(''); // Clear the comment input
            setReplyNum(replyNum + 1);
            ClickComment();
            setReplyState(true);
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
    <>
    {editMode ? <EditComment comment={data} writerProfileImageUrl={data.writerProfileImageUrl} onsave={handleSaveClick} />
    :
    <div className="comment-con">
     {reportMode === true && (
          <div className="report-comment">
            <Report 
              targetId = {commentId}
              type = "COMMENT"
              onClose={handleBackClick}
            />
          </div>
        )}
     <div className="comment-frame">
              <button className="comment-like" onClick={handleLikeClick}>
                  <img
                      src={liked === true ? full_like : like}                      
                      alt="좋아요"
                      className="comment-like-img"
                  />
                  <span className="comment-like-text">
                      <span>{likeNum}</span>
                  </span>
              </button>
              <button className="comment-reply"  onClick={() => { ClickComment(); setReplyState(!replyState); if(createReplyState === false){setCreateReplyState(!createReplyState)}}} >
                  <img
                      src={reply}
                      alt="답글"
                      className="comment-like-img"
                  />
                  <span className="comment-like-text">
                      <span>{replyNum}</span>
                  </span>
              </button>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
              }}
            >
              <img src={comment_more}
                alt="댓글 더보기"
                className="comment-more-img"/>
          
            </DropdownToggle>
                {data.isOwned 
                ?(<DropdownMenu  style={{marginLeft:"230px", marginTop:"5px", width:"100px", height:"90px"}}>
                  <DropdownItem className="comment-drop" onClick={handleEditClick}>수정하기</DropdownItem>
                  <DropdownItem className="comment-drop" onClick={handleDeleteClick}>삭제하기</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem  onClick={handleReplyClick} className="comment-drop">답글달기</DropdownItem>
                  {/* <DropdownItem divider />
                  <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem> */}
                </DropdownMenu>)
                :(<DropdownMenu style={{marginLeft:"230px", marginTop:"5px", width:"100px", height:"60px"}}>
                  <DropdownItem onClick={handleReplyClick}>답글 달기</DropdownItem>
                  <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem>
                </DropdownMenu>)}
              
            </Dropdown>
             
              <div className="comment-writer">
              <img
                  src={data.writerProfileImageUrl}
                  alt="댓글 작성자 프로필이미지"
                  className="comment-writer-profileimg"
                />
                <span className="comment-writer-nickname">
                  {data.writerNickname}
                </span>
              </div>
              <span className="comment-content">
                <span>{body}</span>
              </span>
              <span className="comment-content-time">
                <span>{formatDate_time(data.createdAt)}</span>
              </span>
            </div> 

            
    </div>
    }
     <div className='reply-container'>
      {replyState === true && replys.length > 0 && (
            replys.map((item) => (
              <div>
                <Reply data={item} onDelete={handleDelete} userProfileimg={userProfileimg}></Reply>
              </div>
            ))
          )}
      {createReplyState === true &&
     (<div className="create-reply-con">
     <div className="create-reply-frame">
           <div className="create-reply-save">
             <button className="create-reply-edit-save" onClick={SaveReply} disabled={isSubmitting}>
                 <span>
                 {isSubmitting ? '등록 중' : '등록'}
                 </span>
             </button>
             <button className="create-reply-edit-save2" onClick={() => {setCreateReplyState(false)}}>
                 <span>
                 취소
                 </span>
             </button>
           </div>
          
           <div className="create-reply-writer">
           <img
               src={userProfileimg}
               alt="댓글 작성자 프로필이미지"
               className="create-reply-writer-profileimg"
             />
             <span className="create-reply-writer-nickname">
               {userNickname}
             </span>
           </div>
           <span className="create-reply-content">
         <input 
           className="create-reply-post-text"
           type="text" 
           placeholder="답글을 입력하세요." 
           value={replyBody}
           onChange={(e) => setReplyBody(e.target.value)} 
             />
           </span>
         </div> 
      </div>)
        }
    </div>
    </>
  );
};

export default Comment;