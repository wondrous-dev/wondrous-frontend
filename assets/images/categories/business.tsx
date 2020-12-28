import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

const Business = ({ backgroundColor='#F0F4FE', iconColor='#434B62', style }) => (
  <Svg width={(style && style.width) || "56"} height={(style && style.width) || "56"} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Circle cx="28" cy="28" r="28" fill={backgroundColor} />
    <Path d="M26 15C25.48 15 24.94 15.18 24.56 15.56C24.18 15.94 24 16.48 24 17V18H15V38H26.2C26.07 37.36 26 36.69 26 36H17V29.44C17.59 29.78 18.27 30 19 30H28.01C28.57 29.24 29.25 28.56 30.01 28H19C17.81 28 17 27.19 17 26V20H39V26C39 26.16 38.99 26.31 38.96 26.45C39.68 26.67 40.36 26.97 41 27.34V18H32V17C32 16.48 31.82 15.94 31.44 15.56C31.06 15.18 30.52 15 30 15H26ZM26 17H30V18H26V17ZM21 24V27H23V24H21ZM33 24V26.46C33.6512 26.2565 34.3213 26.1191 35 26.05V24H33ZM36 28C31.59 28 28 31.59 28 36C28 40.41 31.59 44 36 44C40.41 44 44 40.41 44 36C44 31.59 40.41 28 36 28ZM36 30C39.32 30 42 32.68 42 36C42 39.32 39.32 42 36 42C32.68 42 30 39.32 30 36C30 32.68 32.68 30 36 30ZM35 31V37H40V35H37V31H35Z" fill={iconColor}/>

  </Svg>
)

export default Business


