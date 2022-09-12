import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthHeader } from 'components/Auth/withAuth';

function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    const token = getAuthHeader();
    if (token) {
      router.push('/mission-control', undefined, {
        shallow: true,
      });
    } else {
      router.push('/login', undefined, {
        shallow: true,
      });
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (loading) {
    return <></>;
  }
  return <></>;
}

export default Index;
