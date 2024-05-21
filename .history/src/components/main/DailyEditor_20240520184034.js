import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '../../assets/scss/layout/_upload.scss';

const DailyEdit = ({ postType }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [createdAt, setCreatedAt] = useState(new Date().toISOString()); // 현재 시간으로 초기화
    //포맷: 2024-05-20T08:58:40.848Z
    const [expiredAt, setExpiredAt] = useState(''); // 만료 시간
    // const [memberId] = useState('id_222');
    //props로 받아오기

    const [address, setAddress] = useState('');

    const [amPm, setAmPm] = useState('AM'); // 오후/오전
    const [hour, setHour] = useState('12'); // 시간
    const [minute, setMinute] = useState('00'); // 분
    const [todaySelected, setTodaySelected] = useState(false);
    const [tomorrowSelected, setTomorrowSelected] = useState(false);
    const navigate = useNavigate();

    const [image, setImage] = useState(null);   
    const [imagePreview, setImagePreview] = useState(null);

    const [latitude, setLatitude] = useState(''); // [위도, 경도
    const [longitude, setLongitude] = useState('');


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
            const formData = new FormData();
            formData.append('image', image); // Add your image file here
            formData.append('createDailyDto', JSON.stringify({ 
                title,
                body,
                createdAt,
                expiredAt,
                address,
                latitude, // Replace with your latitude value
                longitude, // Replace with your longitude value
            }));
    
            const response = await fetch(`http://61.109.239.63:50001/post-service/daily`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBnYWNob24uYWMua3IiLCJhdXRoIjoiUk9MRV9DTElFTlQiLCJleHAiOjE3MjM2OTg1NTB9.QhADpTfUQrEekr3bwhZX1QTTNHnANtH2Zt8ptmb5jiw',
                },
                body: formData,
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

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const formattedTime = new Date(createdAt).toLocaleString('ko-KR');

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
                <h2>
                    제목: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} type="text" placeholder="제목을 입력하세요." value={title} onChange={onChangeTitle} />
                </h2>
                <span style={{ marginLeft: "25px" }}>
                    주소: 
                    <input style={{ marginLeft: "10px", border: "none", width: "400px" }} type="text" placeholder="주소를 입력하세요." value={address} onChange={onChangeAddress} />
                </span>
                <div style={{ marginTop: "5px" }}>
                    현재 시간: {formattedTime}
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
                <br />
                <br />
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                {imagePreview && (
                    <img src={imagePreview} alt="이미지 미리보기" style={{ marginTop: "10px", maxWidth: "50%", height: "auto" }} />
                )}
                <br />
                <br />
                <textarea
                    placeholder="내용을 입력하세요."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    style={{ marginTop: "10px", width: "100%", height: "200px" }}
                />
            </div>
            <br />
            <button className='save' onClick={onSave}>저장</button>
            
        </div>
    );
};

export default DailyEdit;