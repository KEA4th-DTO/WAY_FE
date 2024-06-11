import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import user7 from "../../assets/images/users/user7.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { shareKakao } from '../../utils/shareKakaoLink';
import { formatDate2, formatPeriod } from '../../utils/changeFormat';
import EditDailyPost from './EditDailyPost';
import Report from './Report';
import { useNavigate } from 'react-router-dom';
import ChatContent from '../../components/main/ChatContent';


const DailyPost = ({ postId, writerNickname, writerProfileImageUrl, onDelete }) => {
        // null 체크를 위해 미리 초기화
        const [post, setPost] = useState([]);
        const [likeNum, setLikeNum] = useState(0);
        const [liked, setLiked] = useState(false); //좋아요 상태인지 아닌지
        const [followed, setFollowed] = useState(false);
        const [editMode, setEditMode] = useState(false);
        const [chatMode, setChatMode] = useState(false);
        const [reportMode, setReportMode] = useState(false);
        const friendNickname = writerNickname;
        const token = localStorage.getItem("accessToken");
        const userNickname = localStorage.getItem("userNickname");
        const Server_IP = process.env.REACT_APP_Server_IP;
        const navigate = useNavigate();
        
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours());

        const [dropdownOpen, setDropdownOpen] = React.useState(false);

        const toggle = () => setDropdownOpen((prevState) => !prevState);

        // console.log('시간: ', currentTime);
        
        useEffect(() => {
          if (postId) {
            const url = `${Server_IP}/post-service/daily/${postId}`;

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
                console.log("게시글 정보:", data.result);
                setPost(data.result);
                setLikeNum(data.result.likesCount);
                setLiked(data.result.isLiked);
              } else {
                console.error("Error in API response:", data.message);
              }
            })
            .catch(error => console.error("Error fetching data:", error));
          }
        }, [userNickname, token, editMode]);
      
        // console.log('만료: ',post.expiredAt);

        // useEffect(() => {
        //     // 데이터의 초기 좋아요 상태에 따라 liked 상태 설정
        //     setLiked(post.likesCount);
        // }, [data]);

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
              console.log("팔로우 상태:", data.result.isFollowing);
              setFollowed(data.result.isFollowing);
            } else {
              console.error("Error in API response:", data.message);
            }
          })
          .catch(error => console.error("Error fetching data:", error));
        }, [followed, friendNickname]);

        
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

         // 채팅버튼 클릭 시
         const handleChatClick = () => {
          setChatMode(true);
        };

        // 뒤로가기 버튼 클릭 처리
        const handleBackClick = () => {
          setReportMode(false);
          setChatMode(false);
        };

        const handleDeleteClick = () => {
          const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
          if (confirmDelete) {
            const url = `${Server_IP}/post-service/daily/${postId}`;
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
                onDelete(postId);
              } else {
                console.error("Error deleting post:", data.message);
              }
            })
            .catch(error => console.error("Error deleting post:", error));
          }
        };
        
        const handleMapClick = () => {
          navigate('/othersmap', { state: writerNickname });
        };

    return(
      <>
      {editMode ? <EditDailyPost post={post} writerProfileImageUrl={writerProfileImageUrl} onsave={handleSaveClick} />
      : <div className="dailypost-frame">
          {reportMode === true && (
          <div className='report-daily'>
            <Report 
              targetId = {post.postId}
              type = "POST"
              onClose={handleBackClick}
            />
          </div>
        )}
         {chatMode === true && (
          <div className='chat-daily'>
            <ChatContent
              postId = {post.postId}
              title = {post.title}
              period =  {formatDate2(post.createdAt, post.expiredAt)}
              nickname = {writerNickname}
              onClose={handleBackClick}
            />
          </div>
        )}
      <div className="dailypost-frame1"> 
      <div className="dailypost-frame3">
          <button className="dailypost-frame4" onClick={handleMapClick}>
            <img 
              alt="사용자 프로필 이미지" 
              src={writerProfileImageUrl || user7} 
              className="dailypost-profileimage" />
            <span className="dailypost-text10">
              <span>{writerNickname}</span>
            </span>
          </button>
          <img
            alt="postType, 핀 이미지"
            src={full_dailyPin}
            className="dailypost-daily-pin-filled"
          />
          <button className="dailypost-text12" onClick={followed ? handleUnfollowClick : handleFollowClick} >
              <span style={{ color: followed ? "#404DF2" : "#000" }}> {followed ? "팔로잉" : "팔로우"}</span>
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
            <img src={more} alt="profile" className="dailypost-menubutton" />
          </DropdownToggle>
              {post.isOwned 
              ?(<DropdownMenu style={{marginLeft:"230px", marginTop:"20px"}}>
                <DropdownItem header>Edit</DropdownItem>
                <DropdownItem onClick={handleEditClick}>수정하기</DropdownItem>
                <DropdownItem onClick={handleDeleteClick}>삭제하기</DropdownItem>
                {/* <DropdownItem divider />
                <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem> */}
              </DropdownMenu>)
              :(<DropdownMenu style={{marginLeft:"230px", marginTop:"20px"}}>
                <DropdownItem header>Report</DropdownItem>
                <DropdownItem onClick={handleReportClick}>신고하기</DropdownItem>
              </DropdownMenu>)}
              
            </Dropdown>

          {/* <button style={{border: "none"}}>
          <img
            alt="더보가"
            src={more}
            className="dailypost-menubutton"
          />
          </button> */}
        </div>
      </div>
        <div className="dailypost-post1-history">
          <img alt="게시글 이미지" src={post.imageUrl} className="dailypost-image" />
        </div>

        <div className="dailypost-frame2">
          <span className="dailypost-text08">
            {post.title}
          </span>
          {/* <span style={{border: "3px solid yellow"}} className="dailypost-text02">
            {post.postType}
          </span> */}
          <span className="dailypost-text04">
              {post.body}
          </span>
          <span className="dailypost-text">
            <span>
              {formatDate2(post.createdAt, post.expiredAt)} {formatPeriod(currentTime, post.expiredAt)} 남았습니다.
            </span>
            </span>
        </div>
       
      <div className="dailypost-group99">
        
        <div className="dailypost-frame7">
          <button style={{ border: "none" }} onClick={handleLikeClick}>
              <img
                  alt="좋아요"
                  src={liked === true ? full_like : like}
                  className="dailypost-svg"
              />
          </button>
         
          <span className="dailypost-text16">
            <span>{likeNum}</span>
          </span>
        </div>
        <button className="dailypost-frame6" onClick={() => shareKakao()}>
          <img
            alt="공유하기"
            src={share}
            className="dailypost-vector"
          />
        </button>
        <button className="dailypost-frame5"  onClick={handleChatClick}>
          <span className="dailypost-text14">
            쪽지하기
          </span>
        </button>
      </div>
      
    </div>}

      
      </>
    );
    
};

export default DailyPost;
