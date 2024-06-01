import React, { useState, useEffect, useRef } from "react";
import UserMapinfo from "./UserMapinfo";
import html2canvas from "html2canvas";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import basic_profile from "../../assets/images/users/basic_profile.png";
import "../../assets/scss/layout/_localmap.scss";
import mymap_img from "../../assets/images/bg/mymap_img.png";
import PreviewHistory from "./PreviewHistory";
import PreviewDaily from "./PreviewDaily";

const UptoMy = () => {

    const state = useLocation().state;
    const [active, setActive] = useState(null);
    const token = localStorage.getItem("accessToken");
    const userNickname = localStorage.getItem("userNickname");

    console.log('state: ', state.result);

    const postId = state.result.postId;
    const capture = state.result.capture;
    // const capture = true;

    
    const postType = state.result.postType;
    // const postType = 'DAILY';

    console.log('post: ', postId, capture);

  return ( 
    <>
    <div style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀 */}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">미리보기</span>
          <div>
            <UserMapinfo userNickname={userNickname} capture={capture}  active={setActive} />
            <div>
                <Link to="/mymap" style={{ textDecoration: "none", color: "inherit" }} >
                <button className="linkto-mymap">
                    확인 완료
                </button>
                </Link>
            </div>
          </div>
        </div>
      </div>
        
      {/* 게시글 */}
      <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
        {
            postType === 'DAILY' 
            ? <div style={{ display: "block", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
                <PreviewDaily postId={postId} />
                </div> 
            : <div className="historyPost-con">
                <PreviewHistory postId={postId} />
                </div>
        }
      </div>
    </div>
    
    </>
  );
};

export default UptoMy;
