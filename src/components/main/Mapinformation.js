import React, { useRef, useEffect, useState } from "react";

import currentPin from "../../assets/images/icons/currentPin.png";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_allPin from "../../assets/images/icons/full_allPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const MapInformation = () => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const [post, setPost] = useState([]);
    const mapRef = useRef(null);
    const [activePin, setActivePin] = useState("ALL"); // 현재 활성화된 핀 타입을 관리
    const [mapState, setMapState] = useState({ zoom: 16, center: null }); // 지도의 확대/축소 및 중심 좌표 상태 관리
    const [activeMarker, setActiveMarker] = useState(null);
    const clickedMarkers = {}; // 클릭된 마커를 저장할 객체
    
    const [bounds, setBounds] = useState({ ne: {lat: '', lng: ''}, sw: {lat: '', lng: ''} });
    const token = localStorage.getItem("accessToken");

    // allPin 을 누르면 allPin 이미지가 full_allPin으로 바뀌고 dailyPin, historyPin 이미지는 원래 이미지로 바뀌는 함수
    const [allPinState, setAllPinState] = useState(true);
    const [dailyPinState, setDailyPinState] = useState(false);
    const [historyPinState, setHistoryPinState] = useState(false);
    
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

    useEffect(() => {
        if (currentMyLocation) {
          const ne_bound = {
            lat: currentMyLocation.lat + 0.0408919,
            lng: currentMyLocation.lng + 0.0514984
          };
          const sw_bound = {
            lat: currentMyLocation.lat - 0.0408696,
            lng: currentMyLocation.lng - 0.0514984
          };
          setBounds({
            latitude1: sw_bound.lat,
            longitude1: sw_bound.lng,
            latitude2: ne_bound.lat,
            longitude2: ne_bound.lng
          });
        }
      }, [currentMyLocation]);

    // 핀 데이터 가져오기
    useEffect(() => {
        if (bounds) {
            const { latitude1, longitude1, latitude2, longitude2 } = bounds;
            const url = `http://210.109.55.124/post-service/posts/pin/range?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;

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
                        console.log("success_pin", data.result.pinResultDtoList);
                        setPost(data.result.pinResultDtoList);
                    } else {
                        console.error("Error in API response:", data.message);
                    }
                })
                .catch(error => console.error("Error fetching pin data:", error));
        }
    }, [bounds, token]);


    //지도 그리기
    useEffect(() => {
        const { naver } = window;
        if (mapRef.current && naver && currentMyLocation) {
            const location = new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng);
            const map = new naver.maps.Map(mapRef.current, {
                center: mapState.center,
                zoom: mapState.zoom,
                minZoom: 6, //12
                maxZoom: 16,

                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.TOP_RIGHT
                }
            });

            // //지도 이동시 bounds 변경(좌표 받아오기)
            // function updateBounds() {
            //     const bounds = map.getBounds();
            //     setBounds({
            //         ne: {
            //             lat: bounds.getNE().lat(),
            //             lng: bounds.getNE().lng()
            //         },
            //         sw: {
            //             lat: bounds.getSW().lat(),
            //             lng: bounds.getSW().lng()
            //         }
            //     });
            // }

            // // Immediately update bounds when map is initialized
            // updateBounds();

            // naver.maps.Event.addListener(map, 'bounds_changed', updateBounds);


            //현재 위치 마커표시
            new naver.maps.Marker({
                position: location,
                map,
                icon: {
                    url: currentPin,
                    size: new naver.maps.Size(28, 28),
                    scaledSize: new naver.maps.Size(28, 28),
                },
                zIndex: 999,
            });

           
            // 게시글 마커 생성 시 클릭 이벤트 핸들러를 설정합니다.
            const createMarker = (item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                let iconUrl = item.postType === "DAILY" ? dailyPin : item.postType === "HISTORY" ? historyPin : allPin;
                const marker = new naver.maps.Marker({
                    position: postLocation,
                    map,
                    icon: {
                        url: iconUrl,
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    },
                    zIndex: index,
                });

                // 마커에 클릭 이벤트를 추가합니다.
                naver.maps.Event.addListener(marker, 'click', () => {
                    handleMarkerClick(item.postId, marker);
                });

                return marker;
            };

            // postId에 따라 정상 아이콘을 반환합니다.
            const getNormalPin = (postId) => {
                const item = post.find(item => item.postId === postId);
                // 게시물이 없는 경우 기본 아이콘 반환
                if (!item) return allPin;
                return item.postType === 'DAILY' ? dailyPin : historyPin;
            }; 


            // postId에 따라 full 아이콘을 반환합니다.
            const getFullPin = (postId) => {
                const item = post.find(item => item.postId === postId);
                // postId에 해당하는 게시물이 없을 경우 기본 아이콘 반환
                if (!item) return allPin;
                return item.postType === 'DAILY' ? full_dailyPin : full_historyPin;
            };

            // 마커 클릭 이벤트 핸들러
            const handleMarkerClick = (postId, marker) => {
                // 클릭된 마커가 이미 클릭된 상태인지 확인합니다.
                if (activeMarker === postId) {
                    // 클릭된 마커를 다시 클릭하면 원래 아이콘으로 변경하고 상태를 비활성화합니다.
                    marker.setIcon({
                        url: getNormalPin(postId),
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    });
                    setActiveMarker(null);
                    delete clickedMarkers[postId]; // 클릭된 마커 목록에서 제거합니다.
                } else {
                    // 모든 클릭된 마커의 아이콘을 원래 아이콘으로 변경합니다.
                    Object.values(clickedMarkers).forEach(clickedMarker => {
                        clickedMarker.setIcon({
                            url: getNormalPin(clickedMarker.postId), // 클릭된 마커의 postId를 가져와서 정상 아이콘을 설정합니다.
                            size: new naver.maps.Size(43, 43),
                            scaledSize: new naver.maps.Size(43, 43),
                        });
                    });
                    // 클릭된 마커의 아이콘을 full 아이콘으로 변경합니다.
                    marker.setIcon({
                        url: getFullPin(postId),
                        size: new naver.maps.Size(50, 50),
                        scaledSize: new naver.maps.Size(50, 50),
                    });
                    // 클릭된 마커를 clickedMarkers에 저장합니다.
                    clickedMarkers[postId] = marker;
                    setActiveMarker(postId);
                }
            };



            // 게시글 마커 표시
            post.filter(item => activePin === 'ALL' || item.postType === activePin).forEach((item, index) => {
                createMarker(item, index);
            });



            // 지도의 확대/축소 및 중심 좌표 상태 변경
            naver.maps.Event.addListener(map, 'zoom_changed', () => {
                setMapState({
                    ...mapState,
                    zoom: map.getZoom(),
                });
            });

            naver.maps.Event.addListener(map, 'center_changed', () => {
                setMapState({
                    ...mapState,
                    center: map.getCenter(),
                });
            });

        }
    }, [currentMyLocation, post, activePin, mapState]);  // `activePin` 및 `mapState`를 의존성 목록에 추가

    useEffect(() => {
        // 페이지가 처음 로드될 때만 현재 위치를 중심으로 지도를 표시
        if (currentMyLocation && mapRef.current) {
            setMapState({
                ...mapState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            });
        }
        
    }, [currentMyLocation]); // currentMyLocation을 의존성 목록에 추가하여 처음 로드될 때만 실행

    return (
        <div>
                <button onClick={onRefreshClick} >
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block' }} />
                </button>
            
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
            
            <div ref={mapRef} style={{ width: "500px", height: "500px" }}></div>
            {/* <div>
                <h4>Map Bounds:</h4>
                <p>North-East Latitude: {bounds.ne.lat}, Longitude: {bounds.ne.lng}</p>
                <p>South-West Latitude: {bounds.sw.lat}, Longitude: {bounds.sw.lng}</p>
            </div> */}

        </div>
    );
};

export default MapInformation;
