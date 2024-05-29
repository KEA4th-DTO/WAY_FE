import React from "react";
import chroma from "chroma-js";
import "../../assets/scss/layout/_waytag.scss";

// 해시 함수를 사용하여 문자열을 색상 값으로 변환
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

// 배경색과 대비되는 글자색을 계산
const getContrastingColor = (backgroundColor) => {
  const luminance = chroma(backgroundColor).luminance();
  return luminance > 0.5
    ? chroma(backgroundColor).darken(3).hex()
    : chroma(backgroundColor).brighten(3).hex();
};

const Waytag = ({ value }) => {
  const backgroundColor = stringToColor(value);
  const textColor = getContrastingColor(backgroundColor);

  return (
    <div className="waytag" style={{ backgroundColor, color: textColor }}>
      <span className="waytag-value">{"#\t" + value}</span>
    </div>
  );
};

export default Waytag;
