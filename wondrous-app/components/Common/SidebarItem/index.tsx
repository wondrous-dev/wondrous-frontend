import { isNumber } from 'lodash';
import {
  Count,
  IconTextWrapper,
  ItemButton,
  ItemButtonIcon,
  ItemButtonText,
} from 'components/Common/SidebarItem/styles';
import Tooltip from 'components/Tooltip';
import { useSideBar } from 'utils/hooks';
import { toolTipStyle } from 'components/Common/SidebarStyles';

const MinimizedItem = ({ isActive, Icon, roundedBg, bgColor, ignoreIconStyles = false }) => (
  <IconTextWrapper>
    {Icon && (
      <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor} ignoreIconStyles={ignoreIconStyles}>
        <Icon />
      </ItemButtonIcon>
    )}
  </IconTextWrapper>
);

const ExpandedItem = ({ children, isActive, Icon, roundedBg, bgColor, count, ignoreIconStyles = false }) => (
  <>
    <IconTextWrapper>
      {Icon && (
        <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor} ignoreIconStyles={ignoreIconStyles}>
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

type ItemProps = {
  children?: React.ReactNode;
  Icon?: React.ReactNode;
  isActive?: boolean;
  roundedBg?: boolean;
  bgColor?: string;
  count?: number | null;
  text?: string;
  [key: string]: any;
};

const Item = ({
  children,
  Icon = null,
  isActive = false,
  roundedBg = false,
  bgColor = '',
  count = null,
  text = '',
  ...props
}: ItemProps) => {
  const { minimized } = useSideBar();

  return (
    <Tooltip title={minimized ? text : null} placement="right" style={toolTipStyle}>
      <ItemButton {...props} disableRipple isActive={isActive} minimized={minimized}>
        {minimized ? (
          <MinimizedItem {...props} isActive={isActive} Icon={Icon} roundedBg={roundedBg} bgColor={bgColor} />
        ) : (
          <ExpandedItem
            {...props}
            isActive={isActive}
            Icon={Icon}
            roundedBg={roundedBg}
            bgColor={bgColor}
            count={count}
          >
            {children}
          </ExpandedItem>
        )}
      </ItemButton>
    </Tooltip>
  );
};

export default Item;
