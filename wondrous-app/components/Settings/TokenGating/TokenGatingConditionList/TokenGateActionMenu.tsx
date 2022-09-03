import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { DELETE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries';
import React, { useContext } from 'react';

import palette from 'theme/palette';
import { TokenGatingCondition } from 'types/TokenGating';
import { useTokenGatingCondition } from 'utils/hooks';
import { DropDown, DropDownItem } from '../../../Common/dropdown';
import { TaskMenuIcon } from '../../../Icons/taskMenu';

import { TokenGateActionMenuContainer } from '../styles';

type Props = {
  tokenGatingCondition: TokenGatingCondition;
};

function TokenGateActionMenu({ tokenGatingCondition }: Props) {
  const { editTokenGating } = useTokenGatingCondition();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertSeverity = snackbarContext?.setSnackbarAlertSeverity;
  const [deleteTokenGatingCondition] = useMutation(DELETE_TOKEN_GATING_CONDITION, {
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertSeverity('error');
      setSnackbarAlertMessage('There are roles associated with this condition!');
    },
  });

  const dropdownItemStyle = {
    marginRight: '12px',
    color: palette.white,
  };

  return (
    <TokenGateActionMenuContainer right="true">
      <DropDown DropdownHandler={TaskMenuIcon}>
        <DropDownItem
          key={`token-gate-edit${tokenGatingCondition?.id}`}
          onClick={() => editTokenGating(tokenGatingCondition)}
          style={dropdownItemStyle}
        >
          Edit
        </DropDownItem>
        <DropDownItem
          key={`token-gate-delete${tokenGatingCondition?.id}`}
          style={dropdownItemStyle}
          onClick={() =>
            deleteTokenGatingCondition({
              variables: {
                tokenGatingConditionId: tokenGatingCondition?.id,
              },
            })
          }
        >
          Delete
        </DropDownItem>
      </DropDown>
    </TokenGateActionMenuContainer>
  );
}

export default TokenGateActionMenu;
