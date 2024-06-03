import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import basic_profile from "../../assets/images/users/basic_profile.png";
import user7 from "../../assets/images/users/user7.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import { formatDate_time } from '../../utils/changeFormat';

const EditHistoryPost = ({ post, writerProfileImageUrl, onsave, thumbnail }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const postId = post.postId;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    const Server_IP = process.env.REACT_APP_Server_IP;
      
    console.log(post);

    useEffect(() => {
      // Component mount 시 post로부터 초기값을 설정
      setTitle(post.title);
      setBody(post.body);
  }, [post]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        setImagePreview(reader.result);
    };
    if (file) {
        reader.readAsDataURL(file);
    }
};

    const saveEditClick = async () => {
        try {
            const requestBody = {
                title: title,
                body: body
            };

            const url = `${Server_IP}/post-service/history/${postId}`;
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

    const formattedTime = new Date(post.createdAt).toLocaleString('ko-KR');

    return(
    <div style={{border: "3px solid red"}}className="history-con">
      
        <div style={{border: "3px solid yellow"}} className="history-frame">
        <button className="edit-save" onClick={saveEditClick}>
            <span className="edit-save-text">
              저장하기
            </span>
          </button>
            {/* -------------게시글------------ */}
            <div>
              <span style={{border: "3px solid green"}} className="intro-postType">
                <span>History</span>
              </span>
              <span className="intro-title">
                제목: 
                <input 
                style={{border: "3px solid yellow"}} 
                type="text" 
                defaultValue={post.title}
                onChange={(e) => setTitle(e.target.value)} 
                />
              </span>
              
              <span className="intro-createAt">
                  {formattedTime}
              </span>
                <div style={{border: "3px solid red"}} id='작성자 정보' className="intro-writer">
                  <div className="intro-writer-profileimg">
                    <img
                      src={writerProfileImageUrl || basic_profile}
                      className="profileimg"
                    />
                  </div>
                  <span className="intro-writer-nickname">
                    <span>{userNickname}</span>
                  </span>
                  <button className="intro-follow" >
                      <span style={{ color: "#000" }}>팔로우</span>
                  </button>
                </div>
                <div className="intro-thumbnail">
                    <span className='intro-thumbnail-text'>
                        썸네일 이미지 :
                    </span>
                    <input type="file" onChange={handleImageUpload} accept="image/*" />
                    <div className="image-container">
                        {imagePreview || thumbnail ? (
                            <img src={imagePreview || thumbnail} alt="이미지 미리보기" className='thumbnail-img' />
                        ) : null}
                    </div>
                </div>
              {/* -------------게시글 내용------------ */}    
                <div style={{border: "3px solid red"}} className="frame-content">
                
                    {/* {post.body ? <EditorViewer contents={post.body} /> : <div>Loading...</div>} */}
                </div>
           </div>
        </div>   
    </div>   
    );
    
};

export default EditHistoryPost;