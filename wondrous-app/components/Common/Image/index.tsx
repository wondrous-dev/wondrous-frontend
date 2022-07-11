import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { parseISO, addSeconds } from 'date-fns';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';

interface SafeImageArgs {
  src: string;
  style?: object;
  defaultImage?: string;
  setImage?(url: string): void;
  className?: string;
}
export const SafeImage = (safeImageArgs: SafeImageArgs) => {
  const { src, style, defaultImage, setImage, className } = safeImageArgs;
  const [getPreviewFile, { data, loading, error }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      localStorage.setItem(`safeImage.${src}`, data?.getPreviewFile?.url);
    },
  });

  let imgUrl = data?.getPreviewFile?.url;
  useEffect(() => {
    if (src && !src.startsWith('http')) {
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
            imgUrl = cachedPreviewUrl;
          }
        }
      } catch (error) {}

      if (!imgUrl) {
        getPreviewFile({
          variables: {
            path: src,
          },
        });
      }
    }

    if (imgUrl) {
      if (setImage && !(src?.startsWith('https') || src?.startsWith('file://'))) {
        setImage(imgUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, src, setImage]);

  if (!src && defaultImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} className={className} src={defaultImage} alt="" />;
  }

  if (src?.startsWith('https') || src?.startsWith('file://')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} className={className} key={src} src={src} alt="" />;
  } else if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img style={style} className={className} key={src} src={imgUrl} alt="" />
    );
  }
  return null;
};
