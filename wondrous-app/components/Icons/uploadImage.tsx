import React from 'react'

export default function UploadImageIcon(props) {
	const { style } = props
	return (
		<svg
			width={style?.width || '14'}
			height={style?.height || '19'}
			viewBox="0 0 14 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={style}
		>
			<path
				d="M7.25855 0.581055L6.73269 1.08359L1.61124 6.20035L2.66296 7.25111L6.52691 3.3907V15.4973H7.99019V3.3907L11.8541 7.25111L12.9059 6.20035L7.78441 1.08359L7.25855 0.581055ZM0.673828 16.9592V18.4212H13.8433V16.9592H0.673828Z"
				fill="#828282"
			/>
		</svg>
	)
}
