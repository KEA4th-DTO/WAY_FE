import React, { useRef, useEffect, useState } from "react";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import refresh from "../../assets/images/icons/refresh.png";

const UploadHisMap = ({ setPostPosition }) => {
    const [currentMyLocation, setCurrentMyLocation] = useState();
    const mapRef = useRef(null);
    const [mapState, setMapState] = useState({ zoom: 16, center: null });
    const infoWindowRef = useRef(null);

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

            var marker = new naver.maps.Marker({
                position: location,
                map,
                icon: {
                    url: full_historyPin,
                    size: new naver.maps.Size(28, 28),
                    scaledSize: new naver.maps.Size(28, 28),
                },
                zIndex: 998,
            });

            // const infoWindow = new naver.maps.InfoWindow({ anchorSkew: true });
            // infoWindowRef.current = infoWindow;

            naver.maps.Event.addListener(map, 'click', function(e) {
                marker.setPosition(e.coord);
                setPostPosition(e.coord);
            });

            const searchAddressToCoordinate = (address) => {
                naver.maps.Service.geocode({
                    query: address
                }, (status, response) => {
                    if (status === naver.maps.Service.Status.ERROR) {
                        return alert('Something went wrong!');
                    }

                    if (response.v2.meta.totalCount === 0) {
                        return alert('No results found for the address.');
                    }

                    const item = response.v2.addresses[0];
                    const point = new naver.maps.Point(item.x, item.y);
                    // const htmlAddresses = [];

                    // if (item.roadAddress) {
                    //     htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
                    // }

                    // if (item.jibunAddress) {
                    //     htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
                    // }

                    // if (item.englishAddress) {
                    //     htmlAddresses.push('[영문 주소] ' + item.englishAddress);
                    // }

                    // infoWindow.setContent([
                    //     '<div style="padding:10px;min-width:200px;line-height:150%;">',
                    //     '<h4 style="margin-top:5px;">검색 주소 : ' + address + '</h4><br />',
                    //     htmlAddresses.join('<br />'),
                    //     '</div>'
                    // ].join('\n'));

                    map.setCenter(point);
                    marker.setPosition(point);

                    // infoWindow.open(map, point);
                });
            };

            const initGeocoder = () => {
                const addressInput = document.getElementById('address');
                const submitButton = document.getElementById('submit');
                
                const handleAddressSearch = (e) => {
                    e.preventDefault();
                    if (!addressInput.value.trim()) {
                        alert('검색어를 입력해주세요.');
                        return;
                    }
                    searchAddressToCoordinate(addressInput.value);
                };

                addressInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        handleAddressSearch(e);
                    }
                });

                submitButton.addEventListener('click', handleAddressSearch);

                // searchAddressToCoordinate('정자동 178-1');
            };

            initGeocoder();
        }
    }, [currentMyLocation, mapState]);

    useEffect(() => {
        if (currentMyLocation && mapRef.current) {
            setMapState({
                ...mapState,
                center: new window.naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
            });
        }
    }, [currentMyLocation]);

    return (
        <div className="upload-map-div">
            <br />
            <button className="upload-refresh-button" onClick={onRefreshClick}>
                <img src={refresh} alt="refresh" style={{ width: '20px', height: '20px', display: 'inline-block', border: 'none' }} />
            </button>

            <input id="address" type="text" placeholder="주소를 입력하세요" />
            <button className="upload-map" id="submit">주소 검색</button>
            <div ref={mapRef} style={{ width: "300px", height: "300px" }}></div>
        </div>
    );
};

export default UploadHisMap;
