import {
  RoundedSecondaryButton,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import AddIcon from '@mui/icons-material/Add';
import { forwardRef, ReactEventHandler, useRef, useState } from 'react';
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Grid,
  Popper,
  Typography,
} from '@mui/material';

const ROLES = [
  {
    id: 1,
    name: 'Ultimate fairies',
  },
];

interface ILevelsRewardProps {
  value?: any;
  setAnchorEl: (element: HTMLAnchorElement) => void;
}
const LevelsRewardViewOrAdd = forwardRef(
  ({ value, setAnchorEl }: ILevelsRewardProps, ref) => {
    if (!value || !value.length)
      return (
        <RoundedSecondaryButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          ref={ref}
          sx={{
            padding: '4px 8px !important',
            borderRadius: '6px !important',
          }}
        >
          <AddIcon
            sx={{
              color: 'black',
              fontSize: '22px',
            }}
          />
        </RoundedSecondaryButton>
      );

    return null;
  }
);

const LevelsReward = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box>
          <LevelsRewardViewOrAdd value={value} setAnchorEl={setAnchorEl} />
          <Popper open={!!anchorEl} anchorEl={anchorEl} placement='bottom'>
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
              <Box
                display='flex'
                gap='6px'
                alignItems='center'
                sx={{
                  cursor: 'pointer',
                }}
              >
                <ButtonBase
                  sx={{
                    padding: '3px 5px',
                    borderRadius: '4px',
                    height: '18px',
                    width: '18px',
                    background: '#84bcff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AddIcon
                    sx={{
                      color: 'black',
                      fontSize: '12px',
                    }}
                  />
                </ButtonBase>
                <Typography
                  color='#2A8D5C'
                  fontFamily='Poppins'
                  fontWeight={500}
                  fontSize='14px'
                  lineHeight='14px'
                >
                  Add new reward
                </Typography>
              </Box>
              {ROLES.map((role, idx) => (
                <Box
                  padding='8px'
                  display='flex'
                  alignItems='center'
                  gap='6px'
                  borderRadius='6px'
                  sx={{
                    cursor: 'pointer',
                    background: 'white',
                    '&:hover': {
                      background: '#c5c5c5',
                    },
                  }}
                >
                  <img
                    src='/images/discord-official-logo.png'
                    height='18px'
                    width='18px'
                    style={{
                      borderRadius: '300px',
                    }}
                  />
                  <Typography
                    fontFamily='Poppins'
                    fontSize='14px'
                    fontWeight={500}
                    color='black'
                  >
                    Role: {role.name}
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Popper>
        </Box>
      </ClickAwayListener>
    </>
  );
};

export default LevelsReward;
