import { NextRouter } from 'next/router';
import { useState } from 'react';
import { PRIVACY_LEVEL } from '../../../utils/constants';
import { SelectMenuBoardTypeItem, SelectMenuBoardTypeWrapper } from './styles';

interface ISelectMenuBoardType {
  router: NextRouter;
  view: string;
}

const SelectMenuBoardType = (props: ISelectMenuBoardType) => {
  const { router, view } = props;
  const [open, setOpen] = useState(false);
  const handleOnClick = () => setOpen(!open);
  const handleOnChange = (e) => {
    const boardType = e.target.value;
    router.replace(
      {
        pathname: router.pathname,
        query: {
          username: router.query.username,
          view,
          boardType: boardType in PRIVACY_LEVEL ? boardType : 'all',
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const itemValue = [
    { value: 'all', label: 'See All' },
    { value: PRIVACY_LEVEL.public, label: 'Public' },
    { value: PRIVACY_LEVEL.private, label: 'Private' },
  ];
  return (
    <SelectMenuBoardTypeWrapper
      value={router?.query?.boardType}
      open={open}
      onClick={handleOnClick}
      onChange={handleOnChange}
      defaultValue={'all'}
    >
      {itemValue.map((item) => (
        <SelectMenuBoardTypeItem value={item.value} key={item}>
          {item.label}
        </SelectMenuBoardTypeItem>
      ))}
    </SelectMenuBoardTypeWrapper>
  );
};

export default SelectMenuBoardType;
