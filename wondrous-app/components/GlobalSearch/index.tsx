import React, { useState, useEffect, useRef } from 'react';
import { InputAdornment } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import { Autocomplete, Option, Input, SearchIconWrapped } from 'components/SearchTasks/styles';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_GLOBAL } from 'graphql/queries';
import CircularProgress from '@mui/material/CircularProgress';
import {
  GlobalSearchWrapper,
  SearchInput,
  SearchResults,
  SearchResultCategory,
  SearchResultItem,
  SearchResultCategoryTitle,
} from './styles';
import { useOutsideAlerter } from 'utils/hooks';
let timeout;

const LABELS_MAP = {
  orgs: 'Organizations',
  pods: 'Pods',
  users: 'Users',
};

const GlobalSearch = (props) => {
  const [options, setOptions] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [globalSearch, { loading }] = useLazyQuery(SEARCH_GLOBAL, {
    onCompleted: ({ globalSearch }) => {
      const items = Object.keys(globalSearch).reduce((acc: any, next: any) => {
        if (Array.isArray(globalSearch[next]) && globalSearch[next]?.length) {
          acc[next] = globalSearch[next];
        }
        return acc;
      }, {});
      setOptions({ ...items, ...{ orgs: globalSearch.orgs, pods: globalSearch.pods, users: globalSearch.users } });
    },
    onError: () => setOptions({}),
  });

  useOutsideAlerter(wrapperRef, () => setIsExpanded(false));

  useEffect(() => {
    if (!isExpanded && Object.keys(options).length) setOptions({});
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) inputRef?.current?.focus();
  }, [isExpanded]);

  const handleInputChange = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      // Reset if field is empty
      if (!e.target.value) {
        setOptions({});
      } else {
        globalSearch({ variables: { searchString: e.target.value } });
      }
    }, 200);
  };

  const handleInputExpand = () => (isExpanded ? false : setIsExpanded(true));

  console.log(options);
  return (
    <>
      <GlobalSearchWrapper onClick={handleInputExpand} ref={wrapperRef}>
        <SearchIconWrapped />

        <SearchInput
          sx={{ height: '40px', width: isExpanded ? '100%' : '0' }}
          placeholder={'Search'}
          inputRef={inputRef}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading ? <CircularProgress color="secondary" size={20} sx={{ marginRight: '12px' }} /> : null}
              </InputAdornment>
            ),
          }}
        />

        {Object.keys(options)?.length ? (
          <SearchResults>
            {Object.keys(options).map((option, optionIdx) => {
              return (
                <SearchResultCategory key={optionIdx}>
                  <SearchResultCategoryTitle>{LABELS_MAP[option]}</SearchResultCategoryTitle>
                  {options[option]?.length ? (
                    options[option].map((item, idx) => {
                      return <SearchResultItem key={idx}>{item.username}</SearchResultItem>;
                    })
                  ) : (
                    <span>No results found</span>
                  )}
                </SearchResultCategory>
              );
            })}
          </SearchResults>
        ) : null}
      </GlobalSearchWrapper>
    </>
  );
};

export default GlobalSearch;
