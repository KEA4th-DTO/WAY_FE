import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '../../assets/scss/layout/_upload.scss';
import UploadHisMap from './UploadHisMap';
import axios from 'axios';


const EditorBox = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [bodyPreview, setBodyPreview] = useState(''); // 본문 미리보기
    const [bodyPlainText, setBodyPlainText] = useState(''); // 본문 텍스트만 저장

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 3); // 현재 시간에서 3시간을 빼기
    
    const [createdAt, setCreatedAt] = useState(currentTime.toISOString());    const [address, setAddress] = useState('');

    const [image, setImage] = useState(null);   
    const [imagePreview, setImagePreview] = useState(null);

    const [latitude, setLatitude] = useState(''); // [위도, 경도
    const [longitude, setLongitude] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);  // 추가된 상태 변수

    const { naver } = window;
    
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;

    useEffect(() => {
        // 컴포넌트가 처음 마운트될 때 한 번 실행
        const interval = setInterval(() => {
            // 매 초마다 현재 시간을 업데이트
            setCreatedAt(new Date().toISOString());
        }, 1000);

        // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 메모리 누수를 방지
        return () => clearInterval(interval);
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

    const onSave = async () => {
        try {
            if (!title || !address || !latitude || !longitude || !image || !body) {
                alert("모든 필드를 채워주세요.");
                return;
            }

            if (title.trim() === '' || isSubmitting) {
                return;
              }
            setIsSubmitting(true);  // 제출 시작
    
            const formData = new FormData();
            formData.append('thumbnailImage', image); // 썸네일 이미지 추가
            const historyDto = {
                title,
                body,
                latitude,
                longitude,
                address,
                bodyPreview,
                bodyPlainText,
            };
            formData.append('createHistoryDto', new Blob([JSON.stringify(historyDto)], { type: 'application/json' })); // createHistoryDto 추가
           
            const url = `${Server_IP}/post-service/history`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('저장되었습니다.');
                navigate('/uptomy', { state: data });

            } else {
                console.error('Error:', data);
                alert('저장에 실패했습니다.');
            }
            setIsSubmitting(false);  // 제출 완료

        } catch (error) {
            console.error('Error:', error);
            alert('저장 중 오류가 발생했습니다.');
            setIsSubmitting(false);  // 오류 발생 시 제출 상태 초기화

        }
    };
    

    // console.log('되나: ', new Blob([body], { type: 'text/html' }));

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
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
    

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };
  
    const formattedTime = new Date(createdAt).toLocaleString('ko-KR');

    const clickMap = () => {
        setShowMap(!showMap);
    };

    const handlePostPositionChange = (position) => {
        setLatitude(position.lat());
        setLongitude(position.lng());
        naver.maps.Service.reverseGeocode(
            {
                location: new naver.maps.LatLng(position.lat(), position.lng()),
            },
            function (status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return alert('Something Wrong!');
                }

                const result = response.result;
                setAddress(result.items[0].address);
            }
        );
    };
    const onChange = () => {
        const data = editorRef.current.getInstance().getHTML();
        setBody(data);
        // console.log(data);
      
        const markdown = editorRef.current.getInstance().getMarkdown();
        // 마크다운에서 이미지 구문 제거
        const textWithoutImages = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
        // HTML 태그 제거
        const textWithoutHTML = textWithoutImages.replace(/(<([^>]+)>)/ig, '');
        // 마크다운 문법 제거
        const textContent = textWithoutHTML.replace(/[#>*_~`[\]]+/g, '');
    
        setBodyPreview(textContent.slice(0, 35)); // 제한된 길이로 본문 미리보기 설정
        setBodyPlainText(textContent);
        // 저장할 textContent를 사용합니다.
        // console.log('텍스트 내용:', textContent);
      };
      


    return (
        <div className="edit_wrap" style={{ position: "relative" }}>
            <div>
            <span className='upload-title'>
                    제목: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} 
                        type="text" 
                        placeholder="제목을 입력하세요." 
                        value={title} 
                        onChange={onChangeTitle} />
                </span>
                <br /> <br />
                <span className='upload-address'>
                    주소: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} 
                        type="text" 
                        placeholder="지도로 주소를 설정해주세요." 
                        value={address} 
                        readOnly />
                    <br />
                    <button className='upload-map' onClick={clickMap}>
                        {showMap ? "완료" : "지도 보기"}
                    </button>
                    {showMap && (
                        <div>
                            <UploadHisMap setPostPosition={handlePostPositionChange} />
                        </div>
                    )}
                </span>
                <div style={{ marginTop: "5px" }}>
                <br />
                    현재 시간: {formattedTime}
                </div>
                
            </div>
            <br />
            <button className='save' onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? '저장 중' : '저장'}
            </button>
            <span>썸네일 이미지 :
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                    {imagePreview && (
                        <img src={imagePreview} alt="이미지 미리보기" style={{ marginTop: "10px", maxWidth: "100%", height: "auto" }} />
                    )} 
            </span>
            <br />
            <Editor
                initialValue="hello !"
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={false} //하단 타입 선택탭 숨기기
                plugins={[colorSyntax]}
                // language="ko-KR"
                ref={editorRef}
                onChange={onChange} // Update body state
                hooks={{
                    addImageBlobHook: onUploadImage
                  }}
            />
        </div>
    );
};

export default EditorBox;