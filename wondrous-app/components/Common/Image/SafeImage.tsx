import React, { useEffect, useState, memo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { parseISO, addSeconds } from 'date-fns';
import Image, { ImageProps } from 'next/image';

import { GET_PREVIEW_FILE } from 'graphql/queries/media';
import { shallowEqual } from 'utils/common';

type SafeImageArgs = Omit<ImageProps, 'style'> & {
  className?: string;
  /**
   * Image src to display while the image is not visible or loaded.
   */
  placeholderSrc?: string;
  /**
   * React element to use as a placeholder.
   */
  placeholderComp?: JSX.Element;
  /**
   * Set `true` to use `next/image` instead of `img` tag.
   *
   * https://nextjs.org/docs/api-reference/next/image
   */
  useNextImage?: boolean;
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
  /**
   * Action called when preview file is loaded
   * @param url
   */
  onPreviewLoaded?(url: string): unknown;
};

// https://nextjs.org/docs/api-reference/next/image
function SafeImage(safeImageArgs: SafeImageArgs) {
  const {
    src,
    onPreviewLoaded,
    width,
    height,
    placeholderComp,
    placeholderSrc,
    alt = '',
    useNextImage = false,
    ...props
  } = safeImageArgs;

  const [imgUrl, setImageUrl] = useState(null);
  const hasProtocol = typeof src === 'string' && (src?.startsWith('http') || src?.startsWith('file://'));
  let safeImageUrl = (hasProtocol ? src : imgUrl) || placeholderSrc;

  // In case if image was imported
  if (typeof src === 'object' && useNextImage) {
    safeImageUrl = src;
  }

  const [getPreviewFile] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
    onCompleted: ({ getPreviewFile: { url } }) => {
      setImageUrl(url);
      localStorage.setItem(`safeImage.${src}`, url);

      if (onPreviewLoaded) {
        onPreviewLoaded(url);
      }
    },
  });

  useEffect(() => {
    if (!src || hasProtocol || typeof src === 'object') {
      setImageUrl(null);
      return;
    }

    try {
      const cachedPreviewUrl = localStorage.getItem(`safeImage.${src}`);

      if (cachedPreviewUrl) {
        // parse query params to get
        // X-Goog-Date: The date and time the signed URL became usable, in the ISO 8601 basic format YYYYMMDD'T'HHMMSS'Z'.
        // X-Goog-Expires: The length of time the signed URL remained valid, measured in seconds from the value in X-Goog-Date.
        const [, signedISODate] = cachedPreviewUrl.match(/X-Goog-Date=([^&]*)/);
        const [, expiresTime] = cachedPreviewUrl.match(/X-Goog-Expires=([^&]*)/);
        const signedDate = parseISO(signedISODate).valueOf();
        const expiredAt = addSeconds(signedDate, Number(expiresTime)).valueOf();

        if (Date.now() < expiredAt) {
          setImageUrl(cachedPreviewUrl);

          if (onPreviewLoaded) {
            onPreviewLoaded(cachedPreviewUrl);
          }
          return;
        }
      }
    } catch (error) {}

    getPreviewFile({
      variables: {
        path: src,
      },
    });
  }, [src, onPreviewLoaded]);

  if (safeImageUrl) {
    return useNextImage ? (
      <Image src={safeImageUrl} alt={alt} width={width} height={height} {...props} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={safeImageUrl} alt={alt} width={width} height={height} {...props} />
    );
  }
  if (placeholderComp) {
    return placeholderComp;
  }

  return null;
}

function arePropsEqualWithStyle(prevProps, nextProps) {
  return !Object.keys(prevProps).some((propName) => {
    const prevProp = prevProps[propName];
    const nextProp = nextProps[propName];

    if (propName === 'style') {
      return !shallowEqual(prevProp, nextProp);
    }

    return prevProp !== nextProp;
  });
}

export default memo(SafeImage, arePropsEqualWithStyle);
