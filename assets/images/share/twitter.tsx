
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const TwitterShare = ({ color, style }) => (
  <Svg width={(style && style.width) || "40"} height={(style && style.width) || "40"} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Path d="M36 0H4C1.79086 0 0 1.79086 0 4V36C0 38.2091 1.79086 40 4 40H36C38.2091 40 40 38.2091 40 36V4C40 1.79086 38.2091 0 36 0Z" fill="#1DA1F2" />
    <Path d="M15.362 30.1588C24.796 30.1588 29.956 22.3428 29.956 15.5648C29.956 15.3428 29.956 15.1218 29.941 14.9018C30.9448 14.1757 31.8114 13.2767 32.5 12.2468C31.5639 12.6616 30.5708 12.9336 29.554 13.0538C30.6247 12.4128 31.4261 11.4046 31.809 10.2168C30.8022 10.8143 29.7006 11.2353 28.552 11.4618C27.7787 10.6395 26.7559 10.095 25.6419 9.91253C24.5279 9.73007 23.3848 9.91985 22.3895 10.4525C21.3943 10.9851 20.6023 11.831 20.1362 12.8591C19.6701 13.8872 19.5558 15.0402 19.811 16.1398C17.7718 16.0376 15.7768 15.5076 13.9556 14.5844C12.1345 13.6612 10.5278 12.3653 9.24 10.7808C8.58409 11.91 8.3832 13.2467 8.67823 14.5188C8.97326 15.7908 9.74202 16.9026 10.828 17.6278C10.0117 17.6036 9.21328 17.3834 8.5 16.9858C8.5 17.0068 8.5 17.0288 8.5 17.0508C8.50032 18.235 8.91026 19.3827 9.66028 20.2991C10.4103 21.2155 11.4542 21.8443 12.615 22.0788C11.8599 22.2848 11.0676 22.3149 10.299 22.1668C10.6268 23.186 11.2649 24.0772 12.1241 24.7159C12.9833 25.3546 14.0206 25.7087 15.091 25.7288C13.2747 27.1562 11.0311 27.9311 8.721 27.9288C8.3129 27.928 7.9052 27.9033 7.5 27.8548C9.84564 29.3601 12.5749 30.1585 15.362 30.1548" fill="white"/>
  </Svg>
)

export {
  TwitterShare
}
