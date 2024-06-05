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

const Comment = ({ data, onDelete }) => {
  console.log('댓정보: ', data);
  const token = localStorage.getItem("accessToken");
  const userNickname = localStorage.getItem("userNickname");
  const Server_IP = process.env.REACT_APP_Server_IP;

  const [likeNum, setLikeNum] = useState(data.likeCounts);
  const [liked, setLiked] = useState(data.isLiked);
  const [replyNum, setReplyeNum] = useState(data.replyCounts);

  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const commentId = data.commentId;
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
            console.log("Successfully liked post:", data);
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
          console.log("Successfully deleted post:", data);
          onDelete(commentId);
        } else {
          console.error("Error deleting post:", data.message);
        }
      })
      .catch(error => console.error("Error deleting post:", error));
    }
  };
  return (
    <>
    {editMode ? <EditComment comment={data} writerProfileImageUrl={data.writerProfileImageUrl} onsave={handleSaveClick} />
    :
    <div className="comment-con">
     {reportMode === true && (
          <div>
            <Report 
              targetId = {commentId}
              type = "COMMENT"
              onClose={handleBackClick}
            />
          </div>
        )}
     <div className="floating-history-comment-frame02">
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
              <button className="comment-reply">
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
                  <DropdownItem  className="comment-drop">답글달기</DropdownItem>
                  {/* <DropdownItem divider />
                  <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem> */}
                </DropdownMenu>)
                :(<DropdownMenu>
s                  <DropdownItem >답글 달기</DropdownItem>
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
    </>
  );
};

export default Comment;

 {/* ------------댓글------------- */}
// 
            {/* ------------답글------------- */}
           
           {/* <div style={{border: "3px solid green"}} id='답글 컨테이너' className="floating-history-comment-frame19">
             <div style={{border: "3px solid orange"}} className="floating-history-comment-frame14">
                 <img
                     src={like}
                     alt="좋아요"
                     className="floating-history-comment-image3"
                 />
                 <span className="floating-history-comment-text034">0</span>
                 </div>
             <div style={{border: "3px solid green"}} id='답글 컨텐츠' className="floating-history-comment-frame12">
               <span className="floating-history-comment-text028">
                 <span>답글 내용입니다!</span>
               </span>
               <span className="floating-history-comment-text030">
                 <span>답글 작성 날짜</span>
               </span>
                 <div className="floating-history-comment-frame13">
                 <img
                   src={user3}
                   alt="댓글 작성자 프로필이미지"
                   className="floating-history-comment-freeiconuser1490711"
                 />
                     <span className="floating-history-comment-text032">
                     <span>아이디</span>
                     </span>
                 </div>
                 <img
                     src={comment_more}
                     alt="더보기"
                     className="floating-history-comment-image2"
                 />
             </div>
             <div className="floating-history-comment-frame08">
               <div className="floating-history-comment-frame10">
                 <span className="floating-history-comment-text026">
                   <span>댓글 달기</span>
                 </span>
               </div>
               <div className="floating-history-comment-frame09">
                 <span className="floating-history-comment-text024">
                   <span>신고하기</span>
                 </span>
               </div>
             </div>
           </div> */}
 
          {/* ------------댓글 작성칸------------- */}
    
           {/* <div style={{border: "3px solid green"}} className="floating-history-comment-group45">
             <img
               src="/external/rectangle391351-s4js.svg"
               alt="Rectangle391351"
               className="floating-history-comment-rectangle39"
             />
             <div style={{border: "3px solid green"}} className="floating-history-comment-group36">
               <div className="floating-history-comment-group27">
                 <span className="floating-history-comment-text059">
                   <span>10술집</span>
                 </span>
               </div>
               <img
                 src={user3}
                 alt="작성자 프로필이미지"
                 className="floating-history-comment-freeiconuser14907112"
               />
             </div>
             <img
             style={{border: "3px solid green"}}
               src="/external/rectangle401351-jkhk-200h.png"
               alt="Rectangle401351"
               className="floating-history-comment-rectangle40"
             />
             
                 <div style={{border: "3px solid green"}} className="floating-history-comment-frame25">
                 <span className="floating-history-comment-text061">
                     <span>등록</span>
                 </span>
                 </div>
                 <span className="floating-history-comment-text063">
                 <span>댓글을 입력해주세요.</span>
                 </span>
           </div> */}
   {/* </div> */}
