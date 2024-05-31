import React, { useState, useEffect } from 'react';
import close from "../../assets/images/logos/close.png";
import report from "../../assets/images/icons/report.png";

const Report = ({ targetId, type, onClose }) => {
    // null 체크를 위해 미리 초기화
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCloseClick = () => {
        onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
    };
    console.log('targetId: ', targetId, type);

    const onSave = async () => {
        try {
            if (!title || !description) {
                alert("모든 필드를 채워주세요.");
                return;
            }

            const formdata = {
                type: type,
                title: title,
                description: description,
            };

            const response = await fetch(`http://210.109.55.124/post-service/report/${targetId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formdata),
            });

            const data = await response.json();
            if (response.ok) {
                alert('신고 접수 되었습니다.');
                handleCloseClick();
            } else {
                console.error('Error:', data);
                alert('신고 접수를 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const handleTitleSelect = (e) => {
        setTitle(e.target.value);
    };

    return (
        <div className="report-con">
            <div style={{ border: "3px solid yellow" }} className="report-frame">
                <img
                    src={close}
                    alt="닫기"
                    className="close"
                    onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
                />
                <div>
                    <img
                        src={report}
                        alt="신고"
                        className="report-img"
                    />
                    <span className="report-title">신고 사유:</span>
                    <select className="report-title" style={{ marginLeft: "5px" }} value={title} onChange={handleTitleSelect}>
                        <option disabled value="">이유를 선택하세요</option>
                        <option value="스팸">스팸</option>
                        <option value="나체 이미지 또는 성적 행위">나체 이미지 또는 성적 행위</option>
                        <option value="혐오 발언 또는 상징">혐오 발언 또는 상징</option>
                        <option value="폭력 또는 위험한 단체">폭력 또는 위험한 단체</option>
                        <option value="불법 또는 규제 상품 판매">불법 또는 규제 상품 판매</option>
                        <option value="따돌림 또는 괴롭힘">따돌림 또는 괴롭힘</option>
                        <option value="지적재산권 침해">지적재산권 침해</option>
                        <option value="자살 또는 자해">자살 또는 자해</option>
                        <option value="섭식 장애">섭식 장애</option>
                        <option value="사기 또는 거짓">사기 또는 거짓</option>
                        <option value="약물">약물</option>
                        <option value="거짓 정보">거짓 정보</option>
                        <option value="마음에 들지 않습니다">마음에 들지 않습니다</option>
                    </select>
                    <br /><br /><br />
                    <span className="report-title">설명:</span>
                    <br /><br />
                    <input
                        className="report-input"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button className="report-save" onClick={onSave}>제출</button>
            </div>
        </div>
    );
};

export default Report;
