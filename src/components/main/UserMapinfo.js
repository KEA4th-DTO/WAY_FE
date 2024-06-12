import React, { useRef, useEffect, useState } from "react";

import currentPin from "../../assets/images/icons/currentPin.png";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_allPin from "../../assets/images/icons/full_allPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";
// import MarkerClustering from "../../utils/MarkerClustering.js";
// import $ from "jquery"; // Import jQuery

const UserMapinfo = ({ userNickname, active, setLoading, }) => {
    const [userPost, setUserPost] = useState([]);
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const mapRef = useRef(null);
    const [activePin, setActivePin] = useState("ALL"); // 현재 활성화된 핀 타입을 관리
    const k_center = { lat: 36.358949, lng: 127.7646949 };
    const [mapState, setMapState] = useState({ zoom: 7, center: k_center }); // 지도의 확대/축소 및 중심 좌표 상태 관리
    const [clickedMarker, setClickedMarker] = useState(null);
    // const [markers, setMarkers] = useState([]); // 마커 목록을 관리

    // allPin 을 누르면 allPin 이미지가 full_allPin으로 바뀌고 dailyPin, historyPin 이미지는 원래 이미지로 바뀌는 함수
    const [allPinState, setAllPinState] = useState(true);
    const [dailyPinState, setDailyPinState] = useState(false);
    const [historyPinState, setHistoryPinState] = useState(false);

    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;

    const onClickAllPin = () => {
        setAllPinState(true);
        setDailyPinState(false);
        setHistoryPinState(false);
        setActivePin("ALL");
    };

    const onClickDailyPin = () => {
        setAllPinState(false);
        setDailyPinState(true);
        setHistoryPinState(false);
        setActivePin("DAILY");
    };

    const onClickHistoryPin = () => {
        setAllPinState(false);
        setDailyPinState(false);
        setHistoryPinState(true);
        setActivePin("HISTORY");
    };

    //지도 새로고침
    const onRefreshClick = () => {
        // Refresh 버튼 클릭 시 지도 상태를 초기화하여 처음 로드될 때와 동일하게 설정
        setMapState({ zoom: 7, center: { lat: 36.358949, lng: 127.7646949 } });
    };

    // 핀 데이터 가져오기
    useEffect(() => {
        if (userNickname) {
            const url = `${Server_IP}/post-service/posts/pin/${userNickname}`;

            setLoading(true); // Start loading

            fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
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
                        setUserPost(data.result.pinResultDtoList);
                    } else {
                        console.error("Error in API response:", data.message);
                    }
                })
                .catch(error => console.error("Error fetching pin data:", error))
                .finally(() => setLoading(false)); // Stop loading
                
        }
    }, [userNickname, token]);

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

    const getNormalPin = (item) => {
        return item.postType === 'DAILY' ? dailyPin : item.postType === 'HISTORY' ? historyPin : allPin;
    };

    const getFullPin = (item) => {
        return item.postType === 'DAILY' ? full_dailyPin : item.postType === 'HISTORY' ? full_historyPin : full_allPin;
    };
    
    //지도 그리기
    useEffect(() => {
        const { naver } = window;
        if (mapRef.current && naver && currentMyLocation) {
            const location = new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng);
            const map = new naver.maps.Map(mapRef.current, {
                center: mapState.center,
                zoom: mapState.zoom,
                minZoom: 7, //12
                maxZoom: 16,
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.TOP_RIGHT
                }
            });

            //현재 위치 마커표시
            new naver.maps.Marker({
                position: location,
                map,
                icon: {
                    url: currentPin,
                    size: new naver.maps.Size(25, 25),
                    scaledSize: new naver.maps.Size(25, 25),
                },
                zIndex: 999,
            });

            const handleMarkerClick = (item, marker) => {
                // console.log('clicked marker:', item, marker);
                // console.log('클릭햇던 마커:', clickedMarker);
                if(clickedMarker && clickedMarker.item === item) {
                    // console.log('같은거 클릭해서 원래대로');
                    marker.setIcon({
                        url: getNormalPin(item),
                        size: new naver.maps.Size(40, 40),
                        scaledSize: new naver.maps.Size(40, 4),
                    });
                    active(null);
                    setClickedMarker(null);
                    return;
                } 
                else if(clickedMarker && clickedMarker.item !== item) {
                    // console.log('다른거 클릭해서 원래거 원래대로');
                    clickedMarker.marker.setIcon({
                        url: getNormalPin(clickedMarker.item),
                        size: new naver.maps.Size(40, 40),
                        scaledSize: new naver.maps.Size(40, 40),
                    });
                }
                // console.log('다른거 클릭햇거나 처음 클릭');

                marker.setIcon({
                    url: getFullPin(item),
                    size: new naver.maps.Size(46, 46),
                    scaledSize: new naver.maps.Size(46, 46),
                });
                active({ item });
                setClickedMarker({ marker, item });
               
            };

            // // Combine post and historypost arrays
            // const combinedPosts = [...post, ...historypost];
        
            // console.log('combinePost:', combinePost);
            const markers = userPost.filter(item => activePin === 'ALL' || item.postType === activePin).map((item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                // console.log('정보: ', item);
                let iconUrl = getNormalPin(item);
                const marker = new naver.maps.Marker({
                    position: postLocation,
                    map,
                    icon: {
                        url: iconUrl,
                        size: new naver.maps.Size(40, 40),
                        scaledSize: new naver.maps.Size(40, 40),
                    },
                    zIndex: index,
                });

                naver.maps.Event.addListener(marker, 'click', () => {
                    handleMarkerClick(item, marker);
                   
                });

                return { marker, item };
            });

            naver.maps.Event.addListener(map, 'zoom_changed', () => {
                setMapState((prevState) => ({
                    ...prevState,
                    zoom: map.getZoom(),
                }));
            });

            naver.maps.Event.addListener(map, 'center_changed', () => {
                setMapState((prevState) => ({
                    ...prevState,
                    center: map.getCenter(),
                })); 
            });
        }
    }, [currentMyLocation, userPost, activePin, mapState, clickedMarker]); // `activePin` 및 `mapState`를 의존성 목록에 추가

    
    return (
        <div>
            <div className="map-header-button">
            <button className="refresh-button" onClick={onRefreshClick}>
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block' }} />
            </button>
            
            <div className="pin-buttons" style={{marginLeft:"290px"}}>
                <span style={{ fontSize: '10px', marginLeft:'8px' }}>all pin</span>
                <span style={{ fontSize: '10px', marginLeft: "23px" }}>daily pin</span>
                <span style={{ fontSize: '10px', marginLeft:"15px" }}>history pin</span>
                <br />
                <button onClick={onClickAllPin} className="basic-button" >
                    <img src={allPinState ? full_allPin : allPin} alt="allPin" style={{ width: '30px', height: '30px'}} />
                </button>
                <button onClick={onClickDailyPin} className="basic-button" >
                    <img src={dailyPinState ? full_dailyPin : dailyPin} alt="dailyPin" style={{ width: '30px', height: '30px' }} />
                </button>
                <button onClick={onClickHistoryPin} className="basic-button" >
                    <img src={historyPinState ? full_historyPin : historyPin} alt="historyPin" style={{ width: '30px', height: '30px' }} />
                </button> 
            </div>
            </div>
            <div id="download" ref={mapRef} style={{ width: "500px", height: "500px" }}></div> 
        </div>
    );
};

export default UserMapinfo;
