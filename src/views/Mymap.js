import React, { useState, useEffect } from "react";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import UserMapinfo from "../components/main/UserMapinfo";

const Mymap = () => {
  //데이터 가져오기
  const [userPost, setUserPost] = useState([]);
  const userId = "id_222"; //임시로 아이디 지정

  useEffect(()=>{
      fetch('http://localhost:3001/post') //API경로 적어주기
      .then(res => {
          return res.json() //json으로 변환됨
      })
      .then(data => {
          // memberId가 userId와 일치하는 경우에만 해당 게시물을 저장
          const userPosts = data.filter(post => post.memberId === userId);
          setUserPost(userPosts);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">
            마이맵
          </span>
          <UserMapinfo userId={userId} />
        </div>
      </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글  {userPost.length}
          </span>
      
          <div style={{border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px"}}>
        {/* postType에 따라 DailyPost 또는 HistoryPost 가져오기 */}
            {userPost.map(item => {
                if (item.postType === 'daily') { 
                    return <DailyList key={item.id} data={item} />;
                } else if (item.postType === 'history') { 
                    return <HistoryList key={item.id} data={item} />;
                }
                return null;
            })}
          </div>
        </div>
    </div>
  );
};
export default Mymap;


