import { useLazyQuery, useQuery } from '@apollo/client';
import { ButtonBase, MenuItem, Select } from '@mui/material';
import { BOT_URL } from 'components/DiscordNotificationSetup';
import CheckCircleIcon from 'components/Icons/checkCircle.svg';
import {
  ComponentFieldWrapper,
  Error,
  FieldInput,
  FieldLabel,
  FieldWrapper,
  MainButton,
} from 'components/OnboardingDao/styles';
import { useField, useFormikContext } from 'formik';
import {
  CHECK_DISCORD_BOT_ADDED,
  GET_CHANNELS_FROM_DISCORD,
  GET_DISCORD_GUILD_FROM_INVITE_CODE,
} from 'graphql/queries';
import { debounce, last } from 'lodash';
import { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import ImportSuccess from './ImportSuccess';

const DisabledButton = styled(ButtonBase)`
  && {
    align-items: center;
    border-radius: 35px;
    border: 1px solid ${({ theme }) => theme.palette.grey78};
    color: ${({ theme }) => theme.palette.grey57};
    display: flex;
    font-family: var(--font-space-grotesk);
    font-size: 15px;
    font-weight: 600;
    height: 40px;
    padding: 8px 24px;
    text-align: center;
    width: fit-content;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const SelectTypography = css`
  font-family: var(--font-space-grotesk);
  color: ${({ theme }) => theme.palette.white};
  font-size: 14px;
  font-weight: 500;
`;

const StyledSelect = styled(Select)`
  && {
    background: ${({ theme }) => theme.palette.background.default};
    height: 42px;
    width: 220px;
    border-radius: 6px;
    ${SelectTypography}

    svg {
      color: ${({ theme }) => theme.palette.white};
    }
  }
`;

const DropdownSelect = styled(({ className, ...props }) => (
  <StyledSelect {...props} {...className} MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: ${({ theme }) => theme.palette.background.default};
    width: 141px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

const DropdownSelectItem = styled(MenuItem)`
  && {
    ${SelectTypography}
  }
`;

const useGetDiscordGuildFromInviteCode = ({ setValue, setError }) => {
  const [query, { data }] = useLazyQuery(GET_DISCORD_GUILD_FROM_INVITE_CODE, {
    onCompleted: ({ getDiscordGuildFromInviteCode }) => setValue(getDiscordGuildFromInviteCode.guildId),
    onError: () => setError('Invalid invite link'),
  });
  const queryHandler = useCallback(
    async ({ inviteLink }) =>
      query({
        variables: {
          inviteCode: last(inviteLink.split('/')),
        },
      }),
    [query]
  );
  const debouncedQueryHandler = useMemo(() => debounce(queryHandler, 3000), [queryHandler]);
  return {
    guildId: data?.getDiscordGuildFromInviteCode?.guildId,
    handleGetDiscordGuildFromInviteCode: debouncedQueryHandler,
  };
};

const useCheckDiscordBotAdded = ({ setError, setValue }) => {
  const [query, { startPolling, stopPolling }] = useLazyQuery(CHECK_DISCORD_BOT_ADDED, {
    onCompleted: ({ checkDiscordBotAdded }) => {
      stopPolling();
      if (!checkDiscordBotAdded?.botAdded) startPolling(1000);
      setError(undefined);
      setValue(checkDiscordBotAdded?.botAdded);
    },
    onError: () => {
      stopPolling();
      setError('Unable to add bot to server');
      setValue(false);
    },
  });
  const handleQuery = async ({ guildId }) => {
    await query({
      variables: {
        guildId,
      },
    });
  };
  return { checkDiscordBotAdded: handleQuery };
};

const useGetChannelsFromDiscord = ({ guildId }) => {
  const { data } = useQuery(GET_CHANNELS_FROM_DISCORD, {
    variables: { guildId },
    skip: !guildId,
  });
  return { channels: data?.getAvailableChannelsForDiscordGuild || [] };
};

const Link = ({ label, tempState, setTempState, channelIdField, addBotField, ...props }) => {
  const { name } = props;
  const { setFieldValue } = useFormikContext();
  const [field, meta, { setValue, setError }] = useField(name);
  const { guildId, handleGetDiscordGuildFromInviteCode } = useGetDiscordGuildFromInviteCode({
    setValue,
    setError,
  });
  const handleOnChange = async (e) => {
    const inviteLink = e.target.value;
    await handleGetDiscordGuildFromInviteCode({ inviteLink });
    setTempState({ ...tempState, [name]: inviteLink });
    setFieldValue(channelIdField.name, '');
    setFieldValue(addBotField.name, false);
  };
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput
        {...field}
        {...props}
        value={tempState[name]}
        onChange={handleOnChange}
        endAdornment={guildId && <CheckCircleIcon />}
      />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const AddWonderBotsButtons = ({ formik, guildId, isDiscordBotAdded, handleOnClick, ...props }) => {
  if (!formik.errors.guildId && guildId && !isDiscordBotAdded) {
    return (
      <MainButton {...props} onClick={handleOnClick}>
        Add Wonder Bot
      </MainButton>
    );
  }
  return (
    <ButtonWrapper>
      <DisabledButton {...props} disabled>
        Add Wonder Bot
      </DisabledButton>
      {isDiscordBotAdded && <ImportSuccess>Successfully Added</ImportSuccess>}
    </ButtonWrapper>
  );
};

const AddWonderBot = ({ label, ...props }) => {
  const [fields, meta, { setError, setValue }] = useField(props.name);
  const formik = useFormikContext() as any;
  const { guildId } = formik.values;
  const { checkDiscordBotAdded } = useCheckDiscordBotAdded({
    setError,
    setValue,
  });
  const handleOnClick = async () => {
    window.open(`${BOT_URL}&guild_id=${guildId}`, '_blank');
    await checkDiscordBotAdded({ guildId });
  };
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <AddWonderBotsButtons
        {...fields}
        {...props}
        formik={formik}
        guildId={guildId}
        isDiscordBotAdded={fields.value}
        handleOnClick={handleOnClick}
      />
      {meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const SelectChannel = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const formik = useFormikContext() as any;
  const { guildId } = formik.values;
  const { channels } = useGetChannelsFromDiscord({ guildId });
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <DropdownSelect {...field} {...props} disabled={!guildId || formik.errors?.guildId}>
        {channels.map(({ id, name }) => (
          <DropdownSelectItem key={id} value={id}>
            {name}
          </DropdownSelectItem>
        ))}
      </DropdownSelect>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const InviteCommunity = (props) => {
  const { fields, tempState, setTempState } = props;
  const { guildId, addBot, channelId } = fields;
  return (
    <ComponentFieldWrapper>
      <Link
        {...guildId}
        tempState={tempState}
        setTempState={setTempState}
        channelIdField={channelId}
        addBotField={addBot}
      />
      <AddWonderBot {...addBot} />
      <SelectChannel {...channelId} />
    </ComponentFieldWrapper>
  );
};

export default InviteCommunity;
