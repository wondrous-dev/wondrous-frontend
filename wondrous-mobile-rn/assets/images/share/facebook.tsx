
import React from 'react'
import Svg, { Circle, Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

const FacebookShare = ({ backgroundColor, iconColor, style }) => (
  <Svg width={(style && style.width) || "40"} height={(style && style.width) || "40"} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Circle cx="28" cy="28" r="28" fill={backgroundColor} />
    <G clip-path="url(#clip0)">
    <Path d="M37.7921 7.0689e-08H2.20612C0.987549 0.000610422 -0.000305105 0.989075 7.0689e-08 2.20795V37.7939C0.000610422 39.0125 0.989075 40.0003 2.20795 40H37.7921C39.0112 40.0003 39.9997 39.0121 40 37.793C40 37.7927 40 37.7924 40 37.7921V2.20612C39.9994 0.987549 39.0109 -0.000305105 37.7921 7.0689e-08Z" fill="#4267B2"/>
    <Path d="M27.6172 40V24.5312H32.832L33.6133 18.4766H27.6172V14.6204C27.6172 12.8714 28.1027 11.6797 30.6107 11.6797H33.7891V6.27899C33.2361 6.20544 31.3388 6.04095 29.1312 6.04095C24.5218 6.04095 21.3672 8.85345 21.3672 14.0207V18.4766H16.1719V24.5312H21.3672V40H27.6172Z" fill="white"/>
    </G>
    <Defs>
    <ClipPath id="clip0">
      <Rect width="40" height="40" rx="4"  fill="white" />
    </ClipPath>
    </Defs>
  </Svg>
)

export { FacebookShare }