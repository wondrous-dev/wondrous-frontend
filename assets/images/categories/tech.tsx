
import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

const Tech = ({ backgroundColor='#F0F4FE', iconColor='#434B62', style }) => (
  <Svg width={(style && style.width) || "56"} height={(style && style.width) || "56"} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Circle cx="28" cy="28" r="28" fill={backgroundColor} />
    <Path d="M38.6667 35.9999C40.1333 35.9999 41.32 34.7999 41.32 33.3333L41.3333 19.9999C41.3333 18.5333 40.1333 17.3333 38.6667 17.3333H17.3333C15.8667 17.3333 14.6667 18.5333 14.6667 19.9999V33.3333C14.6667 34.7999 15.8667 35.9999 17.3333 35.9999H13.3333C12.6 35.9999 12 36.5999 12 37.3333C12 38.0666 12.6 38.6666 13.3333 38.6666H42.6667C43.4 38.6666 44 38.0666 44 37.3333C44 36.5999 43.4 35.9999 42.6667 35.9999H38.6667ZM18.6667 19.9999H37.3333C38.0667 19.9999 38.6667 20.5999 38.6667 21.3333V31.9999C38.6667 32.7333 38.0667 33.3333 37.3333 33.3333H18.6667C17.9333 33.3333 17.3333 32.7333 17.3333 31.9999V21.3333C17.3333 20.5999 17.9333 19.9999 18.6667 19.9999Z" fill={iconColor}/>
  </Svg>
)

export default Tech

