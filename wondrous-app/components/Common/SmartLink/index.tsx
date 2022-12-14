import React, { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  href: string;
  as?: string;
  children: ReactNode;
  asLink?: boolean;
  preventLinkNavigation?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => unknown;
  onNavigate?: (event, url: string) => unknown;
}

/**
 * SmartLink is smart because it can trigger the onClick from the wrapped
 * Link component upon left click, and still allow the context menu to show
 * up upon right click.
 *
 * NOTE: Don't add onClick prop to the inner component
 */
export default function SmartLink({
  children,
  href,
  as,
  onNavigate,
  onClick = () => null,
  preventLinkNavigation = false,
  asLink = false,
}: Props) {
  const destinationUrl = as || href;
  const router = useRouter();

  const handleClick = (event) => {
    const isCommandKeyPressed = event.metaKey || event.ctrlKey;
    onClick(event);

    // if click was by link with href attribute
    if (event.target.href) {
      if (isCommandKeyPressed || !preventLinkNavigation) {
        return;
      }
    }

    event.preventDefault();

    if (onNavigate) {
      onNavigate(event, destinationUrl);
    } else {
      router.push(destinationUrl);
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onClick: handleClick });
    }

    return child;
  });

  return asLink ? (
    <Link
      href={href}
      as={destinationUrl}
      style={{
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  ) : (
    <>{childrenWithProps}</>
  );
}
