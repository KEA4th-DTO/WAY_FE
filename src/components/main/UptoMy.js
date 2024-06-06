import React, { useState, useEffect, useRef } from "react";
import UptoMyMap from "./UptoMyMap";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import basic_profile from "../../assets/images/users/basic_profile.png";
import "../../assets/scss/layout/_localmap.scss";
import mymap_img from "../../assets/images/bg/mymap_img.png";
import PreviewHistory from "./PreviewHistory";
import PreviewDaily from "./PreviewDaily";

const UptoMy = () => {
    const [active, setActive] = useState(null);
    const Server_IP = process.env.REACT_APP_Server_IP;
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");
    
    const state = useLocation().state;
    console.log('state: ', state.result);

    const postId = state.result.postId;
    const capture = state.result.capture;
    // const capture = true;
    
    const postType = state.result.postType;
    const [userProfileimg, setUserprofileimg] = useState(false);

    // const postType = 'DAILY';

    console.log('post: ', postId, capture);

    useEffect(() => {
      if (userNickname) {
        // console.log('유저 닉네임', userNickname);
        const url = `${Server_IP}/member-service/profile/${userNickname}`;
          fetch(url, {
              method: 'GET',
              headers: {
                  'accept': '*/*',
                  'Authorization': `Bearer ${token}`
              }
          })
          .then(res => {
              if (!res.ok) {
                  throw new Error('Network response was not ok ' + res.statusText);
              }
              return res.json();
          })
          .then(data => {
              if (data.isSuccess) {
                // console.log('사진', data.result.profileImageUrl);
                  setUserprofileimg(data.result.profileImageUrl);
              } else {
                  console.error("Error in API response:", data.message);
              }
          })
          .catch(error => console.error("Error fetching data:", error));
      }
    }, [userNickname]);
    
  return ( 
    <>
    <div style={{ display: "flex", width: "950px"}}>
      {/* 지도 & 핀 */}
      <div id="map-con">
          <span className="initial-main-page-text">미리보기</span>
          <div>
            <UptoMyMap userNickname={userNickname} capture={capture}  active={setActive} />
            <div>
                <Link to="/mymap" style={{ textDecoration: "none", color: "inherit" }} >
                <button className="linkto-mymap">
                    확인 완료
                </button>
                </Link>
            </div>
          </div>
      </div>
        
      {/* 게시글 */}
      <div className="initial-main-page-frame" style={{ marginLeft: "20px"}}>
        {
            postType === 'DAILY' 
            ? <div style={{ display: "block", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
                <PreviewDaily postId={postId} userProfileimg={userProfileimg} />
                </div> 
            : <div className="historyPost-con" style={{marginLeft:"45%"}}>
                <PreviewHistory postId={postId} userProfileimg={userProfileimg}/>
                </div>
        }
      </div>
    </div>
    
    </>
  );
};

export default UptoMy;
