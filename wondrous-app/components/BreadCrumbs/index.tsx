import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useGlobalContext } from 'utils/hooks';

const ORG_DEFAULT_CONFIG = ['org'];
const POD_DEFAULT_CONFIG = ['pod'];

const items = {
  org: () => <div>org logo</div>,
  pod: () => <div>pod logo</div>,
  entityType: ({ entityType }) => <div>entity type</div>,
  settings: () => <div>settings</div>,
  undefined: () => null,
};

const buildConfig = (pageData, router) => {
  let config = [];
  if (pageData?.orgData) {
    config = [...ORG_DEFAULT_CONFIG];
  }
  if (pageData?.pod) {
    config = [...POD_DEFAULT_CONFIG];
  }

  if (pageData?.entityType) {
    config.push('entityType');
  }

  if (pageData?.isSettings) {
    config.push('settings');
  }
  return config;
};
const useConfig = () => {
  const [config, setConfig] = useState<String[]>([]);
  const router = useRouter();

  const { pageData } = useGlobalContext();

  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = pageData?.orgData;

  const orgOrPodExists = !!activeOrg || !!activePodOrg;

  const { thumbnailPicture, profilePicture, name } = activeOrg || activePodOrg || {};

  useEffect(() => {
    if (!orgOrPodExists) return;
    setConfig(buildConfig(pageData, router));
  }, [pageData?.orgData, pageData?.pod]);

  return { config };
};

const BreadCrumbs = () => {
  const [forwardPath, setForwardPath] = useState('');
  //   const [config, setConfig] = useState<Config[]>([]);
  const router = useRouter();

  const { config } = useConfig();

  useEffect(() => {
    router.events.on('routeChangeComplete', (url) => {
      console.log('routeChangeComplete', url);
      // if page is : 'settings' and 'settings' is not in history push to history
      const path = router.pathname;
      // const pathExists = config.find((item) => item.path === path);
      // if (!pathExists) {
      //     setConfig((prev) => [...prev, {path}]);
      // }
    });
  }, []);

  const handleBack = () => {
    // go back
    const path = config[config.length - 1];
    // setForwardPath(path);
    router.back();
  };

  if (!config?.length) return null;

  return (
    <div>
      <button type="button" onClick={handleBack}>
        Back
      </button>
      <button type="button">Forward</button>
      {config.map((item: string, idx) => {
        console.log(item);
        const Component = items[item] || null;
        return (
          <div key={idx}>
            <Component />
          </div>
        );
      })}
      {/* {config.map(() => items[item])} */}
    </div>
  );
};

export default BreadCrumbs;
