import {
  Count,
  IconTextWrapper,
  ItemButton,
  ItemButtonIcon,
  ItemButtonText,
} from 'components/Common/SidebarItem/styles';
import { isNumber } from 'lodash';

const Item = ({ children, Icon = null, isActive = false, roundedBg = false, bgColor = '', count = null, ...props }) => (
  <ItemButton {...props} disableRipple isActive={isActive}>
    <IconTextWrapper>
      {Icon && (
        <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
          <Icon />
        </ItemButtonIcon>
      )}
      <ItemButtonText>{children}</ItemButtonText>
    </IconTextWrapper>
    {isNumber(count) && (
      <Count isActive={isActive}>
        <ItemButtonText>{count}</ItemButtonText>
      </Count>
    )}
  </ItemButton>
);

export default Item;
