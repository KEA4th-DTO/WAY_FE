import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '../../assets/scss/layout/_upload.scss';

const HistoryUpload = ({ postType }) => {
    const editorRef = useRef();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [createdAt, setTimer] = useState("00:00:00");

    const currentTimer = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        setTimer(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    }
    
    const startTimer = () => {
        setInterval(currentTimer, 1000);
    }
    
    startTimer();
    
    const [memberId] = useState('id_222');
    const [address, setAddress] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [hashArr, setHashArr] = useState([]);
    const navigate = useNavigate();

    const onSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/post/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title,
                    body,
                    memberId,
                    likeNum: 0,
                    commentNum: 0,
                    createdAt,
                    postType,
                    address,
                    // hashtag: hashArr,
                }),
            });
            const data = await response.json();
            alert('저장되었습니다.');
            // 페이지 이동
            navigate('/mymap');
            console.log('Success:', data);
            // Optionally, show a success message or redirect the user
        } catch (error) {
            console.error('Error:', error);
            // Optionally, show an error message to the user
        }
    };

    const onChange = () => {
        const data = editorRef.current.getInstance().getHTML();
        setBody(data);
        console.log(data);
      };

      const onUploadImage = async (blob, callback) => {
        const url = await uploadImage(blob);
        callback(url, 'alt text');
        return false;
      };

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const onChangeHashtag = (e) => {
        setHashtag(e.target.value);
    };
    
    const onKeyUp = useCallback(
        (e) => {
          if (typeof window !== 'undefined') {
            /* 요소 불러오기, 만들기*/
            const $HashWrapOuter = document.querySelector('.HashWrapOuter');
            const $HashWrapInner = document.createElement('div');
            $HashWrapInner.className = 'HashWrapInner';
            
            /* 태그를 클릭 이벤트 관련 로직 */
            $HashWrapInner.addEventListener('click', () => {
              $HashWrapOuter?.removeChild($HashWrapInner);
              console.log($HashWrapInner.innerHTML);
              setHashArr(hashArr.filter((hashtag) => hashtag));
            });
      
            /* enter 키 코드 :13 */
            if (e.keyCode === 13 && e.target.value.trim() !== '') {
              console.log('Enter Key 입력됨!', e.target.value);
              $HashWrapInner.innerHTML = '#' + e.target.value;
              $HashWrapOuter?.appendChild($HashWrapInner);
              setHashArr((hashArr) => [...hashArr, hashtag]);
              setHashtag('');
            }
          }
        },
        [hashtag, hashArr]
    );
    

    return (
        <div className="edit_wrap" style={{ position: "relative" }}>
             <div>
                <span style={{fontSize: "30px"}}>
                    제목: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} type="text" placeholder="제목을 입력하세요." value={title} onChange={onChangeTitle} />
                </span>
                <br />
                <span style={{ marginLeft: "30px" }}>
                    주소: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} type="text" placeholder="주소를 입력하세요." value={address} onChange={onChangeAddress} />
                </span>
                <div style={{ marginTop: "5px" }}>
                    현재 시간: {createdAt}
                </div>
                {/* <div style={{ marginTop: "5px", marginLeft: "5px" }}>
                    해시태그:
                    <div className="HashWrap">
                        <div className="HashWrapOuter"></div>
                        <input
                            className="HashInput"
                            type="text"
                            value={hashtag}
                            onChange={onChangeHashtag}
                            onKeyUp={onKeyUp}
                            placeholder="해시태그 입력"
                        />

                        </div>
                </div> */}
            </div> 
            <br />
            <button className='save' onClick={onSave}>저장</button>
            <Editor
                initialValue="hello react editor world!"
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true} //하단 타입 선택탭 숨기기
                plugins={[colorSyntax]}
                language="ko-KR"
                ref={editorRef}
                onChange={onChange} // onChange event directly sets the body state
                hooks={{
                    addImageBlobHook: onUploadImage
                }}
            />
        </div>
    );
};

export default HistoryUpload;
