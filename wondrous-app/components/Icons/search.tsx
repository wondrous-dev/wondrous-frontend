import React from 'react'

export default function SearchIcon({ color = '#707070', ...props }) {
	return (
		<svg
			width="19"
			height="18"
			viewBox="0 0 19 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M13.6453 14.0904L13.3253 13.7819L12.9815 14.0635C11.6615 15.1446 9.97926 15.7947 8.14733 15.7947C3.93348 15.7947 0.5 12.3612 0.5 8.14733C0.5 3.93348 3.93348 0.5 8.14733 0.5C12.3612 0.5 15.7947 3.93348 15.7947 8.14733C15.7947 9.97926 15.1446 11.6615 14.0635 12.9815L13.7714 13.3382L14.1034 13.6583L17.5256 16.9574L17.5264 16.9581C17.5566 16.9871 17.5807 17.0218 17.5973 17.0603C17.6139 17.0987 17.6227 17.1401 17.6231 17.182C17.6235 17.2239 17.6156 17.2654 17.5998 17.3042C17.5839 17.343 17.5605 17.3782 17.5309 17.4078L17.8845 17.7613L17.5309 17.4078C17.5013 17.4374 17.4661 17.4608 17.4273 17.4766C17.3885 17.4925 17.347 17.5004 17.3051 17.5C17.2632 17.4996 17.2219 17.4908 17.1834 17.4742C17.145 17.4575 17.1102 17.4334 17.0812 17.4032L17.0745 17.3962L17.0676 17.3895L13.6453 14.0904ZM15.1652 8.14733C15.1652 4.26182 12.0328 1.12947 8.14733 1.12947C4.26182 1.12947 1.12947 4.26182 1.12947 8.14733C1.12947 12.0328 4.26182 15.1652 8.14733 15.1652C12.0328 15.1652 15.1652 12.0328 15.1652 8.14733Z"
				stroke={color}
			/>
		</svg>
	)
}
