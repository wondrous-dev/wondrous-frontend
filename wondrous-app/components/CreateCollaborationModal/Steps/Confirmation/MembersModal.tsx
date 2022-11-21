import { useState } from 'react';
import { Modal as ModalComponent } from 'components/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from 'components/Icons/search';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import MuiBox from '@mui/material/Box';
import { CreateEntityDefaultUserImage } from 'components/CreateEntity/CreateEntityModal/styles';
import { TextField } from 'components/CreateCollaborationModal/Steps/AddTeamMembers/styles';
import { InputWrapper, MembersItem, ButtonWrapper, MemberUsername, RemoveButton, Box } from './styles';

const MembersModal = ({ open, onClose, members, deleteMember }) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e) => setInputValue(e.target.value);

  const handleMemberDelete = (e, userId) => {
    e.preventDefault();
    deleteMember(userId);
  };

  const filteredMembers = members.filter((member) => member.username.includes(inputValue));

  return (
    <ModalComponent maxWidth={560} title="Member invites" open={open} onClose={onClose}>
      <MuiBox sx={{ width: '100%' }}>
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
          {filteredMembers?.map((member, idx) => (
            <MembersItem key={idx}>
              {member?.profilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={member?.profilePicture}
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '4px',
                  }}
                  alt="Profile picture"
                />
              ) : (
                <CreateEntityDefaultUserImage
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '4px',
                  }}
                />
              )}

              <MemberUsername>{member?.username}</MemberUsername>
              <ButtonWrapper>
                <RemoveButton onClick={(e) => handleMemberDelete(e, member.id)} type="button">
                  Remove
                </RemoveButton>
              </ButtonWrapper>
            </MembersItem>
          ))}
        </Box>
      </MuiBox>
    </ModalComponent>
  );
};

export default MembersModal;
