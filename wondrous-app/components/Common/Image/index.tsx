import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_PREVIEW_FILE } from '../../../graphql/queries/media';

interface SafeImageArgs {
  src: string;
  style?: object;
  defaultImage?: string;
  setImage?(url: string): void;
}
export const SafeImage = (safeImageArgs: SafeImageArgs) => {
  const { src, style, defaultImage, setImage } = safeImageArgs;
  const [getPreviewFile, { data, loading, error }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });

  const imgUrl = data?.getPreviewFile?.url;
  useEffect(() => {
    if (src) {
      getPreviewFile({
        variables: {
          path: src,
        },
      });
    }
    if (imgUrl) {
      if (setImage && !(src?.startsWith('https') || src?.startsWith('file://'))) {
        setImage(data.getPreviewFile.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, src, setImage]);

  if (!src && defaultImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} src={defaultImage} alt="" />;
  }

  if (src?.startsWith('https') || src?.startsWith('file://')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} key={src} src={src} alt="" />;
  } else if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img style={style} key={src} src={imgUrl} alt="" />
    );
  }
  return null;
};
