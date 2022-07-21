import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
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
  });

  console.log(data, loading, error);

  const imgUrl = data?.getPreviewFile?.url;
  useEffect(() => {
    if (src && !src.startsWith('http')) {
      getPreviewFile({
        variables: {
          path: src,
        },
      });
    }
    if (imgUrl) {
      if (setImage && !(src?.startsWith('http') || src?.startsWith('file://'))) {
        setImage(data.getPreviewFile.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, src, setImage]);

  if (!src && defaultImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} className={className} src={defaultImage} alt="" />;
  }

  if (src?.startsWith('http') || src?.startsWith('file://')) {
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
