import React, { useState, useEffect, useRef } from 'react';
import "../../assets/scss/layout/_historypost.scss";
import basic_profile from "../../assets/images/users/basic_profile.png";
import close from "../../assets/images/logos/close.png";
import comment from "../../assets/images/logos/comment.png";
import like from "../../assets/images/logos/like.png";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const EditHistoryPost = ({ post, writerProfileImageUrl, onsave, thumbnail }) => {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(thumbnail);
    const [latitude, setLatitude] = useState(post.latitude);
    const [longitude, setLongitude] = useState(post.longitude);
    const [address, setAddress] = useState(post.address);

    const editorRef = useRef();
    const [bodyPreview, setBodyPreview] = useState(''); // 본문 미리보기
    const [bodyPlainText, setBodyPlainText] = useState(''); // 본문 텍스트만 저장

    const postId = post.postId;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    const Server_IP = process.env.REACT_APP_Server_IP;
      
    // console.log(post);

  //   useEffect(() => {
  //     // Component mount 시 post로부터 초기값을 설정
  //     setTitle(post.title);
  //     setBody(post.body);
  // }, [post]);

  // Toast-UI Editor 에 HTML 표시
useEffect(() => {
  // 1. DB에서 가져온 HTML이라고 가정
  const htmlString = post.body;

  // 2. Editor DOM 내용에 HTML 주입
  editorRef.current?.getInstance().setHTML(htmlString);
}, []);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  setImage(file);
  reader.onloadend = () => {
      setImagePreview(reader.result);
  };
  if (file) {
      reader.readAsDataURL(file);
  }
};

const handleCloseClick = () => {
  onsave(); // 부모 컴포넌트에 닫기 이벤트 전달
};

const saveEditClick = async () => {
  try {
    const formData = new FormData();
    formData.append('thumbnailImage', image); // Append the thumbnail image

    const updateHistoryDto = {
      title,
      body: body,
      latitude,
      longitude,
      address,
      bodyPreview,
      bodyPlainText,
    };
    
    formData.append('updateHistoryDto', new Blob([JSON.stringify(updateHistoryDto)], { type: 'application/json' })); // Append the updateHistoryDto

    const url = `${Server_IP}/post-service/history/${postId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    // console.log('formData:', formData);
    
    if (response.ok) {
      // console.log('Success:', data);
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

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    // console.log("에디터내용:", data);
  
    const markdown = editorRef.current.getInstance().getMarkdown();
    // 마크다운에서 이미지 구문 제거
    const textWithoutImages = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
    // HTML 태그 제거
    const textWithoutHTML = textWithoutImages.replace(/(<([^>]+)>)/ig, '');
    // 마크다운 문법 제거
    const textContent = textWithoutHTML.replace(/[#>*_~`[\]]+/g, '');

    setBody(data);
    setBodyPreview(textContent.slice(0, 35)); // 제한된 길이로 본문 미리보기 설정
    setBodyPlainText(textContent);
    // 저장할 textContent를 사용합니다.
    // console.log('텍스트 내용:', textContent);
  };

  const onUploadImage = async (blob, callback) => {
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('historyImage', blob); // Using 'historyImage' as the key
        const url = `${Server_IP}/post-service/history/upload-image`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                // Do not set 'Content-Type' manually
            },
            body: formData
        });

        // Capture full response details
        const data = await response.json();

        if (response.ok) {
            if (data.isSuccess) {
                const url = data.result;
                callback(url, "");
            } else {
                console.error("Error uploading image:", data.message);
                callback(null, data.message);
            }
        } else {
            console.error(`Error uploading image: ${response.status} ${response.statusText}`);
            callback(null, `Server responded with status: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        callback(null, error.message);
    }
    return false;
};

  const formattedTime = new Date(post.createdAt).toLocaleString('ko-KR');

    return(
      <div className="history-con">
      {/* -------------게시글------------ */}
    
      <div className="history-frame">
      <img
      src={close}
      alt="닫기"
      className="close-img"
      onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
    />
     <button className="edit-save" onClick={saveEditClick}>
        <span className="edit-save-text">
          수정하기
        </span>
      </button>
        <span className="intro-postType">
          <span>History</span>
        </span>
        <span className="intro-title">
        <input 
              className='intro-title-input'
              type="text" 
              defaultValue={post.title}
              onChange={(e) => setTitle(e.target.value)} 
              />
        </span>
          <div id='작성자 정보' className="intro-writer" style={{marginTop:"10px"}}>
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
              <span style={{ color: "#000" }}> 팔로우 </span>
            </button>
            <span className="intro-createAt">
              {formattedTime}
            </span>
          </div>

        {/* -------------게시글 내용------------ */}    
        <div className="frame-content">
          <div className="intro-thumbnail">
          <input type="file" onChange={handleImageUpload} accept="image/*" />
            {imagePreview && (
                <img src={imagePreview} alt="이미지 미리보기" className='thumbnail-img' />
            )}
          </div>

          <Editor
            ref={editorRef} // useRef로 DOM 연결
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={false}
            hideModeSwitch={false} //하단 타입 선택탭 숨기기
            // plugins={[colorSyntax]}
            onChange={onChange} // Update body state
            hooks={{
                addImageBlobHook: onUploadImage
              }}
            />
       
        </div>
      </div>
    </div> 
    );
    
};

export default EditHistoryPost;