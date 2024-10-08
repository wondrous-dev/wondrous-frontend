import React from 'react'
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

const Project = ({ style }) => (
  <Svg width={(style && style.width) || "64"} height={(style && style.height) || "64"}  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
  <G clip-Path="url(#clip0)">
  <Path d="M3.56512 63.9999H1.875C0.8395 63.9999 0 63.1604 0 62.1249V60.4348C0 55.9114 1.15487 51.4262 3.33962 47.4637C5.51662 43.5156 8.68 40.1501 12.4879 37.7312C13.2291 37.2602 14.1981 37.3668 14.819 37.9881L26.0117 49.1809C26.6327 49.8019 26.7395 50.7708 26.2686 51.5121C23.8496 55.3199 20.4841 58.4833 16.536 60.6603C12.5736 62.8452 8.08838 63.9999 3.56512 63.9999V63.9999Z" fill="#FFE137"/>
  <Path d="M1.8747 64.0001H3.56483C8.08808 64.0001 12.5733 62.8453 16.5358 60.6605C20.484 58.4835 23.8495 55.3201 26.2685 51.5122C26.7395 50.7708 26.6327 49.802 26.0116 49.1811L20.4152 43.5847L0.548828 63.4508C0.888203 63.7902 1.35695 64.0001 1.8747 64.0001V64.0001Z" fill="#FFC808"/>
  <Path d="M40.3036 60.9271C40.2037 60.9271 40.1032 60.9192 40.0032 60.9029C39.4082 60.8064 38.8961 60.4297 38.6265 59.8906L33.1146 48.8671C32.7082 48.0544 32.9431 47.0674 33.6719 46.5247L49.9626 34.3946C50.5102 33.9867 51.2362 33.9089 51.858 34.1914C52.4797 34.4739 52.8986 35.0719 52.9517 35.7527C53.5631 43.5954 50.7249 51.2823 45.1647 56.8424L41.6292 60.3779C41.2749 60.7322 40.7966 60.9271 40.3036 60.9271V60.9271Z" fill="#FB4021"/>
  <Path d="M15.9704 31.0838C15.687 31.0838 15.4005 31.0195 15.1327 30.8857L4.10922 25.3738C3.5701 25.1043 3.19347 24.592 3.09697 23.997C3.00047 23.4022 3.19573 22.797 3.62198 22.3709L7.1576 18.8354C12.7176 13.2753 20.4051 10.4378 28.2472 11.0484C28.928 11.1015 29.5261 11.5204 29.8086 12.1422C30.0911 12.7639 30.0132 13.4899 29.6055 14.0375L17.4752 30.3283C17.1114 30.8172 16.5475 31.0838 15.9704 31.0838Z" fill="#FF6641"/>
  <Path d="M61.7084 20.5599C56.9237 20.2994 52.4339 18.3012 49.066 14.9335C45.6984 11.5657 43.7001 7.07587 43.4396 2.29112L43.4056 1.66675C37.2112 3.5225 31.4746 6.892 26.769 11.5976L26.6761 11.6906C19.3988 18.9679 13.8766 27.5437 10.263 37.1802C10.0048 37.8687 10.1728 38.6445 10.6927 39.1644L24.8348 53.3065C25.1928 53.6646 25.6723 53.8557 26.161 53.8557C26.3818 53.8557 26.6047 53.8166 26.819 53.7364C36.4553 50.1227 45.0312 44.6006 52.3085 37.3232L52.4018 37.2299C57.1072 32.5245 60.4765 26.7881 62.3322 20.5939L61.7084 20.5599Z" fill="#E6F3FF"/>
  <Path d="M24.8353 53.3066C25.1933 53.6647 25.6728 53.8558 26.1614 53.8558C26.3823 53.8558 26.6052 53.8167 26.8194 53.7365C36.4558 50.1228 45.0317 44.6007 52.309 37.3233L52.4024 37.23C57.1078 32.5246 60.477 26.7882 62.3328 20.594L61.7085 20.56C56.9239 20.2995 52.434 18.3013 49.0662 14.9336L17.7642 46.2355L24.8353 53.3066Z" fill="#D2DCF0"/>
  <Path d="M63.3617 2.14777C63.2221 1.37952 62.6207 0.778148 61.8525 0.638523C55.1593 -0.578602 48.375 -0.0337272 42.1108 2.07965L42.1905 3.54102C42.451 8.32565 44.4491 12.8155 47.8168 16.1834C51.1846 19.551 55.6745 21.5493 60.4592 21.8098L61.9206 21.8894C64.0338 15.6254 64.5786 8.84102 63.3617 2.14777V2.14777Z" fill="#FF6641"/>
  <Path d="M47.8164 16.1835C51.1842 19.5511 55.674 21.5493 60.4588 21.8098L61.9202 21.8895C64.0335 15.6255 64.5783 8.84122 63.3614 2.14785C63.2915 1.76372 63.1063 1.42122 62.8424 1.15747L47.8164 16.1835Z" fill="#FB4021"/>
  <Path d="M39.4196 32.7056C37.2493 32.7056 35.2088 31.8605 33.6743 30.3258C32.1397 28.7913 31.2944 26.7508 31.2944 24.5806C31.2944 22.4103 32.1396 20.3698 33.6743 18.8353C35.2088 17.3007 37.2493 16.4556 39.4196 16.4556C41.5898 16.4556 43.6303 17.3007 45.1648 18.8353C46.6994 20.3698 47.5446 22.4103 47.5446 24.5806C47.5446 26.7508 46.6994 28.7913 45.1648 30.3258C43.6302 31.8605 41.5898 32.7056 39.4196 32.7056Z" fill="#FF6641"/>
  <Path d="M13.787 52.0881C13.3072 52.0881 12.8273 51.9049 12.4613 51.5388C11.729 50.8067 11.729 49.6194 12.4613 48.8872L28.371 32.9773C29.1032 32.2452 30.2904 32.2452 31.0227 32.9773C31.7549 33.7094 31.7549 34.8967 31.0227 35.6289L15.1128 51.5388C14.7467 51.9049 14.2668 52.0881 13.787 52.0881V52.0881Z" fill="#FF6641"/>
  <Path d="M33.6743 30.3257C35.2088 31.8603 37.2493 32.7055 39.4196 32.7055C41.5898 32.7055 43.6303 31.8603 45.1648 30.3257C46.6994 28.7912 47.5446 26.7507 47.5446 24.5805C47.5446 22.4102 46.6994 20.3697 45.1648 18.8352L33.6743 30.3257Z" fill="#FB4021"/>
  <Path d="M12.4609 51.539C12.8271 51.9052 13.3069 52.0883 13.7867 52.0883C14.2664 52.0883 14.7464 51.9052 15.1124 51.539L31.0223 35.6292C31.7546 34.897 31.7546 33.7098 31.0223 32.9775C31.0223 32.9775 31.0223 32.9775 31.0222 32.9775L12.4609 51.539Z" fill="#FB4021"/>
  <Path d="M39.4196 28.9556C38.2509 28.9556 37.1523 28.5006 36.3259 27.6742C35.4996 26.8479 35.0444 25.7492 35.0444 24.5806C35.0444 23.4119 35.4996 22.3133 36.3259 21.4869C37.1522 20.6606 38.2509 20.2056 39.4196 20.2056C40.5882 20.2056 41.6868 20.6606 42.5132 21.4869C43.3396 22.3132 43.7946 23.4119 43.7946 24.5806C43.7946 25.7492 43.3396 26.8478 42.5132 27.6742C41.6868 28.5006 40.5881 28.9556 39.4196 28.9556Z" fill="#84D6FF"/>
  <Path d="M36.3262 27.6741C37.1524 28.5004 38.2512 28.9554 39.4198 28.9554C40.5884 28.9554 41.687 28.5004 42.5134 27.6741C43.3398 26.8478 43.7948 25.7491 43.7948 24.5804C43.7948 23.4118 43.3398 22.3132 42.5134 21.4868L36.3262 27.6741Z" fill="#37C3FF"/>
  </G>
  <Defs>
  <ClipPath id="clip0">
  <Rect width="64" height="64" fill="white"/>
  </ClipPath>
  </Defs>
  </Svg>

)

export default Project
