import {
  Box,
  Button,
  ButtonBase,
  ClickAwayListener,
  Divider,
  Grid,
  Popper,
} from '@mui/material';
import { Label } from 'components/CreateTemplate/styles';
import SettingsIcon from 'components/Icons/SettingsIcon';
import { OrgProfilePicture } from 'components/Shared/ProjectProfilePicture';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useContext,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import GlobalContext from 'utils/context/GlobalContext';
import { WorkspaceWrapper } from './styles';

interface WrenchButtonProps {
  onClick?: () => void;
}

const WrenchButton = forwardRef<HTMLButtonElement, WrenchButtonProps>(
  ({ onClick = (e) => {} }, ref) => (
    <ButtonBase
      ref={ref}
      onClick={onClick}
      type='button'
      sx={{
        borderRadius: '140px',
        backgroundColor: '#BAACFA',
        width: '36px',
        height: '36px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <SettingsIcon />
    </ButtonBase>
  )
);

const WorkspaceSwitch = () => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { userOrgs, activeOrg, setActiveOrg } = useContext(GlobalContext);
  const navigate = useNavigate();

  const onOrgClick = (org) => {
    setActiveOrg(org);
  };
  const handleClickAway = () => {
    if (isOpen) setIsOpen(false);
  };
  const togglePopper = () => setIsOpen((prev) => !prev);
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent='onMouseDown'>
      <div>
        <WrenchButton ref={ref} onClick={togglePopper} />
        <Popper
          open={isOpen}
          placement='bottom-start'
          anchorEl={ref.current}
          sx={{
            zIndex: 1000,
          }}
        >
          <Grid
            bgcolor='white'
            border='1px solid #000000'
            boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
            borderRadius='6px'
            container
            width='300px'
            direction={'column'}
            gap='10px'
            padding='14px'
          >
            <Label>Workspaces</Label>
            {userOrgs?.map((org, idx) => {
              const isActive = org.id === activeOrg?.id;
              return (
                <WorkspaceWrapper onClick={() => onOrgClick(org)}>
                  <Box display='flex' gap='10px' alignItems='center'>
                    <OrgProfilePicture
                      profilePicture={org?.profilePicture}
                      style={{
                        width: '36px',
                        height: '36px',
                      }}
                    />
                    <Label color='#1D1D1D'>{org.name}</Label>
                  </Box>
                  {isActive && (
                    <CheckCircleOutlineOutlinedIcon
                      sx={{
                        color: '#F8AFDB',
                      }}
                    />
                  )}
                </WorkspaceWrapper>
              );
            })}
            <Divider />
            <ButtonBase
              onClick={(e) => {
                e.stopPropagation();
                navigate('/settings');
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'flex-start',
                padding: '10px 4px',
              }}
            >
              <WrenchButton />
              <Label color='#1D1D1D'>Settings</Label>
            </ButtonBase>
          </Grid>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default WorkspaceSwitch;
