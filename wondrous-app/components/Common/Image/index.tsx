import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { parseISO, addSeconds } from 'date-fns';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';
import Image from 'next/image';

interface SafeImageArgs {
  alt?: string;
  className?: string;
  placeholderSrc?: string; // Image src to display while the image is not visible or loaded.
  placeholder?: JSX.Element; // React element to use as a placeholder.
  height?: string;
  src: string;
  width?: string;
  objectPosition?: string;
  useNextImage?: boolean;
  style?: object;
  onPreviewLoaded?(url: string): void;
}

export const SafeImage = (safeImageArgs: SafeImageArgs) => {
  const {
    src,
    placeholderSrc,
    alt,
    onPreviewLoaded,
    width,
    height,
    placeholder,
    useNextImage = true,
    ...props
  } = safeImageArgs;
  const [imgUrl, setImageUrl] = useState(null);
  const safeImageUrl = (src?.startsWith('https') || src?.startsWith('file://') ? src : imgUrl) || placeholderSrc;

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
    if (!src || src.startsWith('http')) {
      return;
    }

    try {
      const cachedPreviewUrl = localStorage.getItem(`safeImage.${src}`);

      if (cachedPreviewUrl && false) {
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
      <Image src={imgUrl} alt={alt} width={width} height={height} {...props} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imgUrl} alt={alt} width={width} height={height} {...props} />
    );
  } else if (placeholder) {
    return placeholder;
  }

  return null;
};
