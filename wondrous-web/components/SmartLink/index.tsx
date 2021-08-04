import React, { ReactNode } from 'react'
import Link from 'next/link'

/**
 * SmartLink is smart because it can trigger the onClick from the wrapped
 * Link component upon left click, and still allow the context menu to show
 * up upon right click.
 *
 * Note that this component currently does not support opening link in new tab
 * when the command key (e.metaKey) is pressed while left clicking.
 */
export default function SmartLink({ children, href, as }: Props) {
	return (
		<Link href={href} as={as}>
			<SmartLinkInner aHref={as}>{children}</SmartLinkInner>
		</Link>
	)
}

function SmartLinkInner(props: InnerProps) {
	const onClickFromNextLink = props.onClick

	const childrenWithProps = React.Children.map(props.children, (child) => {
		// checking isValidElement is the safe way and avoids a typescript error too
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { onClick: onClickFromNextLink })
		}
		return child
	})

	return (
		<a
			href={props.aHref}
			onClick={(e) => {
				e.preventDefault()
			}}
		>
			{childrenWithProps}
		</a>
	)
}

interface Props {
	href: string
	as: string
	children: ReactNode
}

interface InnerProps {
	aHref: string
	onClick?: () => void
	children: ReactNode
}
