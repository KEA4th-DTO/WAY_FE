import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";

const Localmap = () => {
  //데이터 가져오기
  const [post, setPost] = useState([]);
  
  useEffect(()=>{
      fetch('http://localhost:3001/post') //API경로 적어주기
      .then(res => {
          return res.json() //json으로 변환됨
      })
      .then(data => {
          setPost(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">
            로컬맵
          </span>
          <MapInformation />
        </div>
      </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글
          </span>
      
          <div style={{border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px"}}>
        {/* postType에 따라 DailyPost 또는 HistoryPost 가져오기 */}
            {post.map(item => {
                if (item.postType === 'daily') { 
                    return <DailyPost key={item.id} data={item} />;
                } else if (item.postType === 'history') { 
                    return <HistoryPost key={item.id} data={item} />;
                }
                return null;
            })}
          </div>
        </div>
    </div>
  );
};
export default Localmap;


