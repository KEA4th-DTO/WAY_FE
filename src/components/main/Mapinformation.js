import React, { useRef, useEffect, useState } from "react";

import currentPin from "../../assets/images/icons/currentPin.png";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_allPin from "../../assets/images/icons/full_allPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const MapInformation = ({ active }) => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const [post, setPost] = useState([]);
    const mapRef = useRef(null);
    const [activePin, setActivePin] = useState("ALL");
    const [mapState, setMapState] = useState({ zoom: 16, center: null });
    const [activeMarker, setActiveMarker] = useState(null);
    const [clickedMarker, setClickedMarker] = useState(null);
    const [bounds, setBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
    const token = localStorage.getItem("accessToken");

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
            setBounds({
                latitude1: sw_bound.lat,
                longitude1: sw_bound.lng,
                latitude2: ne_bound.lat,
                longitude2: ne_bound.lng
            });
        }
    }, [currentMyLocation]);

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

    const getNormalPin = (item) => {
        return item.postType === 'DAILY' ? dailyPin : item.postType === 'HISTORY' ? historyPin : allPin;
    };

    const getFullPin = (item) => {
        return item.postType === 'DAILY' ? full_dailyPin : item.postType === 'HISTORY' ? full_historyPin : full_allPin;
    };

    useEffect(() => {
        const { naver } = window;
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

           

            const handleMarkerClick = (item, marker) => {
                console.log('clicked marker:', item, marker);
                console.log('클릭햇던 마커:', clickedMarker);
                if(clickedMarker && clickedMarker.item === item) {
                    console.log('같은거 클릭해서 원래대로');
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
                    console.log('다른거 클릭해서 원래거 원래대로');
                    clickedMarker.marker.setIcon({
                        url: getNormalPin(clickedMarker.item),
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    });
                }
                console.log('다른거 클릭햇거나 처음 클릭');

                marker.setIcon({
                    url: getFullPin(item),
                    size: new naver.maps.Size(50, 50),
                    scaledSize: new naver.maps.Size(50, 50),
                });
                setActiveMarker({ item });
                setClickedMarker({ marker, item });
               
            };

            const markers = post.filter(item => activePin === 'ALL' || item.postType === activePin).map((item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
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
    }, [currentMyLocation, post, activePin, mapState, clickedMarker, activeMarker]);

    useEffect(() => {
        if (currentMyLocation && mapRef.current) {
            setMapState((prevState) => ({
                ...prevState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            }));
        }
    }, [currentMyLocation]);

    active(activeMarker);

    return (
        <div>
            <button onClick={onRefreshClick}>
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
        </div>
    );
};


export default MapInformation;