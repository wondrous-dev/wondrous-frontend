import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { parseISO, addSeconds } from 'date-fns';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';

interface SafeImageArgs {
  src: string;
  style?: object;
  defaultImage?: string;
  onPreviewLoaded?(url: string): void;
  className?: string;
  alt?: string;
}
export const SafeImage = (safeImageArgs: SafeImageArgs) => {
  const { src, style, defaultImage, className, alt = '', onPreviewLoaded } = safeImageArgs;
  const [imgUrl, setImageUrl] = useState(null);
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
    if (!src || src.startsWith('http') || imgUrl) {
      return;
    }

    console.log(src, '--------');

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
  }, [imgUrl, src, onPreviewLoaded]);

  if (!imgUrl && defaultImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} className={className} src={defaultImage} alt={alt} />;
  }

  if (src?.startsWith('https') || src?.startsWith('file://')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} className={className} key={src} src={src} alt={alt} />;
  } else if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img style={style} className={className} key={src} src={imgUrl} alt={alt} />
    );
  }

  return null;
};
