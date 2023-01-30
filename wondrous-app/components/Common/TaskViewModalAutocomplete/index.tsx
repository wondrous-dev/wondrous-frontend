import { Box, Grid } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import CloseModalIcon from 'components/Icons/closeModal';
import SearchIcon from 'components/Icons/search';
import { Arrow } from 'components/Icons/sections';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import palette from 'theme/palette';
import { LoadMore } from 'components/SearchTasks/styles';
import { CloseIcon } from '../BoardFilters/styles';
import { ArrowWrapper, Option, PaperComponent, StyledAutocomplete, StyledTextField } from './styles';

const profilePictureStyle = {
  display: 'flex',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  objectFit: 'cover' as any,
};

export const ProfilePicture = ({ profilePicture, width = 24, height = 24 }) => (
  <SafeImage
    src={profilePicture}
    placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
    width={width}
    height={height}
    useNextImage
    style={profilePictureStyle}
    alt="Profile picture"
  />
);

export const RenderOption = (props, option) => {
  const { profilePicture, label, hide } = option || {};
  if (hide) return null;
  return (
    <Option {...props}>
      <ProfilePicture profilePicture={profilePicture} />
      {label}
    </Option>
  );
};

const AssignToSelf = ({ user, onClick }) => {
  if (!user) return null;
  const { profilePicture } = user;
  return (
    <Option onClick={onClick}>
      <Grid container direction="row" alignItems="center" width="100%">
        <Grid item container direction="row" justifyContent="flex-start" alignItems="center" width="80%" gap="10px">
          <ProfilePicture profilePicture={profilePicture} />
          <Box sx={{ color: palette.blue20 }}>+ Assign to Self</Box>
        </Grid>
        <Grid item container justifyContent="flex-end" width="20%">
          <ArrowWrapper>
            <Arrow />
          </ArrowWrapper>
        </Grid>
      </Grid>
    </Option>
  );
};

export const ListboxComponent = ({
  AssignToSelfProps,
  innerRef,
  children,
  hasMore = false,
  handleFetchMore,
  ...props
}) => {
  const [inViewRef, inView] = useInView({});

  useEffect(() => {
    if (hasMore && inView) handleFetchMore();
  }, [hasMore, inView]);

  return (
    <ul {...props}>
      <AssignToSelf {...AssignToSelfProps} />
      {children}
      {!!handleFetchMore && <LoadMore ref={inViewRef} style={{ height: '1px', display: 'block' }} />}
      <Box height="1px" width="100%" ref={innerRef} />
    </ul>
  );
};

const TaskViewModalAutocomplete = ({
  renderInputProps = null,
  ListboxProps = null,
  closeAction = null,
  renderInput = null,
  ...props
}) => (
  <StyledAutocomplete
    disablePortal
    fullWidth
    openOnFocus
    PaperComponent={PaperComponent}
    ListboxComponent={ListboxComponent}
    ListboxProps={ListboxProps}
    popupIcon={
      <Grid width="24px" height="24px" display="flex" gap="4px" alignItems="center">
        <SearchIcon width="13" height="13" />
      </Grid>
    }
    clearIcon={() => (closeAction ? <CloseModalIcon onClick={closeAction} /> : null)}
    renderInput={(params) =>
      renderInput ? (
        renderInput(params)
      ) : (
        <StyledTextField placeholder="Assign user" {...params} {...renderInputProps} />
      )
    }
    renderOption={RenderOption}
    noOptionsText="No user found"
    {...props}
  />
);

export default TaskViewModalAutocomplete;
