import React from 'react'
import Svg, { Path } from 'react-native-svg'

const AddFriend = ({ style }) => (
  <Svg width={(style && style.width) || "64"} height={(style && style.height) || "64"}  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M44.3555 23.5547H15.6445C23.5729 23.5547 30 29.9818 30 37.9102L27.6562 55.1953H56.9531C57.9239 55.1953 58.7109 54.4083 58.7109 53.4375V37.9102C58.7109 29.9818 52.2838 23.5547 44.3555 23.5547Z" fill="#AADC1E"/>
    <Path d="M58.7109 37.9102C58.7109 29.9818 52.2838 23.5547 44.3555 23.5547V55.1953H56.9531C57.9239 55.1953 58.7109 54.4083 58.7109 53.4375V37.9102Z" fill="#8CC314"/>
    <Path d="M1.28906 37.9102V53.4375C1.28906 54.4083 2.07609 55.1953 3.04688 55.1953H30V37.9102C30 29.9818 23.5729 23.5547 15.6445 23.5547C7.71621 23.5547 1.28906 29.9818 1.28906 37.9102Z" fill="#49ACFF"/>
    <Path d="M50.5078 42.3047C49.537 42.3047 48.75 43.0917 48.75 44.0625V55.1953H52.2656V44.0625C52.2656 43.0917 51.4786 42.3047 50.5078 42.3047Z" fill="#64A000"/>
    <Path d="M7.73438 55.1953V44.0625C7.73438 43.0917 8.52141 42.3047 9.49219 42.3047C10.463 42.3047 11.25 43.0917 11.25 44.0625V55.1953" fill="#1790E7"/>
    <Path d="M3.80859 37.0312H1.75781C0.787031 37.0312 0 36.2442 0 35.2734V30.8789C0 28.7789 1.70859 27.0703 3.80859 27.0703C6.55488 27.0703 8.78906 29.3045 8.78906 32.0508C8.78906 34.7971 6.55488 37.0312 3.80859 37.0312Z" fill="#FFD5B6"/>
    <Path d="M51.2109 32.0508C51.2109 29.3045 53.4451 27.0703 56.1914 27.0703C58.2914 27.0703 60 28.7789 60 30.8789V35.2734C60 36.2442 59.213 37.0312 58.2422 37.0312H56.1914C53.4451 37.0312 51.2109 34.7971 51.2109 32.0508Z" fill="#FFC896"/>
    <Path d="M30 37.9102C30 29.9818 23.5729 23.5547 15.6445 23.5547V55.1953H30V37.9102Z" fill="#1790E7"/>
    <Path d="M15.6445 27.0703C9.5059 27.0703 4.51172 22.0761 4.51172 15.9375C4.51172 9.79887 9.5059 4.80469 15.6445 4.80469C21.7832 4.80469 26.7773 9.79887 26.7773 15.9375C26.7773 22.0761 21.7832 27.0703 15.6445 27.0703Z" fill="#FFD5B6"/>
    <Path d="M15.6445 4.80469V27.0703C21.7832 27.0703 26.7773 22.0761 26.7773 15.9375C26.7773 9.79887 21.7832 4.80469 15.6445 4.80469Z" fill="#FFC896"/>
    <Path d="M44.3555 27.0703C38.2168 27.0703 33.2227 22.0761 33.2227 15.9375C33.2227 9.79887 38.2168 4.80469 44.3555 4.80469C50.4941 4.80469 55.4883 9.79887 55.4883 15.9375C55.4883 22.0761 50.4941 27.0703 44.3555 27.0703Z" fill="#FFD5B6"/>
    <Path d="M44.3555 4.80469V27.0703C50.4941 27.0703 55.4883 22.0761 55.4883 15.9375C55.4883 9.79887 50.4941 4.80469 44.3555 4.80469Z" fill="#FFC896"/>
  </Svg>
)

export default AddFriend