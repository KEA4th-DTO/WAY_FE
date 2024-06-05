import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_reply.scss";
import comment_more from "../../assets/images/logos/comment_more.png";
import { formatDate_time } from '../../utils/changeFormat';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import Report from "./Report";
import EditReply from "./EditReply";

const Reply = ({ data, onDelete, userProfileimg }) => {
  console.log('답글정보: ', data);
  const token = localStorage.getItem("accessToken");
  const userNickname = localStorage.getItem("userNickname");
  const Server_IP = process.env.REACT_APP_Server_IP;

  const [likeNum, setLikeNum] = useState(data.likeCounts);
  const [liked, setLiked] = useState(data.isLiked);

  const replyId = data.replyId;
  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [body, setBody] = useState(data.body);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (replyId) {
      const url = `${Server_IP}/post-service/reply/${replyId}`;

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
    const confirmDelete = window.confirm("정말로 답글을 삭제하시겠습니까?");
    if (confirmDelete) {
      const url = `${Server_IP}/post-service/reply/${replyId}`;
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
          onDelete(replyId);
        } else {
          console.error("Error deleting post:", data.message);
        }
      })
      .catch(error => console.error("Error deleting post:", error));
    }
  };
  return (
    <>
    {editMode ? <EditReply reply={data} userProfileimg={userProfileimg} onsave={handleSaveClick} />
    :
    <div className="reply-con">
     {reportMode === true && (
          <div>
            <Report 
              targetId = {replyId}
              type = "REPLY"
              onClose={handleBackClick}
            />
          </div>
        )}
     <div className="reply-frame">
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
                className="reply-more-img"/>
          
            </DropdownToggle>
                {data.isOwned 
                ?(<DropdownMenu  style={{marginLeft:"230px", marginTop:"5px", width:"100px", height:"55px"}}>
                  <DropdownItem className="comment-drop" onClick={handleEditClick}>수정하기</DropdownItem>
                  <DropdownItem className="comment-drop" onClick={handleDeleteClick}>삭제하기</DropdownItem>
                  {/* <DropdownItem divider />
                  <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem> */}
                </DropdownMenu>)
                :(<DropdownMenu>
                  <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem>
                </DropdownMenu>)}
              
            </Dropdown>
             
              <div className="reply-writer">
              <img
                  src={data.writerProfileImageUrl}
                  alt="댓글 작성자 프로필이미지"
                  className="reply-writer-profileimg"
                />
                <span className="reply-writer-nickname">
                  {data.writerNickname}
                </span>
              </div>
              <span className="reply-content">
                <span>{body}</span>
              </span>
              <span className="reply-content-time">
                <span>{formatDate_time(data.createdAt)}</span>
              </span>
            </div> 

            
    </div>
    }
    </>
  );
};

export default Reply;