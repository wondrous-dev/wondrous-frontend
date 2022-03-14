import { NextRouter } from 'next/router';
import { useState } from 'react';
import { PRIVACY_LEVEL } from '../../../utils/constants';
import {
  SelectMenuBoardTypeClickAway,
  SelectMenuBoardTypeDiv,
  SelectMenuBoardTypeIcon,
  SelectMenuBoardTypeItem,
  SelectMenuBoardTypePopper,
  SelectMenuBoardTypePopperMenu,
  SelectMenuBoardTypeText,
  SelectMenuBoardTypeWrapper,
} from './styles';

interface ISelectMenuBoardType {
  router: NextRouter;
  view: string;
}

const SelectMenuBoardType = (props: ISelectMenuBoardType) => {
  const { router, view } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnClickButton = (e) => setAnchorEl(anchorEl ? null : e.currentTarget);
  const handleOnClickAway = () => setAnchorEl(null);
  const handleOnChange = (e) => {
    setAnchorEl(null);
    const boardType = e.target.getAttribute('value');
    const pathQuery = router?.query?.username ? { username: router.query.username } : { podId: router.query.podId };
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...pathQuery,
          view,
          boardType: boardType in PRIVACY_LEVEL ? boardType : 'all',
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const menuItems = {
    all: 'See All',
    [PRIVACY_LEVEL.public]: 'Public',
    // [PRIVACY_LEVEL.private]: 'Private',
  };
  const boardType = menuItems[String(router?.query?.boardType) ?? 'all'];
  return (
    <SelectMenuBoardTypeClickAway onClickAway={handleOnClickAway}>
      <SelectMenuBoardTypeWrapper>
        <SelectMenuBoardTypeDiv open={open} onClick={handleOnClickButton}>
          <SelectMenuBoardTypeText open={open}>{boardType}</SelectMenuBoardTypeText>
          <SelectMenuBoardTypeIcon open={open} />
        </SelectMenuBoardTypeDiv>
        <SelectMenuBoardTypePopper open={open} anchorEl={anchorEl}>
          <SelectMenuBoardTypePopperMenu>
            {Object.keys(menuItems).map((item) => (
              <SelectMenuBoardTypeItem onClick={handleOnChange} value={item} key={'menu-item-' + item}>
                {menuItems[item]}
              </SelectMenuBoardTypeItem>
            ))}
          </SelectMenuBoardTypePopperMenu>
        </SelectMenuBoardTypePopper>
      </SelectMenuBoardTypeWrapper>
    </SelectMenuBoardTypeClickAway>
  );
};

export default SelectMenuBoardType;
