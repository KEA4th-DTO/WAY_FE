import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import user7 from "../../assets/images/users/user7.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import { formatDate2 } from '../../utils/changeFormat';

const EditDailyPost = ({ post, writerProfileImageUrl, onsave }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const postId = post.postId;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
      
    console.log(post);

    useEffect(() => {
      // Component mount 시 post로부터 초기값을 설정
      setTitle(post.title);
      setBody(post.body);
  }, [post]);


    const saveEditClick = async () => {
        try {
            const requestBody = {
                title: title,
                body: body
            };

            const response = await fetch(`http://210.109.55.124/post-service/daily/${postId}`, {
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
                alert('게시글이 성공적으로 수정되었습니다.');
                onsave();
            } else {
                console.error('Error:', data);
                alert('게시글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    };

    return(
      <div style={{border: "3px solid red"}} className="dailypost-frame">
        <div style={{border: "3px solid red"}} className="dailypost-frame1"> 
        <div style={{border: "3px solid orange"}} className="dailypost-frame3">
            <div className="dailypost-frame4">
              <img 
                alt="사용자 프로필 이미지" 
                src={writerProfileImageUrl || user7} 
                className="dailypost-profileimage" />
              <span className="dailypost-text10">
                <span>{userNickname}</span>
              </span>
            </div>
            <img
              alt="postType, 핀 이미지"
              src={full_dailyPin}
              className="dailypost-daily-pin-filled"
            />
            <button className="dailypost-text12">
                <span style={{ color: "#000" }}>팔로우</span>
            </button>

            <button style={{border: "none"}}>
            <img
              alt="더보가"
              src={more}
              className="dailypost-menubutton"
            />
            </button>

          </div>
        </div>
          <div style={{border: "3px solid orange"}} className="dailypost-post1-history">
            <img alt="게시글 이미지" src={post.imageUrl} className="dailypost-image" />
          </div>

          <div style={{border: "3px solid yellow"}} className="dailypost-frame2">
          <span className="dailypost-text08">
            제목: 
            <input 
            style={{border: "3px solid yellow"}} 
            type="text" 
            defaultValue={post.title}
            onChange={(e) => setTitle(e.target.value)} 
                />
            </span>
        
            <span style={{border: "3px solid yellow"}} className="dailypost-text04">
                내용: 
                <input 
              style={{border: "3px solid yellow", width: "350px"}} 
              type="text" 
              defaultValue={post.body}
              onChange={(e) => setBody(e.target.value)} 
                />
            </span>
            <span style={{border: "3px solid green"}} className="dailypost-text">
                {formatDate2(post.createdAt, post.expiredAt)} 남았습니다.
              </span>
          </div>
         
        <div style={{border: "3px solid green"}} className="dailypost-group99">
          
          <div className="dailypost-frame7">
            <button style={{ border: "none" }}>
                <img
                    alt="좋아요"
                    src={like}
                    className="dailypost-svg"
                />
            </button>
           
            <span className="dailypost-text16">
             {post.likesCount}
            </span>
          </div>
          <button className="dailypost-frame6" >
            <img
              alt="공유하기"
              src={share}
              className="dailypost-vector"
            />
          </button>
          <button className="dailypost-frame5" onClick={saveEditClick}>
            <span className="dailypost-text14">
              저장하기
            </span>
          </button>
        </div>
        
      </div>
    
    );
    
};

export default EditDailyPost;