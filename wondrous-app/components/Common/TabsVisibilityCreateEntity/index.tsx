import { PRIVACY_LEVEL } from 'utils/constants';
import { useEffect } from 'react';
import { TabsVisibility } from '../TabsVisibility';

interface ITabsVisibilityCreateEntity {
  isPod: boolean;
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  podPrivacyLevel: string;
  orgPrivacyLevel: string;
  type: string;
}

export function TabsVisibilityCreateEntity(props: ITabsVisibilityCreateEntity) {
  const { isPod, isPublic, setIsPublic, podPrivacyLevel, orgPrivacyLevel, type } = props;
  const tabsVisibilityOptions = {
    [PRIVACY_LEVEL.public]: {
      title: 'Public',
      tooltip: `Public means anyone can see this ${type}`,
    },
    [PRIVACY_LEVEL.private]: {
      title: isPod ? 'Pod Members Only' : 'Org Members Only',
      tooltip: `Private means only those with the proper permissions can see this ${type}`,
    },
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
}
