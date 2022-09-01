import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { InputAdornment } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { SEARCH_GLOBAL } from 'graphql/queries';
import apollo from 'services/apollo';

import { SafeImage } from 'components/Common/Image';
import { useOutsideAlerter } from 'utils/hooks';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import PodIcon from 'components/Icons/podIcon';
import SearchIcon from 'components/Icons/search';
import { DAOIcon } from 'components/Icons/dao';
import { GLOBAL_SEARCH_TYPES } from 'utils/constants';

import {
  GlobalSearchWrapper,
  SearchInput,
  SearchResults,
  SearchResultCategory,
  SearchResultItem,
  SearchResultCategoryTitle,
  SearchInputWrapper,
  SearchIconWrapper,
} from './styles';

let timeout;

const LABELS_DEFAULT_IMAGES_MAP = {
  [GLOBAL_SEARCH_TYPES.ORGS]: {
    label: 'Organizations',
    defaultImg: () => <DAOIcon />,
  },
  [GLOBAL_SEARCH_TYPES.PODS]: {
    label: 'Pods',
    defaultImg: () => <PodIcon />,
  },
  [GLOBAL_SEARCH_TYPES.USERS]: {
    label: 'Users',
    defaultImg: () => <DefaultUserImage />,
  },
};

interface Labels {
  label: string;
  defaultImg: any;
}

function GlobalSearch() {
  const [options, setOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleClose = () => {
    setIsExpanded(false);

    if (inputRef?.current?.value) {
      inputRef.current.value = '';
    }
  };

  useOutsideAlerter(wrapperRef, handleClose);

  useEffect(() => {
    if (isExpanded) inputRef?.current?.focus();
    if (!isExpanded && Object.keys(options).length) setOptions({});
  }, [isExpanded]);

  const handleSearch = async (searchString: string) => {
    try {
      const { data } = await apollo.query({
        variables: { searchString },
        query: SEARCH_GLOBAL,
      });
      const items = Object.keys(data?.globalSearch).reduce((acc: any, next: any) => {
        if (Array.isArray(data?.globalSearch[next]) && data?.globalSearch[next]?.length) {
          acc[next] = data?.globalSearch[next];
        }
        return acc;
      }, {});
      setOptions({
        ...items,
        ...{
          orgs: data?.globalSearch[GLOBAL_SEARCH_TYPES.ORGS],
          pods: data?.globalSearch[GLOBAL_SEARCH_TYPES.PODS],
          users: data?.globalSearch[GLOBAL_SEARCH_TYPES.USERS],
        },
      });
    } catch (error) {
      setOptions({});
    }
  };

  const handleInputChange = (e) => {
    const searchString = e.target.value;
    clearTimeout(timeout);
    setIsLoading(true);

    timeout = setTimeout(async () => {
      if (!searchString) {
        setOptions([]);
      } else {
        handleSearch(searchString);
      }
      setIsLoading(false);
    }, 200);
  };

  const handleInputExpand = () => (isExpanded ? false : setIsExpanded(true));

  const handleRedirect = (type, entity) => {
    handleClose();
    if (type === GLOBAL_SEARCH_TYPES.ORGS)
      return router.push(`/organization/${entity.username}/boards?view=grid`, undefined, { shallow: true });
    if (type === GLOBAL_SEARCH_TYPES.PODS)
      return router.push(`/pod/${entity.id}/boards?view=grid`, undefined, { shallow: true });
    if (type === GLOBAL_SEARCH_TYPES.USERS)
      return router.push(`/profile/${entity.username}/about`, undefined, { shallow: true });
  };

  return (
    <GlobalSearchWrapper onClick={handleInputExpand} ref={wrapperRef} isExpanded={isExpanded}>
      <SearchIconWrapper isExpanded={isExpanded}>
        <SearchIcon />
      </SearchIconWrapper>

      <SearchInputWrapper isExpanded={isExpanded}>
        <SearchInput
          sx={{ height: '40px' }}
          isExpanded={isExpanded}
          placeholder="Search"
          inputRef={inputRef}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? <CircularProgress color="secondary" size={20} sx={{ marginRight: '12px' }} /> : null}
              </InputAdornment>
            ),
          }}
        />
      </SearchInputWrapper>
      {Object.keys(options)?.length ? (
        <SearchResults>
          {Object.keys(options).map((option, optionIdx) => {
            const { label, defaultImg }: Labels = LABELS_DEFAULT_IMAGES_MAP[option];
            return (
              <SearchResultCategory key={optionIdx}>
                <SearchResultCategoryTitle>{label}</SearchResultCategoryTitle>
                {options[option]?.length ? (
                  options[option].map((item, idx) => (
                    <SearchResultItem key={idx} onClick={() => handleRedirect(option, item)}>
                      {item.profilePicture ? (
                        <SafeImage width={29} height={29} src={item.profilePicture} />
                      ) : (
                        defaultImg()
                      )}
                      {item.username}
                      {item.description ? <span>{item.description}</span> : null}
                    </SearchResultItem>
                  ))
                ) : (
                  <span>No results found</span>
                )}
              </SearchResultCategory>
            );
          })}
        </SearchResults>
      ) : null}
    </GlobalSearchWrapper>
  );
}

export default GlobalSearch;
