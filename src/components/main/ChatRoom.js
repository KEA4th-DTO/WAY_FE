import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_chatting.scss";  
import sky from "../../assets/images/bg/sky.png";
import user6 from "../../assets/images/users/user6.png";
import full_checkbox from "../../assets/images/icons/full_checkbox.png";
import checkbox from "../../assets/images/icons/checkbox.png";

const ChatRoom= ({data}) => {
  
  return (
    <div>
          <div className='room-back'>
          <img
              src={user6}
              alt="IMAGE2251"
              className="frame2-image1"
            />
            <span className="frame2-text09">
              <span>{data.title}</span>
            </span>
            <span className="frame2-text08">{data.memberNum}</span>
            <span className="frame2-text06">
              <span>{data.last_chat_time}</span>
            </span>
            <span className="frame2-text04">
              <span>{data.last_chat}</span>
            </span>
            <div className="frame2-ellipse1">
              <span className="frame2-text"> {data.alarmNum} </span>
            </div>
          </div>    
        </div>
  );
};

export default ChatRoom;
