import React, { useState } from "react";
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";

export const NaverMapAPI = (props) => {
  return (
    // 검색을 하고싶은 경우 submodules 로써 geocoder를 꼭 추가해줘야한다.
    <RenderAfterNavermapsLoaded
      ncpClientId={process.env.REACT_APP_API_Client_ID}
      submodules={["geocoder"]}
    >
      // 부모 컴포넌트(Home.js)로부터 받은 props를 이용해 NaverMap api 호출
      <NaverMap
        mapDivId={"maps-getting-started-uncontrolled"}
        style={{ width: "100%", height: "100%" }}
        center={{ lat: props.Latitude, lng: props.Longtitude }}
        defaultZoom={12}
        zoom={props.zoom}
        minZoom={12}
        enableWheelZoom={false}
      >
        // prop.zoom이 15인 경우는 주소 검색이 실행되었을 때이므로 maker를 표시해준다.
        {props.zoom == 15 && (
          <Marker
            position={{ lat: props.Latitude, lng: props.Longtitude }}
            title={props.roadAddress}
            clickable={true}
          />
        )}
      </NaverMap>
    </RenderAfterNavermapsLoaded>
  );
};

export default NaverMapAPI;