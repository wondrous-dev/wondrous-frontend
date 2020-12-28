import React from 'react'
import Svg, { Circle, Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

const Writing = ({ backgroundColor='#F0F4FE', iconColor='#434B62', style }) => (
  <Svg width={(style && style.width) || "56"} height={(style && style.width) || "56"} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Circle cx="28" cy="28" r="28" fill={backgroundColor} />
    <G clip-path="url(#clip0)">
    <Path d="M43 19.2151L36.7853 13.0003L18.8669 30.9188L16.3088 39.6915L25.0816 37.1335L43 19.2151ZM20.8905 31.3809L33.5722 18.6993L37.3011 22.4282L24.6194 35.1098L20.8905 31.3809ZM40.5141 19.2151L38.5439 21.1853L34.8151 17.4564L36.7853 15.4863L40.5141 19.2151ZM20.0758 33.0521L22.9482 35.9246L18.8934 37.1069L20.0758 33.0521Z" fill={iconColor}/>
    <Path d="M13 41.2419H42.9998V42.9997H13V41.2419Z" fill={iconColor}/>
    </G>
    <Defs>
    <ClipPath id="clip0">
    <Rect width="30" height="30" fill="white" transform="translate(13 13)"/>
    </ClipPath>
    </Defs>
  </Svg>
)

export default Writing

