import { PRIVACY_LEVEL } from '@utils/constants';
import { useEffect, useState } from 'react';
import { TabsVisibility } from '../TabsVisibility';

interface ITabsVisibilityCreateEntity {
  isPod: boolean;
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  podPrivacyLevel: string;
  orgPrivacyLevel: string;
}

export const TabsVisibilityCreateEntity = (props: ITabsVisibilityCreateEntity) => {
  const { isPod, isPublic, setIsPublic, podPrivacyLevel, orgPrivacyLevel } = props;
  const tabsVisibilityOptions = {
    [PRIVACY_LEVEL.public]: 'Public',
    [PRIVACY_LEVEL.private]: isPod ? 'Pod Members Only' : 'DAO Members Only',
  };
  const tabsVisibilitySelected = isPublic
    ? tabsVisibilityOptions[PRIVACY_LEVEL.public]
    : tabsVisibilityOptions[PRIVACY_LEVEL.private];
  const tabsVisibilityHandleOnChange = (e) => setIsPublic(e.target.getAttribute('value') === PRIVACY_LEVEL.public);
  useEffect(() => {
    if (podPrivacyLevel) {
      setIsPublic(podPrivacyLevel === PRIVACY_LEVEL.public);
    } else {
      setIsPublic(orgPrivacyLevel === PRIVACY_LEVEL.public);
    }
  }, [podPrivacyLevel, orgPrivacyLevel, setIsPublic]);
  return (
    <TabsVisibility
      options={tabsVisibilityOptions}
      selected={tabsVisibilitySelected}
      onChange={tabsVisibilityHandleOnChange}
      variant
    />
  );
};
