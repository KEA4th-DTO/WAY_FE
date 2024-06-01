import React, { useState, useEffect } from "react";

import user_img from "../assets/images/users/user6.png";
import DailyList from "../components/main/DailyPost";
import HistoryList from "../components/main/HistoryPost";
import UserMapinfo from "../components/main/UserMapinfo";

const Othersmap = () => {
  //데이터 가져오기
  const [user, setUser] = useState({}); 
  const [userPost, setUserPost] = useState([]);
  const userId = "id_1234"; //임시로 아이디 지정

  // useEffect(()=>{
  //     fetch('http://localhost:3001/member') //유저 정보 가져오기
  //     .then(res => {
  //         return res.json() //json으로 변환됨
  //     })
  //     .then(data => {
  //         const userInfos = data.find(mem => mem.memberId === userId);
  //         setUser(userInfos);
  //     })
  //     .catch(error => console.error("Error fetching data:", error));
  // }, []);

//   useEffect(()=>{
//     fetch('http://localhost:3001/post') //유저 게시글 가져오기
//     .then(res => {
//         return res.json() //json으로 변환됨
//     })
//     .then(data => {
//         // memberId가 userId와 일치하는 경우에만 해당 게시물을 저장
//         const userPosts = data.filter(post => post.memberId === userId);
//         setUserPost(userPosts);
//     })
//     .catch(error => console.error("Error fetching data:", error));
// }, []);
  

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      {/* <div id="map-con" style={{ position: "relative", border: "3px solid blue"}}>
        <div style={{ position: "relative", border: "3px solid orange", margin: "5px 5px 0"}}> 
        <img
            src={user_img} // 사용자 프로필 이미지
            alt="사용자 프로필 이미지"
            className="other-user-profileimage"
        />
        <span className="other-user-text">
            {user.nickname}님의 맵
        </span>
        <button className="other-user-button">
            정보보기
        </button>
        </div>
        <UserMapinfo userId={userId} />
        </div> */}

        
        {/* 게시글*/}
        {/* <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글  {userPost.length}
          </span>
      
          <div style={{border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px"}}>
            {userPost.map(item => {
                if (item.postType === 'daily') { 
                    return <DailyList key={item.id} data={item} />;
                } else if (item.postType === 'history') { 
                    return <HistoryList key={item.id} data={item} />;
                }
                return null;
            })}
          </div>
        </div> */}
    </div>
  );
};
export default Othersmap;


