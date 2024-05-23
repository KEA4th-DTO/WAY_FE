import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '../../assets/scss/layout/_upload.scss';
import UploadHisMap from './UploadHisMap';
import axios from 'axios';


const EditorBox = ({ postType }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [bodypreview, setBodyPreview] = useState(''); // 본문 미리보기
    const [createdAt, setCreatedAt] = useState(new Date().toISOString()); // 현재 시간으로 초기화
    const [address, setAddress] = useState('');

    const [image, setImage] = useState(null);   
    const [imagePreview, setImagePreview] = useState(null);

    const [latitude, setLatitude] = useState(''); // [위도, 경도
    const [longitude, setLongitude] = useState('');
    const [showMap, setShowMap] = useState(false);

    const { naver } = window;
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const token = localStorage.getItem("accessToken");

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
    
            const formData = new FormData();
            formData.append('image', image); // Add the image file
            formData.append('createHistoryDto', new Blob([JSON.stringify({ 
                title,
                bodypreview,
                address,
                latitude,
                longitude,
            })], { type: 'application/json' }));
            formData.append('html', new Blob([body], { type: 'text/html' })); // 본문 추가

            const response = await fetch(`http://61.109.239.42:50005//post-service/history`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' // REMOVE this line
                },
                body: formData,
            });
            
            const data = await response.json();

            if (response.ok) {
                alert('저장되었습니다.');
                // 페이지 이동
                navigate('/mymap');
                console.log('Success:', data);
            } else {
                console.error('Error:', data);
                alert('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

      
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
        const formData = new FormData();
        formData.append("file", blob);
        const img = await axios.post(
          "통신 url",
          formData
        );
        const url = img.data[0].boardImageUrl;

        callback(url, "");
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
        console.log(data);

        const markdown = editorRef.current.getInstance().getMarkdown();;
        const textContent = markdown.replace(/[#>*_~`[\]]+/g, ''); // 마크다운 문법 제거
        setBodyPreview(textContent);
        // 저장할 textContent를 사용합니다.
        console.log('텍스트 내용:', textContent);
      };


    return (
        <div className="edit_wrap" style={{ position: "relative" }}>
            <div>
            <h2>
                    제목: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} 
                        type="text" 
                        placeholder="제목을 입력하세요." 
                        value={title} 
                        onChange={onChangeTitle} />
                </h2>
                <span >
                    주소: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} 
                        type="text" 
                        placeholder="주소를 입력하세요." 
                        value={address} 
                        onChange={onChangeAddress} />
                    <br />
                    <button onClick={clickMap}>
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
            <button className='save' onClick={onSave}>저장</button>
            <span>썸네일 이미지 :
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                    {imagePreview && (
                        <img src={imagePreview} alt="이미지 미리보기" style={{ marginTop: "10px", maxWidth: "100%", height: "auto" }} />
                    )} 
            </span>
            <Editor
                initialValue="hello react editor world!"
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={false} //하단 타입 선택탭 숨기기
                plugins={[colorSyntax]}
                language="ko-KR"
                ref={editorRef}
                onChange={onChange} // Update body state
                // hooks={{
                //     addImageBlobHook: onUploadImage
                //   }}
            />
        </div>
    );
};

export default EditorBox;