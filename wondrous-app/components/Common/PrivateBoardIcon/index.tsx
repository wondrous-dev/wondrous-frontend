import { useState } from 'react';
import {
  PrivateBoardIconBackground,
  PrivateBoardIconPopper,
  PrivateBoardIconPopperWrapper,
  PrivateBoardIconPopperText,
} from './styles';
import { PublicEyeIcon, PrivateEyeIcon, LockIconOutline, LockedIconOutline } from '../../Icons/userpass';

interface IPrivateBoardIconProps {
  isPrivate: boolean;
  tooltipTitle: string;
  style?: any;
}

export const TokenGatedBoard = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnMouseEnter = (e) => setAnchorEl(e.currentTarget);
  const handleOnMouseLeave = () => setAnchorEl(null);
  return (
    <>
      <PrivateBoardIconBackground onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        {isPrivate ? <LockIconOutline /> : <LockedIconOutline />}
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
  const { isPrivate, tooltipTitle, style } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnMouseEnter = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleOnMouseLeave = () => setAnchorEl(null);
  return (
    <>
      <PrivateBoardIconBackground style={style} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        {isPrivate ? <PrivateEyeIcon /> : <PublicEyeIcon />}
      </PrivateBoardIconBackground>
      <PrivateBoardIconPopper placement="top" open={open} anchorEl={anchorEl}>
        <PrivateBoardIconPopperWrapper>
          <PrivateBoardIconPopperText>{tooltipTitle}</PrivateBoardIconPopperText>
        </PrivateBoardIconPopperWrapper>
      </PrivateBoardIconPopper>
    </>
  );
};
