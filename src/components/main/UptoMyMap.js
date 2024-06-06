import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas"; // html2canvas를 import
import currentPin from "../../assets/images/icons/currentPin.png";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_allPin from "../../assets/images/icons/full_allPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";


const UptoMyMap = ({ userNickname, capture, active }) => {
    const [userPost, setUserPost] = useState([]);
    const mapRef = useRef(null);
    const [activePin, setActivePin] = useState("ALL"); // 현재 활성화된 핀 타입을 관리
    const k_center = { lat: 36.358949, lng: 127.7646949 };
    const [mapState, setMapState] = useState({ zoom: 7, center: k_center }); // 지도의 확대/축소 및 중심 좌표 상태 관리
  
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
                .catch(error => console.error("Error fetching pin data:", error));
        }
    }, [userNickname, token]);

    //지도 그리기
    useEffect(() => {
        const { naver } = window;
        if (mapRef.current && naver) {
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

            // 게시글 마커 생성 시 클릭 이벤트 핸들러를 설정합니다.
            const createMarker = (item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                let iconUrl = item.postType === "DAILY" ? dailyPin : item.postType === "HISTORY" ? historyPin : allPin;
                const marker = new naver.maps.Marker({
                    position: postLocation,
                    map,
                    icon: {
                        url: iconUrl,
                        size: new naver.maps.Size(30, 30),
                        scaledSize: new naver.maps.Size(30, 30),
                    },
                    zIndex: index,
                });

                return marker;
            };

            // 게시글 마커 표시
            userPost.filter(item => activePin === 'ALL' || item.postType === activePin).forEach((item, index) => {
                createMarker(item, index);
            });

            if(capture){
            const tilesloadedListener = naver.maps.Event.addListener(map, 'tilesloaded', () => {
                // 지도 타일이 모두 로드된 후에 캡처를 실행
                captureMap();
                // 이벤트 리스너 제거
                naver.maps.Event.removeListener(tilesloadedListener);
            });
         };

        }
    }, [userPost, activePin, mapState]); // `activePin` 및 `mapState`를 의존성 목록에 추가

    const captureMap = () => {
        const target = document.getElementById("download");
        if (!target) {
            return alert("사진이 없다는디?");
        }
    
        html2canvas(target, {
            useCORS: true,
            proxy: "http://localhost:3002" // 프록시 서버 주소
        }).then((canvas) => {// 새 캔버스 생성 및 크기 조정
            const resizedCanvas = document.createElement("canvas");
            resizedCanvas.width = 550;
            resizedCanvas.height = 550;
            const ctx = resizedCanvas.getContext("2d");
    
            // 원본 캔버스를 새 캔버스에 맞춰 그리기
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 550, 550);
    
            resizedCanvas.toBlob((blob) => {
                if (blob) {
                    const formData = new FormData();
                    formData.append('myMapImage', blob, 'map.png');

                    const url = `${Server_IP}/member-service/mymap-image`;
    
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.isSuccess) {
                            // alert('성공입니다.');
                        } else {
                            // alert('실패했습니다: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error("Error uploading map image:", error);
                        // alert("사진 저장에 실패했습니다.");
                    });
                }
            }, 'image/png');
        }).catch(error => {
            console.error("Error capturing map:", error);
            // alert("사진 저장에 실패했습니다.");
        });
    };
    

    //   console.log("cap: ", capture);
    //   if(capture){
    //     // captureMap();
    //     console.log("캡처되었습니다.");
    //   }

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

export default UptoMyMap;
