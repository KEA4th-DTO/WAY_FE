import React, { useRef, useEffect, useState } from "react";

import currentPin from "../../assets/images/icons/currentPin.png";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_allPin from "../../assets/images/icons/full_allPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const MapInformation = ({ active, dailybound, historybound }) => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const [post, setPost] = useState([]);
    const [dailyPost, setDailyPost] = useState([]);
    const [combinePost, setCombinePost] = useState([]);
    const [isIn, setIsIn] = useState([]);

    const mapRef = useRef(null);
    const [activePin, setActivePin] = useState("ALL");
    const [mapState, setMapState] = useState({ zoom: 16, center: null });
    const [activeMarker, setActiveMarker] = useState(null);
    const [clickedMarker, setClickedMarker] = useState(null);
    const [dailyBounds, setDailyBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
    const [historyBounds, setHistoryBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;

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

    const onRefreshClick = () => {
        setMapState({ zoom: 16, center: currentMyLocation });
        setCombinePost(post);
    };

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
            setDailyBounds({
                latitude1: sw_bound.lat,
                longitude1: sw_bound.lng,
                latitude2: ne_bound.lat,
                longitude2: ne_bound.lng
            });
            dailybound({
                latitude1: sw_bound.lat,
                longitude1: sw_bound.lng,
                latitude2: ne_bound.lat,
                longitude2: ne_bound.lng
            });
        }
    }, [currentMyLocation]);

    useEffect(() => {
        if (dailyBounds) {
            const { latitude1, longitude1, latitude2, longitude2 } = dailyBounds;
            const url = `${Server_IP}/post-service/posts/pin/range?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;

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
                        // console.log("success_pin", data.result.pinResultDtoList);
                        const daily_p = data.result.pinResultDtoList.filter(item => item.postType === 'DAILY');
                        setDailyPost(daily_p);
                        setCombinePost(data.result.pinResultDtoList);
                        setPost(data.result.pinResultDtoList);
                    } else {
                        console.error("Error in API response:", data.message);
                    }
                })
                .catch(error => console.error("Error fetching pin data:", error));
        }
    }, [dailyBounds]);

    const getNormalPin = (item) => {
        return item.postType === 'DAILY' ? dailyPin : item.postType === 'HISTORY' ? historyPin : allPin;
    };

    const getFullPin = (item) => {
        return item.postType === 'DAILY' ? full_dailyPin : item.postType === 'HISTORY' ? full_historyPin : full_allPin;
    };

    // useEffect(() => {
    //     setCombinePost([...post, ...historypost]);
    // }, [combinePost]);

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

            //지도 이동시 bounds 변경(좌표 받아오기)
            function updateBounds() {
                const bounds = map.getBounds();
                setHistoryBounds({
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

            const handleMarkerClick = (item, marker) => {
                // console.log('clicked marker:', item, marker);
                // console.log('클릭햇던 마커:', clickedMarker);
                if(clickedMarker && clickedMarker.item === item) {
                    // console.log('같은거 클릭해서 원래대로');
                    marker.setIcon({
                        url: getNormalPin(item),
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    });
                    setActiveMarker(null);
                    setClickedMarker(null);
                    return;
                } 
                else if(clickedMarker && clickedMarker.item !== item) {
                    // console.log('다른거 클릭해서 원래거 원래대로');
                    clickedMarker.marker.setIcon({
                        url: getNormalPin(clickedMarker.item),
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    });
                }
                // console.log('다른거 클릭햇거나 처음 클릭');

                marker.setIcon({
                    url: getFullPin(item),
                    size: new naver.maps.Size(50, 50),
                    scaledSize: new naver.maps.Size(50, 50),
                });
                setActiveMarker({ item });
                setClickedMarker({ marker, item });
               
            };

            // // Combine post and historypost arrays
            // const combinedPosts = [...post, ...historypost];
        
            // console.log('combinePost:', combinePost);
            const markers = combinePost.filter(item => activePin === 'ALL' || item.postType === activePin).map((item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
                // console.log('정보: ', item);
                let iconUrl = getNormalPin(item);
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
    }, [currentMyLocation, combinePost, activePin, mapState, clickedMarker, activeMarker]);

    useEffect(() => {
        if (currentMyLocation && mapRef.current) {
            setMapState((prevState) => ({
                ...prevState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            }));
        }
    }, [currentMyLocation]);

    active(activeMarker);

    const onHistoryBound = async () => {
        if (!historyBounds) {
            alert("선택된 바운드가 없습니다.");
            return;
        }
    
        const latitude1 = historyBounds.sw.lat;
        const longitude1 = historyBounds.sw.lng;
        const latitude2 = historyBounds.ne.lat;
        const longitude2 = historyBounds.ne.lng;

        historybound({
            latitude1: latitude1,
            longitude1: longitude1,
            latitude2: latitude2,
            longitude2:  longitude2
        });
    
        const url = `${Server_IP}/post-service/posts/pin/range?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const data = await response.json();
    
            if (data.isSuccess) {
                // console.log("범위의 히스토리 불러오기 성공", data.result.pinResultDtoList);
                const history_p = data.result.pinResultDtoList.filter(item => item.postType === 'HISTORY');
                setCombinePost([...dailyPost, ...history_p]);
                if(history_p.length === 0) {
                    alert("해당 위치에 히스토리가 없습니다.");
                }
            } else {
                console.error("API 응답 오류:", data.message);
            }
        } catch (error) {
            console.error("핀 데이터 가져오기 오류:", error);
        }
    };
    

    return (
        <div>
        <div className="map-header-button">
            <button className="refresh-button" onClick={onRefreshClick}>
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block' }} />
            </button>
            <button className="research-button" onClick={onHistoryBound}>이 위치에서 재검색</button>
            
            <div className="pin-buttons">
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
        <div ref={mapRef} style={{ width: "500px", height: "500px" }}></div>
    </div>
    
    );
};


export default MapInformation;