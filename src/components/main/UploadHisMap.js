import React, { useRef, useEffect, useState } from "react";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const UploadHisMap = ({ setPostPosition }) => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const mapRef = useRef(null);
    const [mapState, setMapState] = useState({ zoom: 16, center: null }); // 지도의 확대/축소 및 중심 좌표 상태 관리

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
        const { naver } = window;
        if (mapRef.current && naver && currentMyLocation) {
            const location = new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng);
            const map = new naver.maps.Map(mapRef.current, {
                center: mapState.center,
                zoom: mapState.zoom,
                minZoom: 7,
                maxZoom: 16,
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.TOP_RIGHT
                }
            });

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
    }, [currentMyLocation, mapState]);

    useEffect(() => {
        // 페이지가 처음 로드될 때만 현재 위치를 중심으로 지도를 표시
        if (currentMyLocation && mapRef.current) {
            setMapState({
                ...mapState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            });
        }
        
    }, [currentMyLocation]); // currentMyLocation을 의존성 목록에 추가하여 처음 로드될 때만 실행
    
    // 검색 기능 추가
    const searchAddress = () => {
        const address = document.getElementById('address').value;
        if (!address) return;

        const { naver } = window;
        naver.maps.Service.geocode({
            query: address
        }, function(status, response) {
            if (status === naver.maps.Service.Status.ERROR || response.v2.meta.totalCount === 0) {
                alert('주소를 찾을 수 없습니다.');
                return;
            }

            const item = response.v2.addresses[0];
            const point = new naver.maps.Point(item.x, item.y);

            const marker = new naver.maps.Marker({
                position: point,
                map: mapRef.current.map,
                icon: {
                    url: full_dailyPin,
                    size: new naver.maps.Size(28, 28),
                    scaledSize: new naver.maps.Size(28, 28),
                },
                zIndex: 999,
            });

            mapRef.current.map.setCenter(point);
        });
    };
    return (

        <div>
            <button onClick={onRefreshClick}>
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block', border: 'none'}} />
            </button>

            <input id="address" type="text" placeholder="주소를 입력하세요" />
            <button onClick={searchAddress}>주소 검색</button>
            <div ref={mapRef} style={{ width: "300px", height: "300px" }}></div>
         
        </div>
    );
};

export default UploadHisMap;
