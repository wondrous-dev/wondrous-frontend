import { useState } from 'react';
import {
  PrivateBoardIconBackground,
  PrivateBoardIconLockIcon,
  PrivateBoardIconPopper,
  PrivateBoardIconPopperWrapper,
  PrivateBoardIconPopperText,
} from './styles';

interface IPrivateBoardIconProps {
  isPrivate: boolean;
  tooltipTitle: string;
}

export const PrivateBoardIcon = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnMouseEnter = (e) => setAnchorEl(e.currentTarget);
  const handleOnMouseLeave = () => setAnchorEl(null);
  return (
    <>
      <PrivateBoardIconBackground
        isPrivate={isPrivate}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <PrivateBoardIconLockIcon />
      </PrivateBoardIconBackground>
      <PrivateBoardIconPopper placement="top" open={open} anchorEl={anchorEl}>
        <PrivateBoardIconPopperWrapper>
          <PrivateBoardIconPopperText>{tooltipTitle}</PrivateBoardIconPopperText>
        </PrivateBoardIconPopperWrapper>
      </PrivateBoardIconPopper>
    </>
  );
};
