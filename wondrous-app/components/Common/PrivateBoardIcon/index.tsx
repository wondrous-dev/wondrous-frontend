import {
  PrivateBoardIconBackground,
} from './styles';
import { PublicEyeIcon, PrivateEyeIcon, LockIconOutline, LockedIconOutline } from '../../Icons/userpass';
import Tooltip from "components/Tooltip";

interface IPrivateBoardIconProps {
  isPrivate: boolean;
  tooltipTitle: string;
  style?: any;
}

export const TokenGatedBoard = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle } = props;
  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <PrivateBoardIconBackground>
          {isPrivate ? <LockIconOutline /> : <LockedIconOutline />}
        </PrivateBoardIconBackground>
      </Tooltip>
    </>
  );
};

export const ToggleBoardPrivacyIcon = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle, style } = props;
  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <PrivateBoardIconBackground style={style}>
          {isPrivate ? <PrivateEyeIcon /> : <PublicEyeIcon />}
        </PrivateBoardIconBackground>
      </Tooltip>
    </>
  );
};
