import React, { useRef, useEffect, useState } from "react";
import allPin from "../../assets/images/icons/allPin.png";

export default function MapInformation() {

    const [currentMyLocation, setCurrentMyLocation] = useState();

    const [post, setPost] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:3001/post') //API경로 적어주기
        .then(res => {
            return res.json() //json으로 변환됨
        })
        .then(data => {
            setPost(data);
        })
    }, []);
    
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

    const mapRef = useRef(null);
    
    useEffect(() => {
        const { naver } = window;
        if (mapRef.current && naver && currentMyLocation) {
            const location = new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng);
            const map = new naver.maps.Map(mapRef.current, {
                center: location,
                zoom: 16,
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
                    url: allPin, // 이미지 파일 경로를 직접 사용
                    size: new naver.maps.Size(43, 43),
                    scaledSize: new naver.maps.Size(43, 43),
                },
                zIndex: 999,
            });

            // 포스트의 위치에 마커 추가
            post.forEach((item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
                new naver.maps.Marker({
                    position: postLocation,
                    map,
                    icon: {
                        url: allPin,
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    },
                    zIndex: index,
                });
            });
        }
    }, [currentMyLocation]);

    return (
        <div ref={mapRef} style={{ width: "500px", height: "500px" }}></div>
    );
}

