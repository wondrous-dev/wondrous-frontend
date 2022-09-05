import { useState } from 'react';
import Box from '@mui/material/Box';
import { Modal as ModalComponent } from 'components/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from 'components/Icons/search';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import { CreateEntityDefaultUserImage } from 'components/CreateEntity/CreateEntityModal/styles';
import { TextField } from '../AddTeamMembers/styles';
import { InputWrapper } from './styles';

const MembersModal = ({ open, onClose, members }) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e) => setInputValue(e.target.value);
  return (
    <ModalComponent maxWidth={560} title="Member invites" open={open} onClose={onClose}>
      <Box sx={{ width: '100%' }}>
        <InputWrapper>
          <TextField
            fullWidth
            value={inputValue}
            onChange={onChange}
            placeholder="Search members..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {' '}
                  <SearchIcon color={palette.highlightBlue} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
          />
        </InputWrapper>
        <Box>
          {members?.map((member, idx) => (
            <div key={idx}>
              {member?.profilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={member?.profilePicture}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <CreateEntityDefaultUserImage />
              )}

              <span>{member?.username}</span>
              <div>
                <button type="button">Remove</button>
              </div>
            </div>
          ))}
        </Box>
      </Box>
    </ModalComponent>
  );
};

export default MembersModal;
