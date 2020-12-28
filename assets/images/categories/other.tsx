
import React from 'react'
import Svg, { Circle, Path, G, Defs, Rect, ClipPath } from 'react-native-svg'

const Music = ({ backgroundColor='#F0F4FE', iconColor='#434B62', style }) => (
  <Svg width={(style && style.width) || "56"} height={(style && style.width) || "56"} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Circle cx="28" cy="28" r="28" fill={backgroundColor} />
  </Svg>
)

export default Music

