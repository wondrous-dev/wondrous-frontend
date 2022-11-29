import {
  Count,
  IconTextWrapper,
  ItemButton,
  ItemButtonIcon,
  ItemButtonText,
} from 'components/Common/SidebarItem/styles';
import { isNumber } from 'lodash';
import { useSideBar } from 'utils/hooks';

const MinimizedItem = ({ isActive, Icon, roundedBg, bgColor }) => (
  <IconTextWrapper>
    {Icon && (
      <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
        <Icon />
      </ItemButtonIcon>
    )}
  </IconTextWrapper>
);

const ExpandedItem = ({ children, isActive, Icon, roundedBg, bgColor, count }) => (
  <>
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
  </>
);

const Item = ({ children, Icon = null, isActive = false, roundedBg = false, bgColor = '', count = null, ...props }) => {
  const { minimized } = useSideBar();

  return (
    <ItemButton {...props} disableRipple isActive={isActive} minimized={minimized}>
      {minimized ? (
        <MinimizedItem {...props} isActive={isActive} Icon={Icon} roundedBg={roundedBg} bgColor={bgColor} />
      ) : (
        <ExpandedItem {...props} isActive={isActive} Icon={Icon} roundedBg={roundedBg} bgColor={bgColor} count={count}>
          {children}
        </ExpandedItem>
      )}
    </ItemButton>
  );
};

export default Item;
