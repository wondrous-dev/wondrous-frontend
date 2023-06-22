import Box from '@mui/material/Box';
import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import SidebarEntityList from 'components/Common/SidebarEntityList';
import SidebarSettingsButton from 'components/Common/SidebarSettingsButton';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import useMediaQuery from 'hooks/useMediaQuery';
import useSideBar from 'hooks/useSideBar';

const EntitySidebar = ({ children, renderSidebar = null }) => {
  const { minimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        {isMobileScreen ? <AboutEntity /> : null}
        <SidebarContent>{renderSidebar ? renderSidebar() : <SidebarEntityList />}</SidebarContent>
        <Box
          display="flex"
          flexDirection={minimized ? `column` : `row`}
          alignItems="center"
          justifyContent="space-between"
          padding="24px 14px"
          gap="24px"
          width="100%"
          sx={{
            '> *': {
              flexGrow: '1',
            },
          }}
        >
          <SidebarSettingsButton />
          <CollapseExpandButton />
        </Box>
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
