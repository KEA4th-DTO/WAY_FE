import React, { useRef, useEffect, useState } from "react";
import allPin from "../../assets/images/icons/allPin.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import historyPin from "../../assets/images/icons/historyPin.png";

export default function MapInformation() {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const [post, setPost] = useState([]);
    const [bounds, setBounds] = useState({ ne: {}, sw: {} });
    const mapRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:3001/post')
            .then(res => res.json())
            .then(data => {
                setPost(data);
            })
            .catch(error => console.error("Error fetching data:", error));
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

            function updateBounds() {
                const bounds = map.getBounds();
                setBounds({
                    ne: bounds.getNE(),
                    sw: bounds.getSW()
                });
            }

            naver.maps.Event.addListener(map, 'bounds_changed', updateBounds);

            new naver.maps.Marker({
                position: location,
                map,
                icon: {
                    url: allPin,
                    size: new naver.maps.Size(43, 43),
                    scaledSize: new naver.maps.Size(43, 43),
                },
                zIndex: 999,
            });

            post.forEach((item, index) => {
                const postLocation = new naver.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
                let iconUrl = item.pin === "daily" ? dailyPin : item.pin === "history" ? historyPin : allPin;
                new naver.maps.Marker({
                    position: postLocation,
                    map,
                    icon: {
                        url: iconUrl,
                        size: new naver.maps.Size(43, 43),
                        scaledSize: new naver.maps.Size(43, 43),
                    },
                    zIndex: index,
                });
            });
        }
    }, [currentMyLocation, post]);

    return (
        <div>
            <div ref={mapRef} style={{ width: "500px", height: "500px" }}></div>
            <div>
                <h4>Map Bounds:</h4>
                <p>North-East Latitude: {bounds.ne.lat}, Longitude: {bounds.ne.lng}</p>
                <p>South-West Latitude: {bounds.sw.lat}, Longitude: {bounds.sw.lng}</p>
            </div>
        </div>
    );
}
