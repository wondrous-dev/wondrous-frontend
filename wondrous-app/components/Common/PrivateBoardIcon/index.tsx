import { useState } from 'react';
import {
  PrivateBoardIconBackground,
  PrivateBoardIconLockIcon,
  PrivateBoardIconPopper,
  PrivateBoardIconPopperWrapper,
  PrivateBoardIconPopperText,
} from './styles';
import { EyeIcon } from '../../Icons/userpass';

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

export const ToggleBoardPrivacyIcon = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnMouseEnter = (e) => setAnchorEl(e.currentTarget);
  const handleOnMouseLeave = () => setAnchorEl(null);
  return (
    <>
      <PrivateBoardIconBackground
        isPrivate={true}
        isClickable
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <EyeIcon />
      </PrivateBoardIconBackground>
      <PrivateBoardIconPopper placement="top" open={open} anchorEl={anchorEl}>
        <PrivateBoardIconPopperWrapper>
          <PrivateBoardIconPopperText>{tooltipTitle}</PrivateBoardIconPopperText>
        </PrivateBoardIconPopperWrapper>
      </PrivateBoardIconPopper>
    </>
  );
};
