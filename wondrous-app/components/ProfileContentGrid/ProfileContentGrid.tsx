import { useState } from 'react';
import {
  ProfileContentGridButton,
  ProfileContentGridButtonContainer,
  ProfileContentGridContent,
  ProfileContentGridEndMessage,
  ProfileContentGridWrapper,
} from './styles';

const ProfileContentGrid = ({ data, Component, fetchMore, buttonIsDisabled }) => {
  return (
    <ProfileContentGridWrapper>
      <ProfileContentGridContent>
        {data?.map((item) => (
          <Component key={item.id} item={item} />
        ))}
      </ProfileContentGridContent>
      <ProfileContentGridButtonContainer>
        {buttonIsDisabled ? (
          <ProfileContentGridEndMessage>This is end of the list.</ProfileContentGridEndMessage>
        ) : (
          <ProfileContentGridButton onClick={fetchMore} disabled={buttonIsDisabled}>
            Show more
          </ProfileContentGridButton>
        )}
      </ProfileContentGridButtonContainer>
    </ProfileContentGridWrapper>
  );
};

export default ProfileContentGrid;
