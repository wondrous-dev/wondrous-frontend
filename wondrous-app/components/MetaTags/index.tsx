import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  meta: {
    title: string;
    img: string;
    description: string;
  };
};

const MetaTags = ({ meta }: Props) => {
  const router = useRouter();

  return meta ? (
    <Head>
      <meta property="og:title" content={meta.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={router.asPath} />
      {meta.img ? <meta property="og:image" content={meta.img} /> : null}
      {meta.description ? <meta property="og:description" content={meta.description} /> : null}
    </Head>
  ) : null;
};

export default MetaTags;
