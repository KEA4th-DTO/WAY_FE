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
    const [activeMarker, setActiveMarker] = useState(null);
    const clickedMarkers = {}; // 클릭된 마커를 저장할 객체
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

            // 게시글 마커 생성 시 클릭 이벤트 핸들러를 설정합니다.
            const createMarker = (item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                let iconUrl = item.postType === "DAILY" ? dailyPin : item.postType === "HISTORY" ? historyPin : allPin;
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

                // setMarkers(prevMarkers => [...prevMarkers, marker]);

                // 마커에 클릭 이벤트를 추가합니다.
                naver.maps.Event.addListener(marker, 'click', () => {
                    handleMarkerClick(item.postId, marker);
                });
                
                return marker;
            };

            // postId에 따라 정상 아이콘을 반환합니다.
            const getNormalPin = (postId) => {
                const item = userPost.find(item => item.postId === postId);
                // postId에 해당하는 게시물이 없을 경우 기본 아이콘 반환
                if (!item) return allPin;
                return item.postType === 'DAILY' ? dailyPin : item.postType === 'HISTORY' ? historyPin : allPin;
            };

            const getFullPin = (postId) => {
                const item = userPost.find(item => item.postId === postId);
                // postId에 해당하는 게시물이 없을 경우 기본 아이콘 반환
                if (!item) return allPin;
                return item.postType === 'DAILY' ? full_dailyPin : full_historyPin;
            };

            // 마커 클릭 이벤트 핸들러
            const handleMarkerClick = (postId, marker) => {
                // postId에 해당하는 게시물을 찾습니다.
                const item = userPost.find(item => item.postId === postId);
                console.log("클릭한 마커:", item, marker);
                console.log("클릭햇엇던 마커 clickedMarkers:", clickedMarkers);
                console.log("활성화 마커 activeMarker:", activeMarker);
                //활성화된 마커가 잇으면 1, 없으면 0
                var ok = (activeMarker) ? 1 : 0;

                if (!item) return;

                // 클릭된 마커가 이미 클릭된 상태인지 확인합니다.
                if (activeMarker === postId) {
                    // 클릭된 마커를 다시 클릭하면 원래 아이콘으로 변경하고 상태를 비활성화합니다.
                    console.log("클릭한거 또 클릭, 원래로 돌아가", marker);
                    marker.setIcon({
                        url: getNormalPin(postId),
                        size: new naver.maps.Size(40, 40),
                        scaledSize: new naver.maps.Size(40, 40),
                    });
                    setActiveMarker(null);
                    ok = 0;
                } else {
                    if(ok === 1){
                        console.log("예전에 클릭햇던거 잇음. 지울게");
                        //예전에 클릭한 마커 지우기
                        Object.values(clickedMarkers).forEach((clickedMarker) => {
                            clickedMarker.setIcon({
                                url: getNormalPin(clickedMarker.get("postId")),
                                size: new naver.maps.Size(40, 40),
                                scaledSize: new naver.maps.Size(40, 40),
                            });
                            });
                    }
                    // 현재 클릭된 마커의 상태를 변경합니다.
                    ok = 0;
                    console.log("새로클릭한거 키워");
                    marker.setIcon({
                        url: getFullPin(postId),
                        size: new naver.maps.Size(46, 46),
                        scaledSize: new naver.maps.Size(46, 46),
                    });

                    clickedMarkers[postId] = marker;
                    console.log("clickedMarkers1:", clickedMarkers);
                }
                
            if(ok === 0){
                setActiveMarker(item);
            };
        };
            // 게시글 마커 표시
            userPost.filter(item => activePin === 'ALL' || item.postType === activePin).forEach((item, index) => {
                createMarker(item, index);
            });


        }
    }, [currentMyLocation, userPost, activePin, mapState, activeMarker, clickedMarkers]); // `activePin` 및 `mapState`를 의존성 목록에 추가

    active(activeMarker);
    
    // // activeMarker가 변경된 후 실행되는 useEffect
    // useEffect(() => {
    //     const { naver } = window;
    //     console.log("activeMarker2:", activeMarker);
    //      // postId에 따라 full 아이콘을 반환합니다.
         

    //     if (activeMarker) {
    //         const marker = clickedMarkers[activeMarker];
    //         console.log("Marker3:", marker);
    //         if (marker) {
    //             marker.setIcon({
    //                 url: getFullPin(activeMarker),
    //                 size: new naver.maps.Size(46, 46),
    //                 scaledSize: new naver.maps.Size(46, 46),
    //             });
    //         }
    //         // 모든 클릭된 마커의 아이콘을 원래 아이콘으로 변경합니다.
    //         // 
    //     // );
    //     }
    // }, [activeMarker, clickedMarkers, userPost]);
    // const [cluster] = useState(() => {
    //     const { naver } = window;

    //     var htmlMarker1 = {
    //         content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-1.png);background-size:contain;"></div>',
    //         size: new naver.maps.Size(40, 40),
    //         anchor: new naver.maps.Point(20, 20)
    //     },
    //     htmlMarker2 = {
    //         content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-2.png);background-size:contain;"></div>',
    //         size: new naver.maps.Size(40, 40),
    //         anchor: new naver.maps.Point(20, 20)
    //     },
    //     htmlMarker3 = {
    //         content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-3.png);background-size:contain;"></div>',
    //         size: new naver.maps.Size(40, 40),
    //         anchor: new naver.maps.Point(20, 20)
    //     },
    //     htmlMarker4 = {
    //         content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-4.png);background-size:contain;"></div>',
    //         size: new naver.maps.Size(40, 40),
    //         anchor: new naver.maps.Point(20, 20)
    //     },
    //     htmlMarker5 = {
    //         content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-5.png);background-size:contain;"></div>',
    //         size: new naver.maps.Size(40, 40),
    //         anchor: new naver.maps.Point(20, 20)
    //     };

    //     const cluster = new MarkerClustering({
    //          minClusterSize: 2,
    //          maxZoom: 12,
    //          map: mapRef.current,
    //          markers: markers,
    //          disableClickZoom: false,
    //          gridSize: 120,
    //             icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
    //          indexGenerator: [10, 100, 200, 500, 1000],
    //          stylingFunction: (clusterMarker, count) => {
    //              $(clusterMarker.getElement()).find('div:first-child').text(count);
    //          }
    //      });
    
    //     return cluster;
    // })

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
