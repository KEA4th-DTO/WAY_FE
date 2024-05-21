import React, { useRef, useEffect, useState } from "react";

import currentPin from "../../assets/images/icons/currentPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const UploadMap = ({ setPostPosition, address }) => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const [bounds, setBounds] = useState({ ne: {lat: '', lng: ''}, sw: {lat: '', lng: ''} });
    const mapRef = useRef(null);
    const [mapState, setMapState] = useState({ zoom: 16, center: null }); // 지도의 확대/축소 및 중심 좌표 상태 관리
    const { naver } = window;
    
    //지도 새로고침
    const onRefreshClick = () => {
        // Refresh 버튼 클릭 시 지도 상태를 초기화하여 처음 로드될 때와 동일하게 설정
        setMapState({ zoom: 16, center: currentMyLocation });
    };

    //현재 위치 가져오기
    useEffect(() => {
        const success = (location) => {
            setCurrentMyLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        };
        const error = () => {
            setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }, []);

    //지도 그리기
    useEffect(() => {
        
        if (mapRef.current && naver && currentMyLocation) {
            const location = new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng);
            const map = new naver.maps.Map(mapRef.current, {
                center: mapState.center,
                zoom: mapState.zoom,
                minZoom: 10,
                maxZoom: 16,
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.TOP_RIGHT
                }
            });

            //지도 이동시 bounds 변경(좌표 받아오기)
            function updateBounds() {
                const bounds = map.getBounds();
                setBounds({
                    ne: {
                        lat: bounds.getNE().lat(),
                        lng: bounds.getNE().lng()
                    },
                    sw: {
                        lat: bounds.getSW().lat(),
                        lng: bounds.getSW().lng()
                    }
                });
            }

            // Immediately update bounds when map is initialized
            updateBounds();

            naver.maps.Event.addListener(map, 'bounds_changed', updateBounds);
            
            //현재 위치 dailyPin 마커 표시
            var marker = new naver.maps.Marker({
                position: location,
                map,
                icon: {
                    url: full_dailyPin,
                    size: new naver.maps.Size(28, 28),
                    scaledSize: new naver.maps.Size(28, 28),
                },
                zIndex: 998,
            });

            naver.maps.Event.addListener(map, 'click', function(e) {
                marker.setPosition(e.coord);
                setPostPosition(e.coord); // 여기에서 위치를 부모 컴포넌트로 전달
            });
        }
    }, [currentMyLocation, mapState, setPostPosition]);  // `mapState`를 의존성 목록에 추가

    useEffect(() => {
        // 페이지가 처음 로드될 때만 현재 위치를 중심으로 지도를 표시
        if (currentMyLocation && mapRef.current) {
            setMapState({
                ...mapState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            });
        }
        
    }, [currentMyLocation]); // currentMyLocation을 의존성 목록에 추가하여 처음 로드될 때만 실행
    
    const onLocationButton = () => {
        naver.maps.Service.reverseGeocode(
          {
            location: new naver.maps.LatLng(latitude, longitude),
          },
          function (status, response) {
            if (status !== naver.maps.Service.Status.OK) {
              return alert('Something Wrong!');
            }
    
            const result = response.result;
            setAddress(result.items[0].address);
          }
        );
      };
    return (

        <div>
            <button onClick={onRefreshClick}>
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block', border: 'none'}} />
            </button>
            
            <div ref={mapRef} style={{ width: "300px", height: "300px" }}></div>
            <div>
                <h4>Map Bounds:</h4>
                <p>North-East Latitude: {bounds.ne.lat}, Longitude: {bounds.ne.lng}</p>
                <p>South-West Latitude: {bounds.sw.lat}, Longitude: {bounds.sw.lng}</p>
            </div>
        </div>
    );
};

export default UploadMap;
