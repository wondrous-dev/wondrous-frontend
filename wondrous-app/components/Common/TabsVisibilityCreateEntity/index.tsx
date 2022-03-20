import { PRIVACY_LEVEL } from '@utils/constants';
import { TabsVisibility } from '../TabsVisibility';

interface ITabsVisibilityCreateEntity {
  isPod: boolean;
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TabsVisibilityCreateEntity = (props: ITabsVisibilityCreateEntity) => {
  const { isPod, isPublic, setIsPublic } = props;
  const tabsVisibilityOptions = {
    [PRIVACY_LEVEL.public]: 'Public',
    [PRIVACY_LEVEL.private]: isPod ? 'Pod Members Only' : 'DAO Members Only',
  };
  const tabsVisibilitySelected = isPublic
    ? tabsVisibilityOptions[PRIVACY_LEVEL.public]
    : tabsVisibilityOptions[PRIVACY_LEVEL.private];
  const tabsVisibilityHandleOnChange = (e) => setIsPublic(e.target.getAttribute('value') === PRIVACY_LEVEL.public);
  return (
    <TabsVisibility
      options={tabsVisibilityOptions}
      selected={tabsVisibilitySelected}
      onChange={tabsVisibilityHandleOnChange}
      variant
    />
  );
};
