import { Masonry } from '@mui/lab';
import { useState } from 'react';
import {
  ProfileContentGridButton,
  ProfileContentGridButtonContainer,
  ProfileContentGridContent,
  ProfileContentGridEndMessage,
  ProfileContentGridWrapper,
} from './styles';

const LIMIT = 4;
const FETCH_MORE_LIMIT = 8;

function ProfileContentGrid({ data, Component, fetchMore, buttonIsDisabled }) {
  const [NoOfItems, setNoOfItems] = useState(LIMIT);
  const handleOnClick = () => {
    const updatedNoOfItems = NoOfItems + FETCH_MORE_LIMIT;
    if (data.length < updatedNoOfItems) fetchMore();
    setNoOfItems(updatedNoOfItems);
  };
  const dataComponent = data?.slice(0, NoOfItems).map((item) => <Component key={item.id} item={item} />);
  return (
    <ProfileContentGridWrapper>
      {NoOfItems > LIMIT && data.length > LIMIT ? (
        <Masonry columns={LIMIT}>{dataComponent}</Masonry>
      ) : (
        <ProfileContentGridContent>{dataComponent}</ProfileContentGridContent>
      )}
      <ProfileContentGridButtonContainer>
        {buttonIsDisabled ? (
          <ProfileContentGridEndMessage>This is end of the list.</ProfileContentGridEndMessage>
        ) : (
          <ProfileContentGridButton onClick={handleOnClick} disabled={buttonIsDisabled}>
            Show more
          </ProfileContentGridButton>
        )}
      </ProfileContentGridButtonContainer>
    </ProfileContentGridWrapper>
  );
}

export default ProfileContentGrid;
