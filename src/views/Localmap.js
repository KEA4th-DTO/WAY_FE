import React, { useState, useEffect } from "react";
import MapInformation from "../components/map/Mapinformation";
import allPin from "../assets/images/icons/allPin.png";
import dailyPin from "../assets/images/icons/dailyPin.png";
import historyPin from "../assets/images/icons/historyPin.png";
import full_allPin from "../assets/images/icons/full_allPin.png";
import full_dailyPin from "../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../assets/images/icons/full_historyPin.png";
import refresh from "../assets/images/icons/refresh.png";

import Post from "../components/map/Post";

import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';


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
   }, []);


   


  // allPin 을 누르면 allPin 이미지가 full_allPin으로 바뀌고 dailyPin, historyPin 이미지는 원래 이미지로 바뀌는 함수
  const [allPinState, setAllPinState] = useState(true);
  const [dailyPinState, setDailyPinState] = useState(false);
  const [historyPinState, setHistoryPinState] = useState(false);
  
  const onClickAllPin = () => {
    setAllPinState(true);
    setDailyPinState(false);
    setHistoryPinState(false);
  };

  const onClickDailyPin = () => {
    setAllPinState(false);
    setDailyPinState(true);
    setHistoryPinState(false);
  };

  const onClickHistoryPin = () => {
    setAllPinState(false);
    setDailyPinState(false);
    setHistoryPinState(true);
  };

    

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        
          <h3 style={{ display: 'inline-block', marginRight: '10px' }}>로컬맵</h3>
          <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block' }} />
        
        <div style={{ display: 'inline-block', marginLeft: '280px', border:"3px solid red" }}>
          <span style={{ fontSize: '10px', margin:"3px" }}>all pin</span>
          <span style={{ fontSize: '10px', margin:"3px" }}>daily pin</span>
          <span style={{ fontSize: '10px', margin:"3px" }}>history pin</span>
          <br />
          <button onClick={onClickAllPin} style={{ border: "none" }}>
            <img src={allPinState ? full_allPin : allPin} alt="allPin" style={{ width: '30px', height: '30px' }} />
          </button>
          <button onClick={onClickDailyPin} style={{ border: "none"}}>
            <img src={dailyPinState ? full_dailyPin : dailyPin} alt="dailyPin" style={{ width: '30px', height: '30px' }} />
          </button>
          <button onClick={onClickHistoryPin} style={{ border: "none" }}>
            <img src={historyPinState ? full_historyPin : historyPin} alt="historyPin" style={{ width: '30px', height: '30px' }} />
          </button> 
        </div>

        <div>
          <MapInformation/>
        </div>
        
        </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green"}}>
          <span className="initial-main-page-text">
            <span>게시글</span>
          </span>
          <ul>
                {post.map(i => (
              <li>{i.title}</li>
            ))}
            </ul>
          <div className="initial-main-page-post1-history" style={{border: "3px solid yellow"}}>
          <Post></Post>
          </div>
        </div>
    </div>
  );
};
export default Localmap;


