import React, { useState } from 'react'
import { Grey57, Red400 } from '../../theme/colors'

export const TaskLikeIcon = (props) => {
	const { liked = false } = props
	const [colorFill, setColorFill] = useState(Grey57)

	const handlePointerEnter = (event) => {
		setColorFill(Red400)
	}

	const handlePointerLeave = (event) => {
		setColorFill(Grey57)
	}

	return (
		<svg
			width="21"
			height="17"
			viewBox="0 0 21 17"
			fill="none"
			cursor="pointer"
			xmlns="http://www.w3.org/2000/svg"
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
		>
			<path
				d="M18.6564 2.56291C18.1947 2.10101 17.6466 1.7346 17.0432 1.48462C16.4399 1.23463 15.7933 1.10596 15.1402 1.10596C14.4871 1.10596 13.8405 1.23463 13.2371 1.48462C12.6338 1.7346 12.0856 2.10101 11.624 2.56291L10.6658 3.52106L9.70767 2.56291C8.77511 1.63035 7.51028 1.10644 6.19144 1.10644C4.8726 1.10644 3.60778 1.63035 2.67522 2.56291C1.74266 3.49547 1.21875 4.76029 1.21875 6.07913C1.21875 7.39797 1.74266 8.6628 2.67522 9.59536L3.63337 10.5535L8.5445 15.4646C9.71607 16.6362 11.6156 16.6362 12.7871 15.4646L17.6983 10.5535L18.6564 9.59536C19.1183 9.13368 19.4847 8.58552 19.7347 7.98219C19.9847 7.37887 20.1134 6.7322 20.1134 6.07913C20.1134 5.42607 19.9847 4.7794 19.7347 4.17607C19.4847 3.57275 19.1183 3.02459 18.6564 2.56291Z"
				stroke={liked ? Red400 : colorFill}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill={liked ? Red400: 'none'}
			/>
		</svg>
	)
}
