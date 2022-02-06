import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';

import SearchIcon from '../Icons/search';
import { Autocomplete, Input } from './styles';


// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const tasks = [
  { title: 'task 1' },
];

export default function SearchTasks() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;


  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        // setOptions(newValue ? [newValue, ...options] : options);
        // setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        console.log(newInputValue);
        setOptions([...tasks]);
      }}
      freeSolo
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <Input
          {...params}
          placeholder="Search people or pods..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
