import { Box, Grid } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SearchIcon from 'components/Icons/search';
import { Arrow } from 'components/Icons/sections';
import { useState } from 'react';
import palette from 'theme/palette';
import { ArrowWrapper, Option, PaperComponent, StyledAutocomplete, StyledTextField } from './styles';

const ProfilePicture = ({ profilePicture }) =>
  profilePicture ? (
    <SafeImage useNextImage={false} src={profilePicture} width={24} height={24} style={{ borderRadius: '24px' }} />
  ) : (
    <DefaultUserImage width={24} height={24} />
  );

const RenderOption = (props, option) => {
  const { profilePicture, label, hide } = option || {};
  if (hide) return null;
  return (
    <Option {...props}>
      <ProfilePicture profilePicture={profilePicture} />
      {label}
    </Option>
  );
};

const assignToSelf = ({ user, onClick }) => {
  if (!user) return null;
  const AssignToSelf = () => {
    const { profilePicture } = user || {};
    return (
      <Option onClick={onClick}>
        <Grid container direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ gap: '10px', width: '80%' }}
          >
            <ProfilePicture profilePicture={profilePicture} />
            <Box sx={{ color: palette.blue20 }}>+ Assign to Self</Box>
          </Grid>
          <Grid item container justifyContent="flex-end" sx={{ width: '20%' }}>
            <ArrowWrapper>
              <Arrow />
            </ArrowWrapper>
          </Grid>
        </Grid>
      </Option>
    );
  };
  return AssignToSelf;
};

const ListboxComponent = ({ AssignToSelf, searchValue, children, ...props }) => {
  if (!(AssignToSelf || searchValue)) return null;
  return (
    <ul {...props}>
      {AssignToSelf && <AssignToSelf />}
      {searchValue && children}
    </ul>
  );
};

const TaskViewModalAutocomplete = ({ user, handleAssignToSelf, ...props }) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <StyledAutocomplete
      disablePortal
      fullWidth
      PaperComponent={PaperComponent}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        AssignToSelf: assignToSelf({ user, onClick: handleAssignToSelf }),
        searchValue,
      }}
      popupIcon={
        <Grid sx={{ width: '24px', height: '24px' }}>
          <SearchIcon width="13" height="13" />
        </Grid>
      }
      renderInput={(params) => {
        setSearchValue(params.inputProps.value);
        return <StyledTextField placeholder="Assign user" {...params} />;
      }}
      renderOption={RenderOption}
      noOptionsText={`Cannot find "${searchValue}"`}
      {...props}
    />
  );
};

export default TaskViewModalAutocomplete;
