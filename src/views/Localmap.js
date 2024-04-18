import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";

import DailyPost from "../components/main/DailyPost";


const Localmap = () => {
  


  


  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        
        <div>
        <MapInformation />
        </div>
        
        </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green"}}>
          <span className="initial-main-page-text">
            게시글
          </span>
          
          <div style={{border: "3px solid yellow"}}>
          <DailyPost/>
          </div>
        </div>
    </div>
  );
};
export default Localmap;


