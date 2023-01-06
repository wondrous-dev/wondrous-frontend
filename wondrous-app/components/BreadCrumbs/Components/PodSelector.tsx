import { useLazyQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import {
  PodSearchAutocomplete,
  PodSearchAutocompletePopper,
  PodSearchClickAway,
  PodSearchDefaultImage,
  PodSearchInput,
  PodSearchInputAdornment,
  PodSearchInputIcon,
  PodSearchLabel,
  PodSearchList,
  PodSearchListItem,
  PodSearchPaper,
  PodSearchPopper,
} from 'components/CreateEntity/CreateEntityModal/PodSearch/styles';
import { Spinner } from 'components/Dashboard/bounties/styles';
import PodIcon from 'components/Icons/podIcon';
import { Chevron, ChevronFilled } from 'components/Icons/sections';
import { GET_USER_AVAILABLE_PODS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';
import { PodSelectorWrapper, PodTitle } from './styles';

const PodSelector = () => {
  const router = useRouter();
  const { pageData } = useGlobalContext();
  const activePod = pageData?.pod;
  const [anchorEl, setAnchorEl] = useState(null);
  const { name, id, color } = activePod || {};

  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  const [getUserPods, { data, loading, error }] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const selectedValue = data?.getAvailableUserPods?.find((option) => option.id === id);

  useEffect(() => {
    if (open && !data) {
      getUserPods({
        variables: {
          orgId: activePod?.orgId,
        },
      });
    }
  }, [open]);

  return (
    <PodSearchClickAway onClickAway={handleClickAway}>
      <div>
        <PodSelectorWrapper onClick={handleClick} display="flex" justifyContent="center" alignItems="center" gap="8px">
          <PodIcon
            color={color}
            style={{
              width: 24,
              height: 24,
              borderRadius: 50,
            }}
          />
          <PodTitle>{name}</PodTitle>
          <ChevronFilled fill="white" isOpen={open} />
        </PodSelectorWrapper>
        <PodSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal>
          {loading ? (
            <Spinner />
          ) : (
            <PodSearchAutocomplete
              value={selectedValue}
              renderInput={(params) => (
                <PodSearchInput
                  {...params}
                  ref={params.InputProps.ref}
                  disableUnderline
                  fullWidth
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <PodSearchInputAdornment position="end">
                        <PodSearchInputIcon />
                      </PodSearchInputAdornment>
                    ),
                  }}
                />
              )}
              disableClearable
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <PodSearchListItem {...props} isActive={option.id === selectedValue?.id}>
                  <PodSearchDefaultImage color={option?.color ?? '#474747'} />
                  <PodSearchLabel>{option?.name}</PodSearchLabel>
                </PodSearchListItem>
              )}
              PaperComponent={PodSearchPaper}
              ListboxComponent={PodSearchList}
              PopperComponent={(params) => <PodSearchAutocompletePopper {...params} />}
              open={open}
              options={data?.getAvailableUserPods ?? []}
              disablePortal
              onChange={(event, value, reason) => {
                if (reason === 'selectOption') {
                  const searchParams = new URLSearchParams(window.location.search);
                  const params = Object.fromEntries(searchParams.entries());
                  router.push(
                    {
                      pathname: router.pathname,
                      query: { ...router.query, ...params, podId: value.id },
                    },
                    undefined,
                    { shallow: true }
                  );
                  handleClickAway();
                }
              }}
              blurOnSelect
            />
          )}
        </PodSearchPopper>
      </div>
    </PodSearchClickAway>
  );
};

export default PodSelector;
