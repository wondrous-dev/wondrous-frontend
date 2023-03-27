import React from 'react';
import { Grid } from '@mui/material';
import { filterCategoryValues, useGetCategories } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelWrapper,
  CreateEntitySelectWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import DropdownSearch from 'components/DropdownSearch';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';

export default function Categories({ categories, onChange }) {
  const categoriesData = useGetCategories();

  return (
    <TaskSectionDisplayDiv alignItems="start">
      <TaskSectionLabel>Category</TaskSectionLabel>
      <CreateEntitySelectWrapper>
        {categories !== null && (
          <DropdownSearch
            label="Select Category"
            searchPlaceholder="Search categories"
            options={categoriesData}
            value={filterCategoryValues(categories)}
            onChange={(categories) => {
              onChange([...categories]);
            }}
            disabled={false}
            onClose={() => {}}
          />
        )}
        {categories == null && (
          <CreateEntityLabelAddButton
            onClick={() => {
              onChange([]);
            }}
          >
            <CreateEntityAddButtonIcon />
            <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
          </CreateEntityLabelAddButton>
        )}
      </CreateEntitySelectWrapper>
    </TaskSectionDisplayDiv>
  );
}
