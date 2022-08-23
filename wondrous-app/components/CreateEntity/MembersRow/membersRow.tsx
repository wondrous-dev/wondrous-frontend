import React from 'react';

import DeleteIcon from '../../Icons/DeleteIcon';

import {
  CreateFormMembersListActivityButtons,
  CreateFormMembersListAdminBlock,
  CreateFormMembersListAdminBlockText,
  CreateFormMembersListAvatar,
  CreateFormMembersListDeleteButton,
  CreateFormMembersListInfo,
  CreateFormMembersListName,
  CreateFormMembersListRow,
} from './styles';

function MembersRow(props) {
  const { name, styledSwitch } = props;

  return (
    <CreateFormMembersListRow>
      <CreateFormMembersListInfo>
        <CreateFormMembersListAvatar />
        <CreateFormMembersListName>{name}</CreateFormMembersListName>
      </CreateFormMembersListInfo>

      <CreateFormMembersListActivityButtons>
        <CreateFormMembersListAdminBlock>
          <CreateFormMembersListAdminBlockText>Admin</CreateFormMembersListAdminBlockText>
          {styledSwitch}
        </CreateFormMembersListAdminBlock>
        <CreateFormMembersListDeleteButton>
          <DeleteIcon />
        </CreateFormMembersListDeleteButton>
      </CreateFormMembersListActivityButtons>
    </CreateFormMembersListRow>
  );
}

// const createPodMembersList = [
// 	{
// 	  avatar: '',
// 	  name: '0xAndros',
// 	  admin: 'true',
// 	},
// 	{
// 	  avatar: '',
// 	  name: '0xAndraos',
// 	  admin: 'false',
// 	},
// 	{
// 	  avatar: '',
// 	  name: '0xAndos',
// 	  admin: 'false',
// 	},
// 	{
// 	  avatar: '',
// 	  name: '0xAsndros',
// 	  admin: 'false',
// 	},
//   ];

{
  /* <CreateFormMembersList>
{createPodMembersList.map((item) => (
  <MembersRow key={item.name} name={item.name} styledSwitch={<AndroidSwitch />} />
))}
</CreateFormMembersList> */
}

export default MembersRow;
