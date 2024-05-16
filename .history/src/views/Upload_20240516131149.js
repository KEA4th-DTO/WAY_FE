import React, { useState } from 'react';
import EditorBox from '../components/main/EditorBox';
// import ChangeAddress from '../components/main/ChangeAddress';
import "../assets/scss/layout/_upload.scss";

const Upload= () => {
  const [postType, setPostType] = useState('daily'); // 포스트 타입 state
  const [body, setBody] = useState(''); // 에디터 내용을 담는 state

   // 포스트 타입이 변경될 때 호출되는 함수
   const handlePostTypeChange = (type) => {
    setPostType(type);
  };

  return (
    <div>
      {/* 포스트 타입 선택 버튼 */}
      <div>
        <button className={postType === 'daily' ? 'daily selected' : 'daily'} onClick={() => handlePostTypeChange('daily')}>Daily</button>
        <button className={postType === 'history' ? 'history selected' : 'history'} onClick={() => handlePostTypeChange('history')}>History</button>
      </div>
      <br />
      {/* 선택된 포스트 타입에 따라 다른 에디터 박스를 렌더링 */}
      {postType === 'daily' ? (
        <EditorBox body={body} setBody={setBody} postType={postType} />
      ) : (
        <EditorBox body={body} setBody={setBody} postType={postType}/>
      )}
    </div>
  );
};

export default Upload;
