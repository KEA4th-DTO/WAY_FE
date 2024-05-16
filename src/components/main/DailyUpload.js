import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '../../assets/scss/layout/_upload.scss';

const EditorBox = ({ postType }) => {
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
    
    const [expiredAt, setExpiredAt] = useState(''); // 만료 시간
    const [memberId] = useState('id_222');
    const [address, setAddress] = useState('');
    const [amPm, setAmPm] = useState('AM'); // 오후/오전
    const [hour, setHour] = useState('12'); // 시간
    const [minute, setMinute] = useState('00'); // 분
    const [todaySelected, setTodaySelected] = useState(false);
    const [tomorrowSelected, setTomorrowSelected] = useState(false);
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
                    expiredAt,
                    postType,
                    address,
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
      };

    // const onUploadImage = async (blob, callback) => {
    //     console.log(blob);
    //     // Handle image upload logic
    // };

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleTodayClick = () => {
        const today = new Date();
        today.setHours(amPm === 'PM' ? Number(hour) + 12 : Number(hour));
        today.setMinutes(Number(minute));
        today.setSeconds(0);
        setExpiredAt(today.toISOString());
        setTodaySelected(true);
        setTomorrowSelected(false);
    };
    
    const handleTomorrowClick = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(amPm === 'PM' ? Number(hour) + 12 : Number(hour));
        tomorrow.setMinutes(Number(minute));
        tomorrow.setSeconds(0);
        setExpiredAt(tomorrow.toISOString());
        setTodaySelected(false);
        setTomorrowSelected(true);
    };
    

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
                <div style={{ marginTop: "5px", position: "relative" }}>
                    만료 시간:
                    <div style={{ display: "inline-block", marginRight: "5px" }}>
                        <button onClick={handleTodayClick} className={todaySelected ? "today" : "tomorrow"}>오늘</button>
                        <button onClick={handleTomorrowClick} className={tomorrowSelected ? "today" : "tomorrow"}>내일</button>
                    </div>
                    <select style={{ marginLeft: "5px" }} value={amPm} onChange={(e) => setAmPm(e.target.value)}>
                        <option value="AM">오전</option>
                        <option value="PM">오후</option>
                    </select>
                    <select value={hour} onChange={(e) => setHour(e.target.value)}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                    </select>
                    시
                    <select value={minute} onChange={(e) => setMinute(e.target.value)}>
                        {[...Array(60)].map((_, i) => (
                            <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                        ))}
                    </select>
                    분
                </div>
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
                
                // hooks={{
                //     addImageBlobHook: onUploadImage
                // }}
            />
        </div>
    );
};

export default EditorBox;
