import { HeaderLogo, HeaderLogoBlur, HeaderLogoWhite, LogoButton } from 'components/Common/SidebarMainLogo/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import { useState } from 'react';

const SidebarMainLogo = ({ onClick, isActive }) => {
  const [clicked, setClicked] = useState(isActive);
  const activated = clicked || isActive;
  const handleOnClick = () => {
    onClick();
    setClicked(true);
  };
  return (
    <SidebarTooltip title="Explore" id="tour-header-dashboard-icon">
      <LogoButton onClick={handleOnClick}>
        <HeaderLogo activated={activated} />
        <HeaderLogoWhite activated={activated} />
        <HeaderLogoBlur activated={activated} />
      </LogoButton>
    </SidebarTooltip>
  );
};

export default SidebarMainLogo;
