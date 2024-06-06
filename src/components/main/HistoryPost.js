import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_historypost.scss";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";

import user3 from "../../assets/images/users/user3.jpg";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";
import comment from "../../assets/images/logos/comment.png";
import more from "../../assets/images/logos/more.png";
import close from "../../assets/images/logos/close.png";
import EditorViewer from './EditorViewer.tsx';
import Comment from './Comment';
import basic_profile from "../../assets/images/users/basic_profile.png";
import Report from './Report.js';
import EditHistoryPost from './EditHistoryPost';
import { useNavigate } from 'react-router-dom';


const HistoryPost = ({ postId, thumbnail, writerNickname, writerProfileImageUrl, onClose }) => {
     // null 체크를 위해 미리 초기화
     const [post, setPost] = useState([]);
     const [commentBody, setCommentBody] = useState('');
     const [likeNum, setLikeNum] = useState(0);
     const [liked, setLiked] = useState(false);
     const [commentNum, setCommentNum] = useState(0);
     const [followed, setFollowed] = useState(false);
     const [comments, setComments] = useState([]);
     const [userProfileimg, setUserprofileimg] = useState(false);
     const friendNickname = writerNickname;

     const [editMode, setEditMode] = useState(false);
     const [reportMode, setReportMode] = useState(false);
     const [commentState, setCommentState] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);  // 추가된 상태 변수

     const token = localStorage.getItem("accessToken");
     const Server_IP = process.env.REACT_APP_Server_IP;
     const userNickname = localStorage.getItem("userNickname");
     const [dropdownOpen, setDropdownOpen] = React.useState(false);
     const navigate = useNavigate();

     const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (postId) {
      const url = `${Server_IP}/post-service/history/${postId}`;
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
          console.log('성공; ', data.result);
          // console.log('썸네일이미지', thumbnail);
          setPost(data.result);
          setLikeNum(data.result.likesCount);
          setLiked(data.result.isLiked);
          setCommentNum(data.result.commentsCount);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
    }
  }, [postId, editMode]);

  useEffect(() => {

    const url = `${Server_IP}/member-service/follow/follow-status/${friendNickname}`;

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
        // console.log("팔로우 상태:", data.result.isFollowing);
        setFollowed(data.result.isFollowing);
      } else {
        console.error("Error in API response:", data.message);
      }
    })
    .catch(error => console.error("Error fetching data:", error));
  }, [followed, friendNickname]);

  const handleFollowClick = async () => {
    try {
        const url = `${Server_IP}/member-service/follow/${friendNickname}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            },
            body: ''  // 이 API는 요청 본문을 필요로 하지 않습니다.
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Network response was not ok: ' + response.statusText + ', ' + errorText);
        }

        const data = await response.json();

        if (data.isSuccess) {
            alert(`${friendNickname}님을 팔로잉하였습니다.`);
            setFollowed(true); // 팔로우 상태를 업데이트합니다.
        } else {
            console.error("Error in API response:", data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error("Error following user:", error);
    }
};

const handleUnfollowClick = async () => {
  try {
    const url = `${Server_IP}/member-service/follow/following-list/${friendNickname}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`
          },
          body: ''  // 이 API는 요청 본문을 필요로 하지 않습니다.
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Network response was not ok: ' + response.statusText + ', ' + errorText);
      }

      const data = await response.json();

      if (data.isSuccess) {
          alert(`${friendNickname}님을 언팔로우하였습니다.`);
          setFollowed(false); // 팔로우 상태를 업데이트합니다.
      } else {
          console.error("Error in API response:", data.message);
      }
  } catch (error) {
      console.error("Error following user:", error);
  }
};
  const handleLikeClick = () => {
    // 좋아요 로직 추가
    const url = `${Server_IP}/post-service/posts/like/${postId}`;
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
            setLikeNum(data.result.likesCount);
            alert(data.message);
            setLiked(!liked);
            console.log("Successfully liked post:", data);
        } else {
            console.error("Error liking post:", data.message);
        }
    })
    .catch(error => console.error("Error unliking post:", error));
    };

  const handleCloseClick = () => {
    onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
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
  const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
  if (confirmDelete) {
    const url = `${Server_IP}/post-service/history/${postId}`;
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
        onClose();
      } else {
        console.error("Error deleting post:", data.message);
      }
    })
    .catch(error => console.error("Error deleting post:", error));
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

const handleDelete = (deletedId) => {
  setComments(comments.filter(item => item.commentId !== deletedId));
  setCommentNum(commentNum - 1);
};

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
      // console.log('댓글:', data.result.commentResultDtoList);
    } else {
      console.error("Error in API response:", data.message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  // console.log('html: ', post.bodyHtmlUrl);

  const formattedTime = new Date(post.createdAt).toLocaleString('ko-KR');

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
          console.log('댓글이 생성되었습니다:', data.result);
          setCommentBody(''); // Clear the comment input
          setCommentNum(commentNum + 1);
          ClickComment();
          alert('댓글이 생성되었습니다.');
      } else {
          console.error("Error in API response:", data.message);
      }
      setIsSubmitting(false);  // 제출 완료

    } catch (error) {
        console.error("Error posting comment:", error);
        setIsSubmitting(false);  // 오류 발생 시 제출 상태 초기화

    }
};

const handleMapClick = () => {
  navigate('/othersmap', { state: writerNickname });
};

  return (
    <>
    {editMode ? <EditHistoryPost post={post} writerProfileImageUrl={writerProfileImageUrl} onsave={handleSaveClick} thumbnail={thumbnail} />
    : 
<div className="history-con">
  {reportMode === true && (
    <div className='report-his'>
      <Report 
        targetId = {postId}
        type = "POST"
        onClose={handleBackClick}
      />
    </div>
  )}
    <div>   
      <img
      src={close}
      alt="닫기"
      className="close-img"
      onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
    />
     <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                position: 'fixed', // 고정 위치
                top: '15px', // 원하는 위치
                right: '40px' // 원하는 위치
            }}
        >
            <img src={more} alt="profile" className="more-img" />
        </DropdownToggle>
        {post.isOwned 
            ? (
                <DropdownMenu style={{ position: 'fixed', top: '60px', right: '40px', marginRight:"40px", marginTop:"20px" }}>
                    <DropdownItem header>Edit</DropdownItem>
                    <DropdownItem onClick={handleEditClick}>수정하기</DropdownItem>
                    <DropdownItem onClick={handleDeleteClick}>삭제하기</DropdownItem>
                </DropdownMenu>
              )
            : (
                <DropdownMenu style={{ position: 'fixed', top: '45px', right: '40px' }}>
                    <DropdownItem header>Report</DropdownItem>
                    <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem>
                </DropdownMenu>
              )}
    </Dropdown>
    </div>
      {/* -------------게시글------------ */}
     
      <div className="history-frame">
        <span className="intro-postType">
          <span>History</span>
        </span>
        <span className="intro-title">
          {post.title}
        </span>
          <div id='작성자 정보' className="intro-writer">
            <button className="intro-writer-profileimg" onClick={handleMapClick}>
              <img
                src={writerProfileImageUrl || user3}
                className="profileimg"
              />
            </button>
            <span className="intro-writer-nickname">
              <span>{writerNickname}</span>
            </span>
            <button className="intro-follow"  onClick={followed ? handleUnfollowClick : handleFollowClick} >
              <span style={{ color: followed ? "#404DF2" : "#000" }}> {followed ? "팔로잉" : "팔로우"}</span>
            </button>
            <span className="intro-createAt">
              {formattedTime}
            </span>
          </div>

        {/* -------------게시글 내용------------ */}    
        <div className="frame-content">
        <div className="intro-thumbnail">
          <img
            src={thumbnail}
            alt="썸네일 이미지"
            className="thumbnail-img"
          />
        </div>
        {post.body ? <EditorViewer contents={post.body} /> : <div>Loading...</div>}
           
          
          {/* -------------해시태그------------ */}
          {/* <div style={{border: "3px solid red"}} id='해시태그' className="frame-hashtag">
              <span className="frame-hashtag-text"> #짱구 </span>
          </div> */}

          {/* -------------게시글 좋아요수, 댓글수------------ */}
          <div className='frame-like-and-comment'>
            <div className="frame-like">
              <button style={{ border: "none" }} onClick={handleLikeClick}>
                <img
                    alt="좋아요"
                    src={liked === true ? full_like : like}
                    className="frame-like-img"
                />
            </button>
           
              <span id='좋아요 수' className="frame-like-text">
                {likeNum}
              </span>
            </div>
            <div className="frame-comment">
            <button onClick={() => { ClickComment(); setCommentState(!commentState); }} style={{border:"none", backgroundColor:"#fff"}}>
              <img
                src={comment}
                alt="게시글 댓글"
                className="frame-like-img"
              />
              </button>
              <span id='댓글 수' className="frame-like-text">
                {commentNum}
              </span>
            </div>
          </div>
        </div>
      

      <div className='comment-container'>
      {commentState === true && comments.length > 0 && (
            comments.map((item) => (
              <div>
                <Comment data={item} onDelete={handleDelete} userProfileimg={userProfileimg}></Comment>
              </div>
            ))
          )}
      {comments &&
      <div className="comment-post-con">
          <div className="comment-post-frame">
            <div className="comment-post-writer">
              <span className="comment-post-writer-nickname">
                {userNickname}
              </span>
            </div>
            <img
              src={userProfileimg || basic_profile}
              className="comment-post-writer-profileimg"
              
            />
          </div>
            <input 
            className="comment-post-text"
              type="text" 
              placeholder="댓글을 입력하세요." 
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)} 
                />
             <button className="comment-post-save" onClick={SaveComment} disabled={isSubmitting}>
              <span className="comment-post-save-text">
              {isSubmitting ? '등록 중' : '등록'}
              </span>
              </button>
        </div>}
    </div>
      
      
     
  </div>
</div>
}
</>
    
  );
};

export default HistoryPost;
