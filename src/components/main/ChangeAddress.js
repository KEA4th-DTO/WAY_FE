import React, { useRef, useEffect, useState, Component } from "react";
import Geocode from "react-geocode";
import allPin from "../../assets/images/icons/allPin.png";

class ChangeAddress extends Component {
    componentDidMount() {
        Geocode.fromAddress('서울특별시 강남구 역삼동').then(
          response => {
            const { lat, lng=} = response.results[0].geometry.location;
            console.log(lat, lng);
          },
          error => {
            console.error(error);
          }
        );
      }
    
      render() {
        return (
          <div>ChangeAddress</div>
        );
      }
    
}
export default ChangeAddress;
